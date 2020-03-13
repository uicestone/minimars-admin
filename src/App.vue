<template>
  <div>
    <md-progress-bar
      md-mode="indeterminate"
      v-if="$isLoading"
    ></md-progress-bar>
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from "vue";
import { Auth } from "@/resources/Auth";

export default {
  mixins: [Auth],
  async created() {
    Vue.http.options.root = process.env.VUE_APP_API_BASE;
    Vue.http.interceptors.push(this.interceptor);

    this.$material.locale = {
      startYear: 1900,
      endYear: 2099,
      dateFormat: "yyyy-MM-dd",
      days: [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ],
      shortDays: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
      shorterDays: ["日", "一", "二", "三", "四", "五", "六"],
      months: [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月"
      ],
      shortMonths: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月"
      ],
      shorterMonths: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12"
      ],
      firstDayOfAWeek: 1
    };
    this.$http.get("config").then(res => {
      this.$config = res.body;
    });
    try {
      this.$user = await this.auth();
    } catch (e) {
      console.warn(e);
    }
  },
  methods: {
    interceptor(request) {
      this.$isLoading = true;

      const token = window.localStorage.getItem("token");

      if (token) {
        request.headers.set("Authorization", token);
      }
      // stop request and return 401 response when no token exist except for login request
      if (
        request.url !== "auth/login" &&
        !window.localStorage.getItem("token")
      ) {
        window.location.hash = "#/login";
        this.$isLoading = false;
        return Promise.reject("No token exists, login required.");
      }
      return response => {
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

          return Promise.reject(message);
        } else if (response.status >= 400) {
          // redirect to login page on any 401 response
          if (response.status === 401) {
            window.location.hash = "#/login";
            window.localStorage.removeItem("token");
          }
          const message = response.body.message || response.statusText;

          this.$notify({
            message,
            icon: "add_alert",
            horizontalAlign: "center",
            verticalAlign: "bottom",
            type: "warning"
          });

          return Promise.reject(message);
        }
        return response;
      };
    }
  }
};
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
</style>
