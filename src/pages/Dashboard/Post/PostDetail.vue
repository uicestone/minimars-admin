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
          .file-input.mx-auto(style='display:block')
            .image-container.mx-auto
              img(:src="post.posterUrl || posterImage || '/img/image_placeholder.jpg'")
            .button-container
              md-button.md-danger.md-round(@click='removeImage', v-if='posterImage || post.posterUrl') 移除
              md-button.md-success.md-round.md-fileinput
                template(v-if='!posterImage && !post.posterUrl') 选择图片
                template(v-else='') 更换
                input(type='file', @change='onFileChange', ref='file-input')
</template>

<script>
import { Post } from "@/resources";
import { Editor } from "@/components";
import { confirm } from "@/helpers/sweetAlert";

export default {
  components: {
    Editor
  },
  data() {
    return {
      post: { id: "", tags: [] },
      posterImage: ""
    };
  },
  methods: {
    async save() {
      if (this.$route.params.id === "add") {
        this.post = (await Post.save(this.post)).body;
      } else {
        this.post = (
          await Post.update(
            {
              id: this.$route.params.id
            },
            this.post
          )
        ).body;
      }
      this.$notify({
        message: "保存成功",
        icon: "check",
        horizontalAlign: "center",
        verticalAlign: "bottom",
        type: "success"
      });
      if (this.$route.params.id === "add") {
        this.$router.replace(`/post/${this.post.id}`);
      }
    },
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
      await Post.delete({ id: this.post.id });
      this.$router.go(-1);
    },
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
    },
    createImage(file, type) {
      let reader = new FileReader();
      let vm = this;

      reader.onload = e => {
        vm.posterImage = e.target.result;
      };
      reader.readAsDataURL(file);
      this.uploadImage(file);
    },
    async uploadImage(file) {
      const formData = new FormData();
      formData.append("file", file);
      const fileObject = (
        await this.$http.post("file", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
      ).body;
      this.post.posterUrl = fileObject.url;
    },
    removeImage: function(type) {
      this.posterImage = "";
      this.post.posterUrl = null;
      this.$refs["file-input"].value = "";
    }
  },
  async mounted() {
    if (this.$route.params.id !== "add") {
      this.post = (await Post.get({ id: this.$route.params.id })).body;
    }
  }
};
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
