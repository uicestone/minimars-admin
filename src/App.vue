<template>
  <div>
    <md-progress-bar
      md-mode="indeterminate"
      v-if="$isLoading"
    ></md-progress-bar>
    <router-view></router-view>
  </div>
</template>

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
