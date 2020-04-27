<template lang="pug">
md-card.codes-card
  md-card-header.md-card-header-icon.md-card-header-blue
    .card-icon
      md-icon card_membership
    h4.title {{ title }}
      md-menu.pull-right(v-if="cards")
        md-button.md-info.md-sm(md-menu-trigger='') 购卡
        md-menu-content
          md-menu-item(v-for='cardType in $cardTypes', :key='cardType.id', @click='createCard(cardType)') {{ cardType.title }}
          md-menu-item(@click="receiveGiftCard") 接收礼品卡
      md-button.pull-right.md-info.md-sm(v-if="customer" @click="goToCustomer") 转到客户：{{ customer.name || customer.mobile }}
  md-card-content.md-layout
    md-table.table-full-width
      md-table-row(v-for='card in items', :key='card.id', :class="{ 'table-warning': card.status === 'pending' }")
        md-table-cell(md-label='卡名') {{ card.title }}
        md-table-cell(md-label='状态' style="text-align:center")
          span(v-if="card.status!=='valid'") {{ card.status | cardStatusName }}
          md-button.md-normal.md-success.md-xs(v-else @click="activateCard(card)" style="width:48px !important") 激活
        md-table-cell(md-label='过期日期')
          | {{ card.expiresAt | date("YYYY-MM-DD") }}
        md-table-cell(md-label='剩余次数', v-if="card.type === 'times'") {{ card.timesLeft }}
        md-table-cell(md-label='日期区间', v-if="card.type === 'period'")
          | {{ card.start | date("YY-MM-DD") }} -
          br
          | {{ card.end | date("YY-MM-DD") }}
        md-table-cell(md-label='面值', v-if="card.type === 'balance'")
          | {{ card.balance }}
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import {
  Card,
  CardType,
  CardStatus,
  CardQuery,
  User
} from "../resources/interfaces";
import { promptSelect, confirm, promptInput } from "../helpers/sweetAlert";
import { CardResource } from "../resources";

@Component
export default class CardsCard extends Vue {
  @Prop({ default: "会员卡" })
  title!: string;

  @Prop({ default: () => undefined })
  cards?: Card[];

  @Prop({ default: () => undefined })
  customer?: User;

  items: Card[] = [];

  @Prop()
  query?: CardQuery;

  async created() {
    if (!this.cards && this.query) {
      this.items = await CardResource.query(this.query);
    }
  }

  async createCard(cardType: CardType) {
    const paymentGateway = await promptSelect(
      "购买" + cardType.title,
      `请选择支付方式`,
      {
        cash: "现金刷卡",
        scan: "现场扫码"
      },
      "确定购买"
    );
    if (!paymentGateway) return;
    const card = await CardResource.save(
      // @ts-ignore
      { customer: (this.user as User).id, ...cardType, id: undefined },
      { paymentGateway }
    );
    this.items?.push(card);
    this.$emit("paymentUpdated");
  }

  async activateCard(card: Card) {
    if (
      !(await confirm(
        "确认激活这张充值卡",
        `将为${card.customer?.name}增加账户余额${card.balance}元`
      ))
    )
      return;
    await CardResource.save({ ...card, status: CardStatus.ACTIVATED });
    this.$emit("updated");
    this.$emit("activated");
  }

  async receiveGiftCard() {
    const giftCode = await promptInput("填写礼品码");
    if (!giftCode) return;
    // @ts-ignore
    await CardResource.save({ giftCode, customer: this.user.id });
    this.$emit("updated");
  }

  goToCustomer() {
    if (!this.customer) return;
    this.$router.push(`/user/${this.customer.id}`);
  }

  @Watch("cards") onCardsChange() {
    if (this.cards) {
      this.items = this.cards;
    }
  }
}
</script>

<style scoped>
.md-table.md-content {
  width: 100%;
}
</style>
