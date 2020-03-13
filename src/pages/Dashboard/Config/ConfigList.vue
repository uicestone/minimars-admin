<template>
  <div class="md-layout">
    <div class="md-layout-item">
      <md-card>
        <md-card-header class="md-card-header-icon">
          <div class="card-icon">
            <md-icon>settings</md-icon>
          </div>
          <h4 class="title">配置列表</h4>
        </md-card-header>
        <md-card-content>
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
              <md-table-cell md-label="配置项">{{ item | key }}</md-table-cell>
              <md-table-cell md-label="描述">{{ item.desc }}</md-table-cell>
              <md-table-cell md-label="更新时间">{{
                item.updatedAt | date
              }}</md-table-cell>
            </md-table-row>
          </md-table>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>
import { Config } from "@/resources";

export default {
  data() {
    return {
      currentSort: "_id",
      currentSortOrder: "desc",
      searchQuery: {},
      searchDelayTimeout: null,
      queriedData: []
    };
  },
  mounted() {
    this.queryData();
  },
  computed: {
    query() {
      return Object.assign({}, this.searchQuery, {
        seperate: true,
        order: this.currentSort
          ? `${this.currentSortOrder === "desc" ? "-" : ""}${this.currentSort}`
          : undefined
      });
    }
  },
  methods: {
    async queryData() {
      const response = await Config.get(this.query);
      this.queriedData = response.body;
    },
    showDetail(item) {
      this.$router.push(`/config/${Object.keys(item)[0]}`);
    },
    noop() {}
  },
  filters: {
    key(input) {
      return Object.keys(input)[0];
    }
  },
  watch: {
    searchQuery: {
      handler() {
        clearTimeout(this.searchDelayTimeout);
        this.searchDelayTimeout = setTimeout(() => {
          this.queryData();
        }, 1000);
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

<style lang="css" scoped>
.md-card .md-card-actions {
  border: 0;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
