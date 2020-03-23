<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-size-66 md-small-size-100 mx-auto">
        <form @submit.prevent="save">
          <md-card>
            <md-card-header class="md-card-header-icon md-card-header-primary">
              <div class="card-icon">
                <md-icon>chrome_reader_mode</md-icon>
              </div>
              <h4 class="title">{{ post.title }}</h4>
            </md-card-header>

            <md-card-content class="md-layout">
              <div class="md-layout-item md-size-100">
                <md-field>
                  <label>标题</label>
                  <md-input v-model="post.title"></md-input>
                </md-field>
              </div>

              <div class="md-layout-item md-size-100">
                <md-field>
                  <label>简称</label>
                  <md-input v-model="post.slug"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-size-100">
                <md-chips
                  @keypress.native.enter.prevent
                  v-model="post.tags"
                  class="md-primary shake-on-error"
                  md-placeholder="添加标签"
                  md-check-duplicated
                >
                </md-chips>
              </div>
              <div class="md-layout-item md-size-100">
                <md-field class="md-has-value mt-4">
                  <label>内容</label>
                  <editor v-model="post.content" />
                </md-field>
              </div>
              <div class="md-layout-item md-size-100 text-right">
                <md-button type="submit" class="md-raised md-primary mt-4"
                  >保存</md-button
                >
                <md-button
                  type="button"
                  class="mt-4 ml-2 md-simple md-danger"
                  @click="remove"
                  v-if="post.id"
                  >删除</md-button
                >
              </div>
            </md-card-content>
          </md-card>
        </form>
      </div>
      <div class="md-layout-item md-size-33 md-small-size-100">
        <md-card>
          <div class="md-layout-item md-size-100 md-xsmall-size-100 pb-2">
            <h4 class="card-title">封面图</h4>
            <div class="file-input mx-auto" style="display:block">
              <div class="image-container mx-auto">
                <img
                  :src="
                    post.posterUrl ||
                      posterImage ||
                      '/img/image_placeholder.jpg'
                  "
                />
              </div>
              <div class="button-container">
                <md-button
                  class="md-danger md-round"
                  @click="removeImage"
                  v-if="posterImage || post.posterUrl"
                  >移除</md-button
                >
                <md-button class="md-success md-round md-fileinput">
                  <template v-if="!posterImage && !post.posterUrl"
                    >选择图片</template
                  >
                  <template v-else>更换</template>
                  <input type="file" @change="onFileChange" ref="file-input" />
                </md-button>
              </div>
            </div>
          </div>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
// import { Datetime } from "vue-datetime";
// import "vue-datetime/dist/vue-datetime.css";
import { Post } from "@/resources";
import { Editor } from "@/components";
import Swal from "sweetalert2";

export default {
  components: {
    // Datetime
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
        !(
          await Swal.fire({
            title: "确定要删除这篇文章？",
            text: `这个操作不可撤销`,
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "md-button md-danger",
            cancelButtonClass: "md-button",
            confirmButtonText: "确定删除",
            cancelButtonText: "取消",
            buttonsStyling: false
          })
        ).value
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
