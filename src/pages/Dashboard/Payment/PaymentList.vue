<template>
  <div class="md-layout">
    <div class="md-layout-item">
      <md-card>
        <md-card-header class="md-card-header-icon md-card-header-primary">
          <div class="card-icon">
            <md-icon>payment</md-icon>
          </div>
          <h4 class="title">流水明细</h4>
        </md-card-header>
        <md-card-content class="paginated-table">
          <div
            class="md-toolbar md-table-toolbar md-transparent md-theme-default md-elevation-0 md-layout mb-2"
          >
            <div class="md-layout-item" style="flex:0;flex-basis:200px">
              总金额：{{ totalAmount | currency }}
            </div>
            <div
              class="md-layout md-layout-item md-alignment-center-right search-query"
            >
              <md-datepicker
                v-model="searchQuery.date"
                :md-model-type="String"
                md-immediately
                class="md-layout-item md-size-20 md-xsmall-size-100"
                ><label>日期</label>
              </md-datepicker>

              <md-field class="md-layout-item md-size-15 md-xsmall-size-25">
                <label>完成</label>
                <md-select v-model="searchQuery.paid">
                  <md-option value="">全部</md-option>
                  <md-option
                    v-for="(name, paid) in {
                      true: '是',
                      false: '否'
                    }"
                    :key="paid"
                    :value="paid"
                    >{{ name }}</md-option
                  >
                </md-select>
              </md-field>

              <md-field class="md-layout-item md-size-15 md-xsmall-size-25">
                <label>类型</label>
                <md-select v-model="searchQuery.attach">
                  <md-option value="">全部</md-option>
                  <md-option
                    v-for="(name, attach) in {
                      booking: '预定',
                      deposit: '充值'
                    }"
                    :key="attach"
                    :value="attach"
                    >{{ name }}</md-option
                  >
                </md-select>
              </md-field>

              <md-field class="md-layout-item md-size-15 md-xsmall-size-25">
                <label>方向</label>
                <md-select v-model="searchQuery.direction">
                  <md-option value="">全部</md-option>
                  <md-option
                    v-for="(name, direction) in {
                      payment: '收款',
                      refund: '退款'
                    }"
                    :key="direction"
                    :value="direction"
                    >{{ name }}</md-option
                  >
                </md-select>
              </md-field>

              <md-field class="md-layout-item md-size-15 md-xsmall-size-25">
                <label>通道</label>
                <md-select v-model="searchQuery.gateway" multiple>
                  <md-option
                    v-for="(name, gateway) in $gatewayNames"
                    :key="gateway"
                    :value="gateway"
                    >{{ name }}</md-option
                  >
                </md-select>
              </md-field>
            </div>
          </div>

          <md-table
            :value="queriedData"
            :md-sort.sync="currentSort"
            :md-sort-order.sync="currentSortOrder"
            :md-sort-fn="noop"
            class="table-striped table-hover"
          >
            <md-table-row
              slot="md-table-row"
              md-selectable="single"
              slot-scope="{ item }"
              @click="showDetail(item)"
            >
              <md-table-cell
                md-label="客户"
                md-sort-by="customer.name"
                @click.native.stop="goToCustomer(item.customer)"
                >{{ item.customer.name
                }}<span v-if="item.customer.mobile">{{
                  item.customer.mobile.substr(-4)
                }}</span
                ><md-icon class="mini"
                  >keyboard_arrow_right</md-icon
                ></md-table-cell
              >
              <md-table-cell md-label="金额" md-sort-by="amount">{{
                item.amountDeposit || item.amount | currency
              }}</md-table-cell>
              <md-table-cell md-label="完成" md-sort-by="paid">{{
                item.paid ? "是" : "否"
              }}</md-table-cell>
              <md-table-cell
                md-label="描述"
                md-sort-by="title"
                style="min-width:25em"
                >{{ item.title }}</md-table-cell
              >
              <md-table-cell md-label="通道" md-sort-by="gateway">{{
                item.gateway | paymentGatewayName
              }}</md-table-cell>
              <md-table-cell md-label="更新时间" md-sort-by="updatedAt">{{
                item.createdAt | date
              }}</md-table-cell>
              <md-table-cell
                md-label="相关链接"
                @click.native.stop="goToRelatedItem(item)"
                >{{ relatedItem(item) }}</md-table-cell
              >
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
import moment from "moment";
import { Pagination } from "@/components";
import { Payment } from "@/resources";

export default {
  components: {
    Pagination
  },
  data() {
    return {
      currentSort: "updatedAt",
      currentSortOrder: "desc",
      pagination: {
        perPage: 10,
        currentPage: 1,
        total: 0
      },
      searchQuery: {
        date: moment().format("YYYY-MM-DD"),
        paid: true,
        attach: ["booking"]
      },
      searchDelayTimeout: null,
      queriedData: [],
      totalAmount: null
    };
  },
  activated() {
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
      const response = await Payment.get(this.query);
      this.queriedData = response.body;
      this.pagination.total = Number(response.headers.map["items-total"][0]);
      this.totalAmount = Number(response.headers.map["total-amount"][0]);
    },
    showDetail(item) {
      // this.$router.push(`/payment/${item.id}`);
    },
    showCreate() {
      // this.$router.push("/payment/add");
    },
    goToCustomer(customer) {
      this.$router.push(`/user/${customer.id}`);
    },
    goToRelatedItem(item) {
      const attach = item.attach.split(" ");
      switch (attach[0]) {
        case "booking":
          return this.$router.push(`/booking/${attach[1]}`);
        case "deposit":
          return this.$router.push(`/user/${attach[1]}`);
      }
    },
    relatedItem(item) {
      const attach = item.attach.split(" ");
      switch (attach[0]) {
        case "booking":
          return "预约";
        case "deposit":
          return "充值";
      }
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

<style lang="css" scoped>
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
</style>
