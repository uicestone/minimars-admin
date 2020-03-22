<template>
  <div class="md-layout">
    <div class="md-layout-item">
      <md-card>
        <md-card-header class="md-card-header-icon md-card-header-primary">
          <div class="card-icon">
            <md-icon>card_giftcard</md-icon>
          </div>
          <h4 class="title">礼品列表</h4>
        </md-card-header>
        <md-card-content class="paginated-table">
          <div
            class="md-toolbar md-table-toolbar md-transparent md-theme-default md-elevation-0 md-layout mb-2"
          >
            <div class="md-layout"></div>
            <div class="toolbar-actions">
              <md-button class="md-primary" @click="showCreate">
                添加礼品
              </md-button>
              <md-button class="md-just-icon md-simple" @click="queryData">
                <md-icon>refresh</md-icon>
              </md-button>
            </div>
          </div>
          <md-table
            :value="queriedData"
            :md-sort.sync="currentSort"
            :md-sort-order.sync="currentSortOrder"
            :md-sort-fn="noop"
            class="paginated-table table-striped table-hover"
          >
            <md-table-row
              slot="md-table-row"
              md-selectable="single"
              slot-scope="{ item }"
              @click="showDetail(item)"
            >
              <md-table-cell md-label="名称" md-sort-by="title">{{
                item.title
              }}</md-table-cell>
              <md-table-cell md-label="库存" md-sort-by="quantity">{{
                item.quantity
              }}</md-table-cell>
              <md-table-cell md-label="门店" md-sort-by="store.name">{{
                item.store.name
              }}</md-table-cell>
              <md-table-cell md-label="积分售价" md-sort-by="priceInPoints">{{
                item.priceInPoints
              }}</md-table-cell>
              <md-table-cell md-label="收款售价" md-sort-by="priceInCny">{{
                item.priceInCny
              }}</md-table-cell>
            </md-table-row>
          </md-table>
        </md-card-content>
        <md-card-actions md-alignment="space-between">
          <div class="">
            <p class="card-category">{{ from }} - {{ to }} / {{ total }}</p>
          </div>
          <pagination
            class="pagination-no-border pagination-primary"
            v-model="pagination.currentPage"
            :per-page="pagination.perPage"
            :total="total"
          >
          </pagination>
        </md-card-actions>
      </md-card>
    </div>
  </div>
</template>

<script>
import { Pagination } from "@/components";
import { Gift } from "@/resources";
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
      const response = await Gift.get(this.query);
      this.queriedData = response.body;
      this.pagination.total = Number(response.headers.map["items-total"][0]);
    },
    showDetail(item) {
      this.$router.push(`/gift/${item.id}`);
    },
    showCreate() {
      this.$router.push("/gift/add");
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
