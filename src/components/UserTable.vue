<script setup>
import { ref, onMounted } from "vue";
import userApi from "@/api/userApi.js";

const users = ref([]);

const fetchUsers = async () => {
  const response = await userApi.getUsersByUserClass(-1);
  const parsedUsersArray = JSON.parse(response.data.data);
  users.value = parsedUsersArray;
};

onMounted(fetchUsers);
</script>

<template>
  <div>
    <h2>用户列表</h2>
    <table border="1">
      <thead>
      <tr>
        <th>ID</th>
        <th>用户名</th>
        <th>密码</th>
        <th>身份类别</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.id }}</td>
        <td>{{ user.userName }}</td>
        <td>{{ user.password }}</td>
        <td>{{ user.userClass === "Normal" ? "普通用户" : user.userClass === "Assistant" ? "咨询师" : user.userClass === "Supervisor" ? "督导" : user.userClass === "Manager" ? "管理员" : "错误" }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 8px;
  border: 1px solid black;
  text-align: left;
}
</style>
