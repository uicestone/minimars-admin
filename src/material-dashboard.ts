// Notifications plugin. Used on Notifications page
import Notifications from "@/components/NotificationPlugin";
// Validation plugin used to validate forms
// import VeeValidate from "vee-validate";
// A plugin file where you could register global components used across the app
import globalComponents from "./plugins/globalComponents";
// A plugin file where you could register global directives
import globalDirectives from "./plugins/globalDirectives";

import globalFilters from "./plugins/globalFilters";

import globalVars from "./plugins/globalVars";
// Sidebar on the right. Used as a local plugin in DashboardLayout.vue
import SideBar from "./components/SidebarPlugin";
// Tabs plugin. Used on Panels page.

// @ts-ignore
import VueMaterial from "vue-material";
import VueClipboard from "vue-clipboard2";

// asset imports
import "vue-material/dist/vue-material.min.css";
import "./assets/scss/material-dashboard.scss";
import "./assets/css/demo.css";
import { VueConstructor } from "vue/types/vue";

// library auto imports
// import "es6-promise/auto";

export default {
  install(Vue: VueConstructor) {
    Vue.use(globalComponents);
    Vue.use(globalDirectives);
    Vue.use(globalFilters);
    Vue.use(globalVars);
    Vue.use(VueMaterial);
    Vue.use(VueClipboard);
    Vue.use(SideBar);
    Vue.use(Notifications);
    // Vue.use(VeeValidate, { fieldsBagName: "veeFields" });
  }
};
