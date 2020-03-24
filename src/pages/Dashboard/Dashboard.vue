<template lang="pug">
.md-layout
  .md-layout-item.md-size-100.md-layout.md-alignment-center-right
    .md-layout-item.md-size-20.md-xsmall-size-100.stats-date
      md-datepicker(v-model='date', :md-model-type='String', md-immediately='')
    .md-layout-item.md-size-20.md-xsmall-size-100.stats-date(style='display:flex;justify-content:space-between')
      md-button.md-info(style='flex:0', @click='addDate(-1)')
        span.md-label
          md-icon keyboard_arrow_left
        | 前一天
      md-button.md-info(style='flex:0', @click='addDate(1)', :disabled='date >= today')
        | 后一天
        md-icon keyboard_arrow_right
    .md-layout-item.md-size-10.md-xsmall-size-100
      md-button.md-info(:href="$http.options.root + 'daily-report/' + date", style='width:100%') 下载日报表
  .md-layout-item.md-medium-size-50.md-xsmall-size-100.md-size-25
    stats-card(header-color='primary')
      template(slot='header')
        .card-icon
          md-icon playlist_add_check
        p.category 当日门票收入
        h3.title
          | ¥
          animated-number(:value='stats.paidAmount - stats.socksAmount')
      template(slot='footer')
        .stats
          md-icon bookmark_border
          | 含现场支付、余额消费和次卡核销
  .md-layout-item.md-medium-size-50.md-xsmall-size-100.md-size-25
    stats-card(header-color='warning')
      template(slot='header')
        .card-icon
          md-icon payment
        p.category 当日充值收入
        h3.title
          | ¥ 
          animated-number(:value='stats.depositAmount')
      template(slot='footer')
        .stats
          md-icon bookmark_border
          | 其中次卡 ¥
          animated-number(:value='stats.codeDepositAmount')
  .md-layout-item.md-medium-size-50.md-xsmall-size-100.md-size-25
    stats-card(header-color='green')
      template(slot='header')
        .card-icon
          md-icon store
        p.category 当日入场人数
        h3.title
          animated-number(:value='stats.customerCount')
      template(slot='footer')
        .stats
          md-icon bookmark_border
          | 其中儿童人数
          animated-number(:value='stats.kidsCount')
  .md-layout-item.md-medium-size-50.md-xsmall-size-100.md-size-25
    stats-card(header-color='grey')
      template(slot='header')
        .card-icon
          i.fas.fa-socks
        p.category 当日袜子发放
        h3.title
          animated-number(:value='stats.socksCount')
          | 双
      template(slot='footer')
        .stats
          md-icon bookmark_border
          | 当日累计袜子发放量
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
        h4.title 每日人数
        p.category
          | 最近一周每日累计入场人数
      template(slot='footer')
        .stats
          md-icon access_time
          | 实时
  .md-layout-item.md-medium-size-100.md-xsmall-size-100.md-size-33
    chart-card(header-animation='false', :chart-data='dailyBookingPaymentChart.data', :chart-options='dailyBookingPaymentChart.options', chart-type='Line', chart-inside-header='', background-color='green')
      md-button.md-simple.md-info.md-just-icon(slot='first-button')
        md-icon refresh
        md-tooltip(md-direction='bottom') Refresh
      md-button.md-simple.md-just-icon(slot='second-button')
        md-icon edit
        md-tooltip(md-direction='bottom') Change Date
      template(slot='content')
        h4.title 每日门票收入
        p.category
          | 最近一周每日门票收入（含余额和次卡核销）
      template(slot='footer')
        .stats
          md-icon access_time
          | 实时
  .md-layout-item.md-medium-size-100.md-xsmall-size-100.md-size-33
    chart-card(header-animation='false', :chart-data='dailyDepositPaymentChart.data', :chart-options='dailyDepositPaymentChart.options', chart-type='Line', chart-inside-header='', background-color='blue')
      md-button.md-simple.md-info.md-just-icon(slot='first-button')
        md-icon refresh
        md-tooltip(md-direction='bottom') Refresh
      md-button.md-simple.md-just-icon(slot='second-button')
        md-icon edit
        md-tooltip(md-direction='bottom') Change Date
      template(slot='content')
        h4.title 每日充值收入
        p.category
          | 最近一周每日充值和次卡销售收入
      template(slot='footer')
        .stats
          md-icon access_time
          | 实时
  .md-layout-item.md-size-33
    global-sales-card(header-color='primary')
      template(slot='header')
        .card-icon
          md-icon language
        h4.title 当日各收款方式收款额
      template(slot='content')
        .md-layout
          .md-layout-item.md-size-100
            md-table(v-model='paidAmountByGatewayNames')
              md-table-row(slot='md-table-row', slot-scope='{ item }')
                md-table-cell {{ item.name }}
                md-table-cell {{ item.amount | currency }}
  .md-layout-item.md-size-33
    global-sales-card(header-color='green')
      template(slot='header')
        .card-icon
          md-icon language
        h4.title 当日各优惠核销人数和券值
      template(slot='content')
        .md-layout
          .md-layout-item.md-size-100
            md-table(v-model='stats.couponsCount')
              md-table-row(slot='md-table-row', slot-scope='{ item }')
                md-table-cell {{ item.name }}
                md-table-cell {{ item.count }}
                md-table-cell {{ item.amount | currency }}
  .md-layout-item.md-size-33
    global-sales-card(header-color='warning')
      template(slot='header')
        .card-icon
          md-icon language
        h4.title 当日各卡种充值人数和金额
      template(slot='content')
        .md-layout
          .md-layout-item.md-size-100
            md-table(v-model='stats.depositsCount')
              md-table-row(slot='md-table-row', slot-scope='{ item }')
                md-table-cell {{ item.desc }}
                md-table-cell {{ item.count }}
                md-table-cell
                  | {{ (item.price * item.count) | currency }}
</template>

<script>
import moment from "moment";
// import AsyncWorldMap from "@/components/WorldMap/AsyncWorldMap.vue";
import {
  StatsCard,
  ChartCard,
  // ProductCard,
  AnimatedNumber,
  GlobalSalesCard
  // GlobalSalesTable
} from "@/components";

export default {
  components: {
    StatsCard,
    ChartCard,
    AnimatedNumber,
    // ProductCard,
    GlobalSalesCard
    // GlobalSalesTable,
    // AsyncWorldMap
  },
  data() {
    return {
      date: moment().format("YYYY-MM-DD"),
      today: moment().format("YYYY-MM-DD"),
      stats: {
        checkedInCount: null,
        dueCount: null,
        customerCount: null,
        kidsCount: null,
        paidAmount: null,
        depositAmount: null,
        codeDepositAmount: null,
        socksCount: null,
        paidAmountByGateways: {},
        couponsCount: [],
        codesCount: [],
        depositsCount: [],
        dailyCustomers: [],
        dailyBookingPayment: [],
        dailyDepositPayment: []
      },
      weekdayMapping: {
        1: "一",
        2: "二",
        3: "三",
        4: "四",
        5: "五",
        6: "六",
        7: "日"
      }
    };
  },
  methods: {
    addDate(add) {
      this.date = moment(this.date)
        .add(add, "days")
        .format("YYYY-MM-DD");
    },
    async updateStats() {
      this.stats = (
        await this.$http.get(`stats${this.date ? "/" + this.date : ""}`)
      ).body;
    }
  },
  computed: {
    paidAmountByGatewayNames() {
      return Object.keys(this.stats.paidAmountByGateways).map(gateway => ({
        name: this.$gatewayNames[gateway],
        amount: this.stats.paidAmountByGateways[gateway]
      }));
    },
    // dailyCustomersChart() {
    //   return {
    //     data: {
    //       labels: ["M", "T", "W", "T", "F", "S", "S"],
    //       series: [[12, 17, 7, 17, 23, 18, 38]]
    //     },
    //     options: {
    //       lineSmooth: this.$Chartist.Interpolation.cardinal({
    //         tension: 0
    //       }),
    //       low: 0,
    //       high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
    //       chartPadding: {
    //         top: 0,
    //         right: 0,
    //         bottom: 0,
    //         left: 0
    //       }
    //     }
    //   };
    // },
    dailyCustomersChart() {
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
    },
    dailyBookingPaymentChart() {
      const values = this.stats.dailyBookingPayment.map(d => d.amount);
      const labels = this.stats.dailyBookingPayment.map(
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
    },
    dailyDepositPaymentChart() {
      const values = this.stats.dailyDepositPayment.map(d => d.amount);
      const labels = this.stats.dailyDepositPayment.map(
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
  },
  mounted() {
    this.updateStats();
  },
  watch: {
    date(val) {
      if (!val) {
        this.date = moment().format("YYYY-MM-DD");
      }
      this.updateStats();
      // console.log(this.stats);
    }
  }
};
</script>
