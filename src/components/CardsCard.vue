<template lang="pug">
md-card.codes-card
  md-card-header.md-card-header-icon.md-card-header-card
    .card-icon
      md-icon card_membership
    h4.title {{ title }}
      slot(name="title-tools")
      md-button.md-simple.md-just-icon.pull-right.mr-1(@click="showInvalid=!showInvalid" style="height:30px" :class="{'md-success':showInvalid}")
        md-icon restore
  md-card-content.md-layout
    md-table.table-full-width
      md-table-row(v-for='card in cards', :key='card.id', v-if="showInvalid || (!['canceled','expired'].includes(card.status))", :class="{ 'table-warning': card.status === 'pending', 'table-muted': card.status === 'expired' }")
        md-table-cell(md-label='卡名' @click.native="$clipboard(card.id,'卡ID')") {{ card.title }}
        md-table-cell.nowrap(md-label='门店') {{ cardStoreName(card) }}
        md-table-cell(md-label='状态' style="text-align:center" :style="{'min-width':card.status == 'valid'?'125px':0}")
          span(v-if="card.status!=='valid'") {{ card.status | cardStatusName }}
          md-button.md-normal.md-success.md-xs(v-if="card.status === 'valid'" @click="activate(card)" style="width:48px !important") 激活
          md-button.md-normal.md-danger.md-xs.ml-1(v-if="card.status === 'valid'" @click="$clipboard(card.giftCode, '礼品码')" style="width:48px !important") 转赠
          md-button.md-simple.md-danger.md-xs(v-if="$user.can('CARD_SELL_ALL') && cardRemovable(card)" @click="remove(card)" style="width:48px!important;height:18px!important;padding:0") 删除
          md-button.md-simple.md-danger.md-xs(v-if="$user.can('CARD_SELL_ALL') && cardRefundable(card)" @click="refund(card)" style="width:48px!important;height:18px!important;padding:0") 退卡
        md-table-cell(md-label='过期日期' @click.native="changeExpireDate(card)")
          | {{ card.expiresAt | date("YYYY-MM-DD") }}
          md-badge.md-cards.card-extend(v-if="card.expiresAtWas" md-content="延" md-dense)
        md-table-cell.nowrap(md-label='剩余次数', v-if="['times','coupon'].includes(card.type)") 剩{{ card.timesLeft }}次
        md-table-cell(md-label='日期区间', v-if="card.type === 'period'")
          | {{ card.start | date("YY-MM-DD") }} -
          br
          | {{ card.end | date("YY-MM-DD") }}
        md-table-cell(md-label='面值', v-if="card.type === 'balance'")
          | {{ card.balance }}
        //- md-table-cell
          | {{ card.createdAt | date('YYYY-MM-DD HH:mm:ss') }}
          | {{ card.payments.map(p => p.id.substr(-4) || p) }}
          textarea(v-model="card.payments")
          button(@click="save(card)") 保存
        md-table-cell(v-if="card.type === 'partner'")
          | 合作卡
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Card, CardStatus } from "@/resources/interfaces";
import { CardResource } from "@/resources";
import { confirm, promptInput } from "../helpers/sweetAlert";
import moment from "moment";

@Component
export default class CardsCard extends Vue {
  @Prop({ default: "会员卡" })
  title!: string;

  @Prop({ default: () => [] })
  cards!: Card[];

  @Prop({ default: () => {} })
  activate!: Function;

  showInvalid = false;

  save(card: Card) {
    CardResource.update(
      { id: card.id },
      // @ts-ignore
      { payments: card.payments.split(",") }
    );
  }

  async remove(card: Card) {
    if (!this.$user.can("CARD_SELL_ALL")) return;
    try {
      if (
        !(await confirm(
          "确认删除这张卡",
          `即将删除该客户的 ${card.title}，本操作不可恢复`,
          null,
          "error"
        ))
      )
        return;
      await CardResource.delete({ id: card.id });
      this.$emit("updated");
    } catch (e) {
      console.error(e);
    }
  }

  async refund(card: Card) {
    if (!this.$user.can("CARD_SELL_ALL")) return;
    try {
      if (
        !(await confirm(
          "确认对这张卡进行退款",
          `即将对该客户进行退款 ${card.title}，本操作不可恢复`,
          null,
          "error"
        ))
      )
        return;
      await CardResource.update(
        { id: card.id },
        { status: CardStatus.CANCELED }
      );
      this.$emit("updated");
    } catch (e) {
      console.error(e);
    }
  }

  async changeExpireDate(card: Card) {
    if (!this.$user.can("CARD_SELL_ALL")) return;
    const expiresAt = await promptInput(
      "更改会员卡过期日期",
      null,
      null,
      "info",
      "text",
      moment(card.expiresAt).format("YYYY-MM-DD"),
      v => {
        if (!v.match(/^\d{4}-\d{2}-\d{2}$/)) return "请输入正确的日期格式";
      }
    );
    if (!expiresAt) return;
    await CardResource.update({ id: card.id }, { expiresAt });
    this.$emit("updated");
  }

  cardStoreName(card: Card) {
    const stores = this.$stores.filter(s => card.stores.includes(s.id));
    return stores.length
      ? stores.map(s => s.name.substr(0, 2)).join("、")
      : "通用";
  }

  cardRemovable(card: Card) {
    if (card.payments && card.payments.some(p => p.paid)) return false;
    if (card.status === CardStatus.ACTIVATED) {
      if (["coupon", "partner", "period", "balance"].includes(card.type)) {
        return true;
      }
      if (card.type === "times" && card.times === card.timesLeft) {
        return true;
      }
    }
    if (card.status === CardStatus.VALID) {
      return true;
    }
    return false;
  }

  cardRefundable(card: Card) {
    if (!card.payments || !card.payments.some(p => p.paid)) return false;
    if (card.providerData?.provider) return false;
    if (card.status === CardStatus.ACTIVATED) {
      if (["coupon", "partner", "period", "balance"].includes(card.type)) {
        return true;
      }
      if (card.type === "times" && card.times === card.timesLeft) {
        return true;
      }
    }
    if (card.status === CardStatus.VALID) {
      return true;
    }
    return false;
  }
}
</script>

<style lang="scss" scoped>
.md-table.table-full-width {
  width: calc(100% + 40px);
}
.md-table-row.table-muted {
  background-color: #e6e6e6;
  color: #828282;
}
.md-badge.card-extend {
  top: 5px;
  right: 2px;
  transform: scale(0.8);
  background-color: #1bbbcf !important;
  font-weight: bold;
  color: #fff;
}
</style>
