<template lang="pug">
.content
  .md-layout
    .md-layout-item.md-medium-size-100.md-size-60.mx-auto
      form(@submit.prevent='save')
        md-card
          md-card-header.md-card-header-icon.md-card-header-card
            .card-icon
              md-icon perm_identity
            h4.title 用户详情
              span(v-if="user.id" @click="$clipboard(user.id, '用户ID')")
                span {{ user.id.substr(-4).toUpperCase() }}
                md-icon(style="font-size:15px !important") file_copy
          md-card-content.md-layout
            .md-layout-item.md-size-25
              poster.pt-4(v-model="user.avatarUrl" placeholder="/img/placeholder.jpg" circle disabled)
              .pt-4.pb-1.text-center 儿童照片：
              poster(v-model="user.childPhotoUrl" placeholder="/img/image_placeholder.jpg" :disabled="readonly")
            .md-layout-item.md-size-75.md-layout.md-alignment-vertical
              .md-layout-item.md-small-size-100.md-size-33
                md-field
                  label 手机号
                  md-input(v-model='user.mobile', type='text' :disabled="readonly")
              .md-layout-item.md-small-size-100.md-size-33
                md-field
                  label 会员姓名
                  md-input(v-model='user.name' :disabled="readonly")
              .md-layout-item.md-small-size-100.md-size-33
                md-field
                  label 孩子姓名
                  md-input(v-model='user.childName' :disabled="readonly")
              .md-layout-item.md-small-size-100.md-size-25
                md-field
                  label 孩子性别
                  md-select(v-model='user.childGender', @keydown.enter.prevent :disabled="readonly")
                    md-option(value='男') 男
                    md-option(value='女') 女
                    md-option(value='未知') 未知
              .md-layout-item.md-small-size-100.md-size-25
                md-field
                  label 孩子生日
                  md-input(v-model='user.childBirthday', type='text' :disabled="readonly")
              .md-layout-item.md-small-size-100.md-size-25
                md-field
                  label 卡号
                  md-input(v-model='user.cardNo' :disabled="readonly")
              .md-layout-item.md-small-size-100.md-size-25
                md-field
                  label 门店
                  md-select(v-model='user.store' :disabled="readonly")
                    md-option 不绑定门店
                    md-option(v-for='store in $stores', :key='store.id', :value='store.id') {{ store.name }}
              .md-layout-item.md-small-size-100.md-size-33
                md-field
                  label 身份证号
                  md-input(v-model='user.idCardNo' :disabled="readonly")
              .md-layout-item.md-small-size-100.md-size-33
                md-field
                  label 地区
                  md-input(v-model='user.region' :disabled="readonly")
              .md-layout-item.md-small-size-100.md-size-33
                md-field
                  label 星座
                  md-input(v-model='user.constellation'  :disabled="readonly")
              .md-layout-item.md-small-size-100.md-size-33
                md-field
                  label 余额
                  md-input(:value='user.balance | round(2)' disabled)
              .md-layout-item.md-small-size-100.md-size-33
                md-field
                  label 其中赠送余额
                  md-input(:value='user.balanceReward | round(2)' disabled)
              .md-layout-item.md-small-size-100.md-size-33
                md-field
                  label 积分
                  md-input(:value='user.points | round(0)' disabled)
              .md-layout-item.md-small-size-100.md-size-25
                md-field
                  label 注册日期
                  md-input(:value='user.createdAt|date("YYYY-MM-DD")' disabled)
              .md-layout-item.md-small-size-100.md-size-25
                md-field
                  label 注册方式
                  md-input(:value="'-'" disabled)
              .md-layout-item.md-small-size-100.md-size-25(v-if="user.firstPlayDate")
                md-field
                  label 首次入场日期
                  md-input(:value='user.firstPlayDate' disabled)
              .md-layout-item.md-small-size-100.md-size-25(v-if="user.firstPlayStore")
                md-field
                  label 首次入场门店
                  md-input(:value='storeName(user.firstPlayStore)' disabled)
              .md-layout-item.md-small-size-100.md-size-25
                md-field
                  label 微信小程序
                  md-input(:value="user.openid?'已激活':'未激活'" disabled)
              .md-layout-item.md-small-size-100.md-size-25
                md-field
                  label 微信公众号
                  md-input(:value="user.openidMp?'已关注':'未关注'" disabled)
              .md-layout-item.md-small-size-100.md-size-25
                md-field
                  label ZOOJOO
                  md-input(:value="user.youzanId?'已激活':'未激活'" disabled)
              .md-layout-item.md-small-size-100.md-size-25
                md-field
                  label 银豹餐饮
                  md-input(:value="user.pospalId?'已激活':'未激活'" disabled)
              .md-layout-item.md-size-100
                md-field
                  label 备注
                  md-textarea(v-model='user.remarks' :disabled="readonly")
              .md-layout-item.md-size-100
                md-chips.md-info.shake-on-error(v-if="$user.can('CUSTOMER')" @keypress.native.enter.prevent, v-model='user.tags', md-placeholder='客户内部标签', md-check-duplicated)
                md-chips.md-info(v-else v-model='user.tags' md-static)
            .md-layout-item.md-size-100.text-right
              md-button.md-info.mt-4(type='submit' :class="{'md-raised':!user.id,'md-simple':user.id}" :disabled="!userValidated") {{ user.id ? "更新" : "创建" }}
              md-button.md-play.mt-4.pull-right(@click="createBooking()" v-if="user.id") 门票预约
              md-button.md-food.mt-4.mr-1.pull-right(@click="createBooking('food')" v-if="user.id") 吧台消费
      bookings-card(title="近期门票预约" type="play" :bookings="userBookings.filter(b=>b.type==='play')" :customer="user")
      bookings-card(title="近期活动预约" type="event" :bookings="userBookings.filter(b=>b.type==='event')" :customer="user")
      bookings-card(title="近期礼品兑换" type="gift" :bookings="userBookings.filter(b=>b.type==='gift')" :customer="user")
      bookings-card(title="近期餐饮消费" type="food" :bookings="userBookings.filter(b=>b.type==='food')" :customer="user")
    .md-layout-item.md-medium-size-100.md-size-40.mx-auto
      membership(:customer="user" @updated="getUser" :allow-buy-card="!readonly")
        template(v-slot:action-buttons)
          md-button.md-info.md-sm.pull-right(v-if="creatable" @click="save") 创建会员
</template>

<script lang="ts">
import Vue from "vue";
import { Watch, Component, Prop } from "vue-property-decorator";
import { BookingsCard, Membership, Poster } from "@/components";
import { BookingResource, UserResource } from "@/resources";
import { User, Store, Booking } from "@/resources/interfaces";

@Component({
  components: {
    BookingsCard,
    Membership,
    Poster
  }
})
export default class UserProfile extends Vue {
  user: Partial<User> = { tags: [] };
  userBookings: Booking[] = [];

  @Prop({ default: false })
  add!: boolean;

  get readonly() {
    if (
      !this.$user.can("CUSTOMER") &&
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

  get userValidated() {
    if (!this.user.mobile || this.user.mobile.length !== 11) return false;
    return true;
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
      this.$router.replace(`/user/${this.user.id}`);
    }
  }

  async getUser() {
    this.user = await UserResource.get({ id: this.$route.params.id });
    return this.user;
  }

  createBooking(type = "play") {
    this.$router.push(`/booking/${type}/add?customer=${this.user.id}`);
  }

  storeName(storeId: string) {
    return this.$stores.find(s => s.id === storeId)?.name || "-";
  }

  @Watch("user.mobile") async onUserMobileUpdate() {
    if (!this.user.id && this.user.mobile?.length === 11) {
      const [user] = await UserResource.query({ mobile: this.user.mobile });
      if (user) {
        this.$destroy();
        this.$router.replace(`/user/${user.id}`);
      } else {
        this.$notify({
          message: "没有匹配手机号的用户，请继续创建用户",
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
