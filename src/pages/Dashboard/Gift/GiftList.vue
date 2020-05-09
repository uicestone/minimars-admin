<template lang="pug">
.md-layout
  .md-layout-item
    md-card
      md-card-header.md-card-header-icon.md-card-header-primary
        .card-icon
          md-icon card_giftcard
        h4.title 礼品列表
      md-card-content.paginated-table
        .md-toolbar.md-table-toolbar.md-transparent.md-theme-default.md-elevation-0.md-layout.mb-2
          .md-layout
          .toolbar-actions
            md-button.md-primary(@click='showCreate')
              | 添加礼品
            md-button.md-just-icon.md-simple(@click='queryData')
              md-icon refresh
        md-table.paginated-table.table-striped.table-hover(:value='queriedData', :md-sort.sync='currentSort', :md-sort-order.sync='currentSortOrder', :md-sort-fn='$noop')
          md-table-row(slot='md-table-row', md-selectable='single', slot-scope='{ item }', @click='showDetail(item)')
            md-table-cell(md-label='名称', md-sort-by='title')
              | {{ item.title }}
            md-table-cell(md-label='库存', md-sort-by='quantity')
              | {{ item.quantity }}
            md-table-cell(md-label='门店', md-sort-by='store.name')
              | {{ item.store ? item.store.name : '-' }}
            md-table-cell(md-label='积分售价', md-sort-by='priceInPoints')
              | {{ item.priceInPoints }}
            md-table-cell(md-label='收款售价', md-sort-by='price')
              | {{ item.price }}
            md-table-cell(md-label='创建日期', md-sort-by='createdAt')
              | {{ item.createdAt | date('YYYY-MM-DD') }}
            md-table-cell(md-label='显示顺序', md-sort-by='order')
              | {{ item.order }}
      md-card-actions(md-alignment='space-between')
        div
          p.card-category {{ from }} - {{ to }} / {{ total }}
        pagination.pagination-no-border.pagination-primary(v-model='pagination.currentPage', :per-page='pagination.perPage', :total='total')
</template>

<script lang="ts">
import List from "@/components/List";
import { GiftResource } from "@/resources";
import { Gift } from "@/resources/interfaces";
import Component from "vue-class-component";

@Component
export default class GiftList extends List<Gift> {
  name = "gift";
  resource = GiftResource;
  currentSort = "order";
  currentSortOrder = "desc";
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
