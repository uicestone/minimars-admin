<template lang="pug">
.content
  .md-layout
    .md-layout-item.md-size-66.md-xsmall-size-100.mx-auto
      form(@submit.prevent='save')
        md-button.md-primary.md-round.md-just-icon.fixed-corner.md-lg(type='submit' :disabled="!valid")
          md-icon save
        md-card
          md-card-header.md-card-header-icon.md-card-header-primary
            .card-icon
              md-icon card_membership
            h4.title {{ cardType.title }}
              span.pull-right(style="display:flex")
                md-switch.md-primary(v-model="cardType.openForReception") 前台购买
                md-switch.md-primary(v-model="cardType.isGift") 可转赠
                md-switch.md-primary(v-model="cardType.openForClient") 客户端购买
                md-switch.md-primary(v-model="cardType.isContract") 协议合作
          md-card-content.md-layout
            .md-layout-item.md-size-30.md-xsmall-size-100
              md-field
                label 名称*
                md-input(v-model='cardType.title')
            .md-layout-item.md-size-15.md-xsmall-size-50
              md-field
                label 代号*
                md-input(v-model='cardType.slug')
            .md-layout-item.md-size-20.md-xsmall-size-100
              md-field
                label 售价*
                md-input(type='number', step='0.01', v-model.number='cardType.price')
            .md-layout-item.md-size-35.md-xsmall-size-100
              md-field
                label 门店
                store-select(v-model='cardType.stores' :multiple="true")
            .md-layout-item.md-size-15.md-xsmall-size-100
              md-field
                label 有效时长
                md-input(type='number', step='1', v-model.number='cardType.expiresInDays')
                span.md-suffix 天
            .md-layout-item.md-size-25.md-xsmall-size-100
              md-datepicker(placeholder='开始日期', v-model='cardType.start', :md-model-type='Date', md-immediately)
                label 有效期起
            .md-layout-item.md-size-25.md-xsmall-size-100
              md-datepicker(placeholder='截止日期', v-model='cardType.end', :md-model-type='Date', md-immediately)
                label 有效期止
            .md-layout-item
              md-field
                label 节假日限制
                md-select(v-model='cardType.dayType', @keydown.enter.prevent)
                  md-option 不限
                  md-option(value='onDaysOnly') 仅限法定工作日
                  md-option(value='offDaysOnly') 仅限法定节假日
            .md-layout-item.md-size-15.md-xsmall-size-50
              md-field
                label 库存
                md-input(type="number" min="0" v-model.number='cardType.quantity')
            .md-layout-item.md-size-15.md-xsmall-size-50
              md-field
                label 限购
                md-input(type="number" min="0" v-model.number='cardType.maxPerCustomer')
            .md-layout-item.md-size-15.md-xsmall-size-50
              md-field
                label 团购代号
                md-input(v-model='cardType.couponSlug')
            .md-layout-item.md-size-30.md-xsmall-size-100
              md-field
                label 赠卡代号（空格分隔多个）
                md-input(v-model='cardType.rewardCardTypes')
            .md-layout-item.md-size-100.mt-4.mx-auto
              p 类型相关
            .md-layout-item.md-size-20.md-xsmall-size-100
              md-field
                label 类型*
                md-select(v-model='cardType.type', @keydown.enter.prevent)
                  md-option(v-for='(name, type) in $cardTypeNames', :key='type', :value='type') {{ name }}
            .md-layout-item.md-size-20.md-xsmall-size-100(v-if="['times', 'coupon'].includes(cardType.type)")
              md-field
                label 次数*
                md-input(type='number', v-model.number='cardType.times')
            .md-layout-item.md-size-20.md-xsmall-size-100(v-if="['times', 'period'].includes(cardType.type)")
              md-field
                label 单次最多儿童数
                md-input(type='number', v-model.number='cardType.maxKids')
            .md-layout-item.md-size-20.md-xsmall-size-100(v-if="['times'].includes(cardType.type)")
              md-field
                label 单次最少儿童数
                md-input(type='number', v-model.number='cardType.minKids')
            .md-layout-item.md-size-20.md-xsmall-size-100(v-if="['times', 'period'].includes(cardType.type)")
              md-field
                label 每儿童免费陪同
                md-input(type='number', v-model.number='cardType.freeParentsPerKid')
            .md-layout-item.md-size-20.md-xsmall-size-100(v-if="['partner'].includes(cardType.type)")
              md-field
                label 品牌链接
                md-input(v-model='cardType.partnerUrl')
            .md-layout-item.md-size-15.md-xsmall-size-25(v-if="['coupon'].includes(cardType.type)")
              md-field
                label 满
                span.md-prefix ¥
                md-input(type='number', v-model.number='cardType.overPrice')
            .md-layout-item.md-size-15.md-xsmall-size-25(v-if="['coupon'].includes(cardType.type)")
              md-field
                label 减
                span.md-prefix ¥
                md-input(type='number', v-model.number='cardType.discountPrice')
            .md-layout-item.md-size-15.md-xsmall-size-25(v-if="['coupon'].includes(cardType.type)")
              md-field
                label 折
                md-input(type='number', step="0.01", min="0.01", max="0.99", v-model.number='cardType.discountRate')
            .md-layout-item.md-size-15.md-xsmall-size-25(v-if="['coupon'].includes(cardType.type)")
              md-field
                label 价
                span.md-prefix ¥
                md-input(type='number', step="0.01", v-model.number='cardType.fixedPrice')
            .md-layout-item.md-size-15.md-xsmall-size-25(v-if="cardType.type === 'balance'")
              md-field
                label 面值*
                md-input(type='number', step='0.01', v-model.number='cardType.balance')
            .md-layout-item.md-size-100(v-if="cardType.type==='balance'" style="display:flex;align-items:center;justify-content:flex-start")
              span 多种面值-售价组合
              md-button.md-just-icon.md-round.md-simple(@click="addBalanceGroup")
                md-icon(style="margin:0;font-size:18px !important") add
            .md-layout-item.md-size-100.md-layout(v-if="cardType.type==='balance'" v-for="(group,index) in cardType.balancePriceGroups" :key="index")
              .md-layout-item.md-size-20
                md-field
                  label 面值
                  md-input(type='number', step='0.01', v-model.number='group.balance')
              .md-layout-item.md-size-20
                md-field
                  label 售价
                  md-input(type='number', step='0.01', v-model.number='group.price')
              .md-layout-item.md-size-10
                md-button.md-just-icon.md-round.md-simple(@click="removeBalancePriceGroup(index)")
                  md-icon delete
            .md-layout-item.md-size-100
                md-chips.md-primary.shake-on-error(@keypress.native.enter.prevent, v-model='cardType.customerTags', md-placeholder='仅对标签客户显示', md-check-duplicated)
            .md-layout-item.md-size-100
              md-field.md-has-value.mt-4
                label 内容详情
                editor(v-model='cardType.content')
            .md-layout-item.md-size-100.text-right
              md-button.mt-4.md-simple.md-danger(type='button', @click='remove', v-if='cardType.id') 删除
    .md-layout-item.md-size-33.md-xsmall-size-100
      md-card
        .md-layout-item.md-size-100.md-xsmall-size-100.pb-2
          h4.card-title 默认卡面
          poster(v-model="cardType.posterUrl")
          h4.card-title 默认卡面（扁）
          poster(v-model="cardType.posterDenseUrl" height="7vw")
          h4.card-title(style="display:flex;align-items:center;justify-content:space-between") 更多卡面
            md-button.md-just-icon.md-simple.md-round(@click="addPoster")
              md-icon add
          poster(v-for="(url,index) in cardType.posterUrls" :key="url" v-model="cardType.posterUrls[index]")
            template(#buttons)
              md-button.md-just-icon.md-simple.md-round.md-danger(@click="removePoster(index)")
                md-icon delete
      md-button.md-block.md-success(v-if="cardType.openForClient" @click="$clipboard('/pages/index/index?cardSell='+cardType.id,'链接')") 点击复制小程序首页跳转链接（购卡）
      md-button.md-block.md-success(v-if="cardType.couponSlug" @click="$clipboard('/pages/index/index?coupon='+cardType.couponSlug,'链接')") 点击复制小程序首页跳转链接（团购）
      md-button.md-block.md-warning(v-if="cardType.couponSlug" @click="$router.push('/post/'+cardType.couponSlug)") 前往团购首页内容详情
      md-button.md-block.md-primary(@click="$router.push('/card?slug='+cardType.slug)") 查看已发卡券
</template>

<script lang="ts">
import Vue from "vue";
import { Watch, Component } from "vue-property-decorator";
import { confirm } from "@/helpers/sweetAlert";
import { CardType } from "@/resources/interfaces";
import { CardTypeResource } from "@/resources";
import { Poster, Editor, StoreSelect } from "@/components";

@Component({
  components: {
    Poster,
    Editor,
    StoreSelect
  }
})
export default class CardTypeDetail extends Vue {
  cardType: Partial<CardType> = {
    id: "",
    stores: [],
    customerTags: [],
    posterUrls: []
  };
  typeRelatedProperties: Array<keyof CardType> = [
    "times",
    "balance",
    "balancePriceGroups",
    "maxKids",
    "minKids",
    "freeParentsPerKid",
    "overPrice",
    "discountPrice",
    "discountRate",
    "fixedPrice",
    "partnerUrl"
  ];
  get valid() {
    return (
      this.cardType.title &&
      this.cardType.slug &&
      this.cardType.price !== undefined
    );
  }
  async save() {
    this.cardType = await CardTypeResource.save(this.cardType);

    this.$notify({
      message: "保存成功",
      icon: "check",
      horizontalAlign: "center",
      verticalAlign: "bottom",
      type: "success"
    });

    if (this.$route.params.id === "add") {
      this.$router.replace(`/card-type/${this.cardType.id}`);
    }
  }
  async remove() {
    if (
      !(await confirm(
        "确定要删除这个卡片种类",
        `这个操作不可撤销，已购该卡客户将不会受影响`,
        "确定删除",
        "error"
      ))
    )
      return;
    await CardTypeResource.delete({ id: this.cardType.id });
    this.$router.go(-1);
  }
  @Watch("cardType.type") onCardTypeTypeUpdate(type: string, typeWas: string) {
    if (typeWas && type && type !== typeWas) {
      for (const k of this.typeRelatedProperties) {
        delete this.cardType[k];
      }
    }
  }
  @Watch("cardType.start") onCardTypeStartUpdate(v: Date | string) {
    if (v && (!v.constructor || v.constructor.name !== "Date")) {
      this.cardType.start = new Date((this.cardType as CardType).start);
    }
  }
  @Watch("cardType.end") onCardTypeEndUpdate(v: Date | string) {
    if (v && (!v.constructor || v.constructor.name !== "Date")) {
      this.cardType.end = new Date((this.cardType as CardType).end);
    }
  }
  @Watch("cardType.dayType") onCardTypeDayTypeUpdate(v: false | string) {
    if (v === false) {
      this.cardType.dayType = null;
    }
  }
  addPoster() {
    this.cardType.posterUrls?.push("");
  }
  removePoster(index: number) {
    this.cardType.posterUrls = this.cardType.posterUrls
      ?.slice(0, index)
      .concat(this.cardType.posterUrls.slice(index + 1));
  }
  addBalanceGroup() {
    if (!this.cardType.balancePriceGroups) {
      this.cardType.balancePriceGroups = [];
    }
    this.cardType.balancePriceGroups.push({});
    this.$set(
      this.cardType,
      "balancePriceGroups",
      this.cardType.balancePriceGroups
    );
  }
  removeBalancePriceGroup(index: number) {
    if (!this.cardType.balancePriceGroups) {
      return;
    }
    this.cardType.balancePriceGroups = this.cardType.balancePriceGroups
      .slice(0, index)
      .concat(this.cardType.balancePriceGroups.slice(index + 1));
  }
  async mounted() {
    if (this.$route.params.id !== "add") {
      this.cardType = await CardTypeResource.get({
        id: encodeURIComponent(this.$route.params.id)
      });
    }
  }
}
</script>
<style lang="scss">
.md-datepicker-body .md-dialog-actions {
  display: none;
}
.md-input {
  min-width: 0;
}
.payments-card {
  margin-top: 50px;
}
.md-card.md-theme-default {
  position: static;
}
.md-card .md-table {
  width: 100%;
}
</style>
