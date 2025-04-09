<template>
   <nav class="navbar">
    <router-link to="/" class="nav-link">首页</router-link>
    <span class="separator">|</span>
    <router-link to="/about" class="nav-link">关于</router-link>
     <span class="separator">|</span>
     <router-link to="/workbench" class="nav-link">工作台</router-link>
    <NavBarActions :avatar-name="userName" class="user-dropdown"></NavBarActions>

  </nav>
  <main>
    <nav class="flex items-center">
      <VaBreadcrumbs v-if="loggedIn">
      <VaBreadcrumbsItem label="Home" to="/workbench"/>
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
import {VaBreadcrumbs, VaBreadcrumbsItem} from "vuestic-ui";

const loggedIn = ref(localStorage.getItem("logged") === "true");
const userName = ref(localStorage.getItem("userName") || "");

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

.user-dropdown {
  position: absolute;
  right: 20px;
  cursor: pointer;
}

</style>

<style lang="scss">
#app {
  font-family: 'Inter', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>