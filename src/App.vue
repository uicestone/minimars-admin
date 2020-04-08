<template>
  <div>
    <md-progress-bar
      md-mode="indeterminate"
      v-if="pendingRequests > 0"
    ></md-progress-bar>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { http } from "@/resources";

@Component
export default class App extends Vue {
  pendingRequests = 0;
  configFetched = false;
  async created() {
    http.interceptors.request.use(this.requestFullfilled);
    http.interceptors.response.use(
      this.responseFullfilled,
      this.responseRejected
    );

    this.$router.beforeResolve(async (to, from, next) => {
      if (this.configFetched) next();
      else
        try {
          const [config, store, authUser, cardType] = await Promise.all([
            http.get("config"),
            http.get("store"),
            http.get("auth/user"),
            http.get("card-type")
          ]);
          this.$config = config.data;
          this.$stores = store.data;
          this.$user = authUser.data;
          this.$cardTypes = cardType.data;
          this.configFetched = true;
        } catch (e) {
          console.warn(e);
        }
      next();
    });
  }

  requestFullfilled(request: AxiosRequestConfig) {
    this.pendingRequests++;

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
      this.pendingRequests--;
      return Promise.reject("No token exists, login required.");
    }
    return request;
  }
  responseFullfilled(response: AxiosResponse) {
    this.pendingRequests--;
    return response;
  }
  responseRejected(err: any) {
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
      return Promise.reject(err.message || err);
    }
    if (response.status >= 500) {
      const message = "服务器内部错误";

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
}
</script>

<style lang="scss">
@import "./assets/scss/md/variables";
.md-progress-bar {
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
</style>
