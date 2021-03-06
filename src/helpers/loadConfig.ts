import { http } from "@/resources";
import {
  Config,
  Store,
  User,
  CardType,
  Coupon,
  Role
} from "@/resources/interfaces";

async function getHttpData(path: string) {
  return new Promise((resolve) => {
    http
      .get(path)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.error(err.message);
        resolve(true);
      });
  });
}

const loadConfig = async (configLoaded: Config = {}) => {
  const [config, stores, user, cardTypes, coupons, roles] = await Promise.all([
    Object.keys(configLoaded).length ? configLoaded : getHttpData("config"),
    configLoaded.stores || getHttpData("store"),
    configLoaded.user?.id
      ? configLoaded.user
      : localStorage.token && getHttpData("auth/user"),
    configLoaded.cardTypes ||
      (localStorage.token && getHttpData("card-type?limit=false")),
    configLoaded.coupons ||
      (localStorage.token && getHttpData("coupon?enabled=true&limit=false")),
    configLoaded.roles ||
      (localStorage.token && getHttpData("role?limit=false"))
  ]);

  return {
    ...(config as Config),
    stores: stores as Store[],
    user: user as User,
    cardTypes: cardTypes as CardType[],
    coupons: coupons as Coupon[],
    roles: roles as Role[]
  };
};

export default loadConfig;
