import DashboardLayout from "@/pages/Dashboard/Layout/DashboardLayout.vue";
import AuthLayout from "@/pages/Dashboard/Pages/AuthLayout.vue";

// Dashboard pages
import Dashboard from "@/pages/Dashboard/Dashboard.vue";
import BossBoard from "@/pages/Dashboard/BossBoard.vue";
import { RouteConfig } from "vue-router";

// Pages
const UserProfile = () => import("@/pages/Dashboard/User/UserProfile.vue");
const UserList = () => import("@/pages/Dashboard/User/UserList.vue");
const StaffProfile = () => import("@/pages/Dashboard/User/StaffProfile.vue");
const StaffList = () => import("@/pages/Dashboard/User/StaffList.vue");
const BookingDetail = () =>
  import("@/pages/Dashboard/Booking/BookingDetail.vue");
const BookingList = () => import("@/pages/Dashboard/Booking/BookingList.vue");
const CardTypeDetail = () =>
  import("@/pages/Dashboard/CardType/CardTypeDetail.vue");
const CardTypeList = () =>
  import("@/pages/Dashboard/CardType/CardTypeList.vue");
const CouponDetail = () => import("@/pages/Dashboard/Coupon/CouponDetail.vue");
const CouponList = () => import("@/pages/Dashboard/Coupon/CouponList.vue");
const EventDetail = () => import("@/pages/Dashboard/Event/EventDetail.vue");
const EventList = () => import("@/pages/Dashboard/Event/EventList.vue");
const GiftDetail = () => import("@/pages/Dashboard/Gift/GiftDetail.vue");
const GiftList = () => import("@/pages/Dashboard/Gift/GiftList.vue");
// const Payment = () => import("@/pages/Dashboard/Payment/PaymentDetail.vue");
const PaymentList = () => import("@/pages/Dashboard/Payment/PaymentList.vue");
const PostDetail = () => import("@/pages/Dashboard/Post/PostDetail.vue");
const PostList = () => import("@/pages/Dashboard/Post/PostList.vue");
const StoreDetail = () => import("@/pages/Dashboard/Store/StoreDetail.vue");
const StoreList = () => import("@/pages/Dashboard/Store/StoreList.vue");
const ConfigList = () => import("@/pages/Dashboard/Config/ConfigList.vue");
const Config = () => import("@/pages/Dashboard/Config/Config.vue");
const Login = () => import("@/pages/Dashboard/Pages/Login.vue");

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
  redirect: "/user/customer",
  children: [
    {
      path: "staff",
      name: "职员列表",
      component: StaffList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: "staff/add",
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
      path: "staff/:id",
      name: "职员详情",
      component: StaffProfile
    },
    {
      path: "customer",
      name: "客户列表",
      component: UserList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: "add",
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
      path: ":id",
      name: "客户详情",
      component: UserProfile
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
    // redirect: "/dashboard",
    name: "Home"
  },
  bookingMenu,
  cardTypeMenu,
  couponMenu,
  eventMenu,
  giftMenu,
  paymentMenu,
  postMenu,
  storeMenu,
  configMenu,
  userMenu,
  authPages,
  {
    path: "/",
    component: DashboardLayout,
    children: [
      {
        path: "dashboard",
        name: "数据统计",
        components: { default: Dashboard }
      },
      {
        path: "boss-board",
        name: "Boss Board",
        components: { default: BossBoard }
      }
    ]
  }
];

export default routes;
