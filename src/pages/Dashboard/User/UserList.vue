<template lang="pug">
.md-layout
  .md-layout-item
    md-card
      md-card-header.md-card-header-icon.md-card-header-primary
        .card-icon
          md-icon supervisor_account
        h4.title 用户列表
      md-card-content.paginated-table
        .md-toolbar.md-table-toolbar.md-transparent.md-theme-default.md-elevation-0.md-layout.mb-2
          .md-layout-item(v-if="searchQuery.role === 'customer'", style='flex:0;flex-basis:200px')
            | 总余额：{{ totalBalance | currency }}
          .md-layout.md-layout-item.md-alignment-center-right.search-query
            md-field.md-layout-item.md-size-25.md-xsmall-size-100
              md-input(type='search', min-length='4', clearable='', placeholder='搜索 手机/姓名/会员码', v-model='searchQuery.keyword')
            md-field.md-layout-item.md-size-20.md-xsmall-size-100
              label 筛选角色
              md-select(v-model='searchQuery.role')
                md-option(v-for="(name, type) in { admin: '管理员', manager: '店员', customer: '客户' }", :key='type', :value='type') {{ name }}
            //- md-field.md-layout-item.md-size-20.md-xsmall-size-100(v-if="searchQuery.role === 'customer'")
              label 会员类型
              md-select(v-model='searchQuery.membership', multiple='')
                md-option(value='code') 次卡
                md-option(value='deposit') 充值
            //- md-field.md-layout-item.md-size-20.md-xsmall-size-100(v-if="searchQuery.role === 'customer'")
              label 会员等级
              md-select(v-model='searchQuery.cardTypes', multiple='')
                md-option(v-for='level in $config.depositLevels', :key='level.slug', :value='level.cardType') {{ level.cardType }}
          .toolbar-actions
            md-button.md-primary(@click='showCreate')
              | 添加用户
            md-button.md-just-icon.md-simple(@click='queryData')
              md-icon refresh
        md-table.paginated-table.table-striped.table-hover(:value='queriedData', :md-sort.sync='currentSort', :md-sort-order.sync='currentSortOrder', :md-sort-fn='noop')
          md-table-row(slot='md-table-row', md-selectable='single', slot-scope='{ item }', @click='showDetail(item)')
            md-table-cell(md-label='姓名', md-sort-by='name')
              | {{ item.name }}
            md-table-cell(md-label='性别', md-sort-by='gender')
              | {{ item.gender }}
            md-table-cell(md-label='手机', md-sort-by='mobile')
              | {{ item.mobile }}
            md-table-cell(md-label='地区', md-sort-by='region')
              | {{ item.region }}
            md-table-cell(md-label='等级', md-sort-by='cardType', v-if="searchQuery.role === 'customer'") {{ item.cardType }}
            md-table-cell(md-label='余额', md-sort-by='balanceDeposit', v-if="searchQuery.role === 'customer'")
              div(v-if='item.balance')
                | {{ item.balanceDeposit }} 赠{{ item.balanceReward }}
              div(v-if='item.codeAmount') 券值：{{ item.codeAmount }}
              div(v-if='!item.balance && !item.codeAmount')
                | -
            md-table-cell(md-label='注册时间', md-sort-by='createdAt')
              | {{ item.createdAt | date }}
      md-card-actions(md-alignment='space-between')
        div
          p.card-category {{ from }} - {{ to }} / {{ total }}
        pagination.pagination-no-border.pagination-primary(v-model='pagination.currentPage', :per-page='pagination.perPage', :total='total')
</template>

<script>
import { Pagination } from "@/components";
import { User } from "@/resources";

export default {
  components: {
    Pagination
  },
  data() {
    return {
      currentSort: "createdAt",
      currentSortOrder: "desc",
      pagination: {
        perPage: 10,
        currentPage: 1,
        total: 0
      },
      searchQuery: { role: "customer" },
      searchDelayTimeout: null,
      queriedData: [],
      totalBalance: null
    };
  },
  mounted() {
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

      if (searchQuery.keyword && searchQuery.keyword.length < 4) {
        delete searchQuery.keyword;
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
      const response = await User.get(this.query);
      this.queriedData = response.body;
      this.pagination.total = Number(response.headers.map["items-total"][0]);
      this.totalBalance = Number(response.headers.map["total-balance"][0]);
    },
    showDetail(item) {
      this.$router.push(`/user/${item.id}`);
    },
    showCreate() {
      this.$router.push("/user/add");
    },
    noop() {}
  },
  watch: {
    "pagination.currentPage"() {
      this.queryData();
    },
    searchQuery: {
      handler() {
        if (this.searchQuery.role !== "customer") {
          delete this.searchQuery.membership;
        }
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
    roleName(role) {
      const roleName = {
        admin: "管理员",
        manager: "店员",
        customer: "客户"
      };
      return roleName[role];
    }
  }
};
</script>

<style lang="css" scoped>
.md-card .md-card-actions {
  border: 0;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
