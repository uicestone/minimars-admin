<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-size-66 md-small-size-100 mx-auto">
        <form @submit.prevent="save">
          <md-card>
            <md-card-header class="md-card-header-icon md-card-header-primary">
              <div class="card-icon">
                <md-icon>card_membership</md-icon>
              </div>
              <h4 class="title">{{ cardType.title }}</h4>
            </md-card-header>

            <md-card-content class="md-layout">
              <div class="md-layout-item md-size-100">
                <md-field>
                  <label>名称</label>
                  <md-input v-model="cardType.title"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                  <label>类型</label>
                  <md-select v-model="cardType.type" @keydown.enter.prevent="">
                    <md-option
                      v-for="(name, type) in $cardTypeNames"
                      :key="type"
                      :value="type"
                      >{{ name }}</md-option
                    >
                  </md-select>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                  <label>售价</label>
                  <md-input type="number" v-model="cardType.price"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-33">
                <md-autocomplete
                  v-model="storeSearchTerm"
                  :md-options="getStores(storeSearchTerm)"
                  @md-selected="selectStore"
                >
                  <label>门店</label>
                  <template slot="md-autocomplete-item" slot-scope="{ item }">
                    {{ item.name }}
                  </template>
                </md-autocomplete>
              </div>
              <div
                class="md-layout-item md-small-size-100 md-size-33"
                v-if="cardType.type === 'times'"
              >
                <md-field>
                  <label>次数</label>
                  <md-input type="number" v-model="cardType.times"></md-input>
                </md-field>
              </div>
              <div
                class="md-layout-item md-small-size-100 md-size-33"
                v-if="cardType.type === 'balance'"
              >
                <md-field>
                  <label>面值</label>
                  <md-input type="number" v-model="cardType.balance"></md-input>
                </md-field>
              </div>
              <div
                class="md-layout-item md-small-size-100 md-size-33"
                v-if="cardType.type === 'period'"
              >
                <!-- <md-field :class="{ 'md-has-value': cardType.date }">
                  <label>日期</label>
                  <datetime
                    v-model="cardType.date"
                    input-class="md-input"
                    type="date"
                    auto
                    format="yyyy-LL-dd"
                    value-zone="Asia/Shanghai"
                    :phrases="{ ok: '确定', cancel: '取消' }"
                  />
                </md-field> -->
                <md-datepicker
                  placeholder="开始日期"
                  v-model="cardType.start"
                  :md-model-type="Date"
                  md-immediately
                >
                  <label>开始日期</label>
                </md-datepicker>
              </div>
              <div
                class="md-layout-item md-small-size-100 md-size-33"
                v-if="cardType.type === 'period'"
              >
                <!-- <md-field :class="{ 'md-has-value': cardType.date }">
                  <label>日期</label>
                  <datetime
                    v-model="cardType.date"
                    input-class="md-input"
                    type="date"
                    auto
                    format="yyyy-LL-dd"
                    value-zone="Asia/Shanghai"
                    :phrases="{ ok: '确定', cancel: '取消' }"
                  />
                </md-field> -->
                <md-datepicker
                  placeholder="截止日期"
                  v-model="cardType.end"
                  :md-model-type="Date"
                  md-immediately
                  ><label>截止日期</label>
                </md-datepicker>
              </div>
              <div class="md-layout-item md-size-100">
                <md-field>
                  <label>内容详情</label>
                  <md-textarea
                    v-model="cardType.content"
                    class="no-padding"
                  ></md-textarea>
                </md-field>
              </div>
              <div class="md-layout-item md-size-100 text-right">
                <md-button type="submit" class="md-raised md-primary mt-4"
                  >保存</md-button
                >
                <md-button
                  type="button"
                  class="mt-4 ml-2 md-simple md-danger"
                  @click="remove"
                  v-if="this.cardType.id"
                  >删除</md-button
                >
              </div>
            </md-card-content>
          </md-card>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// import { Datetime } from "vue-datetime";
// import "vue-datetime/dist/vue-datetime.css";
import { CardType, Store } from "@/resources";
import Swal from "sweetalert2";

export default {
  // components: { Datetime },
  data() {
    return {
      cardType: { id: "", store: null },
      stores: [],
      storeSearchTerm: ""
    };
  },
  methods: {
    async save() {
      if (this.$route.params.id === "add") {
        this.cardType = (await CardType.save(this.cardType)).body;
      } else {
        this.cardType = (
          await CardType.update(
            {
              id: this.$route.params.id
            },
            this.cardType
          )
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
        this.$router.replace(`/card-type/${this.cardType.id}`);
      }
    },
    async remove() {
      if (
        !(
          await Swal.fire({
            title: "确定要删除这个卡片种类？",
            text: `这个操作不可撤销，已够该卡客户将不会受影响`,
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "md-button md-danger",
            cancelButtonClass: "md-button",
            confirmButtonText: "确定删除",
            cancelButtonText: "取消",
            buttonsStyling: false
          })
        ).value
      )
        return;
      await CardType.delete({ id: this.cardType.id });
      this.$router.go(-1);
    },
    async getStores(q) {
      this.stores = (await Store.get({ keyword: q })).body;
      return this.stores;
    },
    selectStore(item) {
      this.cardType.store = item;
      this.storeSearchTerm = item.name;
    }
  },
  watch: {
    "cardType.type"(type, typeWas) {
      if (typeWas && type && type !== typeWas) {
        delete this.cardType.start;
        delete this.cardType.end;
        delete this.cardType.balance;
        delete this.cardType.times;
      }
    },
    "cardType.start"(v) {
      if (v && (!v.constructor || v.constructor.name !== "Date")) {
        this.cardType.start = new Date(this.cardType.start);
      }
    },
    "cardType.end"(v) {
      if (v && (!v.constructor || v.constructor.name !== "Date")) {
        this.cardType.end = new Date(this.cardType.end);
      }
    }
  },
  async mounted() {
    if (this.$route.params.id !== "add") {
      this.cardType = (await CardType.get({ id: this.$route.params.id })).body;
      if (this.cardType.store) this.storeSearchTerm = this.cardType.store.name;
    }
  }
};
</script>
<style lang="scss">
.md-datepicker-body .md-dialog-actions {
  display: none;
}
.md-input {
  min-width: 0;
}
.payments-card {
  margin-top: 50px;
}
.md-card.md-theme-default {
  position: static;
}
.md-card .md-table {
  width: 100%;
}
</style>
