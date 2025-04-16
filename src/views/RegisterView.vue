<template>
  <div class="register-wrapper">
    <div class="register-container">
      <div class="register-content">
        <div class="welcome-section">
          <h1 class="register-title">开启心灵之旅</h1>
          <p class="register-subtitle">每一次倾诉都是走向治愈的开始</p>
        </div>

        <div class="form-group">
          <InputBlank ref="usernameRef" placeholder="用户名" />
          <InputBlank ref="passwordRef" placeholder="密码" type="password" />
          <InputBlank ref="passwordRepeatRef" placeholder="请重复你的密码" type="password" />
        </div>

        <button class="register-button" @click="handleRegister">
          <span>开始心理咨询之旅</span>
        </button>

        <router-link class="login-link" to="/login">
          已有账号？<span>温暖回归</span>
        </router-link>
      </div>
    </div>
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
.register-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5eb 0%, #ffecd2 100%);
  padding: 20px;
}

.register-container {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 15px 35px rgba(255, 178, 107, 0.1);
  width: 100%;
  max-width: 420px;
  text-align: center;
  animation: containerFadeIn 0.8s ease-out;
}

.register-content {
  opacity: 0;
  animation: contentFadeIn 0.8s ease-out forwards;
  animation-delay: 0.3s;
}

.welcome-section {
  margin-bottom: 35px;
}

.register-title {
  color: #5d4037;
  font-size: 2.2em;
  font-weight: 600;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.register-subtitle {
  color: #8d6e63;
  font-size: 1.1em;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group :deep(input) {
  background: #fff8e1;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

.form-group :deep(input:focus) {
  border-color: #ffb74d;
  background: white;
}

.register-button {
  width: 100%;
  padding: 14px;
  margin-top: 20px;
  background: #ffb74d;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.register-button:hover {
  background: #ffa726;
  transform: translateY(-2px);
}

.register-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.5s ease-out;
}

.register-button:active::after {
  transform: translate(-50%, -50%) scale(2);
}

.login-link {
  display: block;
  margin-top: 25px;
  font-size: 0.95em;
  color: #8d6e63;
  text-decoration: none;
  transition: color 0.3s ease;
}

.login-link span {
  color: #ff9800;
  font-weight: 500;
  position: relative;
}

.login-link span::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background: #ff9800;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.login-link:hover span::after {
  transform: scaleX(1);
}

@keyframes containerFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes contentFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: 30px 20px;
  }

  .register-title {
    font-size: 1.8em;
  }
}
</style>
