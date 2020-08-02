<template lang="pug">
md-card.payments-card
  md-card-header.md-card-header-icon.md-card-header-danger
    .card-icon
      md-icon payment
    h4.title {{ title }}
  md-card-content.md-layout
    md-table
      md-table-row(v-for='payment in payments', :key='payment.id' v-if="payment.valid")
        md-table-cell(md-label='创建时间' @click.native="$clipboard(payment.id, '支付ID')")
          //- | {{ payment.id.substr(-4) }}
          //- | {{ payment.s }}
          | {{ payment.createdAt | date("YY/MM/DD HH:mm:ss") }}
        md-table-cell(md-label='金额') {{ payment.amount | currency(2, true) }}
        md-table-cell(md-label='通道') {{ payment.gateway | paymentGatewayName }}
        md-table-cell(md-label='描述') {{ payment.title }}
        md-table-cell(md-label='收款')
          md-button.md-success.md-normal(disabled, v-if='payment.paid') 已收款
          md-button.md-normal.md-warning(v-else-if="payment.valid && !['wechatpay'].includes(payment.gateway)", @click='pay(payment)') 收款
          md-button.md-normal(v-else disabled) 失效
        //- md-table-cell
          | card: {{ payment.card && payment.card.substr(-4) }}
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
