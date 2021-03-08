import DropDown from "@/components/Dropdown.vue";
/**
 * You can register global components here and use them as a plugin in your main Vue instance
 */

const globalComponents = {
  // @ts-ignore
  install(Vue) {
    Vue.component("drop-down", DropDown);
  }
};

export default globalComponents;
