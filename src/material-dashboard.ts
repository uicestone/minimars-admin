// Notifications plugin. Used on Notifications page
import Notifications from "@/components/NotificationPlugin";
// Validation plugin used to validate forms
// import VeeValidate from "vee-validate";
// A plugin file where you could register global components used across the app
import GlobalComponents from "./globalComponents";
// A plugin file where you could register global directives
import GlobalDirectives from "./globalDirectives";
// Sidebar on the right. Used as a local plugin in DashboardLayout.vue
import SideBar from "./components/SidebarPlugin";
// Tabs plugin. Used on Panels page.

// @ts-ignore
import VueMaterial from "vue-material";

// asset imports
import "vue-material/dist/vue-material.min.css";
import "./assets/scss/material-dashboard.scss";
import "./assets/css/demo.css";
import { VueConstructor } from "vue/types/vue";

// library auto imports
// import "es6-promise/auto";

export default {
  install(Vue: VueConstructor) {
    Vue.use(GlobalComponents);
    Vue.use(GlobalDirectives);
    Vue.use(VueMaterial, {
      locale: {
        startYear: 1900,
        endYear: 2099,
        dateFormat: "yyyy-MM-dd",
        days: [
          "星期日",
          "星期一",
          "星期二",
          "星期三",
          "星期四",
          "星期五",
          "星期六"
        ],
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
      }
    });
    Vue.use(SideBar);
    Vue.use(Notifications);
    // Vue.use(VeeValidate, { fieldsBagName: "veeFields" });
  }
};
