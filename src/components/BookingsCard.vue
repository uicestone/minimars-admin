<template lang="pug">
md-card.bookings-card
  md-card-header.md-card-header-icon.md-card-header-warning
    .card-icon
      md-icon history
    h4.title {{ title }}
      md-button.md-warning.md-sm.pull-right(@click='goCustomerBookings' v-if="customer") 查看所有预约
  md-card-content.md-layout
    md-table
      md-table-row(v-for='booking in bookings', :key='booking.id')
        md-table-cell(md-label='日期')
          | {{ booking.date }}
        md-table-cell(md-label='时间')
          | {{ booking.checkInAt }}
        md-table-cell(md-label='类型')
          | {{ booking.type | bookingTypeName }}
        md-table-cell(md-label='大/小')
          | {{ booking.adultsCount }} /
          | {{ booking.kidsCount }}
        //- md-table-cell(md-label='优惠', style='min-width:150px')
          | {{ booking.coupon | couponName }}
        md-table-cell(md-label='门店')
          | {{ booking.store.name }}
        md-table-cell(md-label='状态')
          | {{ booking.status | bookingStatusName }}
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Booking, User, BookingQuery } from "../resources/interfaces";
import { BookingResource } from "../resources";

@Component
export default class BookingsCard extends Vue {
  @Prop({ default: "预约记录" })
  title!: string;

  @Prop()
  bookings?: Booking[];

  @Prop()
  customer?: User;

  @Prop()
  query?: BookingQuery;

  async mounted() {
    if (!this.bookings && this.query) {
      this.bookings = await BookingResource.query(this.query);
    }
  }

  goCustomerBookings() {
    if (!this.customer) return;
    this.$router.push(`/booking?customer=${this.customer.id}`);
  }
}
</script>

<style scoped>
.md-table.md-content {
  width: 100%;
}
</style>