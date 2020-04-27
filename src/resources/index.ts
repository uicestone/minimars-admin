import Axios from "axios";
import Resource from "./Resource";
import {
  User,
  Booking,
  Card,
  CardType,
  Event,
  Gift,
  Payment,
  Post,
  Store,
  ConfigItem,
  Coupon
} from "./interfaces";

export const http = Axios.create({
  baseURL: process.env.VUE_APP_API_BASE
});

export const BookingResource = new Resource<Booking>(http, "booking/{id}");

export const BookingPriceResource = new Resource<Booking>(
  http,
  "booking-price"
);

export const CardResource = new Resource<Card>(http, "card/{id}");

export const CardTypeResource = new Resource<CardType>(http, "card-type/{id}");

export const CouponResource = new Resource<Coupon>(http, "coupon/{id}");

export const ConfigItemResource = new Resource<ConfigItem>(
  http,
  "config/{key}"
);

export const EventResource = new Resource<Event>(http, "event/{id}");

export const GiftResource = new Resource<Gift>(http, "gift/{id}");

export const PaymentResource = new Resource<Payment>(http, "payment/{id}");

export const PostResource = new Resource<Post>(http, "post/{id}");

export const StoreResource = new Resource<Store>(http, "store/{id}");

export const UserResource = new Resource<User>(http, "user/{id}");
