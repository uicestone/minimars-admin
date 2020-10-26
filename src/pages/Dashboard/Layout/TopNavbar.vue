<template>
  <md-toolbar
    md-elevation="0"
    class="md-transparent"
    :class="{
      'md-toolbar-absolute md-white md-fixed-top': $route.meta.navbarAbsolute,
    }"
  >
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-start">
        <h3 class="md-title">{{ $route.name }}</h3>
      </div>
      <div class="md-toolbar-section-end">
        <md-button
          class="md-just-icon md-round md-simple"
          @click="openQrcodeScanner"
        >
          <md-icon>qr_code_scanner</md-icon>
        </md-button>
        <video
          id="qrcode-scanner"
          ref="qrcode-scanner"
          v-if="showQrcodeScanner"
        ></video>
        <md-button
          id="close-qrcode-scanner"
          class="md-just-icon md-round md-simple"
          @click="closeQrcodeScanner"
          v-if="showQrcodeScanner"
          ><md-icon>close</md-icon></md-button
        >
        <md-button
          class="md-just-icon md-round md-simple md-toolbar-toggle"
          :class="{ toggled: $sidebar.showSidebar }"
          @click="toggleSidebar"
        >
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </md-button>

        <div class="md-collapse">
          <md-list>
            <md-list-item href="#/">
              <i class="material-icons">dashboard</i>
              <p class="hidden-lg hidden-md">Dashboard</p>
            </md-list-item>

            <!-- <li class="md-list-item">
              <a
                href="#/components/notifications"
                class="md-list-item-router md-list-item-container md-button-clean dropdown"
              >
                <div class="md-list-item-content">
                  <drop-down direction="down">
                    <md-button
                      slot="title"
                      class="md-button md-just-icon md-simple"
                      data-toggle="dropdown"
                    >
                      <md-icon>notifications</md-icon>
                      <span class="notification">5</span>
                      <p class="hidden-lg hidden-md">Notifications</p>
                    </md-button>
                    <ul class="dropdown-menu dropdown-menu-right">
                      <li><a href="#">Mike John responded to your email</a></li>
                      <li><a href="#">You have 5 new tasks</a></li>
                      <li><a href="#">You're now friend with Andrew</a></li>
                      <li><a href="#">Another Notification</a></li>
                      <li><a href="#">Another One</a></li>
                    </ul>
                  </drop-down>
                </div>
              </a>
            </li> -->

            <!-- <md-list-item href="#/pages/user">
              <i class="material-icons">person</i>
              <p class="hidden-lg hidden-md">Profile</p>
            </md-list-item> -->
          </md-list>
        </div>
      </div>
    </div>
  </md-toolbar>
</template>

<script>
import QrScanner from "qr-scanner";
import qrScannerWorkerSource from "!!raw-loader!../../../../node_modules/qr-scanner/qr-scanner-worker.min.js";
QrScanner.WORKER_PATH = URL.createObjectURL(new Blob([qrScannerWorkerSource]));

export default {
  data() {
    return {
      showQrcodeScanner: false,
      qrScanner: null,
    };
  },
  methods: {
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    minimizeSidebar() {
      if (this.$sidebar) {
        this.$sidebar.toggleMinimize();
      }
    },
    async openQrcodeScanner() {
      this.showQrcodeScanner = true;
      await this.$nextTick();
      this.qrScanner = new QrScanner(this.$refs["qrcode-scanner"], (result) => {
        this.onQrcodeResult(result);
        this.qrScanner.stop();
        this.qrScanner.destroy();
      });
      this.qrScanner.start();
    },
    closeQrcodeScanner() {
      this.showQrcodeScanner = false;
      this.qrScanner.stop();
      this.qrScanner.destroy();
    },
    onQrcodeResult(s) {
      if (!this.showQrcodeScanner) return;
      this.showQrcodeScanner = false;
      this.$router.push(`/user/${s}`);
    },
  },
};
</script>

<style scoped>
#qrcode-scanner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  height: 100vh;
  background: black;
}
#close-qrcode-scanner {
  position: absolute;
  right: 15px;
  top: 15px;
  z-index: 11;
}
#close-qrcode-scanner i {
  font-size: 36px !important;
}
</style>