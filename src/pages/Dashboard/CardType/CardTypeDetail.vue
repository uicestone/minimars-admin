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
          md-card-content.md-layout
            .md-layout-item.md-size-50
              md-field
                label 名称
                md-input(v-model='cardType.title')
            .md-layout-item.md-size-25
              md-field
                label 代号
                md-input(v-model='cardType.slug')
            .md-layout-item.md-small-size-100.md-size-25
              md-field
                label 门店
                md-select(v-model='cardType.store')
                  md-option 不绑定门店
                  md-option(v-for='store in $stores', :key='store.id', :value='store.id') {{ store.name }}
            .md-layout-item.md-small-size-100.md-size-25
              md-field
                label 类型
                md-select(v-model='cardType.type', @keydown.enter.prevent='')
                  md-option(v-for='(name, type) in $cardTypeNames', :key='type', :value='type') {{ name }}
            .md-layout-item.md-small-size-100.md-size-25
              md-field
                label 售价
                md-input(type='number', v-model='cardType.price')
            .md-layout-item.md-small-size-100.md-size-25
              md-field
                label 单次最多儿童数
                md-input(type='number', v-model='cardType.maxKids')
            .md-layout-item.md-small-size-100.md-size-25
              md-field
                label 每儿童免费陪同成人
                md-input(type='number', v-model='cardType.freeParentsPerKid')
            .md-layout-item.md-small-size-100.md-size-100(v-if="cardType.type === 'times'")
              md-field
                label 次数
                md-input(type='number', v-model='cardType.times')
            .md-layout-item.md-small-size-100.md-size-100(v-if="cardType.type === 'balance'")
              md-field
                label 面值
                md-input(type='number', v-model='cardType.balance')
            .md-layout-item.md-small-size-100.md-size-50(v-if="cardType.type === 'period'")
              md-datepicker(placeholder='开始日期', v-model='cardType.start', :md-model-type='Date', md-immediately='')
                label 开始日期
            .md-layout-item.md-small-size-100.md-size-50(v-if="cardType.type === 'period'")
              md-datepicker(placeholder='截止日期', v-model='cardType.end', :md-model-type='Date', md-immediately='')
                label 截止日期
            .md-layout-item.md-size-100
              md-field
                label 内容详情
                md-textarea.no-padding(v-model='cardType.content')
            .md-layout-item.md-size-100.text-right
              md-button.md-raised.md-primary.mt-4(type='submit') 保存
              md-button.mt-4.ml-2.md-simple.md-danger(type='button', @click='remove', v-if='this.cardType.id') 删除
</template>

<script lang="ts">
import Vue from "vue";
import { Watch, Component } from "vue-property-decorator";
import { confirm } from "@/helpers/sweetAlert";
import { CardType, Store } from "@/resources/interfaces";
import { CardTypeResource } from "@/resources";

@Component
export default class CardTypeDetail extends Vue {
  cardType: Partial<CardType> = {
    id: "",
    store: null,
    freeParentsPerKid: 2,
    maxKids: 2
  };
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
