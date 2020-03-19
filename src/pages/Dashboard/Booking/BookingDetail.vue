<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-size-66 md-small-size-100 mx-auto">
        <form @submit.prevent="save">
          <md-card>
            <md-card-header class="md-card-header-icon md-card-header-primary">
              <div class="card-icon">
                <md-icon>timer</md-icon>
              </div>
              <h4 class="title">{{ booking.id.substr(-6).toUpperCase() }}</h4>
            </md-card-header>

            <md-card-content class="md-layout">
              <div class="md-layout-item md-small-size-100 md-size-25">
                <md-autocomplete
                  v-model="customerSearchTerm"
                  :md-options="getCustomers(customerSearchTerm)"
                  @md-selected="selectCustomer"
                >
                  <label>客户</label>
                  <template slot="md-autocomplete-item" slot-scope="{ item }">
                    {{ item.name }}
                  </template>
                </md-autocomplete>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-25">
                <md-autocomplete
                  v-model="storeSearchTerm"
                  :md-options="getStores(storeSearchTerm)"
                  @md-selected="selectStore"
                  :disabled="$user.role === 'manager'"
                >
                  <label>门店</label>
                  <template slot="md-autocomplete-item" slot-scope="{ item }">
                    {{ item.name }}
                  </template>
                </md-autocomplete>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-25">
                <md-field>
                  <label>类型</label>
                  <md-select v-model="booking.type" @keydown.enter.prevent="">
                    <md-option
                      v-for="(name, type) in $bookingTypeNames"
                      :key="type"
                      :value="type"
                      >{{ name }}</md-option
                    >
                  </md-select>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-25">
                <md-field>
                  <label>状态</label>
                  <md-select
                    v-model="booking.status"
                    @keydown.enter.prevent
                    :disabled="$user.role === 'manager'"
                  >
                    <md-option
                      v-for="(name, status) in $bookingStatusNames"
                      :key="status"
                      :value="status"
                      >{{ name }}</md-option
                    >
                  </md-select>
                </md-field>
              </div>
              <div
                class="md-layout-item md-layout md-small-size-100 md-size-50 p-0"
              >
                <div class="md-layout-item md-small-size-100 md-size-66">
                  <!-- <md-field :class="{ 'md-has-value': booking.date }">
                  <label>日期</label>
                  <datetime
                    v-model="booking.date"
                    input-class="md-input"
                    type="date"
                    auto
                    format="yyyy-LL-dd"
                    value-zone="Asia/Shanghai"
                    :phrases="{ ok: '确定', cancel: '取消' }"
                  />
                </md-field> -->
                  <md-datepicker
                    v-model="booking.date"
                    :md-model-type="String"
                    md-immediately
                  />
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                  <md-field>
                    <label>入场时间</label>
                    <md-input v-model="booking.checkInAt"></md-input>
                  </md-field>
                </div>
              </div>
              <div
                class="md-layout-item md-layout md-small-size-100 md-size-50 p-0"
              >
                <div class="md-layout-item md-small-size-100 md-size-33">
                  <md-field>
                    <label>成人</label>
                    <md-input
                      v-model="booking.adultsCount"
                      type="number"
                      min="0"
                    ></md-input>
                    <span class="md-suffix">位</span>
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                  <md-field>
                    <label>儿童</label>
                    <md-input
                      v-model="booking.kidsCount"
                      type="number"
                      min="0"
                    ></md-input>
                    <span class="md-suffix">位</span>
                  </md-field>
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                  <md-field>
                    <label>袜子</label>
                    <md-input
                      v-model="booking.socksCount"
                      type="number"
                      min="0"
                    ></md-input>
                    <span class="md-suffix">双</span>
                  </md-field>
                </div>
              </div>
              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label>备注</label>
                  <md-textarea
                    v-model="booking.remarks"
                    class="no-padding"
                  ></md-textarea>
                </md-field>
              </div>
              <div class="md-layout-item md-size-100 text-right">
                <md-button type="submit" class="md-raised md-primary mt-4"
                  >保存</md-button
                >
                <md-button
                  type="button"
                  class="mt-4 ml-2 md-simple md-danger"
                  @click="remove"
                  v-if="this.booking.id"
                  >删除</md-button
                >
                <md-button
                  type="button"
                  class="mt-4 ml-2 md-simple md-info"
                  @click="goCustomerDetail"
                  v-if="booking.customer"
                  >客户：{{ booking.customer.name }}
                  <span v-if="booking.customer.mobile"
                    >({{ booking.customer.mobile.substr(-4) }})</span
                  ></md-button
                >
                <md-button
                  class="md-raised md-warning mt-4 pull-right"
                  v-if="price"
                  >收款 {{ price | currency }}</md-button
                >
              </div>
            </md-card-content>
          </md-card>
          <md-card class="payments-card">
            <md-card-header class="md-card-header-icon md-card-header-danger">
              <div class="card-icon">
                <md-icon>payment</md-icon>
              </div>
              <h4 class="title">付款记录</h4>
            </md-card-header>

            <md-card-content class="md-layout">
              <md-table>
                <md-table-row
                  v-for="payment in booking.payments"
                  :key="payment.id"
                >
                  <md-table-cell md-label="金额" md-sort-by="amount"
                    >¥{{ payment.amount }}</md-table-cell
                  >
                  <md-table-cell md-label="完成" md-sort-by="paid">{{
                    payment.paid ? "是" : "否"
                  }}</md-table-cell>
                  <md-table-cell
                    md-label="描述"
                    md-sort-by="title"
                    style="width:35%"
                    >{{ payment.title }}</md-table-cell
                  >
                  <md-table-cell md-label="通道" md-sort-by="gateway">{{
                    payment.gateway | paymentGatewayName
                  }}</md-table-cell>
                  <md-table-cell md-label="创建时间" md-sort-by="createdAt">{{
                    payment.createdAt | date
                  }}</md-table-cell>
                </md-table-row>
              </md-table>
            </md-card-content>
          </md-card>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// import { Datetime } from "vue-datetime";
// import "vue-datetime/dist/vue-datetime.css";
import { Booking, BookingPrice, Store, User } from "@/resources";
import Swal from "sweetalert2";
import moment from "moment";

export default {
  // components: { Datetime },
  data() {
    const currentUserStore = this.$user.store;
    return {
      booking: {
        id: "",
        type: "play",
        status: "PENDING",
        customer: null,
        date: moment().format("YYYY-MM-DD"),
        checkInAt: moment().format("HH:mm:ss"),
        adultsCount: 1,
        kidsCount: 1,
        socksCount: 1,
        store: currentUserStore
      },
      price: null,
      customers: [],
      customerSearchTerm: "",
      stores: [],
      storeSearchTerm: currentUserStore ? currentUserStore.name : ""
    };
  },
  methods: {
    async save() {
      if (this.$route.params.id === "add") {
        this.booking = (
          await Booking.save(this.booking, {
            bypassBandIdsCheck: true,
            authBands: false
          })
        ).body;
      } else {
        this.booking = (
          await Booking.update(
            {
              id: this.$route.params.id,
              bypassBandIdsCheck: true,
              authBands: false
            },
            this.booking
          )
        ).body;
      }
      this.$notify({
        message: "保存成功",
        icon: "check",
        horizontalAlign: "center",
        verticalAlign: "bottom",
        type: "success"
      });
      if (this.$route.params.id === "add") {
        this.$router.replace(`/booking/${this.booking.id}`);
      }
    },
    async remove() {
      if (
        !(
          await Swal.fire({
            title: "确定要删除这个预约？",
            text: `这个操作不可撤销，并且将删除这个预约和他的所有支付记录`,
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "md-button md-danger",
            cancelButtonClass: "md-button",
            confirmButtonText: "确定删除",
            cancelButtonText: "取消",
            buttonsStyling: false
          })
        ).value
      )
        return;
      await Booking.delete({ id: this.booking.id });
      this.$router.go(-1);
    },
    async getCustomers(q) {
      this.customers = (await User.get({ keyword: q })).body;
      return this.customers;
    },
    selectCustomer(item) {
      this.booking.customer = item;
      this.customerSearchTerm = item.name;
    },
    async getStores(q) {
      this.stores = (await Store.get({ keyword: q })).body;
      return this.stores;
    },
    selectStore(item) {
      this.booking.store = item;
      this.storeSearchTerm = item.name;
    },
    goCustomerDetail() {
      this.$router.push(`/user/${this.booking.customer.id}`);
    },
    async updateBookingPrice() {
      const { price } = (await BookingPrice.update(this.booking)).body;
      this.price = price;
    }
  },
  watch: {
    booking: {
      handler(b) {
        this.updateBookingPrice();
      },
      deep: true
    }
  },
  async mounted() {
    if (this.$route.params.id !== "add") {
      this.booking = (await Booking.get({ id: this.$route.params.id })).body;
      if (this.booking.customer)
        this.customerSearchTerm = this.booking.customer.name;
      if (this.booking.store) this.storeSearchTerm = this.booking.store.name;
    }
  }
};
</script>
<style lang="scss">
.md-datepicker-body .md-dialog-actions {
  display: none;
}
.md-input {
  min-width: 0;
}
.payments-card {
  margin-top: 50px;
}
.md-card.md-theme-default {
  position: static;
}
.md-card .md-table {
  width: 100%;
}
</style>
