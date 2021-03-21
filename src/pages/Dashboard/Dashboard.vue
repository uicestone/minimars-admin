<template lang="pug">
.md-layout
  .md-layout-item.md-size-100.md-layout.md-alignment-center-right
    .md-layout-item.md-size-30.md-xsmall-size-100.stats-date
      md-datepicker(v-model='date', :md-model-type='String', md-immediately  :md-disabled-dates="disabledDates" style="width:140px")
        label 开始日期
      md-datepicker.ml-2(v-model='dateEnd', :md-model-type='String', md-immediately  :md-disabled-dates="disabledDates" v-if="$user.role!=='manager'" style="width:140px")
        label 结束日期
    .md-layout-item.md-xsmall-size-100(style='display:flex;justify-content:space-between;width:330px;flex:0')
      md-menu.md-button(v-if="!$user.store")
        md-button.md-info(md-menu-trigger) {{ store ? store.name : '全部门店' }}
        md-menu-content
          md-menu-item(@click="selectStore(false)") 全部门店
          md-menu-item(v-for="store in $stores" :key="store.id" @click="selectStore(store)") {{ store.name }}
      md-button.md-info(style='flex:0', @click='addDate(-1)' :disabled='date<=startAvailableDay')
        span.md-label
          md-icon keyboard_arrow_left
        | 前一天
      md-button.md-info(style='flex:0', @click='addDate(1)', :disabled='date >= today')
        | 后一天
        md-icon keyboard_arrow_right
    //- .md-layout-item.md-size-10.md-xsmall-size-100
    //-   md-button.md-info(:href="$http.options.root + 'daily-report/' + date", style='width:100%') 下载日报表
  .md-layout-item.md-size-33.md-xsmall-size-100
    stats-card(header-color='period')
      template(slot='header')
        .card-icon
          md-icon playlist_add_check
        p.category {{rangeText}}累计资金流水（合计）
        h3.title
          | ¥ 
          animated-number(:value='stats.flowAmount')
      template(slot='footer')
        .stats
          md-icon bookmark_border
          | 实时，包含各项现金类收款
  .md-layout-item.md-size-33.md-xsmall-size-100
    stats-card(header-color='play')
      template(slot='header')
        .card-icon
          md-icon payment
        p.category {{rangeText}}核销卡券累计值（合计）
        h3.title
          | ¥ 
          animated-number(:value='stats.cardCouponAmount')
      template(slot='footer')
        .stats
          md-icon bookmark_border
          | 实时，包含各平台优惠券核销券值和会员卡核销价值
  .md-layout-item.md-size-33.md-xsmall-size-100
    stats-card(header-color='card')
      template(slot='header')
        .card-icon
          md-icon store
        p.category {{rangeText}}入场人数
        h3.title
          animated-number(:value='stats.customerCount')
      template(slot='footer')
        .stats
          md-icon bookmark_border
          | 实时，包含所有成功付款订单的成人数及儿童数
  .md-layout-item.md-medium-size-100.md-xsmall-size-100.md-size-33
    chart-card(header-animation='false', :chart-data='dailyFlowChart.data', :chart-options='dailyFlowChart.options', chart-type='Line', chart-inside-header, background-color='period')
      md-button.md-simple.md-info.md-just-icon(slot='first-button')
        md-icon refresh
        md-tooltip(md-direction='bottom') Refresh
      md-button.md-simple.md-just-icon(slot='second-button')
        md-icon edit
        md-tooltip(md-direction='bottom') Change Date
      template(slot='content')
        h4.title 每日资金流水
        p.category
          | 最近一周每日每日资金流水
      template(slot='footer')
        .stats
          md-icon access_time
          | 实时
  .md-layout-item.md-medium-size-100.md-xsmall-size-100.md-size-33
    chart-card(header-animation='false', :chart-data='dailyCardCouponPaymentChart.data', :chart-options='dailyCardCouponPaymentChart.options', chart-type='Line', chart-inside-header, background-color='play')
      md-button.md-simple.md-info.md-just-icon(slot='first-button')
        md-icon refresh
        md-tooltip(md-direction='bottom') Refresh
      md-button.md-simple.md-just-icon(slot='second-button')
        md-icon edit
        md-tooltip(md-direction='bottom') Change Date
      template(slot='content')
        h4.title 每日核销卡券值
        p.category
          | 最近一周每日核销卡券值
      template(slot='footer')
        .stats
          md-icon access_time
          | 实时
  .md-layout-item.md-medium-size-100.md-xsmall-size-100.md-size-33
    chart-card(header-animation='false', :chart-data='dailyCustomersChart.data', :chart-options='dailyCustomersChart.options', chart-type='Line', chart-inside-header, background-color='card')
      md-icon(slot='fixed-button') build
      md-button.md-simple.md-info.md-just-icon(slot='first-button')
        md-icon refresh
        md-tooltip(md-direction='bottom') Refresh
      md-button.md-simple.md-just-icon(slot='second-button')
        md-icon edit
        md-tooltip(md-direction='bottom') Change Date
      template(slot='content')
        h4.title 每日累计入场人数
        p.category
          | 最近一周每日累计入场人数
      template(slot='footer')
        .stats
          md-icon access_time
          | 实时
  .md-layout-item.md-size-33.md-xsmall-size-100
    global-sales-card(header-color='period')
      template(slot='header')
        .card-icon
          md-icon language
        h4.title {{rangeText}}收款方式分类汇总
      template(slot='content')
        .md-layout
          .md-layout-item.md-size-100
            md-table(v-model='flowAmountByGatewayNames')
              md-table-row(slot='md-table-row', slot-scope='{ item }')
                md-table-cell {{ item.name }}
                md-table-cell {{ item.amount | currency(0) }}
  .md-layout-item.md-size-33.md-xsmall-size-100
    global-sales-card(header-color='play')
      template(slot='header')
        .card-icon
          md-icon language
        h4.title {{rangeText}}收款场景分类汇总
      template(slot='content')
        .md-layout
          .md-layout-item.md-size-100
            md-table(v-model='flowAmountBySceneNames')
              md-table-row(slot='md-table-row', slot-scope='{ item }')
                md-table-cell {{ item.name }}
                md-table-cell {{ item.amount | currency(0) }}
  .md-layout-item.md-size-33.md-xsmall-size-100
    global-sales-card(header-color='card')
      template(slot='header')
        .card-icon
          md-icon language
        h4.title {{rangeText}}人数分类汇总
      template(slot='content')
        .md-layout
          .md-layout-item.md-size-100
            md-table
              md-table-row(slot='md-table-row')
                md-table-cell 门市散客
                md-table-cell 
                  span {{ stats.customersByType.guest.adultsCount }} /
                  b  {{ stats.customersByType.guest.kidsCount }}
              md-table-row(slot='md-table-row')
                md-table-cell 平台优惠
                md-table-cell 
                  span {{ stats.customersByType.coupon.adultsCount }} /
                  b  {{ stats.customersByType.coupon.kidsCount }}
              md-table-row(slot='md-table-row')
                md-table-cell 购卡会员
                md-table-cell 
                  span {{ stats.customersByType.card.adultsCount }} /
                  b  {{ stats.customersByType.card.kidsCount }}
  .md-layout-item.md-size-100.md-xsmall-size-100
    global-sales-card(header-color='period')
      template(slot='header')
        .card-icon
          md-icon language
        h4.title {{rangeText}}核销卡券分类汇总
      template(slot='content')
        .md-layout
          .md-layout-item.md-size-100.md-layout
            md-table.md-layout-item(:value='cardCouponByTypes')
              md-table-row(slot='md-table-row', slot-scope='{ item, index }' v-show="index % 3 == 0")
                md-table-cell {{ item.name }}
                md-table-cell {{ item.kidsCount }}
                md-table-cell {{ item.amount | currency(0) }}
            md-table.md-layout-item(:value='cardCouponByTypes')
              md-table-row(slot='md-table-row', slot-scope='{ item, index }' v-show="index % 3 == 1")
                md-table-cell {{ item.name }}
                md-table-cell {{ item.kidsCount }}
                md-table-cell {{ item.amount | currency(0) }}
            md-table.md-layout-item(:value='cardCouponByTypes')
              md-table-row(slot='md-table-row', slot-scope='{ item, index }' v-show="index % 3 == 2")
                md-table-cell {{ item.name }}
                md-table-cell {{ item.kidsCount }}
                md-table-cell {{ item.amount | currency(0) }}
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import moment from "moment";
import {
  StatsCard,
  ChartCard,
  // ProductCard,
  AnimatedNumber,
  GlobalSalesCard
  // GlobalSalesTable
} from "@/components";
import { http } from "@/resources";
import { Store } from "../../resources/interfaces";

@Component({
  components: {
    StatsCard,
    ChartCard,
    AnimatedNumber,
    // ProductCard,
    GlobalSalesCard
    // GlobalSalesTable,
  }
})
export default class Dashboard extends Vue {
  store: Store | null = null;
  date = moment().format("YYYY-MM-DD");
  dateEnd: null | string = null;
  today = moment().format("YYYY-MM-DD");
  queryStartTimeout: null | number = null;
  stats: {
    flowAmount: number;
    cardCouponAmount: number;
    customerCount: number;
    flowAmountByGateways: Record<string, number>;
    flowAmountByScenes: Record<string, number>;
    couponsCount: [];
    cardsCount: [];
    balanceCount: {};
    customersByType: Record<
      "card" | "coupon" | "guest",
      { adultsCount: number; kidsCount: number }
    >;
    dailyCustomers: {
      adultsCount: number;
      kidsCount: number;
      day: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    }[];
    dailyFlowAmount: { amount: number; day: 1 | 2 | 3 | 4 | 5 | 6 | 7 }[];
    dailyCardCouponPayment: {
      amount: number;
      day: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    }[];
  } = {
    flowAmount: 0,
    cardCouponAmount: 0,
    customerCount: 0,
    flowAmountByGateways: {},
    flowAmountByScenes: {},
    couponsCount: [],
    cardsCount: [],
    balanceCount: {},
    customersByType: {
      card: { adultsCount: 0, kidsCount: 0 },
      coupon: { adultsCount: 0, kidsCount: 0 },
      guest: { adultsCount: 0, kidsCount: 0 }
    },
    dailyCustomers: [],
    dailyFlowAmount: [],
    dailyCardCouponPayment: []
  };
  weekdayMapping = {
    1: "一",
    2: "二",
    3: "三",
    4: "四",
    5: "五",
    6: "六",
    7: "日"
  };

  get startAvailableDay() {
    if (this.$user.role === "admin") {
      return "";
    } else if (this.$user.role === "accountant") {
      return moment()
        .subtract(1, "month")
        .startOf("month")
        .format("YYYY-MM-DD");
    }
    return moment().format("YYYY-MM-DD");
  }

  addDate(add: number) {
    this.date = moment(this.date).add(add, "days").format("YYYY-MM-DD");
    if (this.dateEnd) {
      this.dateEnd = moment(this.dateEnd).add(add, "days").format("YYYY-MM-DD");
    }
  }

  selectStore(store: Store | null) {
    this.store = store;
  }

  disabledDates(date: Date) {
    if (this.$user.role === "admin") return false;
    else if (this.$user.role === "accountant") {
      const start = moment().subtract(1, "month").startOf("month").valueOf();
      return date.valueOf() < start;
    } else {
      const start = moment().startOf("day").valueOf();
      return date.valueOf() < start;
    }
  }

  updateStats() {
    if (this.queryStartTimeout) {
      window.clearTimeout(this.queryStartTimeout);
    }
    let url = `stats`;
    if (this.date) {
      url += `/${this.date}`;
    }
    if (this.dateEnd) {
      url += `/${this.dateEnd}`;
    }
    if (this.store) {
      url += `?store=${this.store.id}`;
    }
    this.queryStartTimeout = window.setTimeout(async () => {
      this.stats = (await http.get(url)).data;
      this.queryStartTimeout = null;
    }, 100);
  }

  get rangeText() {
    if (!this.dateEnd || this.dateEnd === this.date) {
      return "当日";
    } else {
      return "区间";
    }
  }

  get flowAmountByGatewayNames() {
    return Object.keys(this.stats.flowAmountByGateways)
      .map(gateway => ({
        name: this.$gatewayNames[gateway],
        amount: this.stats.flowAmountByGateways[gateway]
      }))
      .filter(p => p.amount);
  }

  get flowAmountBySceneNames() {
    return Object.keys(this.stats.flowAmountByScenes)
      .map(scene => ({
        name: this.$sceneNames[scene],
        amount: this.stats.flowAmountByScenes[scene]
      }))
      .filter(p => p.amount);
  }

  get dailyCustomersChart() {
    const values = this.stats.dailyCustomers.map(
      d => d.adultsCount + d.kidsCount
    );
    const labels = this.stats.dailyCustomers.map(
      d => this.weekdayMapping[d.day]
    );
    const high = Math.max(...values) * 1.05;
    const low = Math.min(...values) * 0.95;
    return {
      data: {
        labels: labels,
        series: [values]
      },
      options: {
        axisX: {
          showGrid: false
        },
        low,
        high,
        chartPadding: {
          top: 0,
          right: 5,
          bottom: 0,
          left: 0
        }
      }
    };
  }

  get dailyFlowChart() {
    const values = this.stats.dailyFlowAmount.map(d => d.amount);
    const labels = this.stats.dailyFlowAmount.map(
      d => this.weekdayMapping[d.day]
    );
    const high = Math.max(...values) * 1.05;
    const low = Math.min(...values) * 0.95;
    return {
      data: {
        labels: labels,
        series: [values]
      },
      options: {
        axisX: {
          showGrid: false
        },
        axisY: {
          labelInterpolationFnc: function (value: number) {
            return value / 10000 + "万";
          }
        },
        low,
        high,
        chartPadding: {
          top: 0,
          right: 5,
          bottom: 0,
          left: 10
        }
      }
    };
  }

  get dailyCardCouponPaymentChart() {
    const values = this.stats.dailyCardCouponPayment.map(d => d.amount);
    const labels = this.stats.dailyCardCouponPayment.map(
      d => this.weekdayMapping[d.day]
    );
    const high = Math.max(...values) * 1.05;
    const low = Math.min(...values) * 0.95;
    return {
      data: {
        labels: labels,
        series: [values]
      },
      options: {
        axisX: {
          showGrid: false
        },
        axisY: {
          labelInterpolationFnc: function (value: number) {
            return value / 10000 + "万";
          }
        },
        low,
        high,
        chartPadding: {
          top: 0,
          right: 5,
          bottom: 0,
          left: 10
        }
      }
    };
  }

  get cardCouponByTypes() {
    return [
      ...this.stats.couponsCount,
      ...this.stats.cardsCount,
      this.stats.balanceCount
    ];
  }

  created() {
    // console.log("[DASHBOARD] Created.");
  }

  mounted() {
    this.updateStats();
  }

  @Watch("date") onDateUpdate(val: string) {
    if (!val) {
      this.date = moment().format("YYYY-MM-DD");
    }
    this.updateStats();
    // console.log(this.stats);
  }

  @Watch("dateEnd") onDateEndUpdate() {
    this.updateStats();
  }

  @Watch("store") onStoreUpdate() {
    this.updateStats();
  }
}
</script>

<style scoped>
* >>> .md-card .md-card-content {
  box-sizing: content-box;
}

* >>> .md-table-cell {
  padding-top: 0;
  padding-bottom: 0;
}
.stats-date {
  display: flex;
  justify-content: flex-end;
}
</style>
