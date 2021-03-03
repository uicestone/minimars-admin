<template lang="pug">
.md-layout
  .md-layout-item.md-size-100.md-layout.md-alignment-center-right
    .md-layout-item.md-size-30.md-xsmall-size-100.stats-date
      md-datepicker(v-model='date', :md-model-type='String', md-immediately style="width:140px")
        label 开始日期
      md-datepicker.ml-2(v-model='dateEnd', :md-model-type='String', md-immediately style="width:140px")
        label 结束日期
    .md-layout-item.md-xsmall-size-100(style='display:flex;justify-content:space-between;width:330px;flex:0')
      md-menu.md-button(v-if="$user.role==='admin'")
        md-button.md-info(md-menu-trigger) {{ store ? store.name : '全部门店' }}
        md-menu-content
          md-menu-item(@click="selectStore(false)") 全部门店
          md-menu-item(v-for="store in $stores" :key="store.id" @click="selectStore(store)") {{ store.name }}
      md-button.md-info(style='flex:0', @click='addDate(-1)')
        span.md-label
          md-icon keyboard_arrow_left
        | 前一天
      md-button.md-info(style='flex:0', @click='addDate(1)', :disabled='date >= today')
        | 后一天
        md-icon keyboard_arrow_right
    //- .md-layout-item.md-size-10.md-xsmall-size-100
    //-   md-button.md-info(:href="$http.options.root + 'daily-report/' + date", style='width:100%') 下载日报表
  .md-layout-item.md-size-40.md-xsmall-size-100
    stats-card(header-color='primary')
      template(slot='header')
        .card-icon
          md-icon payment
        p.category {{rangeText}}资金流水
        h3.title
          | ¥ 
          animated-number(:value='stats.flowAmount')
      template(slot='footer')
        .stats
          md-icon bookmark_border
          | 实时，包含各项现金类收款
    chart-card(header-animation='false', :chart-data='dailyFlowChart.data', :chart-options='dailyFlowChart.options', chart-type='Line', chart-inside-header, background-color='primary')
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
    global-sales-card(header-color='primary')
      template(slot='header')
        .card-icon
          md-icon sort
        h4.title {{rangeText}}门店资金流水排名
      template(slot='content')
        .md-layout
          .md-layout-item.md-size-100
            md-table(v-model='flowAmountByGatewayNames')
              md-table-row(slot='md-table-row', slot-scope='{ item }')
                md-table-cell {{ item.name }}
                md-table-cell {{ item.amount | currency(0) }}
  .md-layout-item.md-size-60.md-xsmall-size-100.md-layout
    .pl-0.md-layout-item.md-size-50.md-xsmall-size-100
      stats-card(header-color='warning')
        template(slot='header')
          .card-icon
            md-icon credit_score
          p.category {{rangeText}}票务销售额
          h3.title
            | ¥ 
            animated-number(:value='stats.cardCouponAmount')
        template(slot='footer')
          .stats
            md-icon bookmark_border
            | 实时
      stats-card(header-color='green')
        template(slot='header')
          .card-icon
            md-icon fastfood
          p.category {{rangeText}}餐饮销售额
          h3.title
            | ¥ 
            animated-number(:value='stats.cardCouponAmount')
        template(slot='footer')
          .stats
            md-icon bookmark_border
            | 实时
      stats-card(header-color='rose')
        template(slot='header')
          .card-icon
            md-icon shopping_cart
          p.category {{rangeText}}电商销售额
          h3.title
            | ¥ 
            animated-number(:value='stats.cardCouponAmount')
        template(slot='footer')
          .stats
            md-icon bookmark_border
            | 实时
    .pr-0.md-layout-item.md-size-50.md-xsmall-size-100
      stats-card(header-color='warning')
        template(slot='header')
          .card-icon
            md-icon people
          p.category {{rangeText}}入场人数
          h3.title
            animated-number(:value='stats.customerCount')
        template(slot='footer')
          .stats
            md-icon bookmark_border
            | 实时
      stats-card(header-color='green')
        template(slot='header')
          .card-icon
            md-icon microwave
          p.category {{rangeText}}餐饮订单数
          h3.title
            | ¥ 
            animated-number(:value='stats.cardCouponAmount')
        template(slot='footer')
          .stats
            md-icon bookmark_border
            | 实时
      stats-card(header-color='rose')
        template(slot='header')
          .card-icon
            md-icon local_shipping
          p.category {{rangeText}}电商订单数
          h3.title
            | ¥ 
            animated-number(:value='stats.cardCouponAmount')
        template(slot='footer')
          .stats
            md-icon bookmark_border
            | 实时
    .md-layout-item.md-size-100(style="display:flex;justify-content:center")
      doughnut-chart(:chart-data="sceneFlowPieChart.data")
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
import DoughnutChart from "@/components/Charts/DoughnutChart";

@Component({
  components: {
    StatsCard,
    ChartCard,
    AnimatedNumber,
    // ProductCard,
    GlobalSalesCard,
    // GlobalSalesTable,
    DoughnutChart
  }
})
export default class BossBoard extends Vue {
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

  addDate(add: number) {
    this.date = moment(this.date).add(add, "days").format("YYYY-MM-DD");
    if (this.dateEnd) {
      this.dateEnd = moment(this.dateEnd).add(add, "days").format("YYYY-MM-DD");
    }
  }

  selectStore(store: Store | null) {
    this.store = store;
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

  get sceneFlowPieChart() {
    const values = Object.values(this.stats.flowAmountByScenes);
    const labels = Object.keys(this.stats.flowAmountByScenes).map(
      key => this.$sceneNames[key]
    );
    const sceneColor = {
      play: "#1565c0",
      food: "#4caf50",
      gift: "#e91e63",
      card: "#fb8c00"
    };
    return {
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: Object.keys(this.stats.flowAmountByScenes).map(
              // @ts-ignore
              key => sceneColor[key]
            )
          }
        ]
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

<style lang="scss" scoped>
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
.pie /deep/ {
  .md-card-header {
    min-height: 20px !important;
  }
  .md-card-content {
    min-height: 300px !important;
    .ct-chart {
      height: 100%;
    }
  }
}
</style>
