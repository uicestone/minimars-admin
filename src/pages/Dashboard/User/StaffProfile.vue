<template lang="pug">
.content
  .md-layout
    .md-layout-item.md-medium-size-100.md-size-60.mx-auto
      form(@submit.prevent='save')
        md-card
          md-card-header.md-card-header-icon.md-card-header-green
            .card-icon
              md-icon perm_identity
            h4.title 职员详情
              span(v-if="user.id" @click="$clipboard(user.id, '职员ID')")
                span {{ user.id.substr(-4).toUpperCase() }}
                md-icon(style="font-size:15px !important") file_copy
          md-card-content.md-layout
            .md-layout-item.md-size-25
              poster.pt-4(v-model="user.avatarUrl" placeholder="/img/placeholder.jpg" circle disabled)
            .md-layout-item.md-size-75.md-layout.md-alignment-vertical
              .md-layout-item.md-small-size-100.md-size-33(v-if="1||$user.can('edit-user')")
                md-field
                  label 角色
                  object-select(v-model='user.role', :disabled="readonly" :items="$roles")
              .md-layout-item.md-small-size-100.md-size-33
                md-field
                  label 手机号
                  md-input(v-model='user.mobile', type='text' :disabled="readonly")
              .md-layout-item.md-small-size-100.md-size-33
                md-field
                  label 姓名
                  md-input(v-model='user.name' :disabled="readonly")
              .md-layout-item.md-small-size-100.md-size-33
                md-field
                  label 门店
                  md-select(v-model='user.store' :disabled="readonly")
                    md-option 不绑定门店
                    md-option(v-for='store in $stores', :key='store.id', :value='store.id') {{ store.name }}
              .md-layout-item.md-small-size-100.md-size-33
                md-field
                  label 登录名
                  md-input(v-model='user.login', type='text', autocomplete='new-password')
              .md-layout-item.md-small-size-100.md-size-33
                md-field
                  label 重置密码
                  md-input(v-model='user.password', type='password', autocomplete='new-password')
              .md-layout-item.md-size-100
                md-field
                  label 备注
                  md-textarea(v-model='user.remarks' :disabled="readonly")
            .md-layout-item.md-size-100.text-right
              md-button.md-success.mt-4(type='submit' :class="{'md-raised':!user.id,'md-simple':user.id}") {{ user.id ? "更新" : "创建" }}

</template>

<script lang="ts">
import Vue from "vue";
import { Watch, Component, Prop } from "vue-property-decorator";
import { BookingsCard, Membership, Poster } from "@/components";
import { BookingResource, UserResource } from "@/resources";
import { User, Store, Booking } from "@/resources/interfaces";
import ObjectSelect from "@/components/ObjectSelect.vue";

@Component({
  components: {
    BookingsCard,
    Membership,
    Poster,
    ObjectSelect
  }
})
export default class StaffProfile extends Vue {
  user: Partial<User> = { tags: [] };
  userBookings: Booking[] = [];

  @Prop({ default: false })
  add!: boolean;

  get readonly() {
    if (
      !this.$user.can("STAFF") &&
      this.user.tags &&
      this.user.tags.includes("pr")
    ) {
      return true;
    }
    return false;
  }

  get creatable() {
    return !this.user.id && this.user.mobile?.length === 11;
  }

  async save() {
    this.user = await UserResource.save(this.user);
    this.$notify({
      message: "保存成功",
      icon: "check",
      horizontalAlign: "center",
      verticalAlign: "bottom",
      type: "success"
    });
    if (this.add) {
      this.$destroy();
      this.$router.replace(`/staff/${this.user.id}`);
    }
  }

  async getUser() {
    this.user = await UserResource.get({ id: this.$route.params.id });
    return this.user;
  }

  createBooking(type = "play") {
    this.$router.push(`/booking/${type}/add?customer=${this.user.id}`);
  }

  @Watch("user.mobile") async onUserMobileUpdate() {
    if (!this.user.id && this.user.mobile?.length === 11) {
      const [user] = await UserResource.query({ mobile: this.user.mobile });
      if (user) {
        this.$destroy();
        this.$router.replace(`/user/${user.id}`);
      } else {
        this.$notify({
          message: "没有匹配手机号的职员，请继续创建职员",
          type: "success",
          icon: "add_alert",
          horizontalAlign: "center",
          verticalAlign: "bottom"
        });
      }
    }
  }

  @Watch("user.store") onUserStoreUpdate(store: Store | false) {
    if (typeof store === "object" && store) {
      // @ts-ignore
      this.user.store = this.user.store.id;
    } else if (store === false) {
      this.user.store = null;
    }
  }

  async created() {
    if (!this.add) {
      if (this.$route.params.id === this.$user.id) {
        this.user = this.$user;
      } else {
        this.$set(this.user, "id", this.$route.params.id);
        this.getUser();
      }
      this.userBookings = await BookingResource.query({
        customer: this.user.id,
        limit: 50
      });
    }
  }
}
</script>
<style lang="scss">
.bookings-card,
.payments-card {
  margin-top: 50px;
}
.md-table.table-full-width {
  width: calc(100% + 40px);
}
</style>
