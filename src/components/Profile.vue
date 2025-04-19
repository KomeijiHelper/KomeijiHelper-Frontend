<template>
  <div class="profile-container">
    <h1>编辑个人信息</h1>
    <div class="profile-layout">
      <div class="profile-form">
        <div class="form-group">
          <label for="userName">用户名</label>
          <va-content class="displayUserName"> {{profile.userName}} </va-content>
        </div>
        <div class="form-group">
          <label for="name">昵称</label>
          <input v-model="profile.nickName" type="text" id="name" placeholder="请输入您的姓名" />
        </div>
        <div class="form-group">
          <label for="email">邮箱</label>
          <input v-model="profile.email" type="email" id="email" placeholder="请输入您的邮箱" />
        </div>
        <button @click="togglePasswordEditor">修改密码</button>
        <button @click="saveProfile">保存</button>
      </div>

      <!-- 动态加载密码编辑器 -->
      <PasswordEditor
          v-if="showPasswordEditor"
          @close="showPasswordEditor = false"
          @submit="handlePasswordChange"
      />
    </div>
  </div>
</template>

<script setup>
import userApi from "@/api/userApi.js";
import PasswordEditor from "@/components/PasswordEditor.vue";
import {reactive, ref} from 'vue';
import {useToast, VaContent} from "vuestic-ui";

const {notify} = useToast()
const userData = await userApi.checkSession();

const profile = reactive({
  id: userData.id,
  nickName: userData.nickName,
  userName: userData.userName,
  email: userData.email,
  password: userData.password,
});

const showPasswordEditor = ref(false);

const togglePasswordEditor = () => {
  showPasswordEditor.value = !showPasswordEditor.value;
};

const saveProfile = async () => {
  const response = await userApi.changeUserInfo(JSON.stringify(profile));
  console.log(response);
  if (response.data.code === '200')
    notify("保存成功");
};

const handlePasswordChange = async ({oldPassword, newPassword}) => {
  console.log("修改密码：", oldPassword, " -> ", newPassword);
  const response = await userApi.changePassword(oldPassword, newPassword);
  if (response.data.code !== "200") {
    console.log(response.data.msg)
    notify(response.data.msg);
  }
};
</script>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.profile-layout {
  display: flex;
  flex-direction: row;
  padding-top: 20px;
}

.profile-form {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 400px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

input, textarea {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.displayUserName {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 0px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  margin-top: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}
</style>
