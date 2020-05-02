import Vue from "vue";
import { User, Store, CardType, Config, Coupon } from "@/resources/interfaces";
import { NotificationStore } from "@/components/NotificationPlugin";

declare module "vue/types/vue" {
  interface Vue {
    $config: Config;
    $user: User;
    $stores: Store[];
    $cardTypes: CardType[];
    $coupons: Coupon[];
    $bookingTypeNames: any;
    $bookingStatusNames: any;
    $cardTypeNames: any;
    $cardStatusNames: any;
    $gatewayNames: any;
    $notify: any;
    $material: any;
    $sidebar: any;
    $electron: any;
    notificationStore: typeof NotificationStore;
    sidebarStore: any;
  }
}
