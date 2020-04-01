import Notifications from "./Notifications.vue";

const NotificationStore = {
  state: [], // here the notifications will be added

  // @ts-ignore
  removeNotification(timestamp) {
    // @ts-ignore
    const indexToDelete = this.state.findIndex(n => n.timestamp === timestamp);
    if (indexToDelete !== -1) {
      this.state.splice(indexToDelete, 1);
    }
  },
  // @ts-ignore
  addNotification(notification) {
    notification.timestamp = new Date();
    notification.timestamp.setMilliseconds(
      notification.timestamp.getMilliseconds() + this.state.length
    );
    // @ts-ignore
    this.state.push(notification);
  },
  // @ts-ignore
  notify(notification) {
    if (Array.isArray(notification)) {
      notification.forEach(notificationInstance => {
        this.addNotification(notificationInstance);
      });
    } else {
      this.addNotification(notification);
    }
  }
};

const NotificationsPlugin = {
  // @ts-ignore
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          notificationStore: NotificationStore
        };
      },
      methods: {
        // @ts-ignore
        notify(notification) {
          // @ts-ignore
          this.notificationStore.notify(notification);
        }
      }
    });
    Object.defineProperty(Vue.prototype, "$notify", {
      get() {
        return this.$root.notify;
      }
    });
    Object.defineProperty(Vue.prototype, "$notifications", {
      get() {
        return this.$root.notificationStore;
      }
    });
    Vue.component("Notifications", Notifications);
  }
};

export default NotificationsPlugin;
