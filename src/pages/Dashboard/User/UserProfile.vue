<template lang="pug">
.content
  .md-layout
    .md-layout-item.md-medium-size-100.md-size-66.mx-auto
      form(@submit.prevent='save')
        md-card
          md-card-header.md-card-header-icon.md-card-header-green
            .card-icon
              md-icon perm_identity
            h4.title {{ user.name }}
          md-card-content.md-layout
            .file-input.img-circle.md-layout-item.md-size-25.pt-4
              div(v-if='!user.avatarUrl')
                .image-container
                  img(src='/img/placeholder.jpg', title='')
              .image-container(v-else='')
                img(:src='user.avatarUrl')
              .text-center
                md-button.md-danger.md-round.md-just-icon(@click="removeImage('circle')", v-if='user.avatarUrl')
                  md-icon close
                md-button.md-success.md-round.md-fileinput(:class="{ 'md-just-icon': user.avatarUrl }")
                  div(v-if='!user.avatarUrl') 选择头像
                  div(v-else='')
                    md-icon refresh
                  input(type='file', ref='avatarFileInput', @change='onFileChange', accept='image/jpeg,image/png')
            .md-layout-item.md-size-75.md-layout.md-alignment-vertical
              .md-layout-item.md-small-size-100.md-size-25
                md-field
                  label 姓名
                  md-input(v-model='user.name')
              .md-layout-item.md-small-size-100.md-size-25(v-if="user.role !== 'customer' || $user.can('manage-user')")
                md-field
                  label 角色
                  md-select(v-model='user.role', @keydown.enter.prevent='', :disabled="!$user.can('manage-user')")
                    md-option(value='admin') 管理员
                    md-option(value='manager') 店员
                    md-option(value='customer') 客户
              .md-layout-item.md-small-size-100.md-size-25
                md-field
                  label 门店
                  md-select(v-model='user.store')
                    md-option 不绑定门店
                    md-option(v-for='store in $stores', :key='store.id', :value='store.id') {{ store.name }}
              .md-layout-item.md-small-size-100.md-size-25
                md-field
                  label 性别
                  md-select(v-model='user.gender', @keydown.enter.prevent='', :disabled="!$user.can('manage-user')")
                    md-option(value='男') 男
                    md-option(value='女') 女
                    md-option(value='未知') 未知
              .md-layout-item.md-small-size-100.md-size-50
                md-field
                  label 手机号
                  md-input(v-model='user.mobile', type='text')
              .md-layout-item.md-small-size-100.md-size-50
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
                  md-input(v-model='user.balance', type='text', disabled='')
              .md-layout-item.md-small-size-100.md-size-50(v-if="user.role === 'customer'")
                md-field
                  label 积分
                  md-input(v-model='user.points', type='text', disabled='')
              .md-layout-item.md-small-size-100.md-size-50(v-if="user.role !== 'customer'")
                md-field
                  label 通行证
                  md-input(v-model='user.passNo')
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
              md-button.md-raised.md-primary.mt-4(type='submit') 保存
      md-card.bookings-card(v-if="user.role === 'customer'")
        md-card-header.md-card-header-icon.md-card-header-warning
          .card-icon
            md-icon history
          h4.title
            | 最近预约
            md-button.md-warning.md-sm.pull-right(@click='goCustomerBookings') 查看所有预约
        md-card-content.md-layout
          md-table
            md-table-row(v-for='booking in userBookings', :key='booking.id')
              md-table-cell(md-label='日期', md-sort-by='date')
                | {{ booking.date }}
              md-table-cell(md-label='时间', md-sort-by='checkInAt')
                | {{ booking.checkInAt }}
              md-table-cell(md-label='类型', md-sort-by='type')
                | {{ booking.type | bookingTypeName }}
              md-table-cell(md-label='大/小', md-sort-by='kidsCount')
                | {{ booking.adultsCount }} /
                | {{ booking.kidsCount }}
              md-table-cell(md-label='优惠', md-sort-by='coupon', style='min-width:150px')
                | {{ booking.coupon | couponName }}
              md-table-cell(md-label='状态', md-sort-by='status')
                | {{ booking.status | bookingStatusName }}
    .md-layout-item.md-medium-size-100.md-size-33.mx-auto(v-if="user.role === 'customer'")
      md-card.codes-card
        md-card-header.md-card-header-icon.md-card-header-blue
          .card-icon
            md-icon card_membership
          h4.title
            | 会员卡
            md-menu.pull-right
              md-button.md-info.md-sm(md-menu-trigger='') 购卡
              md-menu-content
                md-menu-item(v-for='cardType in $cardTypes', :key='cardType.id', @click='createCard(cardType)') {{ cardType.title }}
        md-card-content.md-layout
          md-table.table-full-width
            md-table-row(v-for='card in cards', :key='card.id', :class="{ 'table-warning': card.status === 'pending' }")
              md-table-cell(md-label='卡名') {{ card.title }}
              md-table-cell(md-label='状态')
                | {{ card.status | cardStatusName }}
              md-table-cell(md-label='购卡日期')
                | {{ card.createdAt | date("YYYY-MM-DD") }}
              md-table-cell(md-label='剩余次数', v-if="card.type === 'times'") {{ card.timesLeft }}
              md-table-cell(md-label='日期区间', v-if="card.type === 'period'")
                | {{ card.start | date("MM-DD") }} -
                br
                | {{ card.end | date("MM-DD") }}
      md-card.payments-card
        md-card-header.md-card-header-icon.md-card-header-danger
          .card-icon
            md-icon payment
          h4.title 购卡充值记录
        md-card-content.md-layout
          md-table
            md-table-row(v-for='payment in cardPayments', :key='payment.id')
              md-table-cell(md-label='创建时间', md-sort-by='createdAt')
                | {{ payment.createdAt | date("MM/DD") }}
              md-table-cell(md-label='金额', md-sort-by='amount') ¥{{ payment.amount }}
              md-table-cell(md-label='描述', md-sort-by='title', style='width:35%') {{ payment.title }}
              md-table-cell(md-label='收款')
                md-button.md-success.md-normal(disabled='', v-if='payment.paid') 已收款
                md-button.md-normal.md-warning(v-else='', @click='pay(payment)') 收款
</template>

<script>
import { Booking, User, Payment, Card } from "@/resources";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      user: {
        name: "",
        roles: []
      },
      cards: [],
      cardPayments: [],
      userBookings: []
    };
  },
  methods: {
    async save() {
      if (this.$route.params.id === "add") {
        this.user = (await User.save(this.user)).body;
      } else {
        this.user = (
          await User.update({ id: this.$route.params.id }, this.user)
        ).body;
      }
      this.$notify({
        message: "保存成功",
        icon: "check",
        horizontalAlign: "center",
        verticalAlign: "bottom",
        type: "success"
      });
      if (this.$route.params.id === "add") {
        this.$router.replace(`/user/${this.user.id}`);
      }
    },
    goCustomerBookings() {
      this.$router.push(`/booking?customer=${this.user.id}`);
    },
    getClass(headerColor) {
      return "md-card-header-" + headerColor + "";
    },
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
    },
    createImage(file) {
      let reader = new FileReader();
      let vm = this;

      reader.onload = e => {
        vm.user.avatarUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      this.uploadImage(file);
    },
    async uploadImage(file) {
      const formData = new FormData();
      formData.append("file", file);
      const fileObject = (
        await this.$http.post("file", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
      ).body;
      this.user.avatarUri = fileObject.uri;
      this.user.avatarUrl = fileObject.url;
      this.$user.avatarUrl = fileObject.url;
    },
    removeImage() {
      this.user.avatarUri = null;
      this.user.avatarUrl = null;
      this.$user.avatarUrl = null;
      this.$refs.avatarFileInput.value = "";
    },
    selectStore(item) {
      this.user.store = item;
      this.storeSearchTerm = item.name;
    },
    async getCardPayments() {
      this.cardPayments = (
        await Payment.get({
          customer: this.user.id,
          attach: "card"
        })
      ).body;
    },
    async createCard(cardType) {
      const paymentGateway = (
        await Swal.fire({
          title: "购买" + cardType.title,
          text: `请选择支付方式`,
          type: "success",
          input: "select",
          inputOptions: {
            cash: "现金刷卡",
            scan: "现场扫码"
          },
          showCancelButton: true,
          confirmButtonClass: "md-button md-success",
          cancelButtonClass: "md-button",
          confirmButtonText: "确定购买",
          cancelButtonText: "取消",
          buttonsStyling: false
        })
      ).value;
      if (!paymentGateway) return;
      const card = (
        await Card.save(
          { paymentGateway },
          { customer: this.user.id, ...cardType }
        )
      ).body;
      this.cards.push(card);
      this.getCardPayments();
    },
    async getCards() {
      this.cards = (
        await Card.get({
          customer: this.user.id,
          status: "valid,activated,expired"
        })
      ).body;
    },
    async pay(payment) {
      if (
        !(
          await Swal.fire({
            title: `确定已收款 ¥${payment.amount.toFixed(2)}？`,
            // text: `这个操作`,
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "md-button md-warning",
            cancelButtonClass: "md-button",
            confirmButtonText: "确定已收款",
            cancelButtonText: "取消",
            buttonsStyling: false
          })
        ).value
      )
        return;
      await Payment.update({ id: payment.id }, { paid: true });
      this.getCardPayments();
      this.getCards();
    }
  },
  watch: {
    "user.store"(store) {
      if (typeof store === "object" && store) {
        this.user.store = this.user.store.id;
      } else if (store === false) {
        this.user.store = null;
      }
    }
  },
  async mounted() {
    if (this.$route.params.id !== "add") {
      if (this.$route.params.id === this.$user.id) {
        this.user = this.$user;
      } else {
        this.user = (await User.get({ id: this.$route.params.id })).body;
      }
      this.getCardPayments();
      this.userBookings = (await Booking.get({ customer: this.user.id })).body;
      this.getCards();
    }
  }
};
</script>
<style lang="scss">
.payments-card,
.bookings-card,
.codes-card {
  .md-table {
    width: 100%;
  }
}
.bookings-card,
.payments-card {
  margin-top: 50px;
}
.md-table.table-full-width {
  width: calc(100% + 40px);
}
</style>
