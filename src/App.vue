<template>
   <nav class="navbar">
    <router-link to="/" class="nav-link">首页</router-link>
    <span class="separator">|</span>
    <router-link to="/about" class="nav-link">关于</router-link>
     <span class="separator">|</span>
     <router-link to="/dashboard" class="nav-link">工作台</router-link>
    <NavBarActions :avatar-name="userName" class="user-dropdown"></NavBarActions>

  </nav>
  <main>
    <nav class="flex items-center">
      <VaBreadcrumbs v-if="loggedIn">
      <VaBreadcrumbsItem label="Home" to="/dashboard"/>
      <VaBreadcrumbsItem v-for="item in breadcrumbs" :label="item.label" :to="item.to"></VaBreadcrumbsItem>
      </VaBreadcrumbs>
    </nav>
    <router-view></router-view>
  </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watchEffect } from "vue";
import userApi from "@/api/userApi.js";
import NavBarActions from "./components/navbar/NavBarActions.vue";
import { useRoute} from "vue-router";

const loggedIn = ref(localStorage.getItem("logged"));
const userName = ref(localStorage.getItem("userName") || "");
const dropdownOpen = ref(false);

const route = useRoute();

const breadcrumbs = computed(()=> {
  const matched = route.matched.filter(r=>r.name !== 'Home')
  return matched.map((r,index)=>({
    label:r.name,
    to:index < matched.length-1 ? {name:r.name} : undefined,
  }))
});


watchEffect(() => {
  userName.value = localStorage.getItem("userName") || "";
  loggedIn.value = localStorage.getItem("logged") === "true";
});

onMounted(() => {
  document.addEventListener("click", closeDropdownOnOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdownOnOutsideClick);
});

// 切换下拉菜单状态
function toggleDropdown(event) {
  event.stopPropagation(); // 防止点击事件冒泡
  dropdownOpen.value = !dropdownOpen.value;
}

// 点击外部关闭下拉菜单
function closeDropdownOnOutsideClick(event) {
  if (!event.target.closest(".user-dropdown")) {
    dropdownOpen.value = false;
  }
}

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

/* 用户头像 */
.user-dropdown {
  position: absolute;
  right: 20px;
  cursor: pointer;
}

.user-icon {
  width: 40px;
  height: 40px;
  background-color: #007bff;
  color: white;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;
}

.user-icon:hover {
  background-color: #0056b3;
}

/* 下拉菜单 */
.dropdown-menu {
  position: absolute;
  top: 50px;
  right: 0;
  background: white;
  border-radius: 5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  min-width: 120px;
  overflow: hidden;
}

.dropdown-item {
  padding: 10px;
  color: black;
  text-decoration: none;
  display: block;
  text-align: center;
  transition: background-color 0.3s;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

/* 登出按钮 */
.logout {
  cursor: pointer;
  color: red;
}
</style>

<style lang="scss">
#app {
  font-family: 'Inter', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>