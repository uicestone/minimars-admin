<template>
  <div class="md-layout">
    <div class="md-layout-item">
      <md-card>
        <md-card-header class="md-card-header-icon md-card-header-primary">
          <div class="card-icon">
            <md-icon>store</md-icon>
          </div>
          <h4 class="title">场馆列表</h4>
        </md-card-header>
        <md-card-content>
          <md-table
            :value="queriedData"
            :md-sort.sync="currentSort"
            :md-sort-order.sync="currentSortOrder"
            :md-sort-fn="noop"
            class="paginated-table table-striped table-hover"
          >
            <md-table-toolbar class="md-layout mb-2">
              <md-field
                class="md-layout md-layout-item md-size-20 md-xsmall-size-100"
              >
                <md-input
                  type="search"
                  clearable
                  placeholder="搜索"
                  style="width: 200px;"
                  v-model="searchQuery.keyword"
                >
                </md-input>
              </md-field>

              <div class="toolbar-actions">
                <!-- <md-button class="md-primary" @click="showCreate">
                  添加场馆
                </md-button> -->
              </div>
            </md-table-toolbar>

            <md-table-row
              slot="md-table-row"
              md-selectable="single"
              slot-scope="{ item }"
              @click="showDetail(item)"
            >
              <md-table-cell md-label="名称" md-sort-by="name">{{
                item.name
              }}</md-table-cell>
              <md-table-cell md-label="电话" md-sort-by="phone">{{
                item.phone
              }}</md-table-cell>
              <md-table-cell md-label="地址" md-sort-by="address">{{
                item.address
              }}</md-table-cell>
              <md-table-cell md-label="服务器状态" md-sort-by="address">{{
                item.localServer | localServer
              }}</md-table-cell>
              <!-- <md-table-cell md-label="操作">
                <md-button
                  class="md-just-icon md-danger md-simple"
                  @click="">
                  <md-icon>close</md-icon>
                </md-button>
              </md-table-cell> -->
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
import { Store } from "@/resources";

export default {
  components: {
    Pagination
  },
  data() {
    return {
      currentSort: "name",
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
  mounted() {
    this.queryData();
  },
  computed: {
    query() {
      return Object.assign({}, this.searchQuery, {
        limit: this.pagination.perPage,
        skip: (this.pagination.currentPage - 1) * this.pagination.perPage,
        order: this.currentSort
          ? `${this.currentSortOrder === "desc" ? "-" : ""}${this.currentSort}`
          : undefined
      });
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
      const response = await Store.get(this.query);
      this.queriedData = response.body;
      this.pagination.total = Number(response.headers.map["items-total"][0]);
    },
    showDetail(item) {
      // this.$router.push(`/store/${item.id}`);
    },
    showCreate() {
      this.$router.push("/store/add");
    },
    noop() {}
  },
  filters: {
    localServer(input) {
      if (!input) return;
      const statusLabel = {
        disconnected: "已断开",
        connected: "已连接",
        died: "连接异常"
      };
      let text = "";
      if (input.status && statusLabel[input.status]) {
        text = statusLabel[input.status];
      }
      if (input.ip) {
        text += ` ${input.ip.replace("::ffff:", "")}`;
      }
      return text;
    }
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
