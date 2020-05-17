<template lang="pug">
.md-layout
  .md-layout-item
    md-card
      md-card-header.md-card-header-icon.md-card-header-primary(v-if='type==="play"')
        .card-icon
          md-icon timer
        h4.title 票务管理
      md-card-header.md-card-header-icon.md-card-header-warning(v-if='type==="event"')
        .card-icon
          md-icon event
        h4.title 活动预约
      md-card-header.md-card-header-icon.md-card-header-rose(v-if='type==="gift"')
        .card-icon
          md-icon card_giftcard
        h4.title 礼品兑换
      md-card-header.md-card-header-icon.md-card-header-green(v-if='type==="food"')
        .card-icon
          md-icon fastfood
        h4.title 餐饮消费
      md-card-content.paginated-table
        .md-toolbar.md-table-toolbar.md-transparent.md-theme-default.md-elevation-0.md-layout.mb-2
          .md-layout
            md-datepicker.md-layout-item.md-size-20.md-xsmall-size-100(v-model='searchQuery.date', :md-model-type='String', md-immediately)
              label 日期
            md-field.md-layout-item.md-size-15.md-xsmall-size-100(v-if='!searchQuery.customer')
              label 客户
              md-input(type='search', clearable='', v-model='searchQuery.customerKeyword')
            md-field.md-layout-item.md-size-15.md-xsmall-size-100
              label 状态
              md-select(v-model='searchQuery.status', multiple)
                md-option(v-for='(name, status) in $bookingStatusNames', :key='status', :value='status') {{ name }}
            md-field.md-layout-item.md-size-15.md-xsmall-size-100(v-if="$user.role==='admin'")
              label 门店
              md-select(v-model='searchQuery.store')
                md-option(value='') 全部
                md-option(v-for='store in $stores', :key='store.id', :value='store.id') {{ store.name }}
            md-field.md-layout-item.md-size-15.md-xsmall-size-100(v-if="type==='play'")
              label 客户类型
              md-select(v-model='searchQuery.paymentType')
                md-option(value="") 全部
                md-option(value="guest") 门市散客
                md-option(value="coupon") 平台优惠
                md-option(value="card") 购卡会员
            md-field.md-layout-item.md-size-15.md-xsmall-size-100(v-if="type==='play'")
              label 优惠
              md-select(v-model='searchQuery.coupon')
                md-option(value='') 全部
                md-option(v-for='coupon in $coupons', :key='coupon.id', :value='coupon.id') {{ coupon.title }}
          .toolbar-actions
            md-button.md-primary(v-if='type==="play"', @click='showCreate("play")')
              | 创建门票预约
            md-button.md-warning(v-if='type==="event"', @click='showCreate("event")')
              | 创建活动预约
            md-button.md-rose(v-if='type==="gift"', @click='showCreate("gift")')
              | 创建礼品兑换
            md-button.md-success(v-if='type==="food"', @click='showCreate("food")')
              | 创建吧台消费
            md-button.md-just-icon.md-simple(@click='queryData')
              md-icon refresh
        md-table.paginated-table.table-striped.table-hover(:value='queriedData', :md-sort.sync='currentSort', :md-sort-order.sync='currentSortOrder', :md-sort-fn='$noop')
          md-table-row(slot='md-table-row', md-selectable='single', slot-scope='{ item }', @click='showDetail(item)')
            md-table-cell(md-label='门店', md-sort-by='store' v-if="$user.role==='admin' && !searchQuery.store")
              | {{ item.store ? item.store.name : '门店通用' }}
            md-table-cell(md-label='客户', md-sort-by='customer.name', @click.native.stop='goToCustomer(item.customer)', style='min-width:180px')
              span(v-if="item.customer") {{ item.customer.mobile }} {{ item.customer.name }}
                md-icon.mini.pull-right keyboard_arrow_right
              span(v-else) -
            md-table-cell(md-label='状态', md-sort-by='status')
              | {{ item.status | bookingStatusName }}
            md-table-cell(md-label='日期', md-sort-by='date' v-if="!searchQuery.date")
              | {{ item.date }}
            md-table-cell(md-label='入场时间', md-sort-by='checkInAt' v-if="searchQuery.type === 'play'")
              | {{ item.checkInAt }}
            md-table-cell(md-label='大 / 小', md-sort-by='adultsCount' v-if="searchQuery.type === 'play'")
              span {{ item.adultsCount }} /
              b  {{ item.kidsCount }}
            md-table-cell(md-label='礼品', md-sort-by='gift.id' v-if="searchQuery.type === 'gift'")
              | {{ item.gift.title }}
            md-table-cell(md-label='数量', md-sort-by='quantity' v-if="searchQuery.type === 'gift'")
              | {{ item.quantity }}
            md-table-cell(md-label='活动', md-sort-by='event.id' v-if="searchQuery.type === 'event'")
              | {{ item.event.title }}
            md-table-cell(md-label='人数', md-sort-by='kidsCount' v-if="searchQuery.type === 'event'")
              | {{ item.quantity }}
            md-table-cell(md-label='收款', md-sort-by='price')
              | {{ item.payments | paidAmount | currency(2, true) }}
            md-table-cell(md-label='优惠/会员卡', md-sort-by='coupon' v-if="searchQuery.type === 'play'")
              span(v-if='item.coupon') {{ item.coupon.title }}
              span(v-else-if='item.card') {{ item.card.title }}
              span(v-else) -
            md-table-cell(md-label='创建时间', md-sort-by='createdAt')
              | {{ item.createdAt | date }}
      md-card-actions(md-alignment='space-between')
        div
          p.card-category {{ from }} - {{ to }} / {{ total }}
        pagination.pagination-no-border.pagination-primary(v-if='type==="play"', v-model='pagination.currentPage', :per-page='pagination.perPage', :total='total')
        pagination.pagination-no-border.pagination-warning(v-if='type==="event"', v-model='pagination.currentPage', :per-page='pagination.perPage', :total='total')
        pagination.pagination-no-border.pagination-rose(v-if='type==="gift"', v-model='pagination.currentPage', :per-page='pagination.perPage', :total='total')
        pagination.pagination-no-border.pagination-success(v-if='type==="food"', v-model='pagination.currentPage', :per-page='pagination.perPage', :total='total')
</template>

<script lang="ts">
import moment from "moment";
import List from "@/components/List";
import Component from "vue-class-component";
import { BookingResource } from "@/resources";
import {
  Payment,
  BookingQuery,
  Booking,
  BookingType,
  User
} from "@/resources/interfaces";

@Component({
  filters: {
    paidAmount(payments: Payment[]) {
      return payments
        .filter(p => p.paid)
        .map(p => p.amount)
        .reduce((sum, amount) => sum + amount, 0);
    }
  }
})
export default class BookingList extends List<Booking> {
  name = "booking";
  resource = BookingResource;
  type: BookingType = BookingType.PLAY;
  searchQuery: BookingQuery = {};
  showDetail(item: Booking) {
    this.$router.push(`/booking/${item.type}/${item.id}`);
  }
  showCreate(type?: BookingType) {
    this.$router.push(`/booking/${type}/add`);
  }
  goToCustomer(customer: User) {
    this.$router.push(`/user/${customer.id}`);
  }
  created() {
    this.type = this.$route.params.type as BookingType;
    this.searchQuery = {
      type: this.type,
      date: this.$route.query.customer
        ? undefined
        : moment().format("YYYY-MM-DD"),
      status: [],
      customer: this.$route.query.customer as string,
      customerKeyword: ""
    };
  }
}
</script>

<style lang="scss" scoped>
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
.md-input {
  max-width: 100%;
}
</style>
