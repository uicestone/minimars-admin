import Vue from "vue";
import { User, Store, CardType, Config } from "@/resources/interfaces";

declare module "vue/types/vue" {
  interface Vue {
    $Chartist: any;
    $isLoading: boolean;
    $config: Config;
    $user: User;
    $stores: Store[];
    $cardTypes: CardType[];
    $bookingTypeNames: any;
    $bookingStatusNames: any;
    $cardTypeNames: any;
    $cardStatusNames: any;
    $gatewayNames: any;
    $notify: any;
    $material: any;
    $sidebar: any;
    notificationStore: any;
    sidebarStore: any;
  }
}
