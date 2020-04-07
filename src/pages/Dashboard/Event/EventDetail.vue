<template lang="pug">
.content
  .md-layout
    .md-layout-item.md-size-66.md-small-size-100.mx-auto
      form(@submit.prevent='save')
        md-card
          md-card-header.md-card-header-icon.md-card-header-primary
            .card-icon
              md-icon event
            h4.title {{ event.title }}
          md-card-content.md-layout
            .md-layout-item.md-size-66
              md-field
                label 标题
                md-input(v-model='event.title')
            .md-layout-item.md-small-size-100.md-size-33
              md-datepicker(v-model='event.date', md-immediately)
                label 日期
            .md-layout-item.md-small-size-100.md-size-25
              md-field
                label 门店
                md-select(v-model='event.store')
                  md-option(v-for='store in $stores', :key='store.id', :value='store.id') {{ store.name }}
            .md-layout-item.md-small-size-100.md-size-25
              md-field
                label 积分售价
                md-input(type='number', v-model='event.priceInPoints')
            .md-layout-item.md-small-size-100.md-size-25
              md-field
                label 收款售价 ¥
                md-input(type='number', v-model='event.price')
            .md-layout-item.md-small-size-100.md-size-25
              md-field
                label 最大儿童人数
                md-input(type='number', v-model='event.kidsCountMax')
            .md-layout-item.md-size-100
              md-chips.md-primary.shake-on-error(@keypress.native.enter.prevent, v-model='event.tags', md-placeholder='添加标签', md-check-duplicated)
            .md-layout-item.md-small-size-100
              md-field.md-has-value.mt-4
                label 内容
                editor(v-model='event.content')
            .md-layout-item.md-size-100.md-layout.md-alignment-bottom-space-between
              .md-layout.md-alignment-bottom-left.pl-0(style='flex:1;flex-wrap:nowrap')
                md-button.mt-4.md-simple.md-info.md-btn-link(type='button' v-if="event.kidsCountLeft || event.kidsCountLeft === 0")
                  | 剩余儿童名额：{{ event.kidsCountLeft }}
              .md-layout.md-alignment-bottom-right
                md-button.mt-4.ml-2.md-simple.md-danger(type='button', @click='remove', v-if='this.event.id') 删除
                md-button.md-primary.mt-4(type='submit' :class='{"md-simple": event.id,"md-raised": !event.id}') 保存
        md-card.bookings-card
          md-card-header.md-card-header-icon.md-card-header-blue
            .card-icon
              md-icon payment
            h4.title 报名记录
          md-card-content.md-layout
            md-table
              md-table-row(v-for='booking in bookings', :key='booking.id')
                md-table-cell(md-label='客户', md-sort-by='customer')
                  | {{ booking.customer.name }}
                md-table-cell(md-label='人数', md-sort-by='kidsCount')
                  | {{ booking.kidsCount }}
                md-table-cell(md-label='时间', md-sort-by='checkInAt')
                  | {{ booking.createdAt | date('YYYY-MM-DD HH:mm') }}
                md-table-cell(md-label='状态', md-sort-by='status')
                  | {{ booking.status | bookingStatusName }}
    .md-layout-item.md-size-33.md-small-size-100
      md-card
        .md-layout-item.md-size-100.md-xsmall-size-100.pb-2
          h4.card-title 封面图
          poster(v-model="event.posterUrl")
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { EventResource, BookingResource } from "@/resources";
import { Event, Booking } from "@/resources/interfaces";
import { Editor, Poster } from "@/components";
import { confirm } from "@/helpers/sweetAlert";

@Component({
  components: {
    Editor,
    Poster
  }
})
export default class EventDetail extends Vue {
  event: Partial<Event> = {};
  bookings: Booking[] = [];
  async save() {
    this.event = await EventResource.save(this.event);
    this.$notify({
      message: "保存成功",
      icon: "check",
      horizontalAlign: "center",
      verticalAlign: "bottom",
      type: "success"
    });
    if (this.$route.params.id === "add") {
      this.$router.replace(`/event/${this.event.id}`);
    }
  }
  async remove() {
    if (
      !(await confirm(
        "确定要删除这个活动",
        `这个操作不可撤销`,
        "确定删除",
        "error"
      ))
    )
      return;
    await EventResource.delete({ id: this.event.id });
    this.$router.go(-1);
  }

  @Watch("event.date") onEventDateUpdate(v: Date | string) {
    if (!v.constructor || v.constructor.name !== "Date") {
      this.event.date = new Date((this.event as Event).date);
    }
  }
  @Watch("event.store") onEventStoreUpdate(v: string | false) {
    if (typeof v === "object" && v) {
      // @ts-ignore
      this.event.store = this.event.store.id;
    } else if (v === false) {
      this.event.store = null;
    }
  }
  async mounted() {
    if (this.$route.params.id !== "add") {
      this.event = await EventResource.get({ id: this.$route.params.id });
      this.bookings = await BookingResource.query({
        event: this.$route.params.id
      });
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
.bookings-card {
  margin-top: 50px;
}
</style>
