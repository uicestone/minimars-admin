<template lang="pug">
.md-layout
  .md-layout-item
    md-card
      md-card-header.md-card-header-icon.md-card-header-primary
        .card-icon
          md-icon store
        h4.title 门店列表
      md-card-content
        md-table.paginated-table.table-striped.table-hover(:value='queriedData', :md-sort.sync='currentSort', :md-sort-order.sync='currentSortOrder', :md-sort-fn='$noop')
          //- md-table-toolbar.md-layout.mb-2
            md-field.md-layout.md-layout-item.md-size-20.md-xsmall-size-100
              md-input(type='search', clearable='', placeholder='搜索', style='width: 200px;', v-model='searchQuery.keyword')
            .toolbar-actions
          md-table-row(slot='md-table-row', md-selectable='single', slot-scope='{ item }', @click='showDetail(item)')
            md-table-cell(md-label='名称', md-sort-by='name')
              | {{ item.name }}
            md-table-cell(md-label='电话', md-sort-by='phone')
              | {{ item.phone }}
            md-table-cell(md-label='地址', md-sort-by='address')
              | {{ item.address }}
      md-card-actions(md-alignment='space-between')
        div
          p.card-category {{ from }} - {{ to }} / {{ total }}
        pagination.pagination-no-border.pagination-primary(v-model='pagination.currentPage', :per-page='pagination.perPage', :total='total')
</template>

<script lang="ts">
import { StoreResource } from "@/resources";
import { Store } from "@/resources/interfaces";
import List from "@/components/List";

export default class StoreList extends List<Store> {
  name = "store";
  resource = StoreResource;
}
</script>

<style lang="css" scoped>
.md-card .md-card-actions {
  border: 0;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
