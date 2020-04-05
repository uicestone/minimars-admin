<template lang="pug">
.file-input.mx-auto(style='display:block')
  .image-container.mx-auto
    img(:src="value || preview || '/img/image_placeholder.jpg'")
  .button-container
    md-button.md-danger.md-round(@click='removeImage', v-if='preview || value') 移除
    md-button.md-success.md-round.md-fileinput
      template(v-if='!preview && !value') 选择图片
      template(v-else) 更换
      input(type='file', @change='onFileChange', ref='file-input')
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { File } from "@/resources/interfaces";
import { http } from "@/resources";

@Component({
  name: "poster",
  props: {
    value: String
  }
})
export default class Poster extends Vue {
  preview = "";
  onFileChange(e: any) {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    this.createImage(files[0]);
  }
  createImage(file: Blob) {
    let reader = new FileReader();
    let vm = this;

    reader.onload = (e: any) => {
      vm.preview = e.target.result;
    };
    reader.readAsDataURL(file);
    this.uploadImage(file);
  }
  async uploadImage(file: Blob) {
    const formData = new FormData();
    formData.append("file", file);
    const fileObject: File = (
      await http.post("file", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
    ).data;
    this.$emit("input", fileObject.url);
  }
  removeImage() {
    this.preview = "";
    this.$emit("input", null);
    (this.$refs["file-input"] as HTMLInputElement).value = "";
  }
}
</script>
