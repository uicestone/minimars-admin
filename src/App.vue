<template>
  <div>
    <md-progress-bar
      md-mode="indeterminate"
      v-if="$isLoading"
    ></md-progress-bar>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { http } from "./resources";
import { AxiosRequestConfig, AxiosResponse } from "axios";

export default class App extends Vue {
  async created() {
    console.log("ha???");
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
