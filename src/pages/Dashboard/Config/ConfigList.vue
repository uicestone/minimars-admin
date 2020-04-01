<template lang="pug">
.md-layout
  .md-layout-item
    md-card
      md-card-header.md-card-header-icon
        .card-icon
          md-icon settings
        h4.title 配置列表
      md-card-content
        md-table.paginated-table.table-striped.table-hover(:value='queriedData', :md-sort.sync='currentSort', :md-sort-order.sync='currentSortOrder', :md-sort-fn='noop')
          md-table-row(slot='md-table-row', md-selectable='single', slot-scope='{ item }', @click='showDetail(item)')
            md-table-cell(md-label='配置项') {{ item | key }}
            md-table-cell(md-label='描述') {{ item.desc }}
            md-table-cell(md-label='更新时间')
              | {{ item.updatedAt | date }}
</template>

<script lang="ts">
import Component from "vue-class-component";
import List from "@/components/List";
import { ConfigItemResource } from "@/resources";
import { ConfigItem } from "@/resources/interfaces";

@Component({
  filters: {
    key(input: string) {
      return Object.keys(input)[0];
    }
  }
})
export default class ConfigList extends List<ConfigItem> {
  name = "config";
  resource = ConfigItemResource;

  showDetail(item: ConfigItem) {
    this.$router.push(`/config/${Object.keys(item)[0]}`);
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
