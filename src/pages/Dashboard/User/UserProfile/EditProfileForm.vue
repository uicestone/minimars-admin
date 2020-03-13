<template>
  <form @submit.prevent="save">
    <md-card>
      <md-card-header
        class="md-card-header-icon"
        :class="getClass(headerColor)"
      >
        <div class="card-icon">
          <md-icon>perm_identity</md-icon>
        </div>
        <h4 class="title">{{ user.name }}</h4>
      </md-card-header>

      <md-card-content class="md-layout">
        <div class="file-input img-circle md-layout-item md-size-25">
          <div v-if="!user.avatarUrl">
            <div class="image-container">
              <img src="/img/placeholder.jpg" title="" />
            </div>
          </div>
          <div class="image-container" v-else>
            <img :src="user.avatarUrl" />
          </div>
          <div class="text-center">
            <md-button
              class="md-danger md-round md-just-icon"
              @click="removeImage('circle')"
              v-if="user.avatarUrl"
            >
              <md-icon>close</md-icon>
            </md-button>
            <md-button
              class="md-success md-round md-fileinput"
              :class="{ 'md-just-icon': user.avatarUrl }"
            >
              <div v-if="!user.avatarUrl">选择头像</div>
              <div v-else><md-icon>refresh</md-icon></div>
              <input
                type="file"
                ref="avatarFileInput"
                @change="onFileChange"
                accept="image/jpeg,image/png"
              />
            </md-button>
          </div>
        </div>
        <div class="md-layout-item md-size-75 md-layout md-alignment-vertical">
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>姓名</label>
              <md-input v-model="user.name"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>性别</label>
              <md-input v-model="user.gender" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>手机号</label>
              <md-input v-model="user.mobile" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>地区</label>
              <md-input v-model="user.region" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>生日</label>
              <md-input v-model="user.birthday" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>星座</label>
              <md-input v-model="user.constellation" type="text"></md-input>
            </md-field>
          </div>
          <!-- <div
            v-if="user.role === 'customer'"
            class="md-layout-item md-small-size-100 md-size-50"
          >
            <md-field>
              <label>等级</label>
              <md-input v-model="user.cardType" type="text" disabled></md-input>
            </md-field>
          </div> -->
          <div
            v-if="user.role === 'customer'"
            class="md-layout-item md-small-size-100 md-size-50"
          >
            <md-field>
              <label>卡号</label>
              <md-input
                v-model="user.cardNo"
                type="text"
                :disabled="!$user.can('edit-user')"
              ></md-input>
            </md-field>
          </div>
          <div
            v-if="user.role === 'customer'"
            class="md-layout-item md-small-size-100 md-size-50"
          >
            <md-field>
              <label>余额</label>
              <md-input v-model="user.credit" type="text" disabled></md-input>
            </md-field>
          </div>
          <div
            v-if="user.role !== 'customer' || $user.can('manage-user')"
            class="md-layout-item md-small-size-100 md-size-50"
          >
            <md-field>
              <label>角色</label>
              <md-select
                v-model="user.role"
                @keydown.enter.prevent=""
                :disabled="!$user.can('manage-user')"
              >
                <md-option value="admin">管理员</md-option>
                <md-option value="manager">店长</md-option>
                <md-option value="customer">客人</md-option>
              </md-select>
            </md-field>
          </div>
          <div
            v-if="user.role === 'customer'"
            class="md-layout-item md-small-size-100 md-size-50"
          >
            <md-field>
              <label>会员等级</label>
              <md-input v-model="user.cardType" type="text" disabled></md-input>
            </md-field>
          </div>
          <div
            v-if="user.role !== 'customer'"
            class="md-layout-item md-small-size-100 md-size-50"
          >
            <md-field>
              <label>通行证</label>
              <md-input v-model="user.passNo" />
            </md-field>
          </div>
          <div class="md-layout-item md-size-100">
            <md-field>
              <label>身份证号</label>
              <md-input v-model="user.idCardNo" />
            </md-field>
          </div>
        </div>
        <div
          v-if="user.role !== 'customer'"
          class="md-layout-item md-layout mt-2"
        >
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>用户名</label>
              <md-input
                v-model="user.login"
                type="text"
                autocomplete="new-password"
              ></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>重置密码</label>
              <md-input
                v-model="user.password"
                type="password"
                autocomplete="new-password"
              ></md-input>
            </md-field>
          </div>
        </div>
        <div class="md-layout-item md-size-100 text-right">
          <md-button type="submit" class="md-raised md-primary mt-4"
            >保存</md-button
          >
        </div>
      </md-card-content>
    </md-card>
  </form>
</template>
<script>
export default {
  name: "edit-profile-form",
  props: {
    headerColor: {
      type: String,
      default: ""
    },
    user: {
      type: Object
    },
    save: {
      type: Function
    }
  },
  data() {
    return {};
  },
  methods: {
    getClass: function(headerColor) {
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
      const fileObject = (await this.$http.post("file", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })).body;
      this.user.avatarUri = fileObject.uri;
      this.user.avatarUrl = fileObject.url;
      this.$user.avatarUrl = fileObject.url;
    },
    removeImage() {
      this.user.avatarUri = null;
      this.user.avatarUrl = null;
      this.$user.avatarUrl = null;
      this.$refs.avatarFileInput.value = "";
    }
  }
};
</script>
<style>
.text-center {
  text-align: center;
}
.md-fileinput:not(.md-just-icon) .md-ripple {
  padding: 11px 30px !important;
}
</style>
