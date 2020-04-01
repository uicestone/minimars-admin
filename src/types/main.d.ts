import Vue from "vue";
import { Http, Resource } from "vue-resource/types/vue_resource";
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
  }
  interface VueConstructor {
    http: Http;
    resource: Resource;
  }
}
