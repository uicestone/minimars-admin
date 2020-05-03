<template lang="pug">
md-card.payments-card
  md-card-header.md-card-header-icon.md-card-header-danger
    .card-icon
      md-icon payment
    h4.title {{ title }}
  md-card-content.md-layout
    md-table
      md-table-row(v-for='payment in payments', :key='payment.id')
        md-table-cell(md-label='创建时间')
          | {{ payment.createdAt | date("YY/MM/DD") }}
        md-table-cell(md-label='金额') ¥{{ payment.amount }}
        md-table-cell(md-label='通道') {{ payment.gateway | paymentGatewayName }}
        md-table-cell(md-label='描述') {{ payment.title }}
        md-table-cell(md-label='收款')
          md-button.md-success.md-normal(disabled, v-if='payment.paid') 已收款
          md-button.md-normal.md-warning(v-else-if="payment.valid", @click='pay(payment)') 收款
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Payment } from "../resources/interfaces";

@Component
export default class PaymentsCard extends Vue {
  @Prop({ default: "付款记录" })
  title!: string;

  @Prop({ default: () => [] })
  payments!: Payment[];

  @Prop({ default: () => {} })
  pay!: Function;
}
</script>

<style scoped>
.md-table.md-content {
  width: 100%;
}
</style>
