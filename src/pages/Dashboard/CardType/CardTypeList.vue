<template lang="pug">
.md-layout
  .md-layout-item
    md-card
      md-card-header.md-card-header-icon.md-card-header-primary
        .card-icon
          md-icon card_membership
        h4.title 卡片种类
      md-card-content.paginated-table
        .md-toolbar.md-table-toolbar.md-transparent.md-theme-default.md-elevation-0.md-layout.mb-2
          .md-layout
          .toolbar-actions
            md-button.md-primary(@click='showCreate')
              | 添加卡片种类
        md-table.paginated-table.table-striped.table-hover(:value='queriedData', :md-sort.sync='currentSort', :md-sort-order.sync='currentSortOrder', :md-sort-fn='$noop')
          md-table-row(slot='md-table-row', md-selectable='single', slot-scope='{ item }', @click='showDetail(item)')
            md-table-cell(md-label='名称', md-sort-by='title')
              | {{ item.title }}
            md-table-cell(md-label='门店', md-sort-by='type')
              | {{ item.store ? item.store.name : '通用' }}
            md-table-cell(md-label='类型', md-sort-by='type')
              | {{ item.type | cardTypeName }}
            md-table-cell(md-label='售价', md-sort-by='price')
              | {{ item.price }}
      md-card-actions(md-alignment='space-between')
        div
          p.card-category {{ from }} - {{ to }} / {{ total }}
        pagination.pagination-no-border.pagination-primary(v-model='pagination.currentPage', :per-page='pagination.perPage', :total='total')
</template>

<script lang="ts">
import List from "@/components/List";
import { CardTypeResource } from "@/resources";
import { CardType } from "@/resources/interfaces";
import Component from "vue-class-component";

@Component
export default class CardTypeList extends List<CardType> {
  name = "card-type";
  resource = CardTypeResource;
  autoCompletes = [{ key: "customerKeyword", minLength: 4 }];
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
