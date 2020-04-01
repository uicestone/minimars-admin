<template lang="pug">
.md-layout
  .md-layout-item
    md-card
      md-card-header.md-card-header-icon.md-card-header-primary
        .card-icon
          md-icon chrome_reader_mode
        h4.title 文章列表
      md-card-content.paginated-table
        .md-toolbar.md-table-toolbar.md-transparent.md-theme-default.md-elevation-0.md-layout.mb-2
          .md-layout
            md-field.md-layout-item.md-size-15.md-xsmall-size-100
              label 标签
              md-input(clearable='', v-model='searchQuery.tag')  
          .toolbar-actions
            md-button.md-primary(@click='showCreate')
              | 添加文章
            md-button.md-just-icon.md-simple(@click='queryData')
              md-icon refresh
        md-table.paginated-table.table-striped.table-hover(:value='queriedData', :md-sort.sync='currentSort', :md-sort-order.sync='currentSortOrder', :md-sort-fn='$noop')
          md-table-row(slot='md-table-row', md-selectable='single', slot-scope='{ item }', @click='showDetail(item)')
            md-table-cell(md-label='标题', md-sort-by='title')
              | {{ item.title }}
            md-table-cell(md-label='简称', md-sort-by='slug')
              | {{ item.slug }}
            md-table-cell(md-label='发布者', md-sort-by='author.name')
              | {{ item.author.name }}
            md-table-cell(md-label='修改时间', md-sort-by='updatedAt')
              | {{ item.updatedAt | date("YYYY-MM-DD HH:mm") }}
      md-card-actions(md-alignment='space-between')
        div
          p.card-category {{ from }} - {{ to }} / {{ total }}
        pagination.pagination-no-border.pagination-primary(v-model='pagination.currentPage', :per-page='pagination.perPage', :total='total')
</template>

<script lang="ts">
import { PostResource } from "@/resources";
import { Post } from "@/resources/interfaces";
import List from "@/components/List";

export default class PostList extends List<Post> {
  name = "post";
  resource = PostResource;
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
