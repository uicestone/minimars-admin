<template lang="pug">
.md-layout
  .md-layout-item
    md-card
      md-card-header.md-card-header-icon.md-card-header-primary
        .card-icon
          md-icon supervisor_account
        h4.title 职员列表
      md-card-content.paginated-table
        .md-toolbar.md-table-toolbar.md-transparent.md-theme-default.md-elevation-0.md-layout.mb-2
          .md-layout-item.md-size-40.md-xsmall-size-100.md-layout
          .md-layout.md-layout-item.md-alignment-center-right.search-query
            md-field.md-layout-item.md-size-50.md-xsmall-size-100
              md-input(type='search', min-length='4', clearable='', placeholder='搜索 手机/姓名/卡号/标签', v-model='searchQuery.keyword')
            md-field.md-layout-item.md-size-30.md-xsmall-size-100
              label 筛选角色
              md-select(v-model='searchQuery.role')
                md-option(v-for="(name, role) in $userRoles", :key='role', :value='role') {{ name }}
            //- md-field.md-layout-item.md-size-20.md-xsmall-size-100(v-if="searchQuery.role === 'customer'")
              label 会员类型
              md-select(v-model='searchQuery.membership', multiple)
                md-option(value='code') 次卡
                md-option(value='deposit') 充值
            //- md-field.md-layout-item.md-size-20.md-xsmall-size-100(v-if="searchQuery.role === 'customer'")
              label 会员等级
              md-select(v-model='searchQuery.cardTypes', multiple)
                md-option(v-for='level in $config.depositLevels', :key='level.slug', :value='level.cardType') {{ level.cardType }}
          .toolbar-actions
            md-button.md-primary(@click='showCreate')
              | 添加职员
            md-button.md-just-icon.md-simple(@click='queryData')
              md-icon refresh
        md-table.paginated-table.table-striped.table-hover(:value='queriedData', :md-sort.sync='currentSort', :md-sort-order.sync='currentSortOrder', :md-sort-fn='$noop')
          md-table-row(slot='md-table-row', md-selectable='single', slot-scope='{ item }', @click='showDetail(item)')
            md-table-cell(md-label='姓名', md-sort-by='name')
              | {{ item.name }}
            md-table-cell(md-label='登录名', md-sort-by='login')
              | {{ item.login }}
            md-table-cell(md-label='角色', md-sort-by='role')
              | {{ item.role | roleName }}
            md-table-cell(md-label='手机', md-sort-by='mobile')
              | {{ item.mobile }}
      md-card-actions(md-alignment='space-between')
        div
          p.card-category {{ from }} - {{ to }} / {{ total }}
        pagination.pagination-no-border.pagination-primary(v-model='pagination.currentPage', :per-page='pagination.perPage', :total='total')
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import List from "@/components/List";
import { UserResource } from "@/resources";
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
  showDetail(item: User) {
    this.$router.push(`/staff/${item.id}`);
  }
  async created() {
    this.searchQuery = { role: "manager" };
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
