<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-size-100 mx-auto">
        <form @submit.prevent="save">
          <md-card>
            <md-card-header class="md-card-header-icon">
              <div class="card-icon">
                <md-icon>settings</md-icon>
              </div>
              <h4 class="title">{{ key }}</h4>
            </md-card-header>

            <md-card-content class="md-layout">
              <div class="md-layout-item md-size-100">
                <vue-json-editor
                  v-model="value"
                  :expandedOnStart="true"
                  lang="zh"
                ></vue-json-editor>
              </div>
              <div class="md-layout-item md-size-100 text-right">
                <md-button type="submit" class="md-raised md-primary mt-4"
                  >保存</md-button
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
import { Config } from "@/resources";
import vueJsonEditor from "vue-json-editor";

export default {
  components: {
    vueJsonEditor
  },
  data() {
    return {
      key: this.$route.params.key,
      value: {}
    };
  },
  methods: {
    async save() {
      this.value = (await Config.update(
        { key: this.$route.params.key },
        this.value
      )).body[this.key];

      if (typeof this.value !== "object") {
        this.value = { [this.key]: this.value };
      }

      this.$notify({
        message: "保存成功",
        icon: "check",
        horizontalAlign: "center",
        verticalAlign: "bottom",
        type: "success"
      });
    }
  },
  async mounted() {
    const config = (await Config.get({ key: this.$route.params.key })).body;
    this.value = config[this.key];
    if (typeof this.value !== "object") {
      this.value = { [this.key]: this.value };
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
