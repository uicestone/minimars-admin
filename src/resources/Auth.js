export const Auth = {
  created() {},
  methods: {
    async auth() {
      return (await this.$http.get("auth/user")).body;
    },
    async login(login, password) {
      return (await this.$http.post("auth/login", { login, password })).body;
    }
  }
};
