<template lang="pug">
.content
  .md-layout
    .md-layout-item.md-size-60.md-small-size-100
      form(@submit.prevent='save', ref='form')
        md-card
          md-card-header.md-card-header-icon.md-card-header-primary(v-if="booking.type==='play'" style="min-height:61px")
            .card-icon
              md-icon timer
            h4.title 购票预约 {{ booking.id.substr(-4).toUpperCase() }}
              md-button.pull-right.md-primary.md-sm.md-simple(@click="goCustomerDetail" v-if="booking.customer")
                span 查看客户详情
                md-icon.mini keyboard_arrow_right
              md-button.pull-right.md-danger.md-sm.md-simple(@click="cancel")
                span 取消
                md-icon.mini close
          md-card-header.md-card-header-icon.md-card-header-warning(v-if="booking.type==='event'")
            .card-icon
              md-icon event
            h4.title 活动预约 {{ booking.id.substr(-4).toUpperCase() }}
          md-card-header.md-card-header-icon.md-card-header-rose(v-if="booking.type==='gift'")
            .card-icon
              md-icon card_giftcard
            h4.title 礼品兑换 {{ booking.id.substr(-4).toUpperCase() }}
          md-card-header.md-card-header-icon.md-card-header-green(v-if="booking.type==='food'")
            .card-icon
              md-icon fastfood
            h4.title 餐饮消费 {{ booking.id.substr(-4).toUpperCase() }}
          md-card-content.md-layout
            .md-layout-item.md-small-size-100.md-size-50
              md-field
                label 客户
                md-input(v-model='customerSearchTerm' :disabled="!!booking.id")
            .md-layout-item.md-small-size-50.md-size-25
              md-field
                label 门店
                store-select(v-model="booking.store" :disabled='!!booking.id || $user.role !== "admin"')
            .md-layout-item.md-small-size-50.md-size-25
              md-field
                label 状态
                md-select(v-model='booking.status', @keydown.enter.prevent, :disabled='!!booking.id || $user.role !== "admin"')
                  md-option(v-for='(name, status) in $bookingStatusNames', :key='status', :value='status') {{ name }}
            .md-layout-item.md-small-size-100.md-size-100(v-if="booking.type === 'event'")
              md-autocomplete(v-model='eventSearchTerm', :md-options='events', @md-selected='selectEvent' @keypress.enter.native.prevent :disabled='!!booking.id' md-open-on-focus autocomplete="off")
                label 活动
                template(slot='md-autocomplete-item', slot-scope='{ item }')
                  | {{ item.title }}
            .md-layout-item.md-small-size-100.md-size-100(v-if="booking.type === 'gift'")
              md-autocomplete(v-model='giftSearchTerm', :md-options='gifts', @md-selected='selectGift' @keypress.enter.native.prevent :disabled='!!booking.id' autocomplete="off")
                label 礼品
                template(slot='md-autocomplete-item', slot-scope='{ item }')
                  | {{ item.title }}（库存 {{ item.quantity }}）
            .md-layout-item.md-layout.md-small-size-100.md-size-50.p-0(style="flex-wrap:nowrap")
              .md-layout-item(style="flex:1;min-width:33%" v-if="['play','event'].includes(booking.type)")
                md-field
                  label 成人
                  md-input(v-model='booking.adultsCount', type='number', min='0' :disabled="!!booking.id")
                  span.md-suffix 位
              .md-layout-item(style="flex:1;min-width:33%" v-if="['play','event'].includes(booking.type)")
                md-field
                  label 儿童
                  md-input(v-model='booking.kidsCount', type='number', min='0' :disabled="!!booking.id")
                  span.md-suffix 位
              .md-layout-item(style="flex:1;min-width:33%" v-if="['play','event'].includes(booking.type)")
                md-field.md-has-value
                  label 已打印手环
                  md-input(v-model='booking.bandsPrinted', type='number', min='0' disabled)
                  span.md-suffix 条
              .md-layout-item(style="flex:1;min-width:33%" v-if="['food'].includes(booking.type)")
                md-field
                  label 金额
                  span.md-prefix ¥
                  md-input(v-model='booking.price', type='number', min='0', :disabled='!!booking.id')
              //- .md-layout-item(v-if="booking.type==='play'", style="flex:1;min-width:33%")
                md-field
                  label 袜子
                  md-input(v-model='booking.socksCount', type='number', min='0')
                  span.md-suffix 双
              .md-layout-item(v-if="booking.type==='gift'", style="flex:1;min-width:33%")
                md-field
                  label 数量
                  md-input(v-model='booking.quantity', type='number', min='0', :disabled='!!booking.id')
            .md-layout-item.md-layout.md-small-size-100.md-size-50.p-0
              .md-layout-item.md-small-size-60.md-size-60
                md-datepicker(v-model='booking.date', :md-model-type='String', md-immediately)
                  label 日期
              .md-layout-item.md-small-size-40.md-size-40
                md-field
                  label(v-if='["play","party","event"].includes(booking.type)') 入场时间
                  label(v-if='["gift"].includes(booking.type)') 领取时间
                  label(v-if='["food"].includes(booking.type)') 消费时间
                  md-input(v-model='booking.checkInAt', :disabled='!!booking.id')
            .md-layout-item.md-small-size-100
              md-field
                label 备注
                md-textarea.no-padding(v-model='booking.remarks')
            .md-layout-item.md-size-100.card.mt-4(v-if="booking.type === 'play'")
              div(v-if="!booking.id")
                md-button.md-lg-n.mr-1(:class="{'md-warning':usingCoupon(coupon)}" v-for='coupon in coupons', :key='coupon.id', :value='coupon.id', @click='useCoupon(coupon)')
                  span {{ coupon.title }}
                  span.ml-1(v-if="coupon.priceThirdParty")  {{ coupon.priceThirdParty }}
              div(v-else)
                md-button.md-lg-n.md-warning(v-if="booking.coupon")
                  | {{ booking.coupon.title }}
            .md-layout-item.md-size-100.card.mt-4(v-if="booking.type === 'play'")
              div(v-if="!booking.id")
                p(v-if="booking.customer && !customerCards.length") 无有效会员卡
                md-button.md-lg-n.mr-1(:class="{'md-info':usingCard(card)}" v-for='card in customerCards', v-if='booking.type === "play" && (!card.store || card.store === booking.store.id)', :key='card.id', :value='card.id', @click='useCard(card)')
                  | {{ card.title }} {{card.timesLeft?'剩余'+card.timesLeft+'次':''}}
              div(v-else)
                md-button.md-lg-n.md-info(v-if="booking.card")
                  | {{ booking.card.title }} {{booking.card.timesLeft?'剩余'+booking.card.timesLeft+'次':''}}
            .md-layout-item.md-size-100.card.mt-4.md-layout.md-alignment-center-right(v-if="booking.type === 'play'")
              md-button.md-simple.md-warning.md-n(v-if="price || priceInPoints")
                span {{ price | currency }}
                span.ml-1.mr-1(v-if='priceInPoints !== null') /
                span(v-if='priceInPoints !== null') {{ priceInPoints }} 积分
              .md-layout-item(v-if='!booking.id && (price || priceInPoints)')
                md-button.md-n.md-simple(@click="usePaymentGateway('points')", :class="{'md-primary':usingPaymentGateway('points')}", v-if='priceInPoints') 账户积分 {{ booking.customer ? booking.customer.points : ''}}
                md-button.md-n.md-simple(@click="usePaymentGateway('balance')", :class="{'md-primary':usingPaymentGateway('balance')}", v-if='booking.customer && booking.customer.balance') 账户余额 {{ booking.customer.balance }}
                md-button.md-n.md-simple(@click="usePaymentGateway('dianping')", :class="{'md-primary':usingPaymentGateway('dianping')}") 点评POS
                md-button.md-n.md-simple(@click="usePaymentGateway('shouqianba')", :class="{'md-primary':usingPaymentGateway('shouqianba')}") 收钱吧
                md-button.md-n.md-simple(@click="usePaymentGateway('cash')", :class="{'md-primary':usingPaymentGateway('cash')}") 现金
                md-button.md-n.md-simple(@click="usePaymentGateway('pos')", :class="{'md-primary':usingPaymentGateway('pos')}") 银行卡
              .md-layout-item.md-layout.md-alignment-bottom-right(style='flex:0;flex-wrap:nowrap')
                md-button.md-simple.md-danger(type='button', @click='remove', v-if='this.booking.id && $user.can("manage-booking")') 删除
                md-button.md-primary.md-raised(type='submit' v-if='booking.type==="play" && !booking.id' :disabled="!bookingValidated") 保存并入场
                md-button.md-primary.md-simple(type='submit' v-if='booking.type==="play" && booking.id') 保存
                md-button.md-warning(type='submit' v-if='booking.type==="event"' :class='{"md-simple": booking.id,"md-raised": !booking.id}') 保存
                md-button.md-rose(type='submit' v-if='booking.type==="gift"' :class='{"md-simple": booking.id,"md-raised": !booking.id}') 保存
                md-button.md-success(type='submit' v-if='booking.type==="food"' :class='{"md-simple": booking.id,"md-raised": !booking.id}') 保存
                md-button.md-raised.md-info.ml-2(v-if="bandsPrintable > 0 && ['booked','in_service'].includes(booking.status) && ['play','event'].includes(booking.type)" @click="printBands") 打印手环
                md-button.md-raised.md-warning.ml-2(v-if="booking.status === 'booked' && ['play','event'].includes(booking.type)" @click="checkIn") 入场
                md-button.md-raised.md-rose.ml-2(v-if="booking.status === 'booked' && ['gift'].includes(booking.type)" @click="redeem") 兑换
        md-card.payments-card(v-if="booking.payments.length")
          md-card-header.md-card-header-icon.md-card-header-danger
            .card-icon
              md-icon payment
            h4.title 收款
          md-card-content.md-layout
            md-table
              md-table-row(v-for='payment in booking.payments', :key='payment.id')
                md-table-cell(md-label='描述', md-sort-by='title', style='width:35%') {{ payment.title }}
                md-table-cell(md-label='通道', md-sort-by='gateway')
                  | {{ payment.gateway | paymentGatewayName }}
                md-table-cell(md-label='金额', md-sort-by='amount')
                  span(v-if='payment.amount') ¥{{ payment.amount }}
                  span(v-if='payment.amountInPoints')
                    | {{ payment.amountInPoints }}
                md-table-cell(md-label='创建时间', md-sort-by='createdAt')
                  | {{ payment.createdAt | date }}
                md-table-cell(md-label='收款' style="width:86px")
                  md-button.md-success.md-normal(disabled, v-if='payment.paid') 已收款
                  md-button.md-normal.md-warning(v-else, @click='pay(payment)') 收款
        md-button.md-success.md-block.md-raised(v-if='booking.type==="food" && booking.status==="finished"' @click="createAnother") 继续收款

    .md-layout-item.md-size-40.md-small-size-100.mx-auto(v-if="booking.type==='play' && booking.customer")
      membership(:customer="booking.customer" @updated="getCustomer();getCustomerCards()")
</template>

<script lang="ts">
import Vue from "vue";
import { Watch, Component, Prop } from "vue-property-decorator";
import { confirm, promptInput } from "@/helpers/sweetAlert";
import sleep from "@/helpers/sleep";
import moment from "moment";
import {
  BookingResource,
  BookingPriceResource,
  UserResource,
  EventResource,
  GiftResource,
  PaymentResource,
  CardResource,
  CouponResource
} from "@/resources";
import {
  Event,
  Gift,
  Card,
  Store,
  Booking,
  BookingType,
  BookingStatus,
  Payment,
  Coupon,
  PaymentGateway
} from "@/resources/interfaces";
import { Membership, StoreSelect } from "@/components";

@Component({
  components: {
    Membership,
    StoreSelect
  }
})
export default class BookingDetail extends Vue {
  booking: Partial<Booking> = {};
  price: number | null = null;
  priceInPoints: number | null = null;
  customerSearchTerm = "";
  events: Event[] = [];
  gifts: Gift[] = [];
  coupons: Coupon[] = [];
  customerCards: Card[] = [];
  eventSearchTerm: string | null = null;
  giftSearchTerm: string | null = null;
  paymentGateway: string | null = null;

  @Prop({ default: false })
  add!: boolean;

  get bandsPrintable() {
    return (
      (this.booking.kidsCount || 0) +
      (this.booking.adultsCount || 0) -
      (this.booking.bandsPrinted || 0)
    );
  }

  get priceRelatedBookingProperties() {
    return [
      this.booking.card?.id,
      this.booking.coupon?.id,
      this.booking.kidsCount,
      this.booking.adultsCount,
      this.booking.event?.id,
      this.booking.gift?.id
    ].join();
  }

  get bookingValidated() {
    if (!this.paymentGateway && (this.price || this.priceInPoints))
      return false;
    if (!this.booking.customer) return false;
    return true;
  }

  async save() {
    const { paymentGateway } = this;

    if (
      !this.booking.id &&
      !(await confirm(
        "确定已收款/验券",
        `支付方式：${this.booking.card?.title || ""}${this.booking.coupon
          ?.title || ""} ${
          paymentGateway ? this.$gatewayNames[paymentGateway] : ""
        }`
      ))
    ) {
      return;
    }

    this.booking = await BookingResource.save(this.booking, {
      paymentGateway,
      customerKeyword: this.customerSearchTerm
    });

    this.$notify({
      message: "保存成功",
      icon: "check",
      horizontalAlign: "center",
      verticalAlign: "bottom",
      type: "success"
    });
    if (this.add) {
      this.$destroy();
      this.$router.replace(`/booking/${this.booking.type}/${this.booking.id}`);
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

  async searchCustomer(q: string) {
    if (!q) {
      this.booking.customer = null;
      return;
    }
    if (
      q.length < 2 ||
      (this.booking.customer && q === this.booking.customer.mobile)
    )
      return;
    const customers = await UserResource.query({
      role: "customer",
      keyword: q
    });
    if (customers.length === 1) {
      this.booking.customer = customers[0];
      console.log(`Customer set to ${customers[0].id} ${customers[0].mobile}`);
    } else if (this.booking.customer) {
      this.booking.customer = null;
      console.log("Customer cleared.");
    }
  }

  async getEvents(q?: string) {
    console.log("GetEvents with store:", this.booking.store?.name);
    if (q && q === this.booking.event?.title) return;
    this.events = await EventResource.query({
      keyword: q,
      store: this.booking.store?.id
    });
    return this.events;
  }

  selectEvent(item: Event) {
    this.booking.event = item;
    this.eventSearchTerm = item.title;
  }

  async getGifts(q?: string) {
    if (q && q === this.booking.gift?.title) return;
    this.gifts = await GiftResource.query({
      keyword: q,
      store: this.booking.store?.id
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

  cancel() {
    this.$destroy();
    this.$router.back();
  }

  async updateBookingPrice() {
    if (
      this.booking.adultsCount === undefined ||
      this.booking.kidsCount === undefined
    )
      return;
    console.log(
      "Update booking price:",
      JSON.stringify(this.priceRelatedBookingProperties)
    );
    const { price, priceInPoints } = await BookingPriceResource.create(
      this.booking
    );
    this.price = price || null;
    this.priceInPoints = priceInPoints || null;
  }

  useCard(card?: Card | false) {
    if (!card || this.usingCard(card)) {
      console.log("UseCard null");
      this.booking.card = null;
    } else {
      this.useCoupon(false);
      this.usePaymentGateway(false);
      this.booking.card = card;
    }
  }

  usingCard(card: Card) {
    return this.booking.card?.id === card.id;
  }

  useCoupon(coupon?: Coupon | false) {
    if (!coupon || this.usingCoupon(coupon)) {
      console.log("UseCoupon null");
      this.booking.coupon = null;
    } else {
      this.useCard(false);
      this.usePaymentGateway(false);
      this.booking.coupon = coupon;
    }
  }

  usingCoupon(coupon: Coupon) {
    return this.booking.coupon?.id === coupon.id;
  }

  usePaymentGateway(gateway?: PaymentGateway | false) {
    if (!gateway || this.usingPaymentGateway(gateway)) {
      console.log("UsePaymentGateway null");
      this.paymentGateway = null;
    } else {
      this.paymentGateway = gateway;
    }
  }

  usingPaymentGateway(gateway: PaymentGateway) {
    return this.paymentGateway === gateway;
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
        "收款成功，预约状态现在是：" +
        this.$bookingStatusNames[this.booking.status || ""],
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

  async getCustomer() {
    if (!this.booking.customer) return;
    this.booking.customer = await UserResource.get({
      id: this.booking.customer.id
    });
  }

  async checkIn() {
    if (!(await confirm("确定已入场", "确定至少1位客人已经入场"))) return;
    this.booking.status = BookingStatus.IN_SERVICE;
    this.booking = await BookingResource.save(this.booking);
  }

  async redeem() {
    if (!(await confirm("确定已兑换"))) return;
    this.booking.status = BookingStatus.FINISHED;
    this.booking = await BookingResource.save(this.booking);
  }

  createAnother() {
    this.$router.push(`/booking/${this.$route.params.type}/add`);
  }

  async printBands() {
    const n = +(await promptInput(
      "要打印几条手环",
      `可打印手环：${this.bandsPrintable}条`,
      null,
      "question",
      "number",
      this.bandsPrintable,
      v => {
        if (v > this.bandsPrintable) return "超过可打印手环数";
        if (v <= 0) return "请填写有效数字";
      }
    ));
    console.log("n is:", n);
    if (!n) return;
    const data = {
      data1: this.booking.customer?.mobile || "",
      data2:
        this.booking.date + " " + this.booking.checkInAt?.substr(0, 5) || ""
    };
    this.booking.bandsPrinted = (this.booking.bandsPrinted || 0) + n;
    this.$notify({
      message: "正在打印手环，请等待",
      icon: "priority_high",
      horizontalAlign: "center",
      verticalAlign: "bottom",
      type: "warning",
      timeout: n * 1500
    });
    await BookingResource.update(
      { id: this.booking.id },
      { bandsPrinted: this.booking.bandsPrinted }
    );
    for (let i = 0; i < n; i++) {
      console.log("Call electron printBands:", data, n);
      this.$electron?.printBands(data, n);
      await sleep(1500);
    }
    this.$notify({
      message: "手环打印完毕",
      icon: "check",
      horizontalAlign: "center",
      verticalAlign: "bottom",
      type: "success"
    });
  }

  @Watch("$user.store") onUserStoreUpdate(s: Store) {
    if (s.id !== this.booking.store?.id) this.booking.store = s;
  }

  @Watch("priceRelatedBookingProperties")
  onBookingPriceUpdate(b: any, p: any) {
    console.log(
      "Booking price related properties updated",
      JSON.stringify(b),
      JSON.stringify(p)
    );
    // if (!b.id) {
    this.updateBookingPrice();
    // }
  }
  @Watch("booking.customer") onBookingCustomerUpdate() {
    if (this.booking.id) return;
    if (this.booking.type === "play") {
      this.getCustomerCards();
    }
    this.booking.card = null;
    this.paymentGateway = null;
  }
  @Watch("booking.store") onBookingStoreUpdate(
    v: Store | string | boolean,
    p: Store | string | boolean
  ) {
    console.log("Booking store changed", JSON.stringify(v), JSON.stringify(p));
    if (v === false) {
      this.booking.store = null;
    }
    if (typeof v !== "string") {
      return;
    }
    this.booking.card = null;
    this.paymentGateway = null;
    if (this.booking.type === "event") {
      this.getEvents();
      if (this.booking.event) this.booking.event = null;
      this.eventSearchTerm = null;
    }
    if (this.booking.type === "gift") {
      this.getGifts();
      if (this.booking.gift) this.booking.gift = null;
      this.giftSearchTerm = null;
    }
  }
  @Watch("customerSearchTerm") onCustomerSearchTermUpdate(t: string) {
    this.searchCustomer(t);
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

  async created() {
    this.booking = {
      id: "",
      customer: null,
      card: null,
      coupon: null,
      event: null,
      gift: null,
      type: (this.$route.params.type as BookingType) || BookingType.PLAY,
      status: BookingStatus.PENDING,
      date: moment().format("YYYY-MM-DD"),
      checkInAt: moment().format("HH:mm:ss"),
      adultsCount: 1,
      kidsCount: 1,
      socksCount: 1,
      bandsPrinted: 0,
      store: this.$user.store,
      payments: []
    };
    console.log(
      "Created. Booking with store:",
      JSON.stringify(this.$user.store)
    );

    if (this.add) {
      console.log("Add booking:", this.booking.type);
      await this.$user;
      const { type } = this.booking;
      if (this.$route.query.customer) {
        this.booking.customer = await UserResource.get({
          id: this.$route.query.customer
        });
      }
      if (type === "play") {
        this.coupons = await CouponResource.query();
      }
      if (type === "event") {
        this.getEvents();
      }
      if (type === "gift") {
        this.getGifts();
        this.booking.quantity = 1;
      }
      // this.updateBookingPrice();
    } else {
      this.booking = await BookingResource.get({ id: this.$route.params.id });
      if (this.booking.event) this.eventSearchTerm = this.booking.event.title;
      if (this.booking.gift) this.giftSearchTerm = this.booking.gift.title;
    }
    if (this.booking.customer)
      this.customerSearchTerm = this.booking.customer.mobile || "";
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
