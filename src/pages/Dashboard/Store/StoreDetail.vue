<template lang="pug">
.content
  .md-layout
    .md-layout-item.md-size-66.md-small-size-100.mx-auto
      form(@submit.prevent='save')
        md-card
          md-card-header.md-card-header-icon.md-card-header-primary
            .card-icon
              md-icon store
            h4.title {{ store.name }}
          md-card-content.md-layout
            .md-layout-item.md-size-100
              md-field
                label 名称
                md-input(v-model='store.name')
            .md-layout-item.md-size-100
              md-field
                label 地址
                md-input(v-model='store.address')
            .md-layout-item.md-size-100
              md-field
                label 电话
                md-input(v-model='store.phone')
            .md-layout-item.md-size-100
              h4 每日限流
              .md-layout-item.md-size-100.md-layout
                h5.mr-2 优惠活动
                .md-layout-item.md-size-10.p-0(v-for="n in 7")
                  md-field
                    label {{ n-1 | dayOfWeekName }}
                    md-input(v-model='store.dailyLimit.coupon[n-1]')
              .md-layout-item.md-size-100.md-layout
                h5.mr-2 会员散客
                .md-layout-item.md-size-10.p-0(v-for="n in 7")
                  md-field
                    label {{ n-1 | dayOfWeekName }}
                    md-input(v-model='store.dailyLimit.common[n-1]')
              .md-layout-item.md-size-100.md-layout
                h5.mr-2 例外日期
                .md-layout-item.md-size-20.p-0(v-for="(item, index) in store.dailyLimit.dates")
                  md-field
                    label {{ item.date }}
                    span.md-prefix {{ item.group | dailyLimitGroupName }}
                    md-input(v-model='item.limit')
                    span.md-suffix(@click="removeDailyLimitDateItem(index)")
                      md-icon close
                .md-layout-item.md-size-100.p-0.md-layout.md-alignment-bottom-left
                  .md-layout-item.md-layout-item.md-size-25.p-0
                    md-datepicker(v-model='newDailyLimitDateItem.date', :md-model-type='String', md-immediately)
                      label 日期
                  .md-layout-item.md-layout-item.md-size-15.p-0
                    md-field
                      label 分组
                      md-select(v-model='newDailyLimitDateItem.group')
                        md-option(value="coupon") 优惠活动
                        md-option(value="common") 会员散客
                  .md-layout-item.md-layout-item.md-size-10.p-0
                    md-field
                      label 限流
                      md-input(type="number" v-model='newDailyLimitDateItem.limit')
                  md-button.md-just-icon.md-simple(@click="addNewDailyLimitDateItem")
                    md-icon add
            .md-layout-item.md-size-100
              md-field.md-has-value.mt-4
                label 介绍
                editor(v-model='store.content')
            .md-layout-item.md-size-100.text-right
              md-button.md-raised.md-primary.mt-4(type='submit') 保存
              md-button.mt-4.ml-2.md-simple.md-danger(type='button', @click='remove', v-if='store.id') 删除
    .md-layout-item.md-size-33.md-small-size-100
      md-card
        .md-layout-item.md-size-100.md-xsmall-size-100.pb-2
          h4.card-title 封面图
          poster(v-model="store.posterUrl")
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { StoreResource } from "@/resources";
import { Store } from "@/resources/interfaces";
import { Editor, Poster } from "@/components";
import { confirm } from "@/helpers/sweetAlert";

@Component({
  components: {
    Editor,
    Poster,
  },
  filters: {
    dayOfWeekName(n: number) {
      const names = ["日", "一", "二", "三", "四", "五", "六"];
      return names[n];
    },
    dailyLimitGroupName(group: "coupon" | "common") {
      const names = { coupon: "优惠活动", common: "会员散客" };
      return names[group];
    },
  },
})
export default class StoreDetail extends Vue {
  store: Partial<Store> = {
    id: "",
    dailyLimit: {
      common: [],
      coupon: [],
      dates: [],
    },
  };
  newDailyLimitDateItem: { date?: string; group?: string; limit?: number } = {};
  async save() {
    this.store = await StoreResource.save(this.store);
    this.$notify({
      message: "保存成功",
      icon: "check",
      horizontalAlign: "center",
      verticalAlign: "bottom",
      type: "success",
    });
    if (this.$route.params.id === "add") {
      this.$router.replace(`/store/${this.store.id}`);
    }
  }
  async remove() {
    if (
      !(await confirm(
        "确定要删除这个门店",
        `这个操作不可撤销`,
        "确定删除",
        "error"
      ))
    )
      return;
    await StoreResource.delete({ id: this.store.id });
    this.$router.back();
  }
  addNewDailyLimitDateItem() {
    if (!this.store.dailyLimit?.dates) return;
    this.store.dailyLimit.dates.push(this.newDailyLimitDateItem);
    this.newDailyLimitDateItem = {};
  }
  removeDailyLimitDateItem(index: number) {
    if (!this.store.dailyLimit?.dates) return;
    const dates = this.store.dailyLimit.dates;
    this.store.dailyLimit.dates = dates
      .slice(0, index)
      .concat(dates.slice(index + 1));
  }
  async mounted() {
    if (this.$route.params.id !== "add") {
      this.store = await StoreResource.get({ id: this.$route.params.id });
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
h5 {
  font-size: 0.9125rem;
}
</style>
