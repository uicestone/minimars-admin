<template lang="pug">
.md-layout
  .md-layout-item
    md-card
      md-card-header.md-card-header-icon.md-card-header-primary
        .card-icon
          md-icon payment
        h4.title 流水明细
      md-card-content.paginated-table
        .md-toolbar.md-table-toolbar.md-transparent.md-theme-default.md-elevation-0.md-layout.mb-2
          .md-layout-item(style='flex:0;flex-basis:200px')
            | 总金额：{{ totalAmount | currency }}
          .md-layout.md-layout-item.md-alignment-center-right.search-query
            md-datepicker.md-layout-item.md-size-20.md-xsmall-size-100(v-model='searchQuery.date', :md-model-type='String', md-immediately)
              label 日期
            md-field.md-layout-item.md-size-15.md-xsmall-size-25
              label 完成
              md-select(v-model='searchQuery.paid')
                md-option(value='') 全部
                md-option(v-for="(name, paid) in { true: '是', false: '否' }", :key='paid', :value='paid') {{ name }}
            md-field.md-layout-item.md-size-15.md-xsmall-size-25
              label 类型
              md-select(v-model='searchQuery.attach')
                md-option(value='') 全部
                md-option(v-for="(name, attach) in { booking: '消费', card: '充值' }", :key='attach', :value='attach') {{ name }}
            md-field.md-layout-item.md-size-15.md-xsmall-size-25
              label 方向
              md-select(v-model='searchQuery.direction')
                md-option(value='') 全部
                md-option(v-for="(name, direction) in { payment: '收款', refund: '退款' }", :key='direction', :value='direction') {{ name }}
            md-field.md-layout-item.md-size-15.md-xsmall-size-25
              label 通道
              md-select(v-model='searchQuery.gateway', multiple)
                md-option(v-for='(name, gateway) in $gatewayNames', :key='gateway', :value='gateway') {{ name }}
        md-table.table-striped.table-hover(:value='queriedData', :md-sort.sync='currentSort', :md-sort-order.sync='currentSortOrder', :md-sort-fn='$noop')
          md-table-row(slot='md-table-row', md-selectable='single', slot-scope='{ item }')
            md-table-cell(md-label='客户', md-sort-by='customer.name', @click.native.stop='goToCustomer(item.customer)', style='min-width:100px') {{ item.customer ? item.customer.name : "-" }}
              span(v-if='item.customer.mobile')
                | {{ item.customer.mobile.substr(-4) }}
              md-icon.mini keyboard_arrow_right
            md-table-cell(md-label='金额', md-sort-by='amount') {{ item.amountDeposit || item.amount | currency }}
            md-table-cell(md-label='完成', md-sort-by='paid') {{ item.paid ? "是" : "否" }}
            md-table-cell(md-label='描述', md-sort-by='title', style='min-width:25em') {{ item.title }}
            md-table-cell(md-label='通道', md-sort-by='gateway') {{ item.gateway | paymentGatewayName }}
            md-table-cell(md-label='时间', md-sort-by='createdAt') {{ item.createdAt | date }}
            md-table-cell(md-label='相关链接', @click.native.stop='goToRelatedItem(item)') {{ relatedItem(item) }}
      md-card-actions(md-alignment='space-between')
        div
          p.card-category {{ from }} - {{ to }} / {{ total }}
        pagination.pagination-no-border.pagination-primary(v-model='pagination.currentPage', :per-page='pagination.perPage', :total='total')
</template>

<script lang="ts">
import moment from "moment";
import Component from "vue-class-component";
import { PaymentResource } from "@/resources";
import List from "@/components/List";
import { Payment, User } from "@/resources/interfaces";

@Component
export default class PaymentList extends List<Payment> {
  name = "payment";
  resource = PaymentResource;
  totalAmount: number | null = null;
  async queryData() {
    const queriedData = await (List as any).options.methods.queryData.call(
      this
    );
    if (!queriedData) return;
    this.totalAmount = Number(queriedData.$headers["total-amount"]);
    return queriedData;
  }
  showCreate() {
    // this.$router.push("/payment/add");
  }
  goToCustomer(customer: User) {
    this.$router.push(`/user/${customer.id}`);
  }
  goToRelatedItem(item: Payment) {
    const attach = item.attach.split(" ");
    switch (attach[0]) {
      case "booking":
        return this.$router.push(`/booking/${attach[1]}`);
      case "deposit":
        return this.$router.push(`/user/${attach[1]}`);
    }
  }
  relatedItem(item: Payment) {
    const attach = item.attach.split(" ");
    switch (attach[0]) {
      case "booking":
        return "预约";
      case "deposit":
        return "充值";
    }
  }
  created() {
    this.searchQuery = {
      date: moment().format("YYYY-MM-DD"),
      paid: true
    };
  }
}
</script>

<style lang="css" scoped>
.md-card .md-card-actions {
  border: 0;
  margin-left: 20px;
  margin-right: 20px;
}
* >>> .md-datepicker .md-date-icon {
  margin-top: 12px;
  margin-bottom: 0;
}
.md-icon.mini {
  height: 16px;
  width: 16px;
  min-width: 16px;
  font-size: 16px !important;
}
</style>
