<template lang="pug">
#app
  md-progress-bar(md-mode="indeterminate" v-if="pendingRequests > 0")
  notifications
  router-view
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { http } from "@/resources";
import loadConfig from "./helpers/loadConfig";

@Component
export default class App extends Vue {
  pendingRequests = 0;
  configFetched = false;
  created() {
    http.interceptors.request.use(this.requestFullfilled);
    http.interceptors.response.use(
      this.responseFullfilled,
      this.responseRejected
    );

    this.$router.beforeResolve(async (to, from, next) => {
      if (to.path === "/login") next();
      else {
        const config = await loadConfig(this.$config);
        this.$config = config;
        next();
      }
    });
  }

  requestFullfilled(request: AxiosRequestConfig) {
    this.pendingRequests++;

    // stop request and return 401 response when no token exist except for login request
    if (
      !["auth/login", "config", "store"].includes(request.url || "") &&
      !window.localStorage.getItem("token")
    ) {
      this.pendingRequests--;
    }
    return request;
  }

  responseFullfilled(response: AxiosResponse) {
    this.pendingRequests--;
    return response;
  }

  responseRejected(err: any) {
    // console.log("App.responseRejected", err);
    this.pendingRequests--;
    const { response } = err;
    if (!response) {
      if (err.message === "Network Error") {
        const message = "网络连接错误";
        this.$notify({
          message,
          icon: "add_alert",
          horizontalAlign: "center",
          verticalAlign: "bottom",
          type: "danger"
        });
      }
      return Promise.reject(err);
    }
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
}
</script>

<style lang="scss">
@import "./assets/scss/md/variables";
#app > .md-progress-bar {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 2100;
}
@media (max-width: $screen-sm-min) {
  .md-progress-bar {
    left: 0;
    width: 100%;
  }
  .paginated-table .md-table-toolbar .md-field {
    margin-top: 10px;
  }
}
.mapboxgl-ctrl-logo {
  display: none !important;
}
.md-button.md-normal {
  width: 70px !important;
  .md-ripple {
    padding-top: 9px !important;
  }
}
.shake-on-error /deep/ .md-duplicated {
  animation-name: shake;
  animation-duration: 0.5s;
}
// .fade-enter-active,
// .fade-leave-active {
//   transition: opacity 0.5s;
// }
// .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
//   opacity: 0;
// }
// .main-panel > .content {
//   position: relative;
// }
// .main-panel > .content > div {
//   position: absolute;
//   left: 0;
//   right: 0;
// }
</style>
