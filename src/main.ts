import Vue from "vue";
import VueRouter from "vue-router";
import DashboardPlugin from "./material-dashboard";
import CommonFiltersPlugin from "./helpers/CommonFiltersPlugin";
import GlobalLibrariesPlugins from "./helpers/GlobalLibrariesPlugin";
import VueClipboard from "vue-clipboard2";

// Plugins
import App from "./App.vue";

// router setup
import routes from "./routes/routes";
import loadConfig from "./helpers/loadConfig";

// plugin setup
Vue.use(VueRouter);
Vue.use(VueClipboard);
Vue.use(DashboardPlugin);
Vue.use(CommonFiltersPlugin);
Vue.use(GlobalLibrariesPlugins);

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

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  },
  linkExactActiveClass: "nav-item active"
});

loadConfig().then(config => {
  /* eslint-disable no-new */
  new Vue({
    el: "#app",
    render: h => h(App),
    router,
    data: {
      config
    }
  });
});
