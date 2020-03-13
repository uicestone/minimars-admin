<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-66 mx-auto">
        <edit-profile-form
          header-color="primary"
          :user="user"
          :save="save"
        ></edit-profile-form>
        <md-card class="bookings-card" v-if="user.role === 'customer'">
          <md-card-header class="md-card-header-icon md-card-header-warning">
            <div class="card-icon">
              <md-icon>history</md-icon>
            </div>
            <h4 class="title">
              最近预约
              <md-button
                @click="goCustomerBookings"
                class="md-warning md-sm pull-right"
                >查看所有预约</md-button
              >
            </h4>
          </md-card-header>

          <md-card-content class="md-layout">
            <md-table>
              <md-table-row v-for="booking in userBookings" :key="booking.id">
                <md-table-cell md-label="日期" md-sort-by="date">{{
                  booking.date
                }}</md-table-cell>
                <md-table-cell md-label="时间" md-sort-by="checkInAt">{{
                  booking.checkInAt
                }}</md-table-cell>
                <!-- <md-table-cell md-label="类型" md-sort-by="type">{{
                booking.type | bookingTypeName
              }}</md-table-cell> -->
                <md-table-cell md-label="时长" md-sort-by="hours">{{
                  booking.hours ? `${booking.hours}小时` : "畅玩"
                }}</md-table-cell>
                <md-table-cell md-label="人数/袜子" md-sort-by="membersCount"
                  >{{ booking.membersCount }} /
                  {{ booking.socksCount }}</md-table-cell
                >
                <md-table-cell
                  md-label="优惠"
                  md-sort-by="coupon"
                  style="min-width:150px"
                >
                  {{ booking.coupon | couponName }}
                </md-table-cell>
                <md-table-cell md-label="状态" md-sort-by="status">{{
                  booking.status | bookingStatusName
                }}</md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-card>
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-size-33 mx-auto"
        v-if="user.role === 'customer'"
      >
        <md-card class="codes-card">
          <md-card-header class="md-card-header-icon md-card-header-blue">
            <div class="card-icon">
              <md-icon>code</md-icon>
            </div>
            <h4 class="title">券码</h4>
          </md-card-header>
          <md-card-content class="md-layout">
            <md-table>
              <md-table-row v-for="code in user.codes" :key="code.id">
                <md-table-cell md-label="描述">{{ code.title }}</md-table-cell>
                <md-table-cell md-label="券号">{{
                  code.id.substr(-6).toUpperCase()
                }}</md-table-cell>
                <md-table-cell md-label="已使用">{{
                  code.used ? "已使用" : "未使用"
                }}</md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-card>
        <md-card class="payments-card">
          <md-card-header class="md-card-header-icon md-card-header-danger">
            <div class="card-icon">
              <md-icon>payment</md-icon>
            </div>
            <h4 class="title">充值记录</h4>
          </md-card-header>

          <md-card-content class="md-layout">
            <md-table>
              <md-table-row
                v-for="payment in depositPayments"
                :key="payment.id"
              >
                <md-table-cell md-label="创建时间" md-sort-by="createdAt">{{
                  payment.createdAt | date("MM/DD")
                }}</md-table-cell>
                <md-table-cell md-label="金额" md-sort-by="amount"
                  >¥{{ payment.amount }}</md-table-cell
                >
                <md-table-cell
                  md-label="描述"
                  md-sort-by="title"
                  style="width:35%"
                  >{{ payment.title }}</md-table-cell
                >
                <md-table-cell md-label="完成" md-sort-by="paid">{{
                  payment.paid ? "付款成功" : "待付款"
                }}</md-table-cell>
                <!-- <md-table-cell md-label="通道" md-sort-by="gateway">{{
                  payment.gateway | paymentGatewayName
                }}</md-table-cell> -->
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-card>
      </div>
      <!-- <div class="md-layout-item md-medium-size-100 md-size-33">
        <user-card button-color="primary"></user-card>
      </div> -->
    </div>
  </div>
</template>

<script>
import { EditProfileForm } from "@/pages";
import { Booking, User, Payment } from "@/resources";

export default {
  components: {
    EditProfileForm
  },
  data() {
    return {
      user: {
        name: "",
        roles: []
      },
      depositPayments: [],
      userBookings: []
    };
  },
  methods: {
    async save() {
      if (this.$route.params.id === "add") {
        this.user = (await User.save(this.user)).body;
      } else {
        this.user = (await User.update(
          { id: this.$route.params.id },
          this.user
        )).body;
      }
      this.$notify({
        message: "保存成功",
        icon: "check",
        horizontalAlign: "center",
        verticalAlign: "bottom",
        type: "success"
      });
      if (this.$route.params.id === "add") {
        this.$router.replace(`/user/${this.user.id}`);
      }
    },
    goCustomerBookings() {
      this.$router.push(`/booking?customer=${this.user.id}`);
    }
  },
  async mounted() {
    if (this.$route.params.id !== "add") {
      if (this.$route.params.id === this.$user.id) {
        this.user = this.$user;
      } else {
        this.user = (await User.get({ id: this.$route.params.id })).body;
      }
      this.depositPayments = (await Payment.get({
        customer: this.user.id,
        attach: "deposit"
      })).body;
      this.userBookings = (await Booking.get({ customer: this.user.id })).body;
    }
  }
};
</script>
<style lang="scss">
.payments-card,
.bookings-card,
.codes-card {
  .md-table {
    width: 100%;
  }
}
.bookings-card,
.payments-card {
  margin-top: 50px;
}
</style>
