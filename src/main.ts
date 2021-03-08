import Vue from "vue";
import DashboardPlugin from "./material-dashboard";
import App from "./App.vue";

// router setup
import router from "./routes/router";
// plugin setup
Vue.use(DashboardPlugin);

(Vue as any).material.locale = {
  startYear: 1900,
  endYear: 2099,
  dateFormat: "yyyy-MM-dd",
  days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
  shortDays: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
  shorterDays: ["日", "一", "二", "三", "四", "五", "六"],
  months: [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月"
  ],
  shortMonths: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月"
  ],
  shorterMonths: [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12"
  ],
  firstDayOfAWeek: 1
};

new Vue({
  el: "#app",
  render: (h) => h(App),
  router,
  data: {
    config: { coupons: [], cardTypes: [], stores: [] }
  }
});
