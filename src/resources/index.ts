// @ts-nocheck
import Vue from "vue";

const Booking = new Vue.resource("booking{/id}");
const BookingPrice = new Vue.resource(
  "booking-price",
  {},
  { update: { method: "POST" } }
);
const Card = new Vue.resource("card{/id}");
const CardType = new Vue.resource("card-type{/id}");
const Code = new Vue.resource("code{/id}");
const Config = new Vue.resource("config{/key}");
const Event = new Vue.resource("event{/id}");
const Gift = new Vue.resource("gift{/id}");
const Payment = new Vue.resource("payment{/id}");
const Post = new Vue.resource("post{/id}");
const Store = new Vue.resource("store{/id}");
const User = new Vue.resource("user{/id}");

export {
  Booking,
  BookingPrice,
  Card,
  CardType,
  Code,
  Config,
  Event,
  Gift,
  Payment,
  Post,
  Store,
  User
};
