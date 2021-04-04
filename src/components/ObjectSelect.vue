<template lang="pug">
md-select(v-model='itemValue' @md-selected="onItemSelect" @keypress.enter.prevent :disabled="disabled" :multiple="multiple")
  md-option(v-for='item in items', :key='item[itemKey]', :value='item[itemKey]') {{ item[itemText] }}
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";

@Component
export default class ObjectSelect extends Vue {
  @Prop({ default: false })
  disabled!: boolean;

  @Prop({ default: false })
  multiple!: boolean;

  @Prop({ default: "id" })
  itemKey!: string;

  @Prop({ default: "name" })
  itemText!: string;

  @Prop({ type: Array })
  items!: any[];

  @Prop()
  value!: any;

  itemValue: string[] | string = this.multiple ? [] : "";

  @Watch("value", { immediate: true }) onValueChanged(v: any | any[]) {
    if (!this.multiple && v && v[this.itemKey] !== undefined) {
      this.itemValue = v[this.itemKey];
    }
    if (this.multiple && Array.isArray(v)) {
      this.itemValue = v.map(v => v[this.itemKey]);
    }
  }

  onItemSelect(v: string | string[]) {
    this.$emit(
      "input",
      this.multiple
        ? this.items.filter(s => v.includes(s[this.itemKey]))
        : this.items.find(s => s[this.itemKey] === v)
    );
  }
}
</script>
