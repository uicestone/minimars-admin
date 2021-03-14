<template lang="pug">
.wrapper(:class="[{ 'nav-open': $sidebar.showSidebar }]")
  side-bar(:active-color='sidebarBackground', :background-image='sidebarBackgroundImage', :data-background-color='sidebarBackgroundColor')
    user-menu
    template(slot='links')
      sidebar-item(v-if="$user.can('view-boss-board')", :link="{ name: '数据统计', icon: 'dashboard', path: '/boss-board' }")
      sidebar-item(v-else, :link="{ name: '数据统计', icon: 'dashboard', path: '/dashboard' }")
      sidebar-item(v-if="$user.can('view-booking')", :link="{ name: '票务管理', icon: 'access_time', path: '/booking/play' }")
      sidebar-item(v-if="$user.can('view-booking')||$user.can('view-event-booking')", :link="{ name: '活动预约', icon: 'event', path: '/booking/event' }")
      sidebar-item(v-if="$user.can('view-booking')||$user.can('view-gift-booking')", :link="{ name: '礼品兑换', icon: 'card_giftcard', path: '/booking/gift' }")
      sidebar-item(v-if="$user.can('view-booking')||$user.can('view-food-booking')", :link="{ name: '餐饮消费', icon: 'fastfood', path: '/booking/food' }")
      sidebar-item(v-if="$user.can('view-user')", :link="{ name: '客户管理', icon: 'people', path: '/user' }")
      sidebar-item(v-if="$user.can('view-payment')", :link="{ name: '支付明细', icon: 'payment', path: '/payment' }")
      sidebar-item(v-if="$user.can('view-card-type')", :link="{ name: '卡券种类', icon: 'card_membership', path: '/card-type' }")
      sidebar-item(v-if="$user.can('view-coupon')", :link="{ name: '优惠管理', icon: 'confirmation_number', path: '/coupon' }")
      sidebar-item(v-if="$user.can('view-post')", :link="{ name: '内容管理', icon: 'chrome_reader_mode', path: '/post' }")
      sidebar-item(v-if="$user.can('view-event')", :link="{ name: '活动管理', icon: 'event', path: '/event' }")
      sidebar-item(v-if="$user.can('view-gift')", :link="{ name: '礼品管理', icon: 'card_giftcard', path: '/gift' }")
      sidebar-item(v-if="$user.can('view-store')", :link="{ name: '门店管理', icon: 'store', path: '/store' }")
      sidebar-item(v-if="$user.can('view-staff')", :link="{ name: '职员管理', icon: 'manage_accounts', path: '/staff' }")
      sidebar-item(v-if="$user.can('view-config')", :link="{ name: '系统配置', icon: 'settings', path: '/config' }")
  .main-panel
    top-navbar
    div(:class='{ content: !$route.meta.hideContent }', @click='toggleSidebar')
      //- transition(name='fade')
      keep-alive
        router-view(:key='$route.fullPath', v-if='$route.meta.keepAlive')
      router-view(:key='$route.fullPath', v-if='!$route.meta.keepAlive')
    content-footer(v-if='!$route.meta.hideFooter')
</template>
<script lang="ts">
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import Vue from "vue";
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
// import MobileMenu from "./Extra/MobileMenu.vue";
import UserMenu from "./Extra/UserMenu.vue";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";

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
  sidebarBackgroundImage = "./img/bg-login.jpg";
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

  // beforeRouteEnter(to: any, from: any, next: any) {
  //   console.log(to, from);
  //   next();
  // }

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
