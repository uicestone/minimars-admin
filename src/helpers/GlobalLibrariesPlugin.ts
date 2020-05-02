import { VueConstructor } from "vue";
import { User } from "@/resources/interfaces";

const GlobalLibrariesPlugins = {
  install(Vue: VueConstructor) {
    // global library setup
    Object.defineProperty(Vue.prototype, "$electron", {
      get() {
        //@ts-ignore
        return window.remote;
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

    Object.defineProperty(Vue.prototype, "$config", {
      get() {
        return this.$root.config;
      }
    });

    const can = function(this: User, cap: string) {
      const roleCaps: Record<string, string> = {
        admin: ".*",
        manager: "view-(bookings|users|payments)",
        accountant: "view-(payments)"
      };
      return this.role && cap.match(new RegExp(`^${roleCaps[this.role]}$`));
    };

    Object.defineProperty(Vue.prototype, "$user", {
      get() {
        this.$root.config.user.can = can;
        return this.$root.config.user;
      }
    });

    Object.defineProperty(Vue.prototype, "$stores", {
      get() {
        return this.$root.config.stores;
      }
    });

    Object.defineProperty(Vue.prototype, "$cardTypes", {
      get() {
        return this.$root.config.cardTypes;
      }
    });

    Object.defineProperty(Vue.prototype, "$coupons", {
      get() {
        return this.$root.config.coupons;
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
          balance: "账户余额",
          points: "账户积分",
          coupon: "团购优惠券",
          scan: "现场扫码",
          card: "会员卡",
          pos: "银行卡",
          cash: "现金",
          shouqianba: "收钱吧",
          dianping: "点评POS",
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
  }
};

export default GlobalLibrariesPlugins;
