<template lang="pug">
.content
  .md-layout
    .md-layout-item.md-medium-size-100.md-size-60.mx-auto
      form(@submit.prevent='save')
        md-card
          md-card-header.md-card-header-icon.md-card-header-green
            .card-icon
              md-icon perm_identity
            h4.title {{ user.name }}
          md-card-content.md-layout
            //- .file-input.img-circle.md-layout-item.md-size-25.pt-4
              div(v-if='!user.avatarUrl')
                .image-container
                  img(src='/img/placeholder.jpg', title='')
              .image-container(v-else)
                img(:src='user.avatarUrl')
              .text-center
                md-button.md-danger.md-round.md-just-icon(@click="removeImage('circle')", v-if='user.avatarUrl')
                  md-icon close
                md-button.md-success.md-round.md-fileinput(:class="{ 'md-just-icon': user.avatarUrl }")
                  div(v-if='!user.avatarUrl') 选择头像
                  div(v-else)
                    md-icon refresh
                  input(type='file', ref='avatarFileInput', @change='onFileChange', accept='image/jpeg,image/png')
            .md-layout-item.md-size-100.md-layout.md-alignment-vertical
              .md-layout-item.md-small-size-100.md-size-25(v-if="user.role !== 'customer' && $user.can('manage-user')")
                md-field
                  label 用户类型
                  md-select(v-model='user.role', @keydown.enter.prevent, :disabled="!$user.can('manage-user')")
                    md-option(value='admin') 管理员
                    md-option(value='manager') 店员
                    md-option(value='customer') 客户
              .md-layout-item.md-small-size-100.md-size-25
                md-field
                  label(v-if="user.role === 'customer'") 会员姓名
                  label(v-else) 姓名
                  md-input(v-model='user.name')
              .md-layout-item.md-small-size-100.md-size-25(v-if="user.role === 'customer'")
                md-field
                  label 孩子姓名
                  md-input(v-model='user.childName')
              .md-layout-item.md-small-size-100.md-size-25
                md-field
                  label 性别
                  md-select(v-model='user.gender', @keydown.enter.prevent, :disabled="!$user.can('manage-user')")
                    md-option(value='男') 男
                    md-option(value='女') 女
                    md-option(value='未知') 未知
              .md-layout-item.md-small-size-100.md-size-25
                md-field
                  label 门店
                  md-select(v-model='user.store')
                    md-option 不绑定门店
                    md-option(v-for='store in $stores', :key='store.id', :value='store.id') {{ store.name }}
              .md-layout-item.md-small-size-100.md-size-33
                md-field
                  label 手机号
                  md-input(v-model='user.mobile', type='text')
              .md-layout-item.md-small-size-100.md-size-33(v-if="user.role === 'customer'")
                md-field
                  label 卡号
                  md-input(v-model='user.cardNo')
              .md-layout-item.md-small-size-100.md-size-33
                md-field
                  label 身份证号
                  md-input(v-model='user.idCardNo')
              .md-layout-item.md-small-size-100.md-size-33
                md-field
                  label 地区
                  md-input(v-model='user.region', type='text')
              .md-layout-item.md-small-size-100.md-size-33
                md-field
                  label 生日
                  md-input(v-model='user.birthday', type='text')
              .md-layout-item.md-small-size-100.md-size-33
                md-field
                  label 星座
                  md-input(v-model='user.constellation', type='text')
              .md-layout-item.md-small-size-100.md-size-50(v-if="user.role === 'customer'")
                md-field
                  label 余额
                  md-input(v-model='user.balance', type='text', disabled)
              .md-layout-item.md-small-size-100.md-size-50(v-if="user.role === 'customer'")
                md-field
                  label 积分
                  md-input(v-model='user.points', type='text', disabled)
              .md-layout-item.md-size-100
                md-field
                  label 备注
                  md-textarea(v-model='user.remarks')
            .md-layout-item.md-layout.mt-2(v-if="user.role !== 'customer'")
              .md-layout-item.md-small-size-100.md-size-50
                md-field
                  label 用户名
                  md-input(v-model='user.login', type='text', autocomplete='new-password')
              .md-layout-item.md-small-size-100.md-size-50
                md-field
                  label 重置密码
                  md-input(v-model='user.password', type='password', autocomplete='new-password')
            .md-layout-item.md-size-100.text-right
              md-button.md-primary.mt-4(type='submit' :class="{'md-raised':!user.id,'md-simple':user.id}") 保存
              md-button.md-raised.md-primary.mt-4.pull-right(@click="createBooking" v-if="user.id && user.role === 'customer'") 创建门票预约
      bookings-card(title="近期预约" :bookings="userBookings" :customer="user" v-if="user.role === 'customer'")
    .md-layout-item.md-medium-size-100.md-size-40.mx-auto(v-if="user.role === 'customer'")
      membership(:customer="user" @updated="getUser")
</template>

<script lang="ts">
import Vue from "vue";
import { Watch, Component, Prop } from "vue-property-decorator";
import { BookingsCard, Membership } from "@/components";
import { BookingResource, UserResource } from "@/resources";
import { User, Store, Booking } from "@/resources/interfaces";

@Component({
  components: {
    BookingsCard,
    Membership
  }
})
export default class UserProfile extends Vue {
  user: Partial<User> = {};
  userBookings: Booking[] = [];

  @Prop({ default: false })
  add!: boolean;

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

  createBooking() {
    this.$router.push("/booking/play/add?customer=" + this.user.id);
  }

  @Watch("user") onUserUpdate(u: any, pu: any) {
    console.log("onUserUpdate", JSON.stringify(u), JSON.stringify(pu));
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
    if (this.$user.role === "manager") {
      this.user.role = "customer";
    }

    if (!this.add) {
      if (this.$route.params.id === this.$user.id) {
        this.user = this.$user;
      } else {
        await this.getUser();
      }
      this.userBookings = await BookingResource.query({
        customer: this.user.id
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
