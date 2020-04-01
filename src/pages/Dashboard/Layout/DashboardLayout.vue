<template lang="pug">
.wrapper(:class="[{ 'nav-open': $sidebar.showSidebar }]")
  notifications
  side-bar(:active-color='sidebarBackground', :background-image='sidebarBackgroundImage', :data-background-color='sidebarBackgroundColor')
    user-menu
    template(slot='links')
      sidebar-item(:link="{ name: '数据统计', icon: 'dashboard', path: '/dashboard' }")
      sidebar-item(:link="{ name: '票务管理', icon: 'access_time', path: '/booking?type=play' }")
      sidebar-item(:link="{ name: '活动预约', icon: 'access_time', path: '/booking?type=event' }")
      sidebar-item(:link="{ name: '礼品兑换', icon: 'access_time', path: '/booking?type=gift' }")
      sidebar-item(:link="{ name: '餐饮消费', icon: 'access_time', path: '/booking?type=food' }")
      sidebar-item(:link="{ name: '用户管理', icon: 'people', path: '/user' }")
      sidebar-item(:link="{ name: '卡片种类', icon: 'card_membership', path: '/card-type' }")
      sidebar-item(:link="{ name: '内容管理', icon: 'chrome_reader_mode', path: '/post' }")
      sidebar-item(:link="{ name: '活动管理', icon: 'event', path: '/event' }")
      sidebar-item(:link="{ name: '礼品管理', icon: 'card_giftcard', path: '/gift' }")
      sidebar-item(:link="{ name: '流水明细', icon: 'payment', path: '/payment' }")
      sidebar-item(:link="{ name: '门店管理', icon: 'store', path: '/store' }")
      sidebar-item(:link="{ name: '系统配置', icon: 'settings', path: '/config' }")
  .main-panel
    top-navbar
    div(:class='{ content: !$route.meta.hideContent }', @click='toggleSidebar')
      keep-alive
        router-view(:key='$route.fullPath', v-if='$route.meta.keepAlive')
      router-view(:key='$route.fullPath', v-if='!$route.meta.keepAlive')
    content-footer(v-if='!$route.meta.hideFooter')
</template>
<script lang="ts">
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

function hasElement(className: string) {
  return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className: string) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`);
  } else {
    // try to init it later in case this component is loaded async
    setTimeout(() => {
      initScrollbar(className);
    }, 100);
  }
}

import Vue from "vue";
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
// import MobileMenu from "./Extra/MobileMenu.vue";
import UserMenu from "./Extra/UserMenu.vue";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";
import { http } from "../../../resources";
import { AxiosResponse, AxiosRequestConfig } from "axios";

@Component({
  components: {
    TopNavbar,
    ContentFooter,
    // MobileMenu,
    UserMenu
  }
})
export default class DashboardLayout extends Vue {
  sidebarBackgroundColor = "white";
  sidebarBackground = "purple";
  sidebarBackgroundImage = "./img/sidebar-2.jpg";
  sidebarMini = false;
  sidebarImg = true;

  toggleSidebar() {
    if (this.$sidebar.showSidebar) {
      this.$sidebar.displaySidebar(false);
    }
  }
  minimizeSidebar() {
    if (this.$sidebar) {
      this.$sidebar.toggleMinimize();
    }
  }
  interceptorRequest(request: AxiosRequestConfig) {
    this.$isLoading = true;

    const token = window.localStorage.getItem("token");

    if (token) {
      request.headers["Authorization"] = token;
    }
    // stop request and return 401 response when no token exist except for login request
    if (
      !["auth/login", "config", "store"].includes(request.url || "") &&
      !window.localStorage.getItem("token")
    ) {
      window.location.hash = "#/login";
      this.$isLoading = false;
      return Promise.reject("No token exists, login required.");
    }
    return request;
  }
  interceptorResponse(response: AxiosResponse) {
    this.$isLoading = false;
    if (response.status >= 500) {
      const message = "服务器内部错误";
      this.$notify({
        message,
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "bottom",
        type: "danger"
      });
      return Promise.reject(new Error(message));
    } else if (response.status >= 400) {
      // redirect to login page on any 401 response
      if (response.status === 401) {
        window.location.hash = "#/login";
        window.localStorage.removeItem("token");
      }
      const message = response.data.message || response.statusText;

      this.$notify({
        message,
        icon: "add_alert",
        horizontalAlign: "center",
        verticalAlign: "bottom",
        type: "warning"
      });

      return Promise.reject(new Error(message));
    }
    return response;
  }
  async created() {
    http.interceptors.request.use(this.interceptorRequest);
    http.interceptors.response.use(this.interceptorResponse);

    try {
      this.$config = (await http.get("config")).data;
      this.$stores = (await http.get("store")).data;
      this.$user = (await http.get("auth/user")).data;
      this.$cardTypes = (await http.get("card-type")).data;
    } catch (e) {
      console.warn(e);
    }
  }
  mounted() {
    let docClasses = document.body.classList;
    let isWindows = navigator.platform.startsWith("Win");
    if (isWindows) {
      // if we are on windows OS we activate the perfectScrollbar function
      initScrollbar("sidebar");
      initScrollbar("sidebar-wrapper");
      initScrollbar("main-panel");

      docClasses.add("perfect-scrollbar-on");
    } else {
      docClasses.add("perfect-scrollbar-off");
    }
  }

  @Watch("sidebarMini") onSidebarMiniUpdate() {
    this.minimizeSidebar();
  }

  get inDevelopment() {
    return process.env.NODE_ENV === "development";
  }
}
</script>
<style lang="scss">
$scaleSize: 0.95;
@keyframes zoomIn95 {
  from {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
  to {
    opacity: 1;
  }
}
.main-panel .zoomIn {
  animation-name: zoomIn95;
}
@keyframes zoomOut95 {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
}
.main-panel .zoomOut {
  animation-name: zoomOut95;
}
@media (min-width: 1024px) {
  .main-panel > .md-toolbar {
    display: none !important;
  }
}
</style>
