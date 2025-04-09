<template>
  <div class="register-container">
    <h2>注册</h2>

    <InputBlank ref="usernameRef" placeholder="用户名" />

    <InputBlank ref="passwordRef" placeholder="密码" type="password" />

    <InputBlank ref="passwordRepeatRef" placeholder="请重复你的密码" type="password" />

    <button class="register-button" @click="handleRegister">注册</button>

    <router-link class="login-link" to="/login">已经有账号了？点我去登录</router-link>
  </div>
</template>

<script setup>
import { ref } from "vue";
import InputBlank from "@/components/InputBlank.vue";
import userApi from "@/api/userApi.js";

const usernameRef = ref(null);
const passwordRef = ref(null);
const passwordRepeatRef = ref(null);

const handleRegister = async () => {
  const username = usernameRef.value.getValue();
  const password = passwordRef.value.getValue();
  const passwordRepeat = passwordRef.value.getValue();

  if (!username || !password || !passwordRepeat) {
    alert("请输入用户名和密码！");
    return;
  }

  if (passwordRepeat !== password) {
    alert("密码似乎不一致呢");
    return;
  }

  await userApi.register(username, password);
};
</script>

<style scoped>
.register-container {
  width: 300px;
  top: 50%;
  left: 50%;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
  transform: translate(-50%, 50%);
}

h2 {
  text-align: center;
}

.register-button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.register-button:hover {
  background: #0056b3;
}

.login-link {
  display: block;
  margin-top: 20px;
  text-align: center;
  color: #007bff;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}

</style>
