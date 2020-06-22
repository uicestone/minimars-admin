<template lang="pug">
#membership
  cards-card(:cards="cardItems" :activate="activateCard")
    template(v-slot:title-tools)
      md-menu.pull-right(v-if="cardItems")
        md-button.md-info.md-sm(md-menu-trigger) 购卡
        md-menu-content
          md-menu-item(v-for='cardType in $cardTypes', v-if="cardType.type !== 'coupon'", :key='cardType.id', @click='createCard(cardType)') {{ cardType.title }}
          md-menu-item(@click="receiveGiftCard") 接收礼品卡
  payments-card(:payments="paymentItems" :pay="pay")
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { BookingsCard, CardsCard, PaymentsCard } from "@/components";
import { confirm, promptSelect, promptInput } from "@/helpers/sweetAlert";
import { PaymentResource, CardResource } from "@/resources";
import {
  CardType,
  Payment,
  Card,
  User,
  CardStatus
} from "@/resources/interfaces";

@Component({
  components: {
    BookingsCard,
    CardsCard,
    PaymentsCard
  }
})
export default class Membership extends Vue {
  @Prop({ required: true })
  customer!: User;

  @Prop()
  cards?: Card[];

  @Prop()
  payments?: Payment[];

  cardItems: Card[] | null = null;

  // @Prop({ default: () => [] })
  paymentItems: Payment[] | null = null;

  async getCardPayments() {
    if (!this.customer.id) return;
    this.paymentItems = await PaymentResource.query({
      customer: this.customer.id,
      attach: "card "
    });
  }

  async getCards() {
    return (this.cardItems = await CardResource.query({
      customer: this.customer.id
    }));
  }

  async createCard(cardType: CardType) {
    const paymentGateway = await promptSelect(
      cardType.title + " ¥ " + cardType.price,
      `请选择支付方式`,
      {
        dianping: "点评POS",
        shouqianba: "收钱吧",
        cash: "现金",
        pos: "银行卡"
      },
      "确定购买"
    );
    if (!paymentGateway) return;
    const card = await CardResource.save(
      // @ts-ignore
      { customer: this.customer.id, ...cardType, id: undefined },
      { paymentGateway }
    );
    this.cardItems?.unshift(card);
    this.$emit("updated");
    this.getCardPayments();
  }

  async activateCard(card: Card) {
    if (
      !(await confirm(
        "确认激活这张充值卡",
        `将为 ${this.customer.name || this.customer.mobile} 增加账户余额 ${
          card.balance
        } 元`
      ))
    )
      return;
    await CardResource.save({ ...card, status: CardStatus.ACTIVATED });
    this.getCards();
    this.$emit("updated"); // should update user
  }

  async receiveGiftCard() {
    const giftCode = await promptInput("填写礼品码");
    if (!giftCode) return;
    // @ts-ignore
    await CardResource.save({ giftCode, customer: this.customer.id });
    this.getCards();
  }

  async pay(payment: Payment) {
    if (
      !(await confirm(
        `确定已收款 ¥${payment.amount.toFixed(2)}`,
        null,
        "确定已收款"
      ))
    )
      return;
    await PaymentResource.update({ id: payment.id }, { paid: true });
    this.getCards();
    this.getCardPayments();
  }

  goToCustomer() {
    if (!this.customer) return;
    this.$router.push(`/user/${this.customer.id}`);
  }

  @Watch("customer") customerUpdated() {
    console.log("Membership customerUpdated", JSON.stringify(this.customer));
    if (this.customer && this.customer.id && !this.cardItems) {
      this.getCards();
    }
    if (this.customer && this.customer.id && !this.paymentItems) {
      this.getCardPayments();
    }
  }

  created() {
    console.log("Membership created", this.customer);
    this.customerUpdated();
  }
}
</script>
