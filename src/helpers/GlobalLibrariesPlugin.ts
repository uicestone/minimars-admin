import { VueConstructor } from "vue";

const GlobalLibrariesPlugins = {
  install(Vue: VueConstructor) {
    // global library setup
    Object.defineProperty(Vue.prototype, "$electron", {
      get() {
        //@ts-ignore
        return window.remote;
      }
    });

    Object.defineProperty(Vue.prototype, "$Chartist", {
      get() {
        return this.$root.Chartist;
      }
    });

    Object.defineProperty(Vue.prototype, "$pendingRequests", {
      get() {
        if (!this.$root.pendingRequests) this.$root.pendingRequests = 0;
        return this.$root.pendingRequests;
      },
      set(val) {
        this.$root.pendingRequests = val;
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
            manager: "view-(dashboard|booking|user|payment)",
            accountant: "view-(dashboard|payments)"
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
        if (!this.$root.stores) this.$root.stores = [];
        return this.$root.stores;
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

    Object.defineProperty(Vue.prototype, "$coupons", {
      get() {
        return this.$root.coupons || [];
      },
      set(val) {
        this.$root.coupons = val;
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
          pending_refund: "已冻结",
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
          dianping: "点评POS",
          shouqianba: "收钱吧",
          wechatpay: "微信小程序",
          pos: "银行卡",
          cash: "现金",
          card: "会员卡",
          coupon: "团购优惠券",
          balance: "账户余额",
          points: "账户积分"
          // scan: "现场扫码",
          // alipay: "支付宝",
          // unionpay: "银联"
        };
      }
    });

    Object.defineProperty(Vue.prototype, "$noop", {
      get() {
        return () => {};
      }
    });
  }
};

export default GlobalLibrariesPlugins;
