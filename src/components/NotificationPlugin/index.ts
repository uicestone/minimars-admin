import Notifications from "./Notifications.vue";
import { VueConstructor } from "vue";

class NotificationStore {
  static state: { timestamp: Date }[] = []; // here the notifications will be added

  static removeNotification(timestamp: Date) {
    const indexToDelete = this.state.findIndex(n => n.timestamp === timestamp);
    if (indexToDelete !== -1) {
      this.state.splice(indexToDelete, 1);
    }
  }
  static addNotification(notification: { timestamp: Date }) {
    notification.timestamp = new Date();
    notification.timestamp.setMilliseconds(
      notification.timestamp.getMilliseconds() + this.state.length
    );
    this.state.push(notification);
  }
  static notify(notification: { timestamp: Date } | { timestamp: Date }[]) {
    if (Array.isArray(notification)) {
      notification.forEach(notificationInstance => {
        this.addNotification(notificationInstance);
      });
    } else {
      this.addNotification(notification);
    }
  }
}

const NotificationsPlugin = {
  install(Vue: VueConstructor) {
    Vue.mixin({
      data() {
        return {
          notificationStore: NotificationStore
        };
      },
      methods: {
        notify(notification) {
          this.$root.notificationStore.notify(notification);
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
