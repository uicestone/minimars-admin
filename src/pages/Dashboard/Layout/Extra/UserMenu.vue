<template>
  <div class="user">
    <div class="photo">
      <img :src="$user.avatarUrl || './img/default-avatar.png'" alt="avatar" />
    </div>
    <div class="user-info">
      <a
        data-toggle="collapse"
        :aria-expanded="!isClosed"
        @click.stop="toggleMenu"
        @click.capture="clicked"
      >
        <span>
          {{ $user.name || "用户" }}
          <b class="caret"></b>
        </span>
      </a>

      <collapse-transition>
        <div v-show="!isClosed">
          <ul class="nav">
            <slot>
              <li :class="{ active: isProfileActive }">
                <router-link :to="'/user/' + $user.id">
                  <span class="sidebar-mini"
                    ><md-icon>assignment_ind</md-icon></span
                  >
                  <span class="sidebar-normal">个人资料</span>
                </router-link>
              </li>
              <li>
                <a @click="logout">
                  <span class="sidebar-mini"
                    ><md-icon>exit_to_app</md-icon></span
                  >
                  <span class="sidebar-normal">退出登录</span>
                </a>
              </li>
            </slot>
          </ul>
        </div>
      </collapse-transition>
    </div>
  </div>
</template>
<script>
import { CollapseTransition } from "vue2-transitions";

export default {
  components: {
    CollapseTransition
  },
  data() {
    return {
      isClosed: true
    };
  },
  computed: {
    isProfileActive() {
      return (
        this.$route.path.match(/\/user\/\w+/) &&
        this.$route.params.id === this.$user.id
      );
    }
  },
  methods: {
    clicked: function(e) {
      e.preventDefault();
    },
    toggleMenu: function() {
      this.isClosed = !this.isClosed;
    },
    logout() {
      window.localStorage.removeItem("token");
      this.$router.push("/login");
    }
  }
};
</script>
<style>
.collapsed {
  transition: opacity 1s;
}
</style>
