<template>
  <div class="login-container">
    <h2>登录</h2>

    <InputBlank ref="usernameRef" placeholder="用户名" />

    <InputBlank ref="passwordRef" placeholder="密码" type="password" />

    <button class="login-button" @click="handleLogin">登录</button>

    <router-link class="register-link" to="/register">没有账号？点我去注册</router-link>
  </div>
</template>

<script setup>
import { ref } from "vue";
import InputBlank from "@/components/InputBlank.vue";
import userApi from "@/api/userApi.js";

const usernameRef = ref(null);
const passwordRef = ref(null);

const handleLogin = async () => {
  const username = usernameRef.value.getValue();
  const password = passwordRef.value.getValue();

  if (!username || !password) {
    alert("请输入用户名和密码！");
    return;
  }

  await userApi.login(username, password);
};
</script>

<style scoped>
.login-container {
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

.login-button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.login-button:hover {
  background: #0056b3;
}

.register-link {
  display: block;
  margin-top: 20px;
  text-align: center;
  color: #007bff;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}

</style>
