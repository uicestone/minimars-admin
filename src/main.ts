import Vue from "vue";
import VueRouter from "vue-router";
import moment from "moment";
import DashboardPlugin from "./material-dashboard";

// Plugins
import App from "./App.vue";
// @ts-ignore
import Chartist from "chartist";

// router setup
import routes from "./routes/routes";

// plugin setup
Vue.use(VueRouter);
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
    this.$root.user.can = function(cap: string) {
      const roleCaps: Record<string, string> = {
        admin: ".*",
        manager: "view-(booking|user)"
      };
      return this.role && cap.match(new RegExp(`^${roleCaps[this.role]}$`));
    };

    return this.$root.user;
  },
  set(val) {
    this.$root.user = val;
  }
});

Object.defineProperty(Vue.prototype, "$stores", {
  get() {
    return this.$root.stores || [];
  },
  set(val) {
    this.$root.stores = val;
  }
});

Object.defineProperty(Vue.prototype, "$cardTypes", {
  get() {
    return this.$root.cardTypes || [];
  },
  set(val) {
    this.$root.cardTypes = val;
  }
});

Object.defineProperty(Vue.prototype, "$bookingTypeNames", {
  get() {
    return {
      play: "门票",
      // party: "派对",
      event: "活动",
      gift: "礼品兑换",
      food: "餐饮消费"
    };
  }
});

Object.defineProperty(Vue.prototype, "$bookingStatusNames", {
  get() {
    return {
      pending: "待付款",
      booked: "已确认",
      // eslint-disable-next-line
      in_service: "已入场",
      // eslint-disable-next-line
      pending_refund: "待退款",
      finished: "已完成",
      canceled: "已取消"
    };
  }
});

Object.defineProperty(Vue.prototype, "$cardTypeNames", {
  get() {
    return {
      times: "次卡",
      period: "时效卡",
      balance: "储值卡"
    };
  }
});

Object.defineProperty(Vue.prototype, "$cardStatusNames", {
  get() {
    return {
      pending: "待付款",
      valid: "待激活",
      activated: "已激活",
      expired: "已失效",
      cancel: "已取消"
    };
  }
});

Object.defineProperty(Vue.prototype, "$gatewayNames", {
  get() {
    return {
      balance: "账户余额",
      points: "账户积分",
      coupon: "团购优惠券",
      scan: "现场扫码",
      card: "会员卡",
      cash: "现金刷卡",
      wechatpay: "微信小程序",
      alipay: "支付宝",
      unionpay: "银联"
    };
  }
});

Object.defineProperty(Vue.prototype, "$noop", {
  get() {
    return () => {};
  }
});

Vue.filter("date", (value: any, format: string) => {
  if (!value) {
    return null;
  }
  return moment(value).format(format || "YYYY-MM-DD HH:mm");
});

Vue.filter("duration", (value: any) => {
  return moment.duration(value).humanize();
});

Vue.filter("round", (value: any, digits: number) => {
  if (!value) {
    return (0).toFixed(digits);
  }
  return value.toFixed(digits || 0);
});

Vue.filter("bookingTypeName", (value: any) => {
  return Vue.prototype.$bookingTypeNames[value];
});

Vue.filter("bookingStatusName", (value: any) => {
  return Vue.prototype.$bookingStatusNames[value];
});

Vue.filter("cardTypeName", (value: any) => {
  return Vue.prototype.$cardTypeNames[value];
});

Vue.filter("cardStatusName", (value: any) => {
  return Vue.prototype.$cardStatusNames[value];
});

Vue.filter("currency", (value: any) => {
  if (value === undefined || value === null) return "-";
  return "¥ " + (+value).toFixed(2);
});

Vue.filter("paymentGatewayName", (gateway: any) => {
  return Vue.prototype.$gatewayNames[gateway];
});

Vue.filter("couponName", (couponSlug: any) => {
  const coupons = Vue.prototype.$config.coupons;
  if (!coupons) {
    return;
  }
  const coupon = coupons.find((c: { slug: string }) => c.slug === couponSlug);
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