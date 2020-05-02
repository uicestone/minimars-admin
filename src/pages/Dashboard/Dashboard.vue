<template lang="pug">
.md-layout
  .md-layout-item.md-size-100.md-layout.md-alignment-center-right
    .md-layout-item.md-size-20.md-xsmall-size-100.stats-date
      md-datepicker(v-model='date', :md-model-type='String', md-immediately)
    .md-layout-item.md-size-20.md-xsmall-size-100.stats-date(style='display:flex;justify-content:space-between')
      md-button.md-info(style='flex:0', @click='addDate(-1)')
        span.md-label
          md-icon keyboard_arrow_left
        | 前一天
      md-button.md-info(style='flex:0', @click='addDate(1)', :disabled='date >= today')
        | 后一天
        md-icon keyboard_arrow_right
    //- .md-layout-item.md-size-10.md-xsmall-size-100
    //-   md-button.md-info(:href="$http.options.root + 'daily-report/' + date", style='width:100%') 下载日报表
  .md-layout-item.md-size-33.md-xsmall-size-100
    stats-card(header-color='blue')
      template(slot='header')
        .card-icon
          md-icon playlist_add_check
        p.category 当日累计资金流水（合计）
        h3.title
          | ¥
          animated-number(:value='stats.flowAmount')
      template(slot='footer')
        .stats
          md-icon bookmark_border
          | 实时
  .md-layout-item.md-size-33.md-xsmall-size-100
    stats-card(header-color='green')
      template(slot='header')
        .card-icon
          md-icon payment
        p.category 当日核销卡券累计值（合计）
        h3.title
          | ¥ 
          animated-number(:value='stats.cardCouponAmount')
      template(slot='footer')
        .stats
          md-icon bookmark_border
          | 实时
  .md-layout-item.md-size-33.md-xsmall-size-100
    stats-card(header-color='rose')
      template(slot='header')
        .card-icon
          md-icon store
        p.category 当日累计入场人数
        h3.title
          animated-number(:value='stats.customerCount')
      template(slot='footer')
        .stats
          md-icon bookmark_border
          | 实时
  .md-layout-item.md-medium-size-100.md-xsmall-size-100.md-size-33
    chart-card(header-animation='false', :chart-data='dailyFlowChart.data', :chart-options='dailyFlowChart.options', chart-type='Line', chart-inside-header='', background-color='blue')
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
    chart-card(header-animation='false', :chart-data='dailyCardCouponPaymentChart.data', :chart-options='dailyCardCouponPaymentChart.options', chart-type='Line', chart-inside-header='', background-color='green')
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
    chart-card(header-animation='false', :chart-data='dailyCustomersChart.data', :chart-options='dailyCustomersChart.options', chart-type='Line', chart-inside-header='', background-color='rose')
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
  .md-layout-item.md-size-25.md-xsmall-size-100
    global-sales-card(header-color='blue')
      template(slot='header')
        .card-icon
          md-icon language
        h4.title 当日流水分类汇总
      template(slot='content')
        .md-layout
          .md-layout-item.md-size-100
            md-table(v-model='flowAmountByGatewayNames')
              md-table-row(slot='md-table-row', slot-scope='{ item }')
                md-table-cell {{ item.name }}
                md-table-cell {{ item.amount | currency }}
  .md-layout-item.md-size-50.md-xsmall-size-100
    global-sales-card(header-color='green')
      template(slot='header')
        .card-icon
          md-icon language
        h4.title 当日核销卡券分类汇总
      template(slot='content')
        .md-layout
          .md-layout-item.md-size-100.md-layout
            md-table.md-layout-item(:value='stats.couponsCount.concat(stats.cardsCount)')
              md-table-row(slot='md-table-row', slot-scope='{ item, index }' v-if="index % 2 == 0")
                md-table-cell {{ item.name }}
                md-table-cell {{ item.kidsCount }}
                md-table-cell {{ item.amount | currency }}
            md-table.md-layout-item(:value='stats.couponsCount.concat(stats.cardsCount)')
              md-table-row(slot='md-table-row', slot-scope='{ item, index }' v-if="index % 2 == 1")
                md-table-cell {{ item.name }}
                md-table-cell {{ item.kidsCount }}
                md-table-cell {{ item.amount | currency }}
  .md-layout-item.md-size-25.md-xsmall-size-100
    global-sales-card(header-color='rose')
      template(slot='header')
        .card-icon
          md-icon language
        h4.title 当日入场人数分类汇总
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
  date = moment().format("YYYY-MM-DD");
  today = moment().format("YYYY-MM-DD");
  stats: {
    flowAmount: number;
    cardCouponAmount: number;
    customerCount: number;
    flowAmountByGateways: Record<string, number>;
    couponsCount: [];
    cardsCount: [];
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
    couponsCount: [],
    cardsCount: [],
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

  addDate(add: number) {
    this.date = moment(this.date)
      .add(add, "days")
      .format("YYYY-MM-DD");
  }

  async updateStats() {
    this.stats = (
      await http.get(`stats${this.date ? "/" + this.date : ""}`)
    ).data;
  }

  get flowAmountByGatewayNames() {
    return Object.keys(this.stats.flowAmountByGateways)
      .map(gateway => ({
        name: this.$gatewayNames[gateway],
        amount: this.stats.flowAmountByGateways[gateway]
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
</style>
