<template lang="pug">
md-select(v-model='storeName' @md-selected="onStoreNameChanged" @keypress.enter.prevent :disabled="disabled")
  md-option(v-for='name in $stores.map(s=>s.name)', :key='name', :value='name') {{ name }}
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { Store } from "../resources/interfaces";

@Component
export default class StoreSelect extends Vue {
  @Prop({ default: false })
  disabled!: boolean;

  @Prop()
  value!: Store;

  storeName = "";

  @Watch("value") onValueChanged() {
    if (this.value && this.value.name) {
      this.storeName = this.value.name;
    }
  }

  onStoreNameChanged(v: string) {
    console.log("StoreSelect storeName changed:", v);
    this.$emit(
      "input",
      this.$stores.find(s => s.name === this.storeName)
    );
  }

  created() {
    this.onValueChanged();
  }
}
</script>
