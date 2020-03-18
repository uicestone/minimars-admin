<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-size-66 md-small-size-100 mx-auto">
        <form @submit.prevent="save">
          <md-card>
            <md-card-header class="md-card-header-icon md-card-header-primary">
              <div class="card-icon">
                <md-icon>card_giftcard</md-icon>
              </div>
              <h4 class="title">{{ gift.title }}</h4>
            </md-card-header>

            <md-card-content class="md-layout">
              <div class="md-layout-item md-size-100">
                <md-field>
                  <label>显示名称</label>
                  <md-input v-model="gift.title"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-25">
                <md-field>
                  <label>库存</label>
                  <md-input type="number" v-model="gift.quantity"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-25">
                <md-field>
                  <label>积分售价</label>
                  <md-input
                    type="number"
                    v-model="gift.priceInCredit"
                  ></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-25">
                <md-field>
                  <label>收款售价 ¥</label>
                  <md-input type="number" v-model="gift.priceInCny"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-25">
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
              <div class="md-layout-item md-small-size-100">
                <md-field class="md-has-value mt-4">
                  <label>内容</label>
                  <editor v-model="gift.content" />
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
                  v-if="this.gift.id"
                  >删除</md-button
                >
              </div>
            </md-card-content>
          </md-card>
        </form>
      </div>
      <div class="md-layout-item md-size-33 md-small-size-100">
        <md-card>
          <div class="md-layout-item md-size-100 md-xsmall-size-100 pb-2">
            <h4 class="card-title">封面图</h4>
            <div class="file-input mx-auto" style="display:block">
              <div class="image-container mx-auto">
                <img
                  :src="
                    gift.posterUrl ||
                      posterImage ||
                      '/img/image_placeholder.jpg'
                  "
                />
              </div>
              <div class="button-container">
                <md-button
                  class="md-danger md-round"
                  @click="removeImage"
                  v-if="posterImage || gift.posterUrl"
                  >移除</md-button
                >
                <md-button class="md-success md-round md-fileinput">
                  <template v-if="!posterImage && !gift.posterUrl"
                    >选择图片</template
                  >
                  <template v-else>更换</template>
                  <input type="file" @change="onFileChange" />
                </md-button>
              </div>
            </div>
          </div>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
// import { Datetime } from "vue-datetime";
// import "vue-datetime/dist/vue-datetime.css";
import { Gift, Store, User } from "@/resources";
import { Editor } from "@/components";
import Swal from "sweetalert2";

export default {
  components: {
    Editor
  },
  data() {
    return {
      gift: { id: "", store: null },
      stores: [],
      storeSearchTerm: "",
      posterImage: ""
    };
  },
  methods: {
    async save() {
      if (this.$route.params.id === "add") {
        this.gift = (await Gift.save(this.gift)).body;
      } else {
        this.gift = (
          await Gift.update(
            {
              id: this.$route.params.id,
              bypassBandIdsCheck: true,
              authBands: false
            },
            this.gift
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
        this.$router.replace(`/gift/${this.gift.id}`);
      }
    },
    async remove() {
      if (
        !(
          await Swal.fire({
            title: "确定要删除这个礼品？",
            text: `这个操作不可撤销`,
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
      await Gift.delete({ id: this.gift.id });
      this.$router.go(-1);
    },
    async getStores(q) {
      this.stores = (await Store.get({ keyword: q })).body;
      return this.stores;
    },
    selectStore(item) {
      this.gift.store = item;
      this.storeSearchTerm = item.name;
    },
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
    },
    createImage(file, type) {
      let reader = new FileReader();
      let vm = this;

      reader.onload = e => {
        vm.posterImage = e.target.result;
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
      this.gift.posterUrl = fileObject.url;
    },
    removeImage: function(type) {
      this.posterImage = "";
      this.gift.posterUrl = null;
    }
  },
  async mounted() {
    if (this.$route.params.id !== "add") {
      this.gift = (await Gift.get({ id: this.$route.params.id })).body;
      if (this.gift.store) this.storeSearchTerm = this.gift.store.name;
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
