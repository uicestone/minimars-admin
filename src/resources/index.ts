import Axios, { AxiosRequestConfig } from "axios";
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

http.interceptors.request.use((request: AxiosRequestConfig) => {
  const token = window.localStorage.getItem("token");

  if (token) {
    request.headers["Authorization"] = token;
  }
  // stop request and return 401 response when no token exist except for login request
  if (
    !["auth/login", "config", "store"].includes(request.url || "") &&
    !window.localStorage.getItem("token")
  ) {
    window.location.hash = "#/login";
    return Promise.reject(new Error("No token exists, login required."));
  }
  return request;
});

http.interceptors.response.use(
  res => res,
  err => {
    // console.log("http.interceptors.response", err);
    const { response } = err;
    if (!response) return Promise.reject(err);
    // redirect to login page on any 401 response
    if (response.status === 401 && window.location.hash !== "#/login") {
      window.location.hash = "#/login";
      window.localStorage.removeItem("token");
    }
    return Promise.reject(err);
  }
);

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
