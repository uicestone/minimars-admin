// @ts-ignore
import { directive as vClickOutside } from "vue-clickaway";

/**
 * You can register global directives here and use them as a plugin in your main Vue instance
 */

const globalDirectives = {
  // @ts-ignore
  install(Vue) {
    Vue.directive("click-outside", vClickOutside);
  }
};

export default globalDirectives;
