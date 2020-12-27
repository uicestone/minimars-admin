<template lang="pug">
md-card.bookings-card
  md-card-header.md-card-header-icon(:class="cardHeaderClass")
    .card-icon
      md-icon {{ cardHeaderIcon }}
    h4.title {{ title }}
      md-button.md-sm.pull-right(:class="buttonClass" @click='goCustomerBookings' v-if="customer") 查看全部
  md-card-content.md-layout
    md-table
      md-table-row(v-for='booking in bookings', :key='booking.id' @click="showDetail(booking)")
        md-table-cell(md-label='日期')
          | {{ booking.date }} {{ booking.checkInAt }}
        //- md-table-cell(md-label='类型')
          | {{ booking.type | bookingTypeName }}
        md-table-cell(md-label='礼品' v-if="type==='gift'")
          | {{ booking.gift.title }} ×{{ booking.quantity }}
        md-table-cell(md-label='活动' v-if="type==='event'")
          | {{ booking.event.title }}
        md-table-cell(md-label='大/小' v-if="['play','event'].includes(type)")
          | {{ booking.adultsCount }} /
          | {{ booking.kidsCount }}
        //- md-table-cell(md-label='优惠', style='min-width:150px')
          | {{ booking.coupon | couponName }}
        md-table-cell(md-label='优惠/会员卡' v-if="type==='play'")
          span(v-if='booking.coupon') {{ booking.coupon.title }}
          span(v-else-if='booking.card') {{ booking.card.title }}
          span(v-else) -
        md-table-cell(md-label='门店' v-if="$user.role==='admin'")
          | {{ booking.store ? booking.store.name : "门店通用" }}
        md-table-cell(md-label='状态')
          | {{ booking.status | bookingStatusName }}
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Booking, User, BookingQuery, Scene } from "../resources/interfaces";
import { BookingResource } from "../resources";

@Component
export default class BookingsCard extends Vue {
  @Prop({ default: "预约记录" })
  title!: string;

  @Prop({ default: "play" })
  type!: Scene;

  @Prop()
  bookings?: Booking[];

  @Prop()
  customer?: User;

  @Prop()
  query?: BookingQuery;

  get cardHeaderClass() {
    if (!this.type) return "";
    const map = {
      [Scene.PLAY]: "primary",
      [Scene.EVENT]: "warning",
      [Scene.GIFT]: "rose",
      [Scene.FOOD]: "green",
      [Scene.PARTY]: "blue"
    };
    return "md-card-header-" + map[this.type];
  }

  get cardHeaderIcon() {
    if (!this.type) return "";
    const map = {
      [Scene.PLAY]: "timer",
      [Scene.EVENT]: "event",
      [Scene.GIFT]: "card_giftcard",
      [Scene.FOOD]: "fastfood",
      [Scene.PARTY]: ""
    };
    return map[this.type];
  }

  get buttonClass() {
    if (!this.type) return "";
    const map = {
      [Scene.PLAY]: "primary",
      [Scene.EVENT]: "warning",
      [Scene.GIFT]: "rose",
      [Scene.FOOD]: "success",
      [Scene.PARTY]: "blue"
    };
    return "md-" + map[this.type];
  }

  async mounted() {
    if (!this.bookings && this.query) {
      this.bookings = await BookingResource.query(this.query);
    }
  }

  showDetail(booking: Booking) {
    this.$router.push(`/booking/${booking.type}/${booking.id}`);
  }

  goCustomerBookings() {
    if (!this.customer) return;
    this.$router.push(`/booking/${this.type}?customer=${this.customer.id}`);
  }
}
</script>

<style scoped>
.md-table.md-content {
  width: 100%;
}
</style>
