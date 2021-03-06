import moment from "moment";
import { VueConstructor } from "vue";

moment.locale("zh-cn");

const globalFilters = {
  install(Vue: VueConstructor) {
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

    Vue.filter("sceneName", (value: any) => {
      return Vue.prototype.$sceneNames[value];
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

    Vue.filter(
      "currency",
      (value: any, precision: number = 2, lazyPrecision: boolean = false) => {
        if (value === undefined || value === null || isNaN(value)) return "-";
        let fixed = (+value).toFixed(precision);
        if (lazyPrecision) fixed = (+fixed).toString();
        return "¥ " + fixed;
      }
    );

    Vue.filter("paymentGatewayName", (gateway: any) => {
      return Vue.prototype.$gatewayNames[gateway];
    });

    Vue.filter("permissionName", (permission: any) => {
      return Vue.prototype.$permissionNames[permission];
    });

    Vue.filter("couponName", (couponSlug: any) => {
      const coupons = Vue.prototype.$config.coupons;
      if (!coupons) {
        return;
      }
      const coupon = coupons.find(
        (c: { slug: string }) => c.slug === couponSlug
      );
      if (coupon) {
        return coupon.name;
      }
      return "-";
    });
  }
};

export default globalFilters;
