<template lang="pug">
.content
  .md-layout
    .md-layout-item.md-size-66.md-small-size-100.mx-auto
      form(@submit.prevent='save', ref='form')
        md-card
          md-card-header.md-card-header-icon.md-card-header-primary
            .card-icon
              md-icon timer
            h4.title {{ booking.id.substr(-6).toUpperCase() }}
          md-card-content.md-layout
            .md-layout-item.md-small-size-100.md-size-25
              md-autocomplete(v-model='customerSearchTerm', :md-options='getCustomers(customerSearchTerm)', @md-selected='selectCustomer', @md-changed='updateCustomer', :disabled="booking.status && booking.status !== 'pending'")
                label 客户
                template(slot='md-autocomplete-item', slot-scope='{ item }')
                  | {{ item.name }}
            .md-layout-item.md-small-size-100.md-size-25
              md-field
                label 门店
                md-select(v-model='booking.store')
                  md-option(v-for='store in $stores', :key='store.id', :value='store.id') {{ store.name }}
            .md-layout-item.md-small-size-100.md-size-25
              md-field
                label 类型
                md-select(v-model='booking.type', @keydown.enter.prevent='')
                  md-option(v-for='(name, type) in $bookingTypeNames', :key='type', :value='type') {{ name }}
            .md-layout-item.md-small-size-100.md-size-25
              md-field
                label 状态
                md-select(v-model='booking.status', @keydown.enter.prevent='', :disabled="$user.role === 'manager'")
                  md-option(v-for='(name, status) in $bookingStatusNames', :key='status', :value='status') {{ name }}
            .md-layout-item.md-small-size-100.md-size-100(v-if="booking.type === 'event'")
              md-autocomplete(v-model='eventSearchTerm', :md-options='events', @md-selected='selectEvent')
                label 活动
                template(slot='md-autocomplete-item', slot-scope='{ item }')
                  | {{ item.title }}
            .md-layout-item.md-layout.md-small-size-100.md-size-50.p-0
              .md-layout-item.md-small-size-100.md-size-66
                md-datepicker(v-model='booking.date', :md-model-type='String', md-immediately='')
              .md-layout-item.md-small-size-100.md-size-33
                md-field
                  label 入场时间
                  md-input(v-model='booking.checkInAt')
            .md-layout-item.md-layout.md-small-size-100.md-size-50.p-0
              .md-layout-item.md-small-size-100.md-size-50
                md-field
                  label 成人
                  md-input(v-model='booking.adultsCount', type='number', min='0')
                  span.md-suffix 位
              .md-layout-item.md-small-size-100.md-size-50
                md-field
                  label 儿童
                  md-input(v-model='booking.kidsCount', type='number', min='0')
                  span.md-suffix 位
            .md-layout-item.md-small-size-100
              md-field
                label 备注
                md-textarea.no-padding(v-model='booking.remarks')
            .md-layout-item.md-layout.md-alignment-bottom-space-between.md-size-100.text-right.mt-2
              .md-layout.md-alignment-bottom-left.pl-0(style='flex:1;flex-wrap:nowrap')
                div(style='padding-left:0;width:150px', v-if='!booking.id')
                  md-field
                    label 支付方式
                    md-select(v-model='paymentGateway', :disabled='(priceInPoints && !price) || (!customerCards.length && !price)')
                      md-option(v-for='card in customerCards', v-show='price', :key='card.id', :value='card.id', @click.native='useCard(card)') {{ card.title }}
                      md-option(value='points', @click='useCard(false)', v-show='priceInPoints') 账户积分
                      md-option(value='balance', @click='useCard(false)', v-show='price') 账户余额
                      md-option(value='cash', @click='useCard(false)', v-show='price') 现金刷卡
                md-button.mt-2.md-simple.md-info.md-btn-link(type='button', @click='goCustomerDetail', v-if='booking.customer')
                  | 客户：{{ booking.customer.name }}
                  span(v-if='booking.customer.mobile') ({{ booking.customer.mobile.substr(-4) }})
                md-button.md-simple.md-warning.mt-2.md-btn-link(v-if='price !== null') {{ price | currency }}
                md-button.md-simple.md-warning.mt-2.md-btn-link(v-if='priceInPoints !== null') {{ priceInPoints }} 积分
              .md-layout.md-alignment-bottom-right
                md-button.md-simple.md-danger(type='button', @click='remove', v-if='this.booking.id') 删除
                md-button.md-raised.md-primary(type='submit') 保存
        md-card.payments-card
          md-card-header.md-card-header-icon.md-card-header-danger
            .card-icon
              md-icon payment
            h4.title 付款记录
          md-card-content.md-layout
            md-table
              md-table-row(v-for='payment in booking.payments', :key='payment.id')
                md-table-cell(md-label='金额', md-sort-by='amount')
                  span(v-if='payment.amount') ¥{{ payment.amount }}
                  span(v-if='payment.amountInPoints')
                    | {{ payment.amountInPoints }}
                md-table-cell(md-label='描述', md-sort-by='title', style='width:40%') {{ payment.title }}
                md-table-cell(md-label='通道', md-sort-by='gateway')
                  | {{ payment.gateway | paymentGatewayName }}
                md-table-cell(md-label='创建时间', md-sort-by='createdAt')
                  | {{ payment.createdAt | date }}
                md-table-cell(md-label='收款')
                  md-button.md-success.md-normal(disabled='', v-if='payment.paid') 已收款
                  md-button.md-normal.md-warning(v-else='', @click='pay(payment)') 收款
</template>

<script>
import { Booking, BookingPrice, User, Event, Payment, Card } from "@/resources";
import Swal from "sweetalert2";
import moment from "moment";

export default {
  data() {
    return {
      booking: {
        id: "",
        type: "play",
        status: "pending",
        customer: null,
        event: null,
        date: moment().format("YYYY-MM-DD"),
        checkInAt: moment().format("HH:mm:ss"),
        adultsCount: 1,
        kidsCount: 1,
        socksCount: 1,
        store: this.$user.store,
        card: null
      },
      price: null,
      priceInPoints: null,
      customers: [],
      customerSearchTerm: "",
      events: [],
      customerCards: [],
      eventSearchTerm: null,
      paymentGateway: null
    };
  },
  methods: {
    async save() {
      if (this.$route.params.id === "add") {
        const { paymentGateway } = this;
        this.booking = (
          await Booking.save({ paymentGateway }, this.booking)
        ).body;
      } else {
        this.booking = (
          await Booking.update(
            {
              id: this.$route.params.id
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
      if (
        !q ||
        q.length < 4 ||
        (this.booking.customer && q === this.booking.customer.name)
      ) {
        if (this.customers.length) {
          this.customers = [];
        }
      } else this.customers = (await User.get({ keyword: q })).body;
      return this.customers;
    },
    selectCustomer(item) {
      this.booking.customer = item;
      this.customerSearchTerm = item.name;
    },
    updateCustomer(term) {
      if (!term) {
        this.booking.customer = null;
      }
    },
    async getEvents(q) {
      this.events = (await Event.get({ keyword: q })).body;
      return this.events;
    },
    selectEvent(item) {
      this.booking.event = item;
      this.eventSearchTerm = item.title;
    },
    goCustomerDetail() {
      this.$router.push(`/user/${this.booking.customer.id}`);
    },
    async updateBookingPrice() {
      const { price, priceInPoints } = (
        await BookingPrice.update(this.booking)
      ).body;
      this.price = price || null;
      this.priceInPoints = priceInPoints || null;
    },
    useCard(card) {
      if (!card) {
        this.booking.card = null;
      } else {
        this.booking.card = card;
      }
    },
    async pay(payment) {
      if (
        !(
          await Swal.fire({
            title: `确定已收款 ¥${payment.amount.toFixed(2)}？`,
            // text: `这个操作`,
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "md-button md-warning",
            cancelButtonClass: "md-button",
            confirmButtonText: "确定已收款",
            cancelButtonText: "取消",
            buttonsStyling: false
          })
        ).value
      )
        return;
      await Payment.update({ id: payment.id }, { paid: true });
      this.booking = (await Booking.get({ id: this.booking.id })).body;
      this.$notify({
        message:
          "收款成功，预约状态现在是：" +
          this.$bookingStatusNames[this.booking.status],
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "bottom",
        type: "success"
      });
    },
    async getCustomerCards() {
      this.customerCards = (
        await Card.get({
          customer: this.booking.customer.id,
          status: "activated"
        })
      ).body;
    }
  },
  watch: {
    "$user.store"(s) {
      this.booking.store = s;
    },
    booking: {
      handler(b, p) {
        if (!b.id) {
          this.updateBookingPrice();
        }
      },
      deep: true
    },
    "booking.customer"() {
      this.getCustomerCards();
    },
    "booking.type"(t) {
      if (t === "event") {
        this.getEvents();
      }
      if (t !== "event") {
        this.booking.event = null;
        this.eventSearchTerm = null;
      }
    },
    "booking.store"(v) {
      if (typeof v === "object" && v) {
        this.booking.store = this.booking.store.id;
      } else if (v === false) {
        this.booking.store = null;
      }
    },
    eventSearchTerm(t) {
      if (t === null) return;
      this.getEvents(t);
      if (!t) {
        this.booking.event = null;
      }
    },
    priceInPoints() {
      if (this.priceInPoints && !this.price) {
        this.paymentGateway = "points";
      } else if (!this.priceInPoints && this.paymentGateway === "points") {
        this.paymentGateway = null;
      }
    }
  },
  async mounted() {
    if (this.$route.params.id !== "add") {
      this.booking = (await Booking.get({ id: this.$route.params.id })).body;
      if (this.booking.customer)
        this.customerSearchTerm = this.booking.customer.name;
      if (this.booking.event) this.eventSearchTerm = this.booking.event.title;
    } else {
      this.updateBookingPrice();
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
