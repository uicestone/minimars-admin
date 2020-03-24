<template lang="pug">
.content
  .md-layout
    .md-layout-item.md-size-66.md-small-size-100.mx-auto
      form(@submit.prevent='save')
        md-card
          md-card-header.md-card-header-icon.md-card-header-primary
            .card-icon
              md-icon event
            h4.title {{ event.title }}
          md-card-content.md-layout
            .md-layout-item.md-size-66
              md-field
                label 标题
                md-input(v-model='event.title')
            .md-layout-item.md-small-size-100.md-size-33
              md-datepicker(v-model='event.date', md-immediately='')
                label 日期
            .md-layout-item.md-small-size-100.md-size-33
              md-field
                label 门店
                md-select(v-model='event.store')
                  md-option 不绑定门店
                  md-option(v-for='store in $stores', :key='store.id', :value='store.id') {{ store.name }}
            .md-layout-item.md-small-size-100.md-size-33
              md-field
                label 积分售价
                md-input(type='number', v-model='event.priceInPoints')
            .md-layout-item.md-small-size-100.md-size-33
              md-field
                label 收款售价 ¥
                md-input(type='number', v-model='event.priceInCny')
            .md-layout-item.md-small-size-100
              md-field.md-has-value.mt-4
                label 内容
                editor(v-model='event.content')
            .md-layout-item.md-size-100.text-right
              md-button.md-raised.md-primary.mt-4(type='submit') 保存
              md-button.mt-4.ml-2.md-simple.md-danger(type='button', @click='remove', v-if='this.event.id') 删除
    .md-layout-item.md-size-33.md-small-size-100
      md-card
        .md-layout-item.md-size-100.md-xsmall-size-100.pb-2
          h4.card-title 封面图
          .file-input.mx-auto(style='display:block')
            .image-container.mx-auto
              img(:src="event.posterUrl || posterImage || '/img/image_placeholder.jpg'")
            .button-container
              md-button.md-danger.md-round(@click='removeImage', v-if='posterImage || event.posterUrl') 移除
              md-button.md-success.md-round.md-fileinput
                template(v-if='!posterImage && !event.posterUrl') 选择图片
                template(v-else='') 更换
                input(type='file', @change='onFileChange', ref='file-input')
</template>

<script>
// import { Datetime } from "vue-datetime";
// import "vue-datetime/dist/vue-datetime.css";
import { Event } from "@/resources";
import { Editor } from "@/components";
import Swal from "sweetalert2";

export default {
  components: {
    Editor
  },
  data() {
    return {
      event: { id: "", store: null },
      posterImage: ""
    };
  },
  methods: {
    async save() {
      if (this.$route.params.id === "add") {
        this.event = (await Event.save(this.event)).body;
      } else {
        this.event = (
          await Event.update(
            {
              id: this.$route.params.id,
              bypassBandIdsCheck: true,
              authBands: false
            },
            this.event
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
        this.$router.replace(`/event/${this.event.id}`);
      }
    },
    async remove() {
      if (
        !(
          await Swal.fire({
            title: "确定要删除这个活动？",
            text: `这个操作不可撤销，该活动的报名数据将被清空`,
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
      await Event.delete({ id: this.event.id });
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
      this.event.posterUrl = fileObject.url;
    },
    removeImage: function(type) {
      this.posterImage = "";
      this.event.posterUrl = null;
      this.$refs["file-input"].value = "";
    }
  },
  watch: {
    "event.date"(v) {
      if (!v.constructor || v.constructor.name !== "Date") {
        this.event.date = new Date(this.event.date);
      }
    },
    "event.store"(v) {
      if (typeof v === "object" && v) {
        this.event.store = this.event.store.id;
      } else if (v === false) {
        this.event.store = null;
      }
    }
  },
  async mounted() {
    if (this.$route.params.id !== "add") {
      this.event = (await Event.get({ id: this.$route.params.id })).body;
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
</style>
