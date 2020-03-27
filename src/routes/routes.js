import DashboardLayout from "@/pages/Dashboard/Layout/DashboardLayout.vue";
import AuthLayout from "@/pages/Dashboard/Pages/AuthLayout.vue";

// Dashboard pages
import Dashboard from "@/pages/Dashboard/Dashboard.vue";

// Pages
const User = () => import("@/pages/Dashboard/User/UserProfile.vue");
const UserList = () => import("@/pages/Dashboard/User/UserList.vue");
const Booking = () => import("@/pages/Dashboard/Booking/BookingDetail.vue");
const BookingList = () => import("@/pages/Dashboard/Booking/BookingList.vue");
const CardType = () => import("@/pages/Dashboard/CardType/CardTypeDetail.vue");
const CardTypeList = () =>
  import("@/pages/Dashboard/CardType/CardTypeList.vue");
const Event = () => import("@/pages/Dashboard/Event/EventDetail.vue");
const EventList = () => import("@/pages/Dashboard/Event/EventList.vue");
const Gift = () => import("@/pages/Dashboard/Gift/GiftDetail.vue");
const GiftList = () => import("@/pages/Dashboard/Gift/GiftList.vue");
// const Payment = () => import("@/pages/Dashboard/Payment/PaymentDetail.vue");
const PaymentList = () => import("@/pages/Dashboard/Payment/PaymentList.vue");
const Post = () => import("@/pages/Dashboard/Post/PostDetail.vue");
const PostList = () => import("@/pages/Dashboard/Post/PostList.vue");
// const Store = () => import("@/pages/Dashboard/Store/StoreDetail.vue");
const StoreList = () => import("@/pages/Dashboard/Store/StoreList.vue");
const ConfigList = () => import("@/pages/Dashboard/Config/ConfigList.vue");
const Config = () => import("@/pages/Dashboard/Config/Config.vue");
const Login = () => import("@/pages/Dashboard/Pages/Login.vue");

let bookingMenu = {
  path: "/booking",
  component: DashboardLayout,
  redirect: "/booking/index",
  children: [
    {
      path: "index",
      name: "预约列表",
      component: BookingList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: ":id",
      name: "预约详情",
      component: Booking
    }
  ]
};

let cardTypeMenu = {
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
      component: CardType
    }
  ]
};

let eventMenu = {
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
      component: Event
    }
  ]
};

let giftMenu = {
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
      component: Gift
    }
  ]
};

let paymentMenu = {
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

let postMenu = {
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
      component: Post
    }
  ]
};

let storeMenu = {
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
    }
    // {
    //   path: ":id",
    //   name: "门店详情",
    //   component: Store
    // }
  ]
};

let configMenu = {
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

let userMenu = {
  path: "/user",
  component: DashboardLayout,
  redirect: "/user/index",
  children: [
    {
      path: "index",
      name: "用户列表",
      component: UserList,
      meta: {
        keepAlive: true
      }
    },
    {
      path: ":id",
      name: "用户详情",
      component: User
    }
  ]
};

let authPages = {
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

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
    name: "Home"
  },
  bookingMenu,
  cardTypeMenu,
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
      }
    ]
  }
];

export default routes;
