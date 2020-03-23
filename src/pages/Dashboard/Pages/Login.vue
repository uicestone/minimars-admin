<template>
  <div class="md-layout text-center">
    <div
      class="md-layout-item md-size-33 md-medium-size-50 md-small-size-70 md-xsmall-size-100"
    >
      <form @submit.prevent="submitLogin">
        <login-card header-color="primary">
          <h4 slot="title" class="title">登录</h4>
          <md-field class="md-form-group" slot="inputs">
            <md-icon>face</md-icon>
            <label>用户名</label>
            <md-input v-model="login"></md-input>
          </md-field>
          <md-field class="md-form-group" slot="inputs">
            <md-icon>lock_outline</md-icon>
            <label>密码</label>
            <md-input type="password" v-model="password"></md-input>
          </md-field>
          <md-button
            type="submit"
            slot="footer"
            class="md-simple md-success md-lg"
          >
            登录
          </md-button>
        </login-card>
      </form>
    </div>
  </div>
</template>
<script>
import { LoginCard } from "@/components";
export default {
  components: {
    LoginCard
  },
  data() {
    return {
      login: null,
      password: null
    };
  },
  methods: {
    async submitLogin() {
      const { login, password } = this;
      const {
        body: { user, token }
      } = await this.$http.post("auth/login", {
        login,
        password
      });
      window.localStorage.setItem("token", token);
      this.$user = user;
      this.$router.push("/");
    }
  }
};
</script>

<style>
</style>
