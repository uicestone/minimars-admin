import { VueConstructor } from "vue";
import { User } from "@/resources/interfaces";

const globalVars = {
  install(Vue: VueConstructor) {
    // global library setup
    Object.defineProperty(Vue.prototype, "$electron", {
      get() {
        //@ts-ignore
        return window.remote;
      }
    });

    Object.defineProperty(Vue.prototype, "$version", {
      get() {
        return process.env.VERSION;
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
      },
      set(v) {
        this.$root.config = v;
      }
    });

    const can = function(this: User, cap: string) {
      const roleCaps: Record<string, string> = {
        admin: ".*",
        manager: "view-(dashboard|booking|user|payment)",
        eventManager: "view-(event-booking)",
        accountant: "view-(dashboard|card-type|payment)"
      };
      return this.role && cap.match(new RegExp(`^${roleCaps[this.role]}$`));
    };

    Object.defineProperty(Vue.prototype, "$user", {
      get() {
        this.$root.config.user.can = can;
        return this.$root.config.user;
      },
      set(v) {
        this.$root.config.user = v;
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

    Object.defineProperty(Vue.prototype, "$userRoles", {
      get() {
        return {
          admin: "管理员",
          accountant: "财务",
          manager: "店员",
          eventManager: "活动策划",
          customer: "客户"
        };
      }
    });

    Object.defineProperty(Vue.prototype, "$bookingTypeNames", {
      get() {
        return {
          play: "门票",
          // party: "派对",
          event: "活动",
          gift: "礼品",
          food: "餐饮"
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
          pending_refund: "待撤销",
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
          balance: "储值卡",
          coupon: "优惠券",
          partner: "合作卡"
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
          canceled: "已取消"
        };
      }
    });

    Object.defineProperty(Vue.prototype, "$gatewayNames", {
      get() {
        return {
          dianping: "点评POS",
          shouqianba: "收钱吧",
          wechatpay: "微信支付",
          pos: "银行卡",
          cash: "现金",
          card: "会员卡",
          coupon: "团购优惠券",
          balance: "账户余额",
          points: "账户积分",
          alipay: "支付宝",
          pr: "市场公关",
          internal: "内部消费"
          // scan: "现场扫码",
          // unionpay: "银联"
        };
      }
    });

    Object.defineProperty(Vue.prototype, "$sceneNames", {
      get() {
        return {
          play: "门票",
          food: "餐饮",
          event: "活动",
          gift: "礼品",
          mall: "电商",
          card: "次卡",
          balance: "充值",
          period: "时效卡",
          party: "派对"
        };
      }
    });

    Object.defineProperty(Vue.prototype, "$noop", {
      get() {
        return () => {};
      }
    });

    Object.defineProperty(Vue.prototype, "$clipboard", {
      get() {
        return (v: string, name: string = "文本") => {
          this.$copyText(v);
          this.$notify({
            message: `${name}已复制`,
            icon: "check",
            horizontalAlign: "center",
            verticalAlign: "bottom",
            type: "success"
          });
        };
      }
    });
  }
};

export default globalVars;
