<template lang="pug">
.content
  .md-layout
    .md-layout-item.md-size-66.md-small-size-100.mx-auto
      form(@submit.prevent='save')
        md-card
          md-card-header.md-card-header-icon.md-card-header-primary
            .card-icon
              md-icon role
            h4.title {{ role.name }}
          md-card-content.md-layout
            .md-layout-item.md-size-100
              md-field
                label 名称
                md-input(v-model='role.name')
            .md-layout-item.md-size-100
              md-field.md-layout-item.md-size-100
                label 权限
                md-select(v-model='role.permissions', multiple)
                  md-option(v-for='(name, permission) in $permissionNames', :key='permission', :value='permission') {{ name }}
            .md-layout-item.md-size-100.text-right
              md-button.md-raised.md-primary.mt-4(type='submit') 保存
              md-button.mt-4.ml-2.md-simple.md-danger(type='button', @click='remove', v-if='role.id') 删除
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { RoleResource } from "@/resources";
import { Role } from "@/resources/interfaces";
import { confirm } from "@/helpers/sweetAlert";

@Component({
  filters: {}
})
export default class RoleDetail extends Vue {
  @Prop({ default: false })
  add!: boolean;

  role: Partial<Role> = {
    id: "",
    permissions: []
  };
  async save() {
    this.role = await RoleResource.save(this.role);
    this.$notify({
      message: "保存成功",
      icon: "check",
      horizontalAlign: "center",
      verticalAlign: "bottom",
      type: "success"
    });
    if (this.add) {
      this.$router.replace(`/role/${this.role.id}`);
    }
  }
  async remove() {
    if (
      !(await confirm(
        "确定要删除这个角色",
        `这个操作不可撤销`,
        "确定删除",
        "error"
      ))
    )
      return;
    await RoleResource.delete({ id: this.role.id });
    this.$router.back();
  }
  async mounted() {
    if (!this.add) {
      this.role = await RoleResource.get({ id: this.$route.params.id });
    }
  }
}
</script>
<style lang="scss">
</style>
