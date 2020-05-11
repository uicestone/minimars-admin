import { http } from "@/resources";
import { Config, Store, User, CardType, Coupon } from "@/resources/interfaces";

async function getHttpData(path: string) {
  return new Promise(resolve => {
    http
      .get(path)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        console.error(err);
        resolve();
      });
  });
}

const loadConfig = async (configLoaded: Config = {}) => {
  const [config, stores, user, cardTypes, coupons] = await Promise.all([
    getHttpData("config"),
    configLoaded.stores || getHttpData("store"),
    configLoaded.user || getHttpData("auth/user"),
    configLoaded.cardTypes || getHttpData("card-type"),
    configLoaded.coupons || getHttpData("coupon?enabled=true")
  ]);

  return {
    ...(config as Config),
    stores: stores as Store[],
    user: user as User,
    cardTypes: cardTypes as CardType[],
    coupons: coupons as Coupon[]
  };
};

export default loadConfig;
