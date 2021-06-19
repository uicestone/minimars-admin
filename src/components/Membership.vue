<template lang="pug">
#membership
  cards-card(:cards="cardItems" :activate="activateCard" @updated="getCards();getCardPayments();$emit('updated')")
    template(v-slot:title-tools)
      slot(name="action-buttons")
      md-menu.pull-right(v-if="cardItems && allowBuyCard")
        md-button.md-cards.md-sm(md-menu-trigger) 购卡
        md-menu-content
          md-field.mx-auto(style="width:90%")
            label 筛选
            md-input(v-model="filterCardTypeTerm")
          md-menu-item(v-for='cardType in filteredCardTypes', v-if="$user.can('CARD_SELL_ALL')||cardType.openForReception", :key='cardType.id', @click='createCard(cardType)') {{ cardType.title }}
          md-menu-item(@click="receiveGiftCard") 接收礼品卡
  payments-card(:payments="paymentItems" :pay="pay" title="购卡记录")
    template(v-slot:title-tools)
      slot(name="action-buttons")
        md-button.md-danger.md-sm.pull-right.md-simple(md-menu-trigger @click="$router.push('/payment?customer='+customer.id)") 全部支付明细
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
  CardStatus,
  Scene
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

  @Prop({ default: true })
  allowBuyCard!: boolean;

  cardItems: Card[] | null = null;

  // @Prop({ default: () => [] })
  paymentItems: Payment[] | null = null;

  filterCardTypeTerm = "";

  get filteredCardTypes() {
    if (!this.filterCardTypeTerm) return this.$cardTypes;
    return this.$cardTypes.filter(
      ct =>
        ct.slug.includes(this.filterCardTypeTerm) ||
        ct.title.includes(this.filterCardTypeTerm)
    );
  }

  async getCardPayments() {
    if (!this.customer.id) return;
    this.paymentItems = await PaymentResource.query({
      customer: this.customer.id,
      scene: [Scene.CARD, Scene.BALANCE, Scene.PERIOD].join(",")
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
        mallpos: "商场POS",
        cash: "现金",
        pos: "银行卡",
        agency: "三方代收",
        pr: "市场公关"
      },
      "确定购买"
    );
    if (!paymentGateway) return;
    await CardResource.save(
      // @ts-ignore
      { customer: this.customer.id, ...cardType, id: undefined },
      { paymentGateway }
    );
    // this.cardItems?.unshift(card);
    this.cardItems = await CardResource.query({ customer: this.customer.id });
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

  @Watch("customer", { immediate: true }) customerUpdated(c: User, p: User) {
    if (c && c.id && c.id !== p?.id && !this.cardItems) {
      this.getCards();
    }
    if (c && c.id && c.id !== p?.id && !this.paymentItems) {
      this.getCardPayments();
    }
  }
}
</script>

<style lang="scss" scoped>
.md-menu-content {
  max-height: 60vh;
}
</style>
