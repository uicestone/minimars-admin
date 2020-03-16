<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-size-66 md-small-size-100 mx-auto">
        <form @submit.prevent="save">
          <md-card>
            <md-card-header class="md-card-header-icon md-card-header-primary">
              <div class="card-icon">
                <md-icon>event</md-icon>
              </div>
              <h4 class="title">{{ event.title }}</h4>
            </md-card-header>

            <md-card-content class="md-layout">
              <div class="md-layout-item md-size-66">
                <md-field>
                  <label>标题</label>
                  <md-input v-model="event.title"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-33">
                <!-- <md-field :class="{ 'md-has-value': event.date }">
                  <label>日期</label>
                  <datetime
                    v-model="event.date"
                    input-class="md-input"
                    type="date"
                    auto
                    format="yyyy-LL-dd"
                    value-zone="Asia/Shanghai"
                    :phrases="{ ok: '确定', cancel: '取消' }"
                  />
                </md-field> -->
                <md-datepicker v-model="event.date" md-immediately>
                  <label>日期</label>
                </md-datepicker>
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
              <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                  <label>积分售价</label>
                  <md-input
                    type="number"
                    v-model="event.priceInCredit"
                  ></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100 md-size-33">
                <md-field>
                  <label>收款售价 ¥</label>
                  <md-input type="number" v-model="event.priceInCny"></md-input>
                </md-field>
              </div>
              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label>内容详情</label>
                  <md-textarea
                    v-model="event.content"
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
                    event.posterUrl ||
                      posterImage ||
                      '/img/image_placeholder.jpg'
                  "
                />
              </div>
              <div class="button-container">
                <md-button
                  class="md-danger md-round"
                  @click="removeImage"
                  v-if="posterImage || event.posterUrl"
                  >移除</md-button
                >
                <md-button class="md-success md-round md-fileinput">
                  <template v-if="!posterImage && !event.posterUrl"
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
import { Event, Store, User } from "@/resources";
import Swal from "sweetalert2";

export default {
  // components: { Datetime },
  data() {
    return {
      event: { id: "", store: null },
      stores: [],
      storeSearchTerm: "",
      posterImage: ""
    };
  },
  methods: {
    async save() {
      if (this.$route.params.id === "add") {
        this.event = (await Event.save(this.event)).body;
      } else {
        this.event = (
          await Event.update(
            {
              id: this.$route.params.id,
              bypassBandIdsCheck: true,
              authBands: false
            },
            this.event
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
        this.$router.replace(`/event/${this.event.id}`);
      }
    },
    async remove() {
      if (
        !(
          await Swal.fire({
            title: "确定要删除这个活动？",
            text: `这个操作不可撤销，该活动的报名数据将被清空`,
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
      await Event.delete({ id: this.event.id });
      this.$router.go(-1);
    },
    async getStores(q) {
      this.stores = (await Store.get({ keyword: q })).body;
      return this.stores;
    },
    selectStore(item) {
      this.event.store = item;
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
      this.event.posterUrl = fileObject.url;
    },
    removeImage: function(type) {
      this.posterImage = "";
      this.event.posterUrl = null;
    }
  },
  watch: {
    "event.date"(v) {
      if (!v.constructor || v.constructor.name !== "Date") {
        this.event.date = new Date(this.event.date);
      }
    }
  },
  async mounted() {
    if (this.$route.params.id !== "add") {
      this.event = (await Event.get({ id: this.$route.params.id })).body;
      if (this.event.store) this.storeSearchTerm = this.event.store.name;
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
