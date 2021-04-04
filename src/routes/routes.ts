import DashboardLayout from "@/pages/Dashboard/Layout/DashboardLayout.vue";
import AuthLayout from "@/pages/Dashboard/Pages/AuthLayout.vue";

import { RouteConfig } from "vue-router";

// Dashboard pages
const Dashboard = () =>
  import(/* webpackChunkName: "dashboard" */ "@/pages/Dashboard/Dashboard.vue");
const BossBoard = () =>
  import(/* webpackChunkName: "dashboard" */ "@/pages/Dashboard/BossBoard.vue");
// Pages
const UserProfile = () =>
  import(
    /* webpackChunkName: "user" */ "@/pages/Dashboard/User/UserProfile.vue"
  );
const UserList = () =>
  import(/* webpackChunkName: "user" */ "@/pages/Dashboard/User/UserList.vue");
const StaffProfile = () =>
  import(
    /* webpackChunkName: "user" */ "@/pages/Dashboard/User/StaffProfile.vue"
  );
const StaffList = () =>
  import(/* webpackChunkName: "user" */ "@/pages/Dashboard/User/StaffList.vue");
const BookingDetail = () =>
  import(
    /* webpackChunkName: "booking" */ "@/pages/Dashboard/Booking/BookingDetail.vue"
  );
const BookingList = () =>
  import(
    /* webpackChunkName: "booking" */ "@/pages/Dashboard/Booking/BookingList.vue"
  );
const CardTypeDetail = () =>
  import(
    /* webpackChunkName: "booking" */ "@/pages/Dashboard/CardType/CardTypeDetail.vue"
  );
const CardTypeList = () =>
  import(
    /* webpackChunkName: "booking" */ "@/pages/Dashboard/CardType/CardTypeList.vue"
  );
const CardList = () =>
  import(
    /* webpackChunkName: "booking" */ "@/pages/Dashboard/Card/CardList.vue"
  );
const CouponDetail = () =>
  import(
    /* webpackChunkName: "booking" */ "@/pages/Dashboard/Coupon/CouponDetail.vue"
  );
const CouponList = () =>
  import(
    /* webpackChunkName: "booking" */ "@/pages/Dashboard/Coupon/CouponList.vue"
  );
const EventDetail = () =>
  import(
    /* webpackChunkName: "booking" */ "@/pages/Dashboard/Event/EventDetail.vue"
  );
const EventList = () =>
  import(
    /* webpackChunkName: "booking" */ "@/pages/Dashboard/Event/EventList.vue"
  );
const GiftDetail = () =>
  import(
    /* webpackChunkName: "booking" */ "@/pages/Dashboard/Gift/GiftDetail.vue"
  );
const GiftList = () =>
  import(
    /* webpackChunkName: "booking" */ "@/pages/Dashboard/Gift/GiftList.vue"
  );
// const Payment = () => import("@/pages/Dashboard/Payment/PaymentDetail.vue");
const PaymentList = () =>
  import(
    /* webpackChunkName: "payment" */ "@/pages/Dashboard/Payment/PaymentList.vue"
  );
const PostDetail = () =>
  import(
    /* webpackChunkName: "misc" */ "@/pages/Dashboard/Post/PostDetail.vue"
  );
const PostList = () =>
  import(/* webpackChunkName: "misc" */ "@/pages/Dashboard/Post/PostList.vue");
const StoreDetail = () =>
  import(
    /* webpackChunkName: "misc" */ "@/pages/Dashboard/Store/StoreDetail.vue"
  );
const StoreList = () =>
  import(
    /* webpackChunkName: "misc" */ "@/pages/Dashboard/Store/StoreList.vue"
  );
const RoleDetail = () =>
  import(
    /* webpackChunkName: "misc" */ "@/pages/Dashboard/User/RoleDetail.vue"
  );
const RoleList = () =>
  import(/* webpackChunkName: "misc" */ "@/pages/Dashboard/User/RoleList.vue");
const ConfigList = () =>
  import(
    /* webpackChunkName: "misc" */ "@/pages/Dashboard/Config/ConfigList.vue"
  );
const Config = () =>
  import(/* webpackChunkName: "misc" */ "@/pages/Dashboard/Config/Config.vue");
const Login = () =>
  import(/* webpackChunkName: "misc" */ "@/pages/Dashboard/Pages/Login.vue");

const bookingMenu: RouteConfig = {
  path: "/booking",
  component: DashboardLayout,
  redirect: "/booking/play",
  children: [
    {
      path: ":type/add",
      name: "添加预约",
      component: BookingDetail,
      props: {
        add: true
      },
      meta: {
        keepAlive: true
      }
    },
    {
      alias: "play",
      path: ":type",
      name: "票务管理",
      component: BookingList,
      meta: {
        keepAlive: true
      }
    },
    {
      alias: "event",
      path: ":type",
      name: "活动预约",
      component: BookingList,
      meta: {
        keepAlive: true
      }
    },
    {
      alias: "gift",
      path: ":type",
      name: "礼品兑换",
      component: BookingList,
      meta: {
        keepAlive: true
      }
    },
    {
      alias: "food",
      path: ":type",
      name: "餐饮消费",
      component: BookingList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: ":type/:id",
      name: "预约详情",
      component: BookingDetail
    }
  ]
};

const cardMenu: RouteConfig = {
  path: "/card",
  component: DashboardLayout,
  redirect: "/card/index",
  children: [
    {
      path: "index",
      name: "卡券明细",
      component: CardList,
      meta: {
        keepAlive: true
      }
    }
  ]
};

const cardTypeMenu: RouteConfig = {
  path: "/card-type",
  component: DashboardLayout,
  redirect: "/card-type/index",
  children: [
    {
      path: "index",
      name: "卡片种类",
      component: CardTypeList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: ":id",
      name: "卡种详情",
      component: CardTypeDetail
    }
  ]
};

const couponMenu: RouteConfig = {
  path: "/coupon",
  component: DashboardLayout,
  redirect: "/coupon/index",
  children: [
    {
      path: "index",
      name: "优惠",
      component: CouponList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: ":id",
      name: "优惠详情",
      component: CouponDetail
    }
  ]
};

const eventMenu: RouteConfig = {
  path: "/event",
  component: DashboardLayout,
  redirect: "/event/index",
  children: [
    {
      path: "index",
      name: "活动列表",
      component: EventList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: ":id",
      name: "活动详情",
      component: EventDetail
    }
  ]
};

const giftMenu: RouteConfig = {
  path: "/gift",
  component: DashboardLayout,
  redirect: "/gift/index",
  children: [
    {
      path: "index",
      name: "礼品列表",
      component: GiftList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: ":id",
      name: "礼品详情",
      component: GiftDetail
    }
  ]
};

const paymentMenu: RouteConfig = {
  path: "/payment",
  component: DashboardLayout,
  redirect: "/payment/index",
  children: [
    {
      path: "index",
      name: "流水明细",
      component: PaymentList,
      meta: {
        keepAlive: true
      }
    }
    // {
    //   path: ":id",
    //   name: "流水详情",
    //   component: Payment
    // }
  ]
};

const postMenu: RouteConfig = {
  path: "/post",
  component: DashboardLayout,
  redirect: "/post/index",
  children: [
    {
      path: "index",
      name: "文章列表",
      component: PostList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: ":id",
      name: "文章详情",
      component: PostDetail
    }
  ]
};

const storeMenu: RouteConfig = {
  path: "/store",
  component: DashboardLayout,
  redirect: "/store/index",
  children: [
    {
      path: "index",
      name: "门店明细",
      component: StoreList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: ":id",
      name: "门店详情",
      component: StoreDetail
    }
  ]
};

const configMenu: RouteConfig = {
  path: "/config",
  component: DashboardLayout,
  redirect: "/config/index",
  children: [
    {
      path: "index",
      name: "配置列表",
      component: ConfigList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: ":key",
      name: "配置详情",
      component: Config
    }
  ]
};

const userMenu: RouteConfig = {
  path: "/user",
  component: DashboardLayout,
  children: [
    {
      path: "/staff",
      name: "职员列表",
      component: StaffList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: "/staff/add",
      name: "添加职员",
      component: StaffProfile,
      props: {
        add: true
      },
      meta: {
        keepAlive: true
      }
    },
    {
      path: "/staff/:id",
      name: "职员详情",
      component: StaffProfile
    },
    {
      path: "/user",
      name: "客户列表",
      component: UserList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: "/user/add",
      name: "添加客户",
      component: UserProfile,
      props: {
        add: true
      },
      meta: {
        keepAlive: true
      }
    },
    {
      path: "/user/:id",
      name: "客户详情",
      component: UserProfile
    }
  ]
};

const roleMenu: RouteConfig = {
  path: "/role",
  component: DashboardLayout,
  children: [
    {
      path: "/role",
      name: "角色列表",
      component: RoleList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: "/role/add",
      name: "添加角色",
      component: RoleDetail,
      props: {
        add: true
      },
      meta: {
        keepAlive: true
      }
    },
    {
      path: "/role/:id",
      name: "角色详情",
      component: RoleDetail
    }
  ]
};

const authPages = {
  path: "/",
  component: AuthLayout,
  name: "Authentication",
  children: [
    {
      path: "/login",
      name: "用户登录",
      component: Login
    }
  ]
};

const routes: RouteConfig[] = [
  {
    path: "/",
    redirect: "/dashboard",
    name: "Home"
  },
  bookingMenu,
  cardMenu,
  cardTypeMenu,
  couponMenu,
  eventMenu,
  giftMenu,
  paymentMenu,
  postMenu,
  storeMenu,
  configMenu,
  userMenu,
  roleMenu,
  authPages,
  {
    path: "/",
    component: DashboardLayout,
    children: [
      {
        path: "dashboard",
        name: "数据统计",
        component: Dashboard
      },
      {
        path: "boss-board",
        name: "Boss Board",
        component: BossBoard
      }
    ]
  }
];

export default routes;
