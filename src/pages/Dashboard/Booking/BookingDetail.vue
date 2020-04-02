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
              md-autocomplete(v-model='customerSearchTerm', :md-options='customers', @md-selected='selectCustomer', @md-changed='getCustomers(customerSearchTerm)', @keypress.enter.native.prevent, :disabled="booking.status && booking.status !== 'pending'" autocomplete="off")
                label 客户
                template(slot='md-autocomplete-item', slot-scope='{ item }')
                  | {{ item.name }}
            .md-layout-item.md-small-size-100.md-size-25
              md-field
                label 门店
                md-select(v-model='booking.store', @keypress.enter.prevent)
                  md-option(v-for='store in $stores', :key='store.id', :value='store.id') {{ store.name }}
            .md-layout-item.md-small-size-100.md-size-25
              md-field
                label 类型
                md-select(v-model='booking.type', @keydown.enter.prevent)
                  md-option(v-for='(name, type) in $bookingTypeNames', :key='type', :value='type') {{ name }}
            .md-layout-item.md-small-size-100.md-size-25
              md-field
                label 状态
                md-select(v-model='booking.status', @keydown.enter.prevent='', :disabled="$user.role === 'manager'")
                  md-option(v-for='(name, status) in $bookingStatusNames', :key='status', :value='status') {{ name }}
            .md-layout-item.md-small-size-100.md-size-100(v-if="booking.type === 'event'")
              md-autocomplete(v-model='eventSearchTerm', :md-options='events', @md-selected='selectEvent' @keypress.enter.native.prevent autocomplete="off")
                label 活动
                template(slot='md-autocomplete-item', slot-scope='{ item }')
                  | {{ item.title }}
            .md-layout-item.md-small-size-100.md-size-100(v-if="booking.type === 'gift'")
              md-autocomplete(v-model='giftSearchTerm', :md-options='gifts', @md-selected='selectGift' @keypress.enter.native.prevent autocomplete="off")
                label 礼品
                template(slot='md-autocomplete-item', slot-scope='{ item }')
                  | {{ item.title }}
            .md-layout-item.md-layout.md-small-size-100.md-size-50.p-0
              .md-layout-item.md-small-size-100.md-size-66
                md-datepicker(v-model='booking.date', :md-model-type='String', md-immediately='')
              .md-layout-item.md-small-size-100.md-size-33
                md-field
                  label 入场时间
                  md-input(v-model='booking.checkInAt')
            .md-layout-item.md-layout.md-small-size-100.md-size-50.p-0(style="flex-wrap:nowrap")
              .md-layout-item(style="flex:1;min-width:33%" v-if="['play','event'].includes(booking.type)")
                md-field
                  label 成人
                  md-input(v-model='booking.adultsCount', type='number', min='0')
                  span.md-suffix 位
              .md-layout-item(style="flex:1;min-width:33%" v-if="['play','event'].includes(booking.type)")
                md-field
                  label 儿童
                  md-input(v-model='booking.kidsCount', type='number', min='0')
                  span.md-suffix 位
              //- .md-layout-item(v-if="booking.type==='play'", style="flex:1;min-width:33%")
                md-field
                  label 袜子
                  md-input(v-model='booking.socksCount', type='number', min='0')
                  span.md-suffix 双
              .md-layout-item(v-if="booking.type==='gift'", style="flex:1;min-width:33%")
                md-field
                  label 数量
                  md-input(v-model='booking.quantity', type='number', min='0')
            .md-layout-item.md-small-size-100
              md-field
                label 备注
                md-textarea.no-padding(v-model='booking.remarks')
            .md-layout-item.md-layout.md-alignment-bottom-space-between.md-size-100.text-right.mt-2
              .md-layout.md-alignment-bottom-left.pl-0(style='flex:1;flex-wrap:nowrap')
                div(style='padding-left:0;width:150px', v-if='!booking.id')
                  md-field
                    label 支付方式
                    md-select(v-model='paymentGateway', :disabled='!price')
                      md-option(v-for='card in customerCards', v-show='price && card.store === booking.store', :key='card.id', :value='card.id', @click.native='useCard(card)')
                        b
                        b {{ card.title }}
                        b(v-if='card.timesLeft') -剩余{{ card.timesLeft }}
                      md-option(value='points', @click='useCard(false)', v-show='priceInPoints') 账户积分 {{ booking.customer ? booking.customer.points : ''}}
                      md-option(value='balance', @click='useCard(false)', v-show='price') 账户余额
                      md-option(value='cash', @click='useCard(false)', v-show='price') 现金刷卡
                md-button.mt-2.md-simple.md-info.md-btn-link(type='button', @click='goCustomerDetail', v-if='booking.id && booking.customer')
                  | 客户：{{ booking.customer.name }}
                  span(v-if='booking.customer.mobile') ({{ booking.customer.mobile.substr(-4) }})
                md-button.md-simple.md-warning.mt-2.md-btn-link(v-if='price !== null') {{ price | currency }}
                md-button.md-simple.md-warning.mt-2.md-btn-link(v-if='priceInPoints !== null') {{ priceInPoints }} 积分
              .md-layout.md-alignment-bottom-right
                md-button.md-simple.md-danger(type='button', @click='remove', v-if='this.booking.id') 删除
                md-button.md-raised.md-primary(type='submit') 保存
                md-button.md-raised.md-warning.ml-2(v-if="booking.status === 'booked' && ['play','event'].includes(booking.type)" @click="checkIn") 入场
        md-card.payments-card
          md-card-header.md-card-header-icon.md-card-header-danger
            .card-icon
              md-icon payment
            h4.title 付款记录
          md-card-content.md-layout
            md-table
              md-table-row(v-for='payment in booking.payments', :key='payment.id')
                md-table-cell(md-label='描述', md-sort-by='title', style='width:40%') {{ payment.title }}
                md-table-cell(md-label='通道', md-sort-by='gateway')
                  | {{ payment.gateway | paymentGatewayName }}
                md-table-cell(md-label='金额', md-sort-by='amount')
                  span(v-if='payment.amount') ¥{{ payment.amount }}
                  span(v-if='payment.amountInPoints')
                    | {{ payment.amountInPoints }}
                md-table-cell(md-label='创建时间', md-sort-by='createdAt')
                  | {{ payment.createdAt | date }}
                md-table-cell(md-label='收款')
                  md-button.md-success.md-normal(disabled='', v-if='payment.paid') 已收款
                  md-button.md-normal.md-warning(v-else='', @click='pay(payment)') 收款
</template>

<script lang="ts">
import Vue from "vue";
import { Watch, Component } from "vue-property-decorator";
import { confirm } from "@/helpers/sweetAlert";
import moment from "moment";
import {
  BookingResource,
  BookingPriceResource,
  UserResource,
  EventResource,
  GiftResource,
  PaymentResource,
  CardResource
} from "@/resources";
import {
  User,
  Event,
  Gift,
  Card,
  Store,
  Booking,
  BookingType,
  BookingStatus,
  Payment
} from "@/resources/interfaces";

@Component
export default class BookingDetail extends Vue {
  booking: Partial<Booking> = {
    id: "",
    type: BookingType.PLAY,
    status: BookingStatus.PENDING,
    date: moment().format("YYYY-MM-DD"),
    checkInAt: moment().format("HH:mm:ss"),
    adultsCount: 1,
    kidsCount: 1,
    socksCount: 1,
    store: this.$user.store
  };
  price: number | null = null;
  priceInPoints: number | null = null;
  customers: User[] = [];
  customerSearchTerm = "";
  events: Event[] = [];
  gifts: Gift[] = [];
  customerCards: Card[] = [];
  eventSearchTerm: string | null = null;
  giftSearchTerm: string | null = null;
  paymentGateway: string | null = null;

  async save() {
    const { paymentGateway } = this;
    this.booking = await BookingResource.save(this.booking, { paymentGateway });
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
  }

  async remove() {
    if (!this.booking.id) return;
    if (
      !(await confirm(
        "确定要删除这个预约？",
        `这个操作不可撤销，并且将删除这个预约和他的所有支付记录`,
        "确定删除",
        "error"
      ))
    )
      return;
    await BookingResource.delete({ id: this.booking.id });
    this.$router.go(-1);
  }

  async getCustomers(q: string) {
    if (!q) {
      this.booking.customer = null;
    }
    if (
      !q ||
      q.length < 4 ||
      (this.booking.customer && q === this.booking.customer.name)
    ) {
      if (this.customers.length) {
        this.customers = [];
      }
    } else this.customers = await UserResource.query({ keyword: q });
    return this.customers;
  }

  selectCustomer(item: User) {
    this.booking.customer = item;
    this.customerSearchTerm = item.name || "";
  }

  async getEvents(q?: string) {
    if (typeof this.booking.store === "object") return;
    this.events = await EventResource.query({
      keyword: q,
      store: this.booking.store
    });
    return this.events;
  }

  selectEvent(item: Event) {
    this.booking.event = item;
    this.eventSearchTerm = item.title;
  }

  async getGifts(q?: string) {
    if (typeof this.booking.store === "object") return;
    this.gifts = await GiftResource.query({
      keyword: q,
      store: this.booking.store
    });
    return this.gifts;
  }

  selectGift(item: Gift) {
    (this.booking as Booking).gift = item;
    this.giftSearchTerm = item.title;
  }

  goCustomerDetail() {
    if (!this.booking.customer) return;
    this.$router.push(`/user/${this.booking.customer.id}`);
  }

  async updateBookingPrice() {
    if (!this.booking.customer) return;
    const { price, priceInPoints } = await BookingPriceResource.create(
      this.booking
    );
    this.price = price || null;
    this.priceInPoints = priceInPoints || null;
  }

  useCard(card: Card) {
    if (!card) {
      this.booking.card = null;
    } else {
      this.booking.card = card;
    }
  }

  async pay(payment: Payment) {
    const booking = this.booking as Booking;
    if (
      !(await confirm(
        `确定已收款 ¥${payment.amount.toFixed(2)}`,
        null,
        "确定已收款"
      ))
    )
      return;
    await PaymentResource.update({ id: payment.id }, { paid: true });
    this.booking = await BookingResource.get({ id: booking.id });
    this.$notify({
      message:
        "收款成功，预约状态现在是：" + this.$bookingStatusNames[booking.status],
      icon: "add_alert",
      horizontalAlign: "center",
      verticalAlign: "bottom",
      type: "success"
    });
  }

  async getCustomerCards() {
    if (!this.booking.customer) return;
    this.customerCards = await CardResource.query({
      customer: this.booking.customer.id,
      status: "activated"
    });
  }

  async checkIn() {
    this.booking.status = BookingStatus.IN_SERVICE;
    this.booking = await BookingResource.save(this.booking);
  }

  @Watch("$user.store") onUserStoreUpdate(s: Store) {
    this.booking.store = s;
  }

  @Watch("booking", { deep: true })
  onBookingUpdate(b: Booking) {
    if (!b.id) {
      this.updateBookingPrice();
    }
  }
  @Watch("booking.customer") onBookingCustomerUpdate() {
    this.getCustomerCards();
    this.booking.card = null;
    this.paymentGateway = null;
  }
  @Watch("booking.type") onBookingTypeUpdate(t: BookingType) {
    this.booking.card = null;
    this.paymentGateway = null;
    if (t === "event") {
      this.getEvents();
    }
    if (t !== "event") {
      this.booking.event = null;
      this.eventSearchTerm = null;
    }
    if (t === "gift") {
      this.getGifts();
      this.booking.quantity = 1;
    }
    if (t !== "gift") {
      this.booking.gift = null;
      this.giftSearchTerm = null;
      this.booking.quantity = undefined;
    }
  }
  @Watch("booking.store") onBookingStoreUpdate(
    v: Store | string | boolean,
    p: Store | string | boolean
  ) {
    if (typeof v === "object" && v) {
      // @ts-ignore
      this.booking.store = this.booking.store.id;
    } else if (v === false) {
      this.booking.store = null;
    }
    if (typeof v === "string" && typeof p === "object") {
      return;
    }
    if (typeof v !== "string") {
      return;
    }
    this.booking.card = null;
    this.paymentGateway = null;
    if (this.booking.type === "event") {
      this.getEvents();
      this.booking.event = null;
      this.eventSearchTerm = null;
    }
    if (this.booking.type === "gift") {
      console.log(v, p);
      this.getGifts();
      this.booking.gift = null;
      this.giftSearchTerm = null;
    }
  }
  @Watch("eventSearchTerm") onEventSearchTermUpdate(t: string) {
    if (t === null) return;
    this.getEvents(t);
    if (!t) {
      this.booking.event = null;
    }
  }
  @Watch("giftSearchTerm") onGiftSearchTermUpdate(t: string) {
    if (t === null) return;
    this.getGifts(t);
    if (!t) {
      this.booking.gift = null;
    }
  }
  @Watch("priceInPoints") onPriceInPointsUpdate() {
    if (this.priceInPoints && !this.price) {
      this.paymentGateway = "points";
    } else if (!this.priceInPoints && this.paymentGateway === "points") {
      this.paymentGateway = null;
    }
  }

  async mounted() {
    if (this.$route.params.id !== "add") {
      this.booking = await BookingResource.get({ id: this.$route.params.id });
      if (this.booking.customer)
        this.customerSearchTerm = this.booking.customer.name || "";
      if (this.booking.event) this.eventSearchTerm = this.booking.event.title;
      if (this.booking.gift) this.giftSearchTerm = this.booking.gift.title;
    } else {
      const { type } = this.$route.query;
      if (type) this.booking.type = type as BookingType;
      this.updateBookingPrice();
    }
  }
}
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
