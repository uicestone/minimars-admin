<template lang="pug">
.content
  .md-layout
    .md-layout-item.md-size-66.md-small-size-100.mx-auto
      form(@submit.prevent='save')
        md-card
          md-card-header.md-card-header-icon.md-card-header-primary
            .card-icon
              md-icon card_membership
            h4.title {{ cardType.title }}
              span.pull-right(style="display:flex")
                md-switch.md-primary(v-model="cardType.isGift") 可转赠
                md-switch.md-primary(v-model="cardType.openForClient") 客户端购买
          md-card-content.md-layout
            .md-layout-item.md-size-40
              md-field
                label 名称
                md-input(v-model='cardType.title')
            .md-layout-item.md-size-20
              md-field
                label 每用户最多购买
                md-input(type="number" min="1" v-model='cardType.maxPerCustomer')
            .md-layout-item.md-size-20
              md-field
                label 代号
                md-input(v-model='cardType.slug')
            .md-layout-item.md-small-size-100.md-size-20
              md-field
                label 门店
                md-select(v-model='cardType.store')
                  md-option 不绑定门店
                  md-option(v-for='store in $stores', :key='store.id', :value='store.id') {{ store.name }}
            .md-layout-item.md-small-size-100.md-size-20
              md-field
                label 类型
                md-select(v-model='cardType.type', @keydown.enter.prevent)
                  md-option(v-for='(name, type) in $cardTypeNames', :key='type', :value='type') {{ name }}
            .md-layout-item.md-small-size-100.md-size-20
              md-field
                label 售价
                md-input(type='number', step='0.01', v-model='cardType.price')
            .md-layout-item.md-small-size-100.md-size-20
              md-field
                label 有效时长
                md-input(type='number', step='1', v-model='cardType.expiresInDays')
                span.md-suffix 天
            .md-layout-item.md-small-size-100.md-size-20(v-if="['times', 'period'].includes(cardType.type)")
              md-field
                label 单次最多儿童数
                md-input(type='number', v-model='cardType.maxKids')
            .md-layout-item.md-small-size-100.md-size-20(v-if="['times', 'period'].includes(cardType.type)")
              md-field
                label 每儿童免费陪同成人
                md-input(type='number', v-model='cardType.freeParentsPerKid')
            .md-layout-item(v-if="['times', 'coupon'].includes(cardType.type)")
              md-field
                label 次数
                md-input(type='number', v-model='cardType.times')
            .md-layout-item
              md-field
                label 节假日限制
                md-select(v-model='cardType.dayType', @keydown.enter.prevent)
                  md-option 不限
                  md-option(value='onDaysOnly') 仅限法定工作日
                  md-option(value='offDaysOnly') 仅限法定节假日
            .md-layout-item(v-if="['coupon'].includes(cardType.type)")
              md-field
                label 满
                md-input(type='number', v-model='cardType.overPrice')
            .md-layout-item(v-if="['coupon'].includes(cardType.type)")
              md-field
                label 减
                md-input(type='number', v-model='cardType.discountPrice')
            .md-layout-item(v-if="cardType.type === 'balance'")
              md-field
                label 面值
                md-input(type='number', step='0.01', v-model='cardType.balance')
            .md-layout-item(v-if="['period', 'coupon', 'times'].includes(cardType.type)")
              md-datepicker(placeholder='开始日期', v-model='cardType.start', :md-model-type='Date', md-immediately)
                label 开始日期
            .md-layout-item(v-if="['period', 'times'].includes(cardType.type)")
              md-datepicker(placeholder='截止日期', v-model='cardType.end', :md-model-type='Date', md-immediately)
                label 截止日期
            .md-layout-item.md-size-100
                md-chips.md-primary.shake-on-error(@keypress.native.enter.prevent, v-model='cardType.customerTags', md-placeholder='仅对标签客户显示', md-check-duplicated)
            .md-layout-item.md-size-100
              md-field.md-has-value.mt-4
                label 内容详情
                editor(v-model='cardType.content')
            .md-layout-item.md-size-100.text-right
              md-button.md-raised.md-primary.mt-4(type='submit') 保存
              md-button.mt-4.ml-2.md-simple.md-danger(type='button', @click='remove', v-if='this.cardType.id') 删除
    .md-layout-item.md-size-33.md-small-size-100
      md-card
        .md-layout-item.md-size-100.md-xsmall-size-100.pb-2
          h4.card-title 封面图
          poster(v-model="cardType.posterUrl")

</template>

<script lang="ts">
import Vue from "vue";
import { Watch, Component } from "vue-property-decorator";
import { confirm } from "@/helpers/sweetAlert";
import { CardType, Store } from "@/resources/interfaces";
import { CardTypeResource } from "@/resources";
import { Poster, Editor } from "@/components";

@Component({
  components: {
    Poster,
    Editor,
  },
})
export default class CardTypeDetail extends Vue {
  cardType: Partial<CardType> = {
    id: "",
    store: null,
    freeParentsPerKid: 2,
    maxKids: 2,
    customerTags: [],
  };
  async save() {
    this.cardType = await CardTypeResource.save(this.cardType);

    this.$notify({
      message: "保存成功",
      icon: "check",
      horizontalAlign: "center",
      verticalAlign: "bottom",
      type: "success",
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
      delete this.cardType.start;
      delete this.cardType.end;
      delete this.cardType.balance;
      delete this.cardType.times;
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
  @Watch("cardType.store") onCardTypeStoreUpdate(v: Store | false) {
    if (typeof v === "object" && v) {
      // @ts-ignore
      this.cardType.store = this.cardType.store.id;
    } else if (v === false) {
      this.cardType.store = null;
    }
  }
  async mounted() {
    if (this.$route.params.id !== "add") {
      this.cardType = await CardTypeResource.get({ id: this.$route.params.id });
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
