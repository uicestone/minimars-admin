<template lang="pug">
.content
  .md-layout
    .md-layout-item.md-size-66.md-small-size-100.mx-auto
      form(@submit.prevent='save')
        md-card
          md-card-header.md-card-header-icon.md-card-header-primary
            .card-icon
              md-icon store
            h4.title {{ store.name }}
          md-card-content.md-layout
            .md-layout-item.md-size-100
              md-field
                label 名称
                md-input(v-model='store.name')
            .md-layout-item.md-size-100
              md-field
                label 地址
                md-input(v-model='store.address')
            .md-layout-item.md-size-100
              md-field
                label 电话
                md-input(v-model='store.phone')
            .md-layout-item.md-size-100
              md-field.md-has-value.mt-4
                label 介绍
                editor(v-model='store.content')
            .md-layout-item.md-size-100.text-right
              md-button.md-raised.md-primary.mt-4(type='submit') 保存
              md-button.mt-4.ml-2.md-simple.md-danger(type='button', @click='remove', v-if='store.id') 删除
    .md-layout-item.md-size-33.md-small-size-100
      md-card
        .md-layout-item.md-size-100.md-xsmall-size-100.pb-2
          h4.card-title 封面图
          poster(v-model="store.posterUrl")
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { StoreResource } from "@/resources";
import { Store } from "@/resources/interfaces";
import { Editor, Poster } from "@/components";
import { confirm } from "@/helpers/sweetAlert";

@Component({
  components: {
    Editor,
    Poster
  }
})
export default class StoreDetail extends Vue {
  store: Partial<Store> = { id: "" };
  async save() {
    this.store = await StoreResource.save(this.store);
    this.$notify({
      message: "保存成功",
      icon: "check",
      horizontalAlign: "center",
      verticalAlign: "bottom",
      type: "success"
    });
    if (this.$route.params.id === "add") {
      this.$router.replace(`/store/${this.store.id}`);
    }
  }
  async remove() {
    if (
      !(await confirm(
        "确定要删除这篇文章",
        `这个操作不可撤销`,
        "确定删除",
        "error"
      ))
    )
      return;
    await StoreResource.delete({ id: this.store.id });
    this.$router.go(-1);
  }
  async mounted() {
    if (this.$route.params.id !== "add") {
      this.store = await StoreResource.get({ id: this.$route.params.id });
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
.shake-on-error /deep/ .md-duplicated {
  animation-name: shake;
  animation-duration: 0.5s;
}
</style>
