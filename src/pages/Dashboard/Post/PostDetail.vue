<template lang="pug">
.content
  .md-layout
    .md-layout-item.md-size-66.md-small-size-100.mx-auto
      form(@submit.prevent='save')
        md-card
          md-card-header.md-card-header-icon.md-card-header-primary
            .card-icon
              md-icon chrome_reader_mode
            h4.title {{ post.title }}
          md-card-content.md-layout
            .md-layout-item.md-size-100
              md-field
                label 标题
                md-input(v-model='post.title')
            .md-layout-item.md-size-100
              md-field
                label 简称
                md-input(v-model='post.slug')
            .md-layout-item.md-size-50
              md-datepicker(placeholder='开始日期', v-model='post.start', :md-model-type='Date', md-immediately)
                label 开始日期
            .md-layout-item.md-size-50
              md-datepicker(placeholder='结束日期', v-model='post.end', :md-model-type='Date', md-immediately)
                label 结束日期
            .md-layout-item.md-size-100
              md-chips.md-primary.shake-on-error(@keypress.native.enter.prevent, v-model='post.tags', md-placeholder='添加标签', md-check-duplicated)
            .md-layout-item.md-size-100(v-if='post.tags.includes("home-banner")')
              md-field
                label 链接至
                md-input(v-model='post.target')
            .md-layout-item.md-size-100
              md-field.md-has-value.mt-4
                label 内容
                editor(v-model='post.content')
            .md-layout-item.md-size-100.text-right
              md-button.md-raised.md-primary.mt-4(type='submit') 保存
              md-button.mt-4.ml-2.md-simple.md-danger(type='button', @click='remove', v-if='post.id') 删除
    .md-layout-item.md-size-33.md-small-size-100
      md-card
        .md-layout-item.md-size-100.md-xsmall-size-100.pb-2
          h4.card-title 封面图
          poster(v-model="post.posterUrl")
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { PostResource } from "@/resources";
import { Post } from "@/resources/interfaces";
import { Editor, Poster } from "@/components";
import { confirm } from "@/helpers/sweetAlert";

@Component({
  components: {
    Editor,
    Poster,
  },
})
export default class PostDetail extends Vue {
  post: Partial<Post> = { id: "", tags: [], start: null, end: null };
  async save() {
    this.post = await PostResource.save(this.post);
    this.$notify({
      message: "保存成功",
      icon: "check",
      horizontalAlign: "center",
      verticalAlign: "bottom",
      type: "success",
    });
    if (this.$route.params.id === "add") {
      this.$router.replace(`/post/${this.post.id}`);
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
    await PostResource.delete({ id: this.post.id });
    this.$router.go(-1);
  }
  async mounted() {
    if (this.$route.params.id !== "add") {
      this.post = await PostResource.get({ id: this.$route.params.id });
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
