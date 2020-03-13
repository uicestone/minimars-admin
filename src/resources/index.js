import Vue from "vue";

const Booking = new Vue.resource("booking{/id}");
const Code = new Vue.resource("code{/id}");
const Config = new Vue.resource("config{/key}");
const Payment = new Vue.resource("payment{/id}");
const Store = new Vue.resource("store{/id}");
const User = new Vue.resource("user{/id}");

export { Booking, Code, Config, Payment, Store, User };
