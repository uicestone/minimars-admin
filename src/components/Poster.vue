<template lang="pug">
.file-input.mx-auto(:class='{"img-circle":circle}' style='display:block')
  .image-container.mx-auto
    img(:src="value || preview || placeholder")
  .button-container(v-if="!disabled")
    md-button.md-danger.md-round.md-simple.md-just-icon(@click='removeImage', v-if='preview || value')
      md-icon close
    md-button.md-success.md-round.md-fileinput(v-if='!preview && !value')
      | 选择图片
      input(type='file', @change='onFileChange', ref='file-input')
    md-button.md-success.md-round.md-fileinput.md-just-icon(v-else)
      md-icon refresh
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
    value: String,
    circle: { default: false, type: Boolean },
    placeholder: { default: "/img/image_placeholder.jpg", type: String },
    disabled: { default: false, type: Boolean }
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

<style lang="scss" scoped>
.file-input.img-circle .button-container {
  flex-direction: row;
}
</style>
