<template lang="pug">
.md-layout
  .md-layout-item.md-size-100.md-layout.md-alignment-center-right
    .md-layout-item.md-size-30.md-xsmall-size-100.stats-date
      md-datepicker(v-model='date', :md-model-type='String', md-immediately style="width:140px")
        label 开始日期
      md-datepicker.ml-2(v-model='dateEnd', :md-model-type='String', md-immediately style="width:140px")
        label 结束日期
    .md-layout-item.md-xsmall-size-100(style='display:flex;justify-content:space-between;width:330px;flex:0')
      md-menu.md-button
        md-button.md-period(md-menu-trigger) {{ store ? store.name : '全部门店' }}
        md-menu-content
          md-menu-item(@click="selectStore(false)") 全部门店
          md-menu-item(v-for="store in $stores" :key="store.id" @click="selectStore(store)") {{ store.name }}
      md-button.md-period(style='flex:0', @click='addDate(-1)')
        span.md-label
          md-icon keyboard_arrow_left
        | 前一天
      md-button.md-period(style='flex:0', @click='addDate(1)', :disabled='date >= today')
        | 后一天
        md-icon keyboard_arrow_right
    //- .md-layout-item.md-size-10.md-xsmall-size-100
    //-   md-button.md-info(:href="$http.options.root + 'daily-report/' + date", style='width:100%') 下载日报表
  .md-layout-item.md-size-45.md-xsmall-size-100
    stats-card(header-color='period')
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
          | 各项收款和
    chart-card.mt-8.two-card-height(header-animation='false', :chart-data='dailyFlowChart.data', :chart-options='dailyFlowChart.options', chart-type='Line', chart-inside-header, background-color='period')
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
    global-sales-card.mt-8(header-color='period')
      template(slot='header')
        .card-icon
          md-icon sort
        h4.title {{rangeText}}门店资金流水排名
      template(slot='content')
        .md-layout
          .md-layout-item.md-size-100
            md-table(v-model='flowAmountByStoreNames')
              md-table-row(slot='md-table-row', slot-scope='{ item }')
                md-table-cell {{ item.name }}
                md-table-cell {{ item.amount | currency(0) }}
  .md-layout-item.md-size-55.md-xsmall-size-100.md-layout
    .pl-0.md-layout-item.md-size-50.md-xsmall-size-50
      stats-card(header-color='play')
        template(slot='header')
          .card-icon
            md-icon credit_score
          p.category {{rangeText}}票务销售额
          h3.title
            | ¥ 
            animated-number(:value='playFlowAmount')
        template(slot='footer')
          .stats
            md-icon bookmark_border
            | 票务收款
      stats-card.mt-8(header-color='food')
        template(slot='header')
          .card-icon
            md-icon fastfood
          p.category {{rangeText}}餐饮销售额
          h3.title
            | ¥ 
            animated-number(:value='stats.flowAmountByScenes.food||0')
        template(slot='footer')
          .stats
            md-icon bookmark_border
            | 餐饮收款
      stats-card.mt-8(header-color='mall')
        template(slot='header')
          .card-icon
            md-icon shopping_cart
          p.category {{rangeText}}电商销售额
          h3.title
            | ¥ 
            animated-number(:value='stats.flowAmountByScenes.mall||0')
        template(slot='footer')
          .stats
            md-icon bookmark_border
            | 电商收款
    .pr-0.md-layout-item.md-size-50.md-xsmall-size-50
      stats-card(header-color='play')
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
      stats-card.mt-8(header-color='food')
        template(slot='header')
          .card-icon
            md-icon microwave
          p.category {{rangeText}}餐饮订单数
          h3.title
            animated-number(:value='stats.foodBookingsCount')
        template(slot='footer')
          .stats
            md-icon bookmark_border
            | 实时
      stats-card.mt-8(header-color='mall')
        template(slot='header')
          .card-icon
            md-icon local_shipping
          p.category {{rangeText}}电商订单数
          h3.title
            animated-number(:value='stats.mallBookingsCount')
        template(slot='footer')
          .stats
            md-icon bookmark_border
            | 实时
    .md-layout-item.md-size-100.px-0(style="display:flex;justify-content:center")
      doughnut-chart(:chart-data="sceneFlowPieChart.data" style="min-height:300px")
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
    playAmount: number;
    foodAmount: number;
    mallAmount: number;
    customerCount: number;
    foodBookingsCount: number;
    mallBookingsCount: number;
    dailyFlowAmount: { amount: number; day: 1 | 2 | 3 | 4 | 5 | 6 | 7 }[];
    flowAmountByScenes: Record<string, number>;
    flowAmountByStores: Record<string, number>;
  } = {
    flowAmount: 0,
    playAmount: 0,
    foodAmount: 0,
    mallAmount: 0,
    customerCount: 0,
    foodBookingsCount: 0,
    mallBookingsCount: 0,
    dailyFlowAmount: [],
    flowAmountByScenes: {},
    flowAmountByStores: {}
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

  get playFlowAmount() {
    return (
      (this.stats.flowAmountByScenes.play || 0) +
      (this.stats.flowAmountByScenes.card || 0) +
      (this.stats.flowAmountByScenes.balance || 0) +
      (this.stats.flowAmountByScenes.period || 0)
    );
  }

  get flowAmountBySceneNames() {
    return Object.keys(this.stats.flowAmountByScenes)
      .map(scene => ({
        name: this.$sceneNames[scene],
        amount: this.stats.flowAmountByScenes[scene]
      }))
      .filter(p => p.amount);
  }

  get flowAmountByStoreNames() {
    return [
      ...this.$stores.map(s => ({
        name: s.name,
        amount: this.stats.flowAmountByStores[s.id]
      }))
    ].sort((a, b) => b.amount - a.amount);
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
      play: "#C2ACE5",
      food: "#FFDEC0",
      gift: "#FFCCE9",
      mall: "#A8FC90",
      event: "#FFDD7D",
      balance: "#D1D1D1",
      card: "#97F2E1",
      period: "#93C4F9"
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
.two-card-height /deep/ {
  .md-card-header {
    min-height: 210px !important;
  }
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

@media (max-width: 400px) {
  .md-layout-item {
    padding-left: 8px;
    padding-right: 8px;
  }
  .md-card /deep/ {
    margin-bottom: 0px;
    .category {
      clear: left;
      text-align: center;
    }
    h3 {
      // margin-top: 10px !important;
      // font-size: rem;
      text-align: center;
    }
    .md-card-header.md-card-header-icon i {
      width: 28px;
      height: 28px;
      line-height: 28px;
      font-size: 24px !important;
    }
    .md-card-header + .md-card-actions {
      margin-top: 0;
    }
  }
}
</style>
