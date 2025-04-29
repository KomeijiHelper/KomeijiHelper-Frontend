<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-content">
        <div class="welcome-section">
          <h1 class="login-title">温暖相遇</h1>
          <p class="login-subtitle">每次回归都是新的开始</p>
        </div>

        <div class="form-group">
          <InputBlank ref="usernameRef" placeholder="用户名" />
          <InputBlank ref="passwordRef" placeholder="密码" type="password" />
        </div>

        <button class="login-button" @click="handleLogin">
          <span>开始访谈</span>
        </button>

        <router-link class="register-link" to="/register">
          初次造访？<span>开启心理咨询之旅</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import userApi from "@/api/userApi.js";
import InputBlank from "@/components/InputBlank.vue";
import {ref} from "vue";
import {useToast} from "vuestic-ui";

const usernameRef = ref(null);
const passwordRef = ref(null);
const {notify} = useToast();

const handleLogin = async () => {
  const username = usernameRef.value.getValue();
  const password = passwordRef.value.getValue();

  if (!username || !password) {
    notify("请输入用户名和密码！");
    return;
  }

  try {
    const res = await userApi.login(username, password);
    console.log(res)
    if (res.status === 200) {
      notify("登陆成功");
      await (new Promise(resolve => setTimeout(resolve, 1000)));
      window.location.reload();
    } else {
      notify("登录失败！");
    }
  } catch (err) {
    notify("登录请求失败！请检查控制台");
    console.error(err);
  }
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5eb 0%, #ffecd2 100%);
  padding: 20px;
}

.login-container {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 15px 35px rgba(255, 178, 107, 0.1);
  width: 100%;
  max-width: 420px;
  text-align: center;
  animation: containerFadeIn 0.8s ease-out;
}

.login-content {
  opacity: 0;
  animation: contentFadeIn 0.8s ease-out forwards;
  animation-delay: 0.3s;
}

.welcome-section {
  margin-bottom: 35px;
}

.login-title {
  color: #5d4037;
  font-size: 2.2em;
  font-weight: 600;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.login-subtitle {
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

.login-button {
  width: 100%;
  padding: 14px;
  margin-top: 20px;
  background: #ffa726;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-button:hover {
  background: #ff9800;
  transform: translateY(-2px);
}

.login-button::after {
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

.login-button:active::after {
  transform: translate(-50%, -50%) scale(2);
}

.register-link {
  display: block;
  margin-top: 25px;
  font-size: 0.95em;
  color: #8d6e63;
  text-decoration: none;
  transition: color 0.3s ease;
}

.register-link span {
  color: #ff9800;
  font-weight: 500;
  position: relative;
}

.register-link span::after {
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

.register-link:hover span::after {
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
  .login-container {
    padding: 30px 20px;
  }

  .login-title {
    font-size: 1.8em;
  }
}
</style>