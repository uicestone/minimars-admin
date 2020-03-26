<template lang="pug">
.content
  .md-layout
    .md-layout-item.md-size-66.md-small-size-100.mx-auto
      form(@submit.prevent='save')
        md-card
          md-card-header.md-card-header-icon.md-card-header-primary
            .card-icon
              md-icon card_giftcard
            h4.title {{ gift.title }}
          md-card-content.md-layout
            .md-layout-item.md-size-100
              md-field
                label 显示名称
                md-input(v-model='gift.title')
            .md-layout-item.md-small-size-100.md-size-25
              md-field
                label 库存
                md-input(type='number', v-model='gift.quantity')
            .md-layout-item.md-small-size-100.md-size-25
              md-field
                label 积分售价
                md-input(type='number', v-model='gift.priceInPoints')
            .md-layout-item.md-small-size-100.md-size-25
              md-field
                label 收款售价 ¥
                md-input(type='number', v-model='gift.price')
            .md-layout-item.md-small-size-100.md-size-25
              md-field
                label 门店
                md-select(v-model='gift.store')
                  md-option 不绑定门店
                  md-option(v-for='store in $stores', :key='store.id', :value='store.id') {{ store.name }}
            .md-layout-item.md-small-size-100
              md-field.md-has-value.mt-4
                label 内容
                editor(v-model='gift.content')
            .md-layout-item.md-size-100.text-right
              md-button.md-raised.md-primary.mt-4(type='submit') 保存
              md-button.mt-4.ml-2.md-simple.md-danger(type='button', @click='remove', v-if='this.gift.id') 删除
    .md-layout-item.md-size-33.md-small-size-100
      md-card
        .md-layout-item.md-size-100.md-xsmall-size-100.pb-2
          h4.card-title 封面图
          .file-input.mx-auto(style='display:block')
            .image-container.mx-auto
              img(:src="gift.posterUrl || posterImage || '/img/image_placeholder.jpg'")
            .button-container
              md-button.md-danger.md-round(@click='removeImage', v-if='posterImage || gift.posterUrl') 移除
              md-button.md-success.md-round.md-fileinput
                template(v-if='!posterImage && !gift.posterUrl') 选择图片
                template(v-else) 更换
                input(type='file', @change='onFileChange', ref='file-input')
</template>

<script>
// import { Datetime } from "vue-datetime";
// import "vue-datetime/dist/vue-datetime.css";
import { Gift } from "@/resources";
import { Editor } from "@/components";
import Swal from "sweetalert2";

export default {
  components: {
    Editor
  },
  data() {
    return {
      gift: { id: "", store: null },
      posterImage: ""
    };
  },
  methods: {
    async save() {
      if (this.$route.params.id === "add") {
        this.gift = (await Gift.save(this.gift)).body;
      } else {
        this.gift = (
          await Gift.update(
            {
              id: this.$route.params.id
            },
            this.gift
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
        this.$router.replace(`/gift/${this.gift.id}`);
      }
    },
    async remove() {
      if (
        !(
          await Swal.fire({
            title: "确定要删除这个礼品？",
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
      await Gift.delete({ id: this.gift.id });
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
      this.gift.posterUrl = fileObject.url;
    },
    removeImage: function(type) {
      this.posterImage = "";
      this.gift.posterUrl = null;
      this.$refs["file-input"].value = "";
    }
  },
  watch: {
    "gift.store"(v) {
      if (typeof v === "object" && v) {
        this.gift.store = this.gift.store.id;
      } else if (v === false) {
        this.gift.store = null;
      }
    }
  },
  async mounted() {
    if (this.$route.params.id !== "add") {
      this.gift = (await Gift.get({ id: this.$route.params.id })).body;
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
