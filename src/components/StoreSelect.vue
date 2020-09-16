<template lang="pug">
md-select(v-model='fieldValue' @md-selected="onFieldValueSelected" @keypress.enter.prevent :disabled="disabled" :multiple="multiple")
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

  @Prop({ default: false })
  multiple!: boolean;

  @Prop()
  value!: Store | Store[];

  fieldValue: string[] | string = this.multiple ? [] : "";

  isStore(o: any): o is Store {
    return o && typeof o === "object" && "member" in o;
  }

  @Watch("value", { immediate: true }) onValueChanged() {
    if (
      !this.multiple &&
      this.value &&
      this.isStore(this.value) &&
      this.value.name
    ) {
      this.fieldValue = this.value.name;
    }
    if (this.multiple && !this.isStore(this.value)) {
      this.fieldValue = this.value.map(v => v.name);
    }
  }

  onFieldValueSelected(v: string | string[]) {
    if (
      (this.isStore(this.value) && this.value.name === v) ||
      (!this.isStore(this.value) &&
        v instanceof Array &&
        this.value.map(s => s.name).join() === v.join())
    )
      return;
    console.log("StoreSelect fieldValue selected:", v);
    this.$emit(
      "input",
      this.multiple
        ? this.$stores.filter(s => v.includes(s.name))
        : this.$stores.find(s => s.name === v)
    );
  }
}
</script>
