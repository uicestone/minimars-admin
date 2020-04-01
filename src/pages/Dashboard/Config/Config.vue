<template lang="pug">
.content
  .md-layout
    .md-layout-item.md-size-100.mx-auto
      form(@submit.prevent='save')
        md-card
          md-card-header.md-card-header-icon
            .card-icon
              md-icon settings
            h4.title {{ key }}
          md-card-content.md-layout
            .md-layout-item.md-size-100
              vue-json-editor(v-model='value', :expandedonstart='true', lang='zh')
            .md-layout-item.md-size-100.text-right
              md-button.md-raised.md-primary.mt-4(type='submit') 保存

</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
// @ts-ignore
import vueJsonEditor from "vue-json-editor";
import { ConfigItemResource } from "@/resources";

@Component({
  components: {
    vueJsonEditor
  }
})
export default class Config extends Vue {
  key = this.$route.params.key;
  value = {};
  async save() {
    this.value = (
      await ConfigItemResource.update(
        { key: this.$route.params.key },
        this.value
      )
    )[this.key];

    if (typeof this.value !== "object") {
      this.value = { [this.key]: this.value };
    }

    this.$notify({
      message: "保存成功",
      icon: "check",
      horizontalAlign: "center",
      verticalAlign: "bottom",
      type: "success"
    });
  }
  async mounted() {
    const config = await ConfigItemResource.get({
      key: this.$route.params.key
    });
    this.value = config[this.key];
    if (typeof this.value !== "object") {
      this.value = { [this.key]: this.value };
    }
  }
}
</script>
<style lang="scss">
.md-datepicker-body .md-dialog-actions {
  display: none;
}
.md-input {
  min-width: 0;
}
.payments-card {
  margin-top: 50px;
}
.md-card.md-theme-default {
  position: static;
}
.md-card .md-table {
  width: 100%;
}
</style>
