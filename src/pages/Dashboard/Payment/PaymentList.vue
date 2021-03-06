<template lang="pug">
.md-layout
  .md-layout-item
    md-card
      md-card-header.md-card-header-icon.md-card-header-danger
        .card-icon
          md-icon payment
        h4.title 支付明细
          md-button.md-just-icon.md-simple.md-xs.pull-right(@click='queryData')
            md-icon refresh
          md-button.md-just-icon.md-simple.md-xs.pull-right(@click='download' v-if="$user.can('PAYMENT_DOWNLOAD') && (searchQuery.date || searchQuery.dateEnd)")
            md-icon get_app
          span.pull-right.mr-2.text-normal.text-right(style="text-align:right")
            b 合计：
            | 收款 {{ totalAmount.assets | currency }} /
            | 核销 {{ totalAmount.debt | currency }} /
            | 收入 {{ totalAmount.revenue | currency }}
            br
            | 次数 {{ totalAmount.times }} /
            | 余额 {{ totalAmount.balance | currency }}
      md-card-content.paginated-table
        .md-toolbar.md-table-toolbar.md-transparent.md-theme-default.md-elevation-0.md-layout.mb-2
          .md-layout.md-layout-item.search-query
            md-datepicker.md-layout-item.md-size-date.md-xsmall-size-50(v-if="showDateRange" v-model='searchQuery.date', :md-model-type='String', md-immediately :md-disabled-dates="disabledDates")
              label 日期开始
            md-datepicker.md-layout-item.md-size-date.md-xsmall-size-50(v-if="showDateRange" v-model='searchQuery.dateEnd', :md-model-type='String', md-immediately :md-disabled-dates="disabledDates")
              label 日期结束
            md-field.md-layout-item.md-size-10.md-xsmall-size-50(v-if="!$user.store")
              label 门店
              md-select(v-model='searchQuery.store')
                md-option(value='') 全部
                md-option(v-for='store in $stores', :key='store.id', :value='store.id') {{ store.name }}
            md-field.md-layout-item.md-size-10.md-xsmall-size-50
              label 支付方式
              md-select(v-model='searchQuery.gateway', multiple)
                md-option(v-for='(name, gateway) in $gatewayNames', :key='gateway', :value='gateway') {{ name }}
            md-field.md-layout-item.md-size-10.md-xsmall-size-50
              label 业务场景
              md-select(v-model='searchQuery.scene' multiple)
                md-option(v-for="(label, scene) in $sceneNames", :key='scene', :value='scene') {{ label }}
            //- md-field.md-layout-item.md-size-5.md-xsmall-size-50
              label 收/退
              md-select(v-model='searchQuery.direction')
                md-option(v-for="(name, direction) in { payment: '收款', refund: '退款' }", :key='direction', :value='direction') {{ name }}
            md-field.md-layout-item.md-size-5.md-xsmall-size-50
              label 完成
              md-select(v-model='searchQuery.paid')
                md-option(value='') 全部
                md-option(v-for="(name, paid) in { true: '是', false: '否' }", :key='paid', :value='paid') {{ name }}
            md-field.md-layout-item.md-size-10.md-xsmall-size-50
              label 退款状态
              md-select(v-model='searchQuery.refunded')
                md-option(value='') 全部
                md-option(v-for="(name, refunded) in { true: '已全额退款', false: '无退款' }", :key='refunded', :value='refunded') {{ name }}
            md-field.md-layout-item.md-size-15.md-xsmall-size-50.mr-2
              label 描述
              md-input(v-model="searchQuery.title")
            md-field.md-layout-item.md-size-10.md-xsmall-size-50
              label 金额
              md-input(v-model="searchQuery.amount")
        md-table.table-striped.table-hover(:value='queriedData', :md-sort.sync='currentSort', :md-sort-order.sync='currentSortOrder', :md-sort-fn='$noop')
          md-table-row(slot='md-table-row', md-selectable='single', slot-scope='{ item }' @click="$clipboard(item.id, '支付ID')")
            md-table-cell(md-label='客户', md-sort-by='customer', @click.native.stop='goToCustomer(item.customer)', style='min-width:100px') {{ item.customer ? item.customer.name : "-" }}
              span(v-if='item.customer && item.customer.mobile')
                | {{ item.customer.mobile.substr(-4) }}
              md-icon.mini keyboard_arrow_right
            md-table-cell(md-label='次数', md-sort-by='times')
              span(v-if="$user.can('DEVELOP') && item.card" @click.stop="$router.push(`/payment?card=${item.card}`)") {{item.card.substr(-2).toUpperCase()}} 
              | {{ item.times ? (item.times > 0 ? `+${item.times}` : item.times) : '-' }}
            md-table-cell(md-label='金额', md-sort-by='amount')
              div(v-if="item.amount || (item.amount===0&&!item.amountInPoints)") {{ item.amount | currency }}
              div(v-if="item.amountInPoints!==undefined") {{ item.amountInPoints }} 积分
            md-table-cell(md-label='完成', md-sort-by='paid' v-if="searchQuery.paid===''") {{ item.paid ? "是" : "否" }}
            md-table-cell(md-label='描述', md-sort-by='title', style='min-width:25em') {{ item.title }}
            md-table-cell(md-label='通道', md-sort-by='gateway') {{ item.gateway | paymentGatewayName }}
            md-table-cell(md-label='时间', md-sort-by='createdAt') {{ item.createdAt | date }}
            md-table-cell(md-label='业务场景', @click.native.stop='goToRelatedItem(item)')
              | {{ item.scene | sceneName }}
              md-icon.mini(style="margin:0") keyboard_arrow_right
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
  totalAmount: {
    assets: number;
    debt: number;
    revenue: number;
    balance: number;
    times: number;
  } = { assets: NaN, debt: NaN, revenue: NaN, balance: NaN, times: NaN };

  get showDateRange() {
    return (
      this.$user.can("PAYMENT_LAST_WEEK") ||
      this.$user.can("PAYMENT_LAST_MONTH") ||
      this.$user.can("PAYMENT_ALL_DATE") ||
      this.$user.can("BOSSBOARD")
    );
  }

  async queryData() {
    const queriedData = await (List as any).options.methods.queryData.call(
      this
    );
    if (!queriedData) return;
    const [assets, debt, revenue, balance, times] = queriedData.$headers[
      "total-amount"
    ].split(",") as number[];
    this.totalAmount.assets = assets;
    this.totalAmount.debt = debt;
    this.totalAmount.revenue = revenue;
    this.totalAmount.balance = balance;
    this.totalAmount.times = times;
    return queriedData;
  }
  showCreate() {
    // this.$router.push("/payment/add");
  }
  goToCustomer(customer: User) {
    this.$router.push(`/user/${customer.id}`);
  }
  goToRelatedItem(item: Payment) {
    if (item.booking) {
      return this.$router.push(`/booking/${item.scene}/${item.booking}`);
    } else if (item.customer) {
      return this.$router.push(`/user/${item.customer.id}`);
    }
  }
  disabledDates(date: Date) {
    if (this.$user.can("PAYMENT_ALL_DATE")) {
      return false;
    } else if (this.$user.can("PAYMENT_LAST_MONTH")) {
      const start = moment().subtract(1, "month").startOf("month").valueOf();
      return date.valueOf() < start;
    } else if (this.$user.can("PAYMENT_LAST_WEEK")) {
      const start = moment().subtract(1, "week").startOf("week").valueOf();
      return date.valueOf() < start;
    } else {
      const start = moment().startOf("day").valueOf();
      return date.valueOf() < start;
    }
  }
  download() {
    const params: Record<string, any> = {
      token: window.localStorage.token,
      ...this.searchQuery
    };
    const queryString = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join("&");
    window.location.href =
      process.env.VUE_APP_API_BASE + "/payment-sheet?" + queryString;
  }
  created() {
    this.searchQuery = {
      date: moment().format("YYYY-MM-DD"),
      scene: [],
      paid: true,
      gateway: []
    };
    if (this.$route.query.customer) {
      this.searchQuery.customer = this.$route.query.customer;
      this.searchQuery.date = undefined;
    }
    if (this.$route.query.card) {
      this.searchQuery.card = this.$route.query.card;
      this.searchQuery.date = undefined;
    }
    if (this.$user.store) {
      this.searchQuery.store = this.$user.store.id;
    }
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
.md-size-date {
  min-width: 135px;
  max-width: 140px;
}
</style>
