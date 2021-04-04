<template lang="pug">
.md-layout
  .md-layout-item
    md-card
      md-card-header.md-card-header-icon.md-card-header-primary
        .card-icon
          md-icon confirmation_number
        h4.title 卡券
      md-card-content.paginated-table
        .md-toolbar.md-table-toolbar.md-transparent.md-theme-default.md-elevation-0.md-layout.mb-2
          .md-layout-item.md-size-30.md-xsmall-size-100.md-layout
            b 次卡当前余额：
            .md-size-100(style="width:100%" v-for="stats in timesCardStatsByStore" :key="stats.storeNames") {{ stats.storeNames }}：{{stats.customersCount}}人，{{ stats.times }}次，{{ stats.priceLeft | currency }} 
          .md-layout.md-layout-item.md-alignment-center-right.search-query
            md-field.md-layout-item.md-size-20.md-xsmall-size-100
              label 名称
              md-input(v-model='searchQuery.title')
            md-field.md-layout-item.md-size-20.md-xsmall-size-100
              label 代号
              md-input(v-model='searchQuery.slug')
            md-field.md-layout-item.md-size-20.md-xsmall-size-100
              label 类型
              md-select(v-model='searchQuery.type')
                md-option(value="") 全部
                md-option(v-for='(name, type) in $cardTypeNames', :key='type', :value='type') {{ name }}
            md-field.md-layout-item.md-size-20.md-xsmall-size-100
              label 状态
              md-select(v-model='searchQuery.status' multiple)
                md-option(v-for='(name, status) in $cardStatusNames', :key='status', :value='status') {{ name }}
            md-field.md-layout-item.md-size-20.md-xsmall-size-100
              label 门店
              md-select(v-model='searchQuery.stores')
                md-option(value='') 全部
                md-option(v-for='store in $stores', :key='store.id', :value='store.id') {{ store.name }}
          .toolbar-actions
        md-table.paginated-table.table-striped.table-hover(:value='queriedData', :md-sort.sync='currentSort', :md-sort-order.sync='currentSortOrder', :md-sort-fn='$noop')
          md-table-row(slot='md-table-row', md-selectable='single', slot-scope='{ item }')
            md-table-cell(md-label='名称', md-sort-by='title')
              | {{ item.title }}
            md-table-cell(md-label='代号', md-sort-by='slug')
              router-link(:to="getCardTypeLink(item)") {{ item.slug }}
            md-table-cell(md-label='门店', md-sort-by='stores')
              span(v-if="item.stores.length")
                span(v-for="storeId in item.stores" :key="storeId") {{ getStoreName(storeId) }}
              span(v-else) 通用
            md-table-cell(md-label='类型', md-sort-by='type')
              | {{ item.type | cardTypeName }}
            md-table-cell(md-label='状态')
              | {{ item.status | cardStatusName }}
            md-table-cell(md-label='权益')
              span(v-if="['times','coupon'].includes(item.type)") {{item.timesLeft}}次
              span(v-else-if="item.type==='period'") {{item.start | date('YYYY-MM-DD')}} - {{item.end|date('YYYY-MM-DD')}}
            md-table-cell(md-label='开卡日期')
              | {{item.createdAt|date('YYYY-MM-DD')}}
            md-table-cell(md-label='过期日期')
              | {{item.expiresAt|date('YYYY-MM-DD')}}
            md-table-cell(md-label='客户')
              router-link(:to="'/user/'+item.customer") {{ item.customer.substr(-4).toUpperCase() }}
      md-card-actions(md-alignment='space-between')
        div
          p.card-category {{ from }} - {{ to }} / {{ total }}
        pagination.pagination-no-border.pagination-primary(v-model='pagination.currentPage', :per-page='pagination.perPage', :total='total')
</template>

<script lang="ts">
import List from "@/components/List";
import { CardResource, http } from "@/resources";
import { Card } from "@/resources/interfaces";
import Component from "vue-class-component";

@Component
export default class CardList extends List<Card> {
  name = "card";
  resource = CardResource;
  autoCompletes = [{ key: "customerKeyword", minLength: 4 }];
  timesCardStatsByStore: {
    storeNames: string;
    times: number;
    priceLeft: number;
  }[] = [];

  getCardTypeLink(item: Card) {
    return "/card-type/" + encodeURIComponent(item.slug);
  }

  getStoreName(storeId: string) {
    return this.$stores.find(s => s.id === storeId)?.name;
  }

  async created() {
    console.log("CardList:created");
    this.searchQuery = { status: [] };
    if (this.$route.query.slug) {
      this.searchQuery.slug = this.$route.query.slug;
    }
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
