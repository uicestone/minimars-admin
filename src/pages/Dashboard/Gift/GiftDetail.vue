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
                md-input(type='number', step='0.01', v-model='gift.priceInPoints')
            .md-layout-item.md-small-size-100.md-size-25
              md-field
                label 收款售价 ¥
                md-input(type='number', step='0.01', v-model='gift.price')
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
          poster(v-model="gift.posterUrl")
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { Gift, Store } from "@/resources/interfaces";
import { GiftResource } from "@/resources";
import { Editor, Poster } from "@/components";
import { confirm } from "@/helpers/sweetAlert";

@Component({
  components: {
    Editor,
    Poster
  }
})
export default class GiftDetail extends Vue {
  gift: Partial<Gift> = { id: "", store: null };
  posterImage = "";
  async save() {
    this.gift = await GiftResource.save(this.gift);
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
  }
  async remove() {
    if (
      !(await confirm(
        "确定要删除这个礼品",
        `这个操作不可撤销`,
        "确定删除",
        "error"
      ))
    )
      return;
    await GiftResource.delete({ id: this.gift.id });
    this.$router.go(-1);
  }
  @Watch("gift.store") onGiftStoreUpdate(v: Store | false) {
    if (typeof v === "object" && v) {
      // @ts-ignore
      this.gift.store = this.gift.store.id;
    } else if (v === false) {
      this.gift.store = null;
    }
  }
  async mounted() {
    if (this.$route.params.id !== "add") {
      this.gift = await GiftResource.get({ id: this.$route.params.id });
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
