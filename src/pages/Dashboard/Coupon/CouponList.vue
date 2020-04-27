<template lang="pug">
.md-layout
  .md-layout-item
    md-card
      md-card-header.md-card-header-icon.md-card-header-primary
        .card-icon
          md-icon confirmation_number
        h4.title 优惠
      md-card-content.paginated-table
        .md-toolbar.md-table-toolbar.md-transparent.md-theme-default.md-elevation-0.md-layout.mb-2
          .md-layout
          .toolbar-actions
            md-button.md-primary(@click='showCreate')
              | 添加优惠
        md-table.paginated-table.table-striped.table-hover(:value='queriedData', :md-sort.sync='currentSort', :md-sort-order.sync='currentSortOrder', :md-sort-fn='$noop')
          md-table-row(slot='md-table-row', md-selectable='single', slot-scope='{ item }', @click='showDetail(item)')
            md-table-cell(md-label='名称', md-sort-by='title')
              | {{ item.title }}
            md-table-cell(md-label='平台售价', md-sort-by='priceThirdParty')
              | {{ item.priceThirdParty | currency }}
            md-table-cell(md-label='免费陪同成人', md-sort-by='freeParentsPerKid')
              | {{ item.freeParentsPerKid }}
      md-card-actions(md-alignment='space-between')
        div
          p.card-category {{ from }} - {{ to }} / {{ total }}
        pagination.pagination-no-border.pagination-primary(v-model='pagination.currentPage', :per-page='pagination.perPage', :total='total')
</template>

<script lang="ts">
import List from "@/components/List";
import { CouponResource } from "@/resources";
import { Coupon } from "@/resources/interfaces";
import Component from "vue-class-component";

@Component
export default class CouponList extends List<Coupon> {
  name = "coupon";
  resource = CouponResource;
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
