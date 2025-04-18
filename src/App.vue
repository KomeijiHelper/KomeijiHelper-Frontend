<template>
  <nav class="navbar">
    <router-link to="/" class="nav-link">首页</router-link>
    <span class="separator">|</span>
    <router-link to="/about" class="nav-link">关于</router-link>
    <span class="separator">|</span>
    <router-link to="/workbench" class="nav-link">工作台</router-link>

    <div class="navbar-right">
      <va-content class="user-role">{{ displayName }}</va-content>
      <NavBarActions :avatar-name="userName" class="user-dropdown nav-link" />
    </div>
  </nav>

  <AIChatWidget></AIChatWidget>
  <main>
    <router-view class="global"></router-view>
    <!-- <canvas v-if="loggedIn" id="model_view"></canvas> -->
    <Vue3DraggableResizable :parent="true" :resizable="false" class="draggable">
      <Live2d v-if="loggedIn"></Live2d>
    </Vue3DraggableResizable>
  </main>
</template>

<script setup>
import { onMounted, ref, watchEffect,onBeforeUnmount } from "vue";
import userApi from "@/api/userApi.js";
import NavBarActions from "./components/navbar/NavBarActions.vue";
import { VaContent } from "vuestic-ui";
import Live2d from "./components/Live2d.vue";
import Vue3DraggableResizable from 'vue3-draggable-resizable'
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'

const loggedIn = ref(localStorage.getItem("logged") === "true");
const userName = ref(localStorage.getItem("userName") || "");
const displayName = ref(localStorage.getItem("displayUserRole"));

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

function handleBeforeUnload(e) {
  userApi.logout();
  console.log('🧹 页面即将关闭，执行清理操作')
}

watchEffect(() => {
  userName.value = localStorage.getItem("userName") || "";
  loggedIn.value = localStorage.getItem("logged") === "true";
  displayName.value = localStorage.getItem("displayUserRole");
});

</script>

<style scoped>
html,
body,
#app {
  height: 100%;
  margin: 0;
}

.navbar {
  background-color: #333;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  height: 8vh;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  padding: 10px;
  margin: 0 10px;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
}

.nav-link:hover {
  background-color: #007bff;
  color: #fff;
}

.separator {
  color: #fff;
  margin: 0 10px;
}

.navbar-right {
  position: absolute;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 2vw;
  /* 以百分比控制它们之间的间距 */
  min-width: 20%;
  /* 你可以按需调整宽度 */
  justify-content: flex-end;
}

.user-dropdown,
.user-role {
  color: white;
  cursor: pointer;
}

.global {
  background: linear-gradient(120deg, #fdfbfb 0%, #fff5eb 100%);
  height: 92vh;
}


.draggable{
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
  background: transparent !important;
}
main {
  position: relative;
}
</style>

<style lang="scss">
#app {
  font-family: 'Inter', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
</style>