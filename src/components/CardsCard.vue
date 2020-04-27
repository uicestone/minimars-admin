<template lang="pug">
md-card.codes-card
  md-card-header.md-card-header-icon.md-card-header-blue
    .card-icon
      md-icon card_membership
    h4.title {{ title }}
      slot(name="title-tools")
  md-card-content.md-layout
    md-table.table-full-width
      md-table-row(v-for='card in cards', :key='card.id', :class="{ 'table-warning': card.status === 'pending' }")
        md-table-cell(md-label='卡名') {{ card.title }}
        md-table-cell(md-label='状态' style="text-align:center")
          span(v-if="card.status!=='valid'") {{ card.status | cardStatusName }}
          md-button.md-normal.md-success.md-xs(v-else @click="activate(card)" style="width:48px !important") 激活
        md-table-cell(md-label='过期日期')
          | {{ card.expiresAt | date("YYYY-MM-DD") }}
        md-table-cell(md-label='剩余次数', v-if="card.type === 'times'") {{ card.timesLeft }}
        md-table-cell(md-label='日期区间', v-if="card.type === 'period'")
          | {{ card.start | date("YY-MM-DD") }} -
          br
          | {{ card.end | date("YY-MM-DD") }}
        md-table-cell(md-label='面值', v-if="card.type === 'balance'")
          | {{ card.balance }}
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Card } from "@/resources/interfaces";

@Component
export default class CardsCard extends Vue {
  @Prop({ default: "会员卡" })
  title!: string;

  @Prop({ default: () => [] })
  cards!: Card[];

  @Prop({ default: () => {} })
  activate!: Function;
}
</script>

<style scoped></style>
