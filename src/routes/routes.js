import DashboardLayout from "@/pages/Dashboard/Layout/DashboardLayout.vue";
import AuthLayout from "@/pages/Dashboard/Pages/AuthLayout.vue";

// Dashboard pages
import Dashboard from "@/pages/Dashboard/Dashboard.vue";

// Pages
const User = () => import("@/pages/Dashboard/User/UserProfile.vue");
const UserList = () => import("@/pages/Dashboard/User/UserList.vue");
const Booking = () => import("@/pages/Dashboard/Booking/BookingDetail.vue");
const BookingList = () => import("@/pages/Dashboard/Booking/BookingList.vue");
// const Code = () => import("@/pages/Dashboard/Code/CodeDetail.vue");
const CodeList = () => import("@/pages/Dashboard/Code/CodeList.vue");
// const Payment = () => import("@/pages/Dashboard/Payment/PaymentDetail.vue");
const PaymentList = () => import("@/pages/Dashboard/Payment/PaymentList.vue");
// const Store = () => import("@/pages/Dashboard/Store/StoreDetail.vue");
const StoreList = () => import("@/pages/Dashboard/Store/StoreList.vue");
const ConfigList = () => import("@/pages/Dashboard/Config/ConfigList.vue");
const Config = () => import("@/pages/Dashboard/Config/Config.vue");
const Pricing = () => import("@/pages/Dashboard/Pages/Pricing.vue");
const TimeLine = () => import("@/pages/Dashboard/Pages/TimeLinePage.vue");
const RtlSupport = () => import("@/pages/Dashboard/Pages/RtlSupport.vue");
const Login = () => import("@/pages/Dashboard/Pages/Login.vue");
const Register = () => import("@/pages/Dashboard/Pages/Register.vue");
const Lock = () => import("@/pages/Dashboard/Pages/Lock.vue");

// Components pages
const Buttons = () => import("@/pages/Dashboard/Components/Buttons.vue");
const GridSystem = () => import("@/pages/Dashboard/Components/GridSystem.vue");
const Panels = () => import("@/pages/Dashboard/Components/Panels.vue");
const SweetAlert = () => import("@/pages/Dashboard/Components/SweetAlert.vue");
const Notifications = () =>
  import("@/pages/Dashboard/Components/Notifications.vue");
const Icons = () => import("@/pages/Dashboard/Components/Icons.vue");
const Typography = () => import("@/pages/Dashboard/Components/Typography.vue");

// Forms pages
const RegularForms = () => import("@/pages/Dashboard/Forms/RegularForms.vue");
const ExtendedForms = () => import("@/pages/Dashboard/Forms/ExtendedForms.vue");
const ValidationForms = () =>
  import("@/pages/Dashboard/Forms/ValidationForms.vue");
const Wizard = () => import("@/pages/Dashboard/Forms/Wizard.vue");

// TableList pages
const RegularTables = () =>
  import("@/pages/Dashboard/Tables/RegularTables.vue");
const ExtendedTables = () =>
  import("@/pages/Dashboard/Tables/ExtendedTables.vue");
const PaginatedTables = () =>
  import("@/pages/Dashboard/Tables/PaginatedTables.vue");

// Maps pages
const GoogleMaps = () => import("@/pages/Dashboard/Maps/GoogleMaps.vue");
const FullScreenMap = () => import("@/pages/Dashboard/Maps/FullScreenMap.vue");
const VectorMaps = () => import("@/pages/Dashboard/Maps/VectorMaps.vue");

// Calendar
const Calendar = () => import("@/pages/Dashboard/Calendar.vue");
// Charts
const Charts = () => import("@/pages/Dashboard/Charts.vue");
const Widgets = () => import("@/pages/Dashboard/Widgets.vue");

let componentsMenu = {
  path: "/components",
  component: DashboardLayout,
  redirect: "/components/buttons",
  name: "Components",
  children: [
    {
      path: "buttons",
      name: "Buttons",
      components: { default: Buttons }
    },
    {
      path: "grid-system",
      name: "Grid System",
      components: { default: GridSystem }
    },
    {
      path: "panels",
      name: "Panels",
      components: { default: Panels }
    },
    {
      path: "sweet-alert",
      name: "Sweet Alert",
      components: { default: SweetAlert }
    },
    {
      path: "notifications",
      name: "Notifications",
      components: { default: Notifications }
    },
    {
      path: "icons",
      name: "Icons",
      components: { default: Icons }
    },
    {
      path: "typography",
      name: "Typography",
      components: { default: Typography }
    }
  ]
};
let formsMenu = {
  path: "/forms",
  component: DashboardLayout,
  redirect: "/forms/regular",
  name: "Forms",
  children: [
    {
      path: "regular",
      name: "Regular Forms",
      components: { default: RegularForms }
    },
    {
      path: "extended",
      name: "Extended Forms",
      components: { default: ExtendedForms }
    },
    {
      path: "validation",
      name: "Validation Forms",
      components: { default: ValidationForms }
    },
    {
      path: "wizard",
      name: "Wizard",
      components: { default: Wizard }
    }
  ]
};

let tablesMenu = {
  path: "/table-list",
  component: DashboardLayout,
  redirect: "/table-list/regular",
  name: "Tables",
  children: [
    {
      path: "regular",
      name: "Regular Tables",
      components: { default: RegularTables }
    },
    {
      path: "extended",
      name: "Extended Tables",
      components: { default: ExtendedTables }
    },
    {
      path: "paginated",
      name: "Pagianted Tables",
      components: { default: PaginatedTables }
    }
  ]
};

let mapsMenu = {
  path: "/maps",
  component: DashboardLayout,
  name: "Maps",
  redirect: "/maps/google",
  children: [
    {
      path: "google",
      name: "Google Maps",
      components: { default: GoogleMaps }
    },
    {
      path: "full-screen",
      name: "Full Screen Map",
      meta: {
        hideContent: true,
        hideFooter: true,
        navbarAbsolute: true
      },
      components: { default: FullScreenMap }
    },
    {
      path: "vector-map",
      name: "Vector Map",
      components: { default: VectorMaps }
    }
  ]
};

let pagesMenu = {
  path: "/pages",
  component: DashboardLayout,
  name: "Pages",
  redirect: "/pages/user",
  children: [
    {
      path: "user",
      name: "User Page",
      components: { default: User }
    },
    {
      path: "timeline",
      name: "Timeline Page",
      components: { default: TimeLine }
    },
    {
      path: "rtl",
      name: "وحة القيادة",
      meta: {
        rtlActive: true
      },
      components: { default: RtlSupport }
    }
  ]
};

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

let codeMenu = {
  path: "/code",
  component: DashboardLayout,
  redirect: "/code/index",
  children: [
    {
      path: "index",
      name: "券码列表",
      component: CodeList,
      meta: {
        keepAlive: true
      }
    }
    // {
    //   path: ":id",
    //   name: "券码详情",
    //   component: Code
    // }
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

let storeMenu = {
  path: "/store",
  component: DashboardLayout,
  redirect: "/store/index",
  children: [
    {
      path: "index",
      name: "场馆明细",
      component: StoreList,
      meta: {
        keepAlive: true
      }
    }
    // {
    //   path: ":id",
    //   name: "场馆详情",
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
    },
    {
      path: "/register",
      name: "用户注册",
      component: Register
    },
    {
      path: "/pricing",
      name: "Pricing",
      component: Pricing
    },
    {
      path: "/lock",
      name: "锁定",
      component: Lock
    }
  ]
};

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
    name: "Home"
  },
  componentsMenu,
  formsMenu,
  tablesMenu,
  mapsMenu,
  pagesMenu,
  bookingMenu,
  codeMenu,
  paymentMenu,
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
        path: "calendar",
        name: "Calendar",
        components: { default: Calendar }
      },
      {
        path: "charts",
        name: "Charts",
        components: { default: Charts }
      },
      {
        path: "widgets",
        name: "Widgets",
        components: { default: Widgets }
      }
    ]
  }
];

export default routes;
