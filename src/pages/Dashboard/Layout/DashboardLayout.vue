<template lang="pug">
.wrapper(:class="[{ 'nav-open': $sidebar.showSidebar }]")
  notifications
  side-bar(:active-color='sidebarBackground', :background-image='sidebarBackgroundImage', :data-background-color='sidebarBackgroundColor')
    user-menu
    template(slot='links')
      sidebar-item(:link="{ name: '数据统计', icon: 'dashboard', path: '/dashboard' }")
      sidebar-item(:link="{ name: '预约管理', icon: 'access_time', path: '/booking' }")
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
<script>
/* eslint-disable no-new */
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

function hasElement(className) {
  return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`);
  } else {
    // try to init it later in case this component is loaded async
    setTimeout(() => {
      initScrollbar(className);
    }, 100);
  }
}

import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
// import MobileMenu from "./Extra/MobileMenu.vue";
import UserMenu from "./Extra/UserMenu.vue";

export default {
  components: {
    TopNavbar,
    ContentFooter,
    // MobileMenu,
    UserMenu
  },
  data() {
    return {
      sidebarBackgroundColor: "white",
      sidebarBackground: "purple",
      sidebarBackgroundImage: "./img/sidebar-2.jpg",
      sidebarMini: false,
      sidebarImg: true
    };
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    minimizeSidebar() {
      if (this.$sidebar) {
        this.$sidebar.toggleMinimize();
      }
    }
  },
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
  },
  watch: {
    sidebarMini() {
      this.minimizeSidebar();
    }
  },
  computed: {
    inDevelopment() {
      return process.env.NODE_ENV === "development";
    }
  }
};
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
