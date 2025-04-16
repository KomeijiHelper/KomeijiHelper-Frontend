<template>
  <div class="lead-in">
    <div class="content-wrapper">
      <div class="welcome-section">
        <h1 class="title">欢迎来到心理咨询室</h1>
        <p class="subtitle">在这里，找到内心的平静</p>
        <div class="quote">
          每一次倾诉都是通向心灵成长的道路
        </div>
      </div>
      
      <div class="buttons-container">
        <button @click="$router.push('/login')" class="btn login-btn">
          <span class="btn-content">登录</span>
          <span class="btn-description">欢迎回来</span>
        </button>
        <button @click="$router.push('/register')" class="btn register-btn">
          <span class="btn-content">注册</span>
          <span class="btn-description">开启心理成长之旅</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.lead-in {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 更柔和的米色渐变背景 */
  background: linear-gradient(135deg, #fff5eb 0%, #ffecd2 100%);
  padding: 20px;
}

.content-wrapper {
  background: rgba(255, 255, 255, 0.92);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(255, 178, 107, 0.1);
  max-width: 600px;
  width: 90%;
  text-align: center;
  animation: fadeIn 0.8s ease-out;
}

.welcome-section {
  margin-bottom: 40px;
}

.title {
  /* 温暖的深褐色 */
  color: #5d4037;
  font-size: 2.5em;
  margin-bottom: 15px;
  font-weight: 600;
}

.subtitle {
  /* 柔和的棕色 */
  color: #8d6e63;
  font-size: 1.2em;
  margin-bottom: 25px;
}

.quote {
  font-style: italic;
  /* 淡棕色 */
  color: #a1887f;
  margin: 20px 0;
  padding: 15px;
  /* 温暖的橙色边框 */
  border-left: 4px solid #ffb74d;
  border-right: 4px solid #ffb74d;
  background: #fff8e1;
  text-align: center;
}

.buttons-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
  margin: 0 auto;
}

.btn {
  border: none;
  padding: 15px 30px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.btn-content {
  font-size: 1.2em;
  font-weight: 600;
  margin-bottom: 5px;
}

.btn-description {
  font-size: 0.9em;
  opacity: 0.9;
}

.login-btn {
  /* 温暖的橙色 */
  background: #ffa726;
  color: white;
}

.login-btn:hover {
  background: #ff9800;
  transform: translateY(-2px);
}

.register-btn {
  /* 柔和的珊瑚色 */
  background: #ffab91;
  color: white;
}

.register-btn:hover {
  background: #ff8a65;
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 20px;
  }
  
  .title {
    font-size: 2em;
  }
}
</style>