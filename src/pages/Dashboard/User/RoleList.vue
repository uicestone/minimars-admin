<template lang="pug">
.md-layout
  .md-layout-item
    md-card
      md-card-header.md-card-header-icon.md-card-header-primary
        .card-icon
          md-icon store
        h4.title 角色列表
      md-card-content.paginated-table
        .md-toolbar.md-table-toolbar.md-transparent.md-theme-default.md-elevation-0.md-layout.mb-2
          .md-layout.md-layout-item.md-alignment-center-right.search-query
          .toolbar-actions
            md-button.md-primary(@click='showCreate')
              | 添加角色
        md-table.table-striped.table-hover(:value='queriedData', :md-sort.sync='currentSort', :md-sort-order.sync='currentSortOrder', :md-sort-fn='$noop')
          //- md-table-toolbar.md-layout.mb-2
            md-field.md-layout.md-layout-item.md-size-20.md-xsmall-size-100
              md-input(type='search', clearable='', placeholder='搜索', style='width: 200px;', v-model='searchQuery.keyword')
            .toolbar-actions
          md-table-row(slot='md-table-row', md-selectable='single', slot-scope='{ item }', @click='showDetail(item)')
            md-table-cell(md-label='名称', md-sort-by='name' style="width:50px")
              | {{ item.name }}
            md-table-cell(md-label='权限')
              div
                span(v-for="p in item.permissions") {{ p | permissionName }}, 
      md-card-actions(md-alignment='space-between')
        div
          p.card-category {{ from }} - {{ to }} / {{ total }}
        pagination.pagination-no-border.pagination-primary(v-model='pagination.currentPage', :per-page='pagination.perPage', :total='total')
</template>

<script lang="ts">
import { RoleResource } from "@/resources";
import { Role } from "@/resources/interfaces";
import List from "@/components/List";
import Component from "vue-class-component";

@Component
export default class RoleList extends List<Role> {
  name = "role";
  resource = RoleResource;
}
</script>

<style lang="css" scoped>
.md-card .md-card-actions {
  border: 0;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
