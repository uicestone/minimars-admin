import Vue from "vue";
import { User, Store, CardType, Config, Coupon } from "@/resources/interfaces";

declare module "vue/types/vue" {
  interface Vue {
    $Chartist: any;
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
    notificationStore: any;
    sidebarStore: any;
  }
}
