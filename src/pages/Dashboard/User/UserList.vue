<template lang="pug">
.md-layout
  .md-layout-item
    md-card
      md-card-header.md-card-header-icon.md-card-header-primary
        .card-icon
          md-icon supervisor_account
        h4.title 客户列表
      md-card-content.paginated-table
        .md-toolbar.md-table-toolbar.md-transparent.md-theme-default.md-elevation-0.md-layout.mb-2
          .md-layout-item.md-size-40.md-xsmall-size-100.md-layout
            div(style="padding:0 5px")
              div 用户余额：{{ stats.totalBalance | currency }}
              div 其中实收：{{ stats.totalBalanceDeposit | currency }}
            div(style="padding:0 5px")
              div 未激活卡：{{ stats.totalValidCardBalance | currency }}
              div 其中实收：{{ stats.totalValidCardBalanceDeposit | currency }}
          .md-layout.md-layout-item.md-alignment-center-right.search-query
            md-field.md-layout-item.md-size-50.md-xsmall-size-100
              md-input(type='search', min-length='4', clearable='', placeholder='搜索 手机/姓名/卡号/标签', v-model='searchQuery.keyword')
          .toolbar-actions
            md-button.md-primary(@click='showCreate')
              | 添加用户
            md-button.md-just-icon.md-simple(@click='queryData')
              md-icon refresh
        md-table.paginated-table.table-striped.table-hover(:value='queriedData', :md-sort.sync='currentSort', :md-sort-order.sync='currentSortOrder', :md-sort-fn='$noop')
          md-table-row(slot='md-table-row', md-selectable='single', slot-scope='{ item }', @click='showDetail(item)')
            md-table-cell(md-label='手机', md-sort-by='mobile')
              | {{ item.mobile }}
            md-table-cell(md-label='姓名', md-sort-by='name')
              | {{ item.name }}
            md-table-cell(md-label='卡号', md-sort-by='cardNo')
              | {{ item.cardNo }}
            md-table-cell(md-label='余额', md-sort-by='balanceDeposit')
              | {{ item.balance || '-' }}
            md-table-cell(md-label='积分', md-sort-by='points')
              | {{ item.points }}
            md-table-cell(md-label='注册时间', md-sort-by='createdAt')
              | {{ item.createdAt | date }}
            md-table-cell(md-label='注册渠道', md-sort-by='registeredAt')
              | {{ item.registeredAt }}
      md-card-actions(md-alignment='space-between')
        div
          p.card-category {{ from }} - {{ to }} / {{ total }}
        pagination.pagination-no-border.pagination-primary(v-model='pagination.currentPage', :per-page='pagination.perPage', :total='total')
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import List from "@/components/List";
import { http, UserResource } from "@/resources";
import { User } from "@/resources/interfaces";

@Component
export default class UserList extends List<User> {
  name = "user";
  resource = UserResource;
  stats: {
    totalBalance?: number;
    totalBalanceDeposit?: number;
    totalValidCardBalance?: number;
    totalValidCardBalanceDeposit?: number;
  } = {};
  async queryData() {
    const queriedData = await (List as any).options.methods.queryData.call(
      this
    );
    if (!queriedData) return;
    return queriedData;
  }
  async created() {
    this.searchQuery = { role: "customer" };
    this.stats = (await http.get("stats/user-balance")).data;
  }
}
</script>

<style lang="css" scoped>
.md-card .md-card-actions {
  border: 0;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
