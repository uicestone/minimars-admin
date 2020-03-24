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
        md-table.paginated-table.table-striped.table-hover(:value='queriedData', :md-sort.sync='currentSort', :md-sort-order.sync='currentSortOrder', :md-sort-fn='noop')
          md-table-row(slot='md-table-row', md-selectable='single', slot-scope='{ item }', @click='showDetail(item)')
            md-table-cell(md-label='名称', md-sort-by='title')
              | {{ item.title }}
            md-table-cell(md-label='类型', md-sort-by='type')
              | {{ item.type | cardTypeName }}
            md-table-cell(md-label='售价', md-sort-by='price')
              | {{ item.price }}
      md-card-actions(md-alignment='space-between')
        div
          p.card-category {{ from }} - {{ to }} / {{ total }}
        pagination.pagination-no-border.pagination-primary(v-model='pagination.currentPage', :per-page='pagination.perPage', :total='total')
</template>

<script>
import { Pagination } from "@/components";
import { CardType } from "@/resources";
import moment from "moment";

export default {
  components: {
    Pagination
  },
  data() {
    const customer = this.$route.query.customer;
    return {
      currentSort: "title",
      currentSortOrder: "asc",
      pagination: {
        perPage: 10,
        currentPage: 1,
        total: 0
      },
      searchQuery: {},
      searchDelayTimeout: null,
      queriedData: []
    };
  },
  activated() {
    this.queryData();
  },
  computed: {
    query() {
      const searchQuery = {
        ...this.searchQuery,
        limit: this.pagination.perPage,
        skip: (this.pagination.currentPage - 1) * this.pagination.perPage,
        order: this.currentSort
          ? `${this.currentSortOrder === "desc" ? "-" : ""}${this.currentSort}`
          : undefined
      };

      if (
        searchQuery.customerKeyword &&
        searchQuery.customerKeyword.length < 4
      ) {
        delete searchQuery.customerKeyword;
      }

      for (let field in searchQuery) {
        if (Array.isArray(searchQuery[field])) {
          searchQuery[field] = searchQuery[field].join(",");
        }
      }

      return searchQuery;
    },
    from() {
      return Math.min(
        this.pagination.perPage * (this.pagination.currentPage - 1) + 1,
        this.total
      );
    },
    to() {
      return Math.min(this.from + this.pagination.perPage - 1, this.total);
    },
    total() {
      return this.pagination.total;
    }
  },
  methods: {
    async queryData() {
      const response = await CardType.get(this.query);
      this.queriedData = response.body;
      this.pagination.total = Number(response.headers.map["items-total"][0]);
    },
    showDetail(item) {
      this.$router.push(`/card-type/${item.id}`);
    },
    showCreate() {
      this.$router.push("/card-type/add");
    },
    noop() {}
  },
  watch: {
    "pagination.currentPage"() {
      this.queryData();
    },
    searchQuery: {
      handler() {
        clearTimeout(this.searchDelayTimeout);
        this.searchDelayTimeout = setTimeout(() => {
          this.queryData();
        }, 200);
      },
      deep: true
    },
    currentSort() {
      this.queryData();
    },
    currentSortOrder() {
      this.queryData();
    }
  }
};
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
