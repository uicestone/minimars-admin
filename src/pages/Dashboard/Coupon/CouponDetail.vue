<template lang="pug">
.content
  .md-layout
    .md-layout-item.md-size-66.md-small-size-100.mx-auto
      form(@submit.prevent='save')
        md-card
          md-card-header.md-card-header-icon.md-card-header-primary
            .card-icon
              md-icon confirmation_number
            h4.title {{ coupon.title }}
              md-switch.pull-right(v-model="coupon.enabled") 启用
          md-card-content.md-layout
            .md-layout-item.md-size-33
              md-field
                label 名称
                md-input(v-model='coupon.title')
            .md-layout-item.md-small-size-100.md-size-33
              md-field
                label 儿童数
                md-input(type='number', v-model='coupon.kidsCount')
            .md-layout-item.md-small-size-100.md-size-33
              md-field
                label 门店
                md-select(v-model='coupon.store')
                  md-option 不绑定门店
                  md-option(v-for='store in $stores', :key='store.id', :value='store.id') {{ store.name }}
            .md-layout-item.md-small-size-100.md-size-33
              md-field
                label 三方平台售价
                md-input(type='number', step='0.01', v-model='coupon.priceThirdParty')
            .md-layout-item.md-small-size-100.md-size-33
              md-field
                label 门店售价
                md-input(type='number', step='0.01', v-model='coupon.price')
            .md-layout-item.md-small-size-100.md-size-33
              md-field
                label 每儿童免费陪同成人
                md-input(type='number', v-model='coupon.freeParentsPerKid')
            .md-layout-item.md-small-size-100.md-size-50(v-if="coupon.type === 'period'")
              md-datepicker(placeholder='开始日期', v-model='coupon.start', :md-model-type='Date', md-immediately)
                label 开始日期
            .md-layout-item.md-small-size-100.md-size-50(v-if="coupon.type === 'period'")
              md-datepicker(placeholder='截止日期', v-model='coupon.end', :md-model-type='Date', md-immediately)
                label 截止日期
            .md-layout-item.md-size-100
              md-field
                label 内容详情
                md-textarea.no-padding(v-model='coupon.content')
            .md-layout-item.md-size-100.text-right
              md-button.md-raised.md-primary.mt-4(type='submit') 保存
              md-button.mt-4.ml-2.md-simple.md-danger(type='button', @click='remove', v-if='this.coupon.id') 删除

</template>

<script lang="ts">
import Vue from "vue";
import { Watch, Component } from "vue-property-decorator";
import { confirm } from "@/helpers/sweetAlert";
import { Coupon, Store } from "@/resources/interfaces";
import { CouponResource } from "@/resources";

@Component
export default class CouponDetail extends Vue {
  coupon: Partial<Coupon> = {
    id: "",
    store: null,
    kidsCount: 1,
    price: 0,
    enabled: true
  };
  async save() {
    this.coupon = await CouponResource.save(this.coupon);

    this.$notify({
      message: "保存成功",
      icon: "check",
      horizontalAlign: "center",
      verticalAlign: "bottom",
      type: "success"
    });

    if (this.$route.params.id === "add") {
      this.$router.replace(`/coupon/${this.coupon.id}`);
    }
  }
  async remove() {
    if (
      !(await confirm(
        "确定要删除这个优惠",
        `这个操作不可撤销`,
        "确定删除",
        "error"
      ))
    )
      return;
    await CouponResource.delete({ id: this.coupon.id });
    this.$router.go(-1);
  }
  @Watch("coupon.store") onCouponStoreUpdate(v: Store | false) {
    if (typeof v === "object" && v) {
      // @ts-ignore
      this.coupon.store = this.coupon.store.id;
    } else if (v === false) {
      this.coupon.store = null;
    }
  }
  async mounted() {
    if (this.$route.params.id !== "add") {
      this.coupon = await CouponResource.get({ id: this.$route.params.id });
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
