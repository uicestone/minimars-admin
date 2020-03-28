<template lang="pug">
.md-layout
  .md-layout-item
    md-card
      md-card-header.md-card-header-icon.md-card-header-primary
        .card-icon
          md-icon timer
        h4.title 预约列表
      md-card-content.paginated-table
        .md-toolbar.md-table-toolbar.md-transparent.md-theme-default.md-elevation-0.md-layout.mb-2
          .md-layout
            md-datepicker.md-layout-item.md-size-25.md-xsmall-size-100(v-model='searchQuery.date', :md-model-type='String', md-immediately='')
              label 日期
            md-field.md-layout-item.md-size-20.md-xsmall-size-100(v-if='!searchQuery.customer')
              label 搜索客户
              md-input(type='search', clearable='', v-model='searchQuery.customerKeyword')
            md-field.md-layout-item.md-size-20.md-xsmall-size-100
              label 筛选状态
              md-select(v-model='searchQuery.status', multiple='')
                md-option(v-for='(name, status) in $bookingStatusNames', :key='status', :value='status') {{ name }}
            md-field.md-layout-item.md-size-20.md-xsmall-size-100
              label 筛选类型
              md-select(v-model='searchQuery.type')
                md-option(value='') 全部类型
                md-option(v-for='(name, type) in $bookingTypeNames', :key='type', :value='type') {{ name }}
            //- md-field.md-layout-item.md-size-15.md-xsmall-size-100
              label 优惠
              md-select(v-model='searchQuery.coupon')
                md-option(value='') 不指定
                md-option(v-for='coupon in $config.coupons', :key='coupon.slug', :value='coupon.slug') {{ coupon.name }}
          .toolbar-actions
            md-button.md-primary.mr-2(@click='showCreate()')
              | 门票预约
            md-button.md-warning.mr-2(@click='showCreate("event")')
              | 活动预约
            md-button.md-rose(@click='showCreate("gift")')
              | 礼品兑换
            md-button.md-just-icon.md-simple(@click='queryData')
              md-icon refresh
        md-table.paginated-table.table-striped.table-hover(:value='queriedData', :md-sort.sync='currentSort', :md-sort-order.sync='currentSortOrder', :md-sort-fn='noop')
          md-table-row(slot='md-table-row', md-selectable='single', slot-scope='{ item }', @click='showDetail(item)')
            md-table-cell(md-label='门店', md-sort-by='store.name')
              | {{ item.store.name }}
            md-table-cell(md-label='客户', md-sort-by='customer.name', @click.native.stop='goToCustomer(item.customer)', style='min-width:120px')
              | {{ item.customer.name }}
              span(v-if='item.customer.mobile')
                | {{ item.customer.mobile.substr(-4) }}
              md-icon.mini keyboard_arrow_right
            md-table-cell(md-label='类型', md-sort-by='type')
              | {{ item.type | bookingTypeName }}
            md-table-cell(md-label='状态', md-sort-by='status')
              | {{ item.status | bookingStatusName }}
            md-table-cell(md-label='日期', md-sort-by='date')
              | {{ item.date }}
            md-table-cell(md-label='入场时间', md-sort-by='checkInAt')
              | {{ item.checkInAt }}
            md-table-cell(md-label='大 / 小', md-sort-by='adultsCount') {{ item.adultsCount }} / {{ item.kidsCount }}
            md-table-cell(md-label='收款', md-sort-by='socksCount')
              | {{ item.payments | paidAmount | currency }}
            md-table-cell(md-label='优惠/券码', md-sort-by='coupon')
              span(v-if='item.coupon') {{ item.coupon | couponName }}
              span(v-else-if='item.code')
                | {{ `${item.code.title} ${item.code.id.substr(-6).toUpperCase()}` }}
              span(v-else='') -
            md-table-cell(md-label='创建时间', md-sort-by='createdAt')
              | {{ item.createdAt | date }}
      md-card-actions(md-alignment='space-between')
        div
          p.card-category {{ from }} - {{ to }} / {{ total }}
        pagination.pagination-no-border.pagination-primary(v-model='pagination.currentPage', :per-page='pagination.perPage', :total='total')
</template>

<script>
import { Pagination } from "@/components";
import { Booking } from "@/resources";
import moment from "moment";

export default {
  components: {
    Pagination
  },
  data() {
    const customer = this.$route.query.customer;
    return {
      currentSort: "createdAt",
      currentSortOrder: "desc",
      pagination: {
        perPage: 10,
        currentPage: 1,
        total: 0
      },
      searchQuery: {
        date: customer ? null : moment().format("YYYY-MM-DD"),
        customer
      },
      searchDelayTimeout: null,
      queriedData: []
    };
  },
  activated() {
    this.queryData();
  },
  computed: {
    query() {
      const searchQuery = {
        ...this.searchQuery,
        limit: this.pagination.perPage,
        skip: (this.pagination.currentPage - 1) * this.pagination.perPage,
        order: this.currentSort
          ? `${this.currentSortOrder === "desc" ? "-" : ""}${this.currentSort}`
          : undefined
      };

      if (
        searchQuery.customerKeyword &&
        searchQuery.customerKeyword.length < 4
      ) {
        delete searchQuery.customerKeyword;
      }

      for (const field in searchQuery) {
        if (Array.isArray(searchQuery[field])) {
          searchQuery[field] = searchQuery[field].join(",");
        }
      }

      return searchQuery;
    },
    from() {
      return Math.min(
        this.pagination.perPage * (this.pagination.currentPage - 1) + 1,
        this.total
      );
    },
    to() {
      return Math.min(this.from + this.pagination.perPage - 1, this.total);
    },
    total() {
      return this.pagination.total;
    }
  },
  methods: {
    async queryData() {
      const response = await Booking.get(this.query);
      this.queriedData = response.body;
      this.pagination.total = Number(response.headers.map["items-total"][0]);
    },
    showDetail(item) {
      this.$router.push(`/booking/${item.id}`);
    },
    showCreate(type) {
      this.$router.push("/booking/add" + (type ? `?type=${type}` : ""));
    },
    goToCustomer(customer) {
      this.$router.push(`/user/${customer.id}`);
    },
    noop() {}
  },
  watch: {
    "pagination.currentPage"() {
      this.queryData();
    },
    searchQuery: {
      handler() {
        clearTimeout(this.searchDelayTimeout);
        this.searchDelayTimeout = setTimeout(() => {
          this.queryData();
        }, 200);
      },
      deep: true
    },
    currentSort() {
      this.queryData();
    },
    currentSortOrder() {
      this.queryData();
    }
  },
  filters: {
    paidAmount(payments) {
      return payments
        .filter(p => p.paid)
        .map(p => p.amount)
        .reduce((sum, amount) => sum + amount, 0);
    }
  }
};
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
