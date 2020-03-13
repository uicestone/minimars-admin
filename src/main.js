import Vue from "vue";
import VueRouter from "vue-router";
import VueResource from "vue-resource";
import moment from "moment";
import DashboardPlugin from "./material-dashboard";

// Plugins
import App from "./App.vue";
import Chartist from "chartist";

// router setup
import routes from "./routes/routes";

// plugin setup
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(DashboardPlugin);

moment.locale("zh-cn");

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

// global library setup
Object.defineProperty(Vue.prototype, "$Chartist", {
  get() {
    return this.$root.Chartist;
  }
});

Object.defineProperty(Vue.prototype, "$isLoading", {
  get() {
    return this.$root.isLoading;
  },
  set(val) {
    this.$root.isLoading = val;
  }
});

const config = {}; // global config from api

Object.defineProperty(Vue.prototype, "$config", {
  get() {
    return config;
  },
  set(val) {
    Object.assign(config, val);
  }
});

Object.defineProperty(Vue.prototype, "$user", {
  get() {
    this.$root.user.can = function(cap) {
      const roleCaps = {
        admin: ".*",
        manager: "view-(booking|user|code)"
      };
      return this.role && cap.match(`^${roleCaps[this.role]}$`);
    };

    return this.$root.user;
  },
  set(val) {
    this.$root.user = val;
  }
});

Object.defineProperty(Vue.prototype, "$bookingTypeNames", {
  get() {
    return {
      play: "计时自由探险",
      party: "派对和聚会"
    };
  }
});

Object.defineProperty(Vue.prototype, "$bookingStatusNames", {
  get() {
    return {
      PENDING: "待付款",
      BOOKED: "已确认",
      IN_SERVICE: "已入场",
      PENDING_REFUND: "待退款",
      FINISHED: "已完成",
      CANCELED: "已取消"
    };
  }
});

Object.defineProperty(Vue.prototype, "$gatewayNames", {
  get() {
    return {
      credit: "充值余额",
      code: "次卡券码",
      coupon: "团购优惠券",
      scan: "现场扫码",
      card: "现场刷卡",
      cash: "现场现金",
      wechatpay: "微信小程序",
      alipay: "支付宝",
      unionpay: "银联"
    };
  }
});

Vue.filter("date", (value, format) => {
  if (!value) {
    return null;
  }
  return moment(value).format(format || "YYYY-MM-DD HH:mm");
});

Vue.filter("duration", value => {
  return moment.duration(value).humanize();
});

Vue.filter("round", (value, digits) => {
  if (!value) {
    return (0).toFixed(digits);
  }
  return value.toFixed(digits || 0);
});

Vue.filter("bookingTypeName", value => {
  return Vue.prototype.$bookingTypeNames[value];
});

Vue.filter("bookingStatusName", value => {
  return Vue.prototype.$bookingStatusNames[value];
});

Vue.filter("currency", value => {
  if (value === undefined || value === null) return "-";
  return "¥ " + (+value).toFixed(2);
});

Vue.filter("paymentGatewayName", gateway => {
  return Vue.prototype.$gatewayNames[gateway];
});

Vue.filter("couponName", couponSlug => {
  const coupons = Vue.prototype.$config.coupons;
  if (!coupons) {
    return;
  }
  const coupon = coupons.find(c => c.slug === couponSlug);
  if (coupon) {
    return coupon.name;
  }
  return "-";
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App),
  router,
  data: {
    Chartist: Chartist,
    user: {},
    isLoading: false
  }
});
