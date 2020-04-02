<template lang="pug">
.md-layout.text-center
  .md-layout-item.md-size-33.md-medium-size-50.md-small-size-70.md-xsmall-size-100
    form(@submit.prevent='submitLogin')
      login-card(header-color='primary')
        h4.title(slot='title') 登录
        md-field.md-form-group(slot='inputs')
          md-icon face
          label 用户名
          md-input(v-model='login')
        md-field.md-form-group(slot='inputs')
          md-icon lock_outline
          label 密码
          md-input(type='password', v-model='password')
        md-button.md-simple.md-success.md-lg(type='submit', slot='footer')
          | 登录
</template>
<script>
import { LoginCard } from "@/components";
import { http } from "@/resources";
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
        data: { user, token }
      } = await http.post("auth/login", {
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

<style></style>
