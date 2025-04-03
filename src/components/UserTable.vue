<script setup>
import { ref, onMounted } from "vue";
import userApi from "@/api/userApi.js";

const users = ref([]);
const search = ref("");

const fetchUsers = async () => {
  const response = await userApi.getUsersByUserClass(-1);
  users.value = JSON.parse(response.data.data);
};

onMounted(fetchUsers);

const userClassMap = {
  Normal: "普通用户",
  Assistant: "咨询师",
  Supervisor: "督导",
  Manager: "管理员",
};
</script>

<template>
  <va-card>
    <va-card-title>用户列表</va-card-title>
    <va-card-content>
      <va-input v-model="search" placeholder="搜索用户..." class="mb-3" />
      <va-data-table
          :items="users"
          :columns="[
          { key: 'id', label: 'ID' },
          { key: 'userName', label: '用户名' },
          { key: 'password', label: '密码' },
          { key: 'userClass', label: '身份类别', sortable: true },
        ]"
          :filter="search"
          :per-page="5"
      >
        <template #cell(userClass)="{ value }">
          {{ userClassMap[value] || "错误" }}
        </template>
      </va-data-table>
    </va-card-content>
  </va-card>
</template>

<style scoped>
.va-card {
  padding: 20px;
}
</style>
