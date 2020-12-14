<template lang="pug">
.md-layout
  .md-layout-item
    md-card
      md-card-header.md-card-header-icon.md-card-header-primary
        .card-icon
          md-icon card_membership
        h4.title 卡券种类
      md-card-content.paginated-table
        .md-toolbar.md-table-toolbar.md-transparent.md-theme-default.md-elevation-0.md-layout.mb-2
          .md-layout-item.md-size-40.md-layout
            .md-size-100(style="width:100%" v-for="stats in timesCardStatsByStore" :key="stats.storeNames") {{ stats.storeNames }}：{{ stats.times }}次，{{ stats.priceLeft | currency }} 
          .md-layout.md-layout-item.md-alignment-center-right.search-query
            md-field.md-layout-item.md-size-25.md-xsmall-size-100
              label 类型
              md-select(v-model='searchQuery.type')
                md-option(value="") 全部
                md-option(v-for='(name, type) in $cardTypeNames', :key='type', :value='type') {{ name }}
            md-field.md-layout-item.md-size-25.md-xsmall-size-100
              label 门店
              md-select(v-model='searchQuery.stores')
                md-option(value='') 全部
                md-option(v-for='store in $stores', :key='store.id', :value='store.id') {{ store.name }}
            md-field.md-layout-item.md-size-25.md-xsmall-size-100
              label 前台开放
              md-select(v-model='searchQuery.openForReception')
                md-option(value="") 全部
                md-option(:value="true") 是
                md-option(:value="false") 否
            md-field.md-layout-item.md-size-25.md-xsmall-size-100
              label 客户端开放
              md-select(v-model='searchQuery.openForClient')
                md-option(value="") 全部
                md-option(:value="true") 是
                md-option(:value="false") 否
          .toolbar-actions
            md-button.md-primary(@click='showCreate')
              | 添加卡券种类
        md-table.paginated-table.table-striped.table-hover(:value='queriedData', :md-sort.sync='currentSort', :md-sort-order.sync='currentSortOrder', :md-sort-fn='$noop')
          md-table-row(slot='md-table-row', md-selectable='single', slot-scope='{ item }', @click='showDetail(item)')
            md-table-cell(md-label='名称', md-sort-by='title')
              | {{ item.title }}
            md-table-cell(md-label='代号', md-sort-by='slug')
              | {{ item.slug }}
            md-table-cell(md-label='门店', md-sort-by='stores')
              | {{ item.stores.length ? item.stores.map(s=>s.name).join("、") : '通用' }}
            md-table-cell(md-label='类型', md-sort-by='type')
              | {{ item.type | cardTypeName }}
            md-table-cell(md-label='售价', md-sort-by='price')
              | {{ item.price | currency }}
            md-table-cell(md-label='客户端开放', md-sort-by='openForClient')
              | {{ item.openForClient ? '是' : '否' }}
            md-table-cell(md-label='前台开放', md-sort-by='openForReception')
              | {{ item.openForReception ? '是' : '否' }}
      md-card-actions(md-alignment='space-between')
        div
          p.card-category {{ from }} - {{ to }} / {{ total }}
        pagination.pagination-no-border.pagination-primary(v-model='pagination.currentPage', :per-page='pagination.perPage', :total='total')
</template>

<script lang="ts">
import List from "@/components/List";
import { CardTypeResource, http } from "@/resources";
import { CardType } from "@/resources/interfaces";
import Component from "vue-class-component";

@Component
export default class CardTypeList extends List<CardType> {
  name = "card-type";
  resource = CardTypeResource;
  autoCompletes = [{ key: "customerKeyword", minLength: 4 }];
  timesCardStatsByStore: {
    storeNames: string;
    times: number;
    priceLeft: number;
  }[] = [];
  async created() {
    this.timesCardStatsByStore = (await http.get("stats/times-card")).data;
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
