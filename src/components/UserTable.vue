<script setup>
import { ref, onMounted } from "vue";
import userApi from "@/api/userApi.js";
import {VaButton, VaCard, VaCardContent, VaCardTitle, VaContent, VaInput, VaSelect} from "vuestic-ui";

const users = ref([]);
const editableUsers = ref([]);
const search = ref("");

// 直接使用原始 userClass 值作为选项
const userClassOptions = ["Normal", "Assistant", "Supervisor", "Manager"];

const fetchUsers = async () => {
  const response = await userApi.getUsersByUserClass(-1);
  users.value = JSON.parse(response.data.data);
  editableUsers.value = users.value.map(user => ({ ...user }));
};

onMounted(fetchUsers);

const submitUser = async (userIndex) => {
  try {
    const userToSubmit = editableUsers.value[userIndex];
    console.log(JSON.stringify(userToSubmit));
    await userApi.submitUserChange(userToSubmit);
    await fetchUsers()
  } catch (err) {
    console.error(err);
    alert("提交失败");
  }
};
</script>

<template>
  <va-card>
    <va-card-title>用户列表</va-card-title>
    <va-card-content>
      <va-input v-model="search" placeholder="搜索用户..." class="mb-3" />
      <va-data-table
          :items="editableUsers"
          :columns="[
          { key: 'id', label: 'ID' },
          { key: 'userName', label: '用户名' },
          { key: 'password', label: '密码' },
          { key: 'userClass', label: '身份类别', sortable: true },
          { key: 'operation', label: '操作' },
        ]"
          :filter="search"
          :per-page="5"
      >
        <template #cell(userName)="{ rowIndex }">
          <va-content>{{ editableUsers[rowIndex].userName }}</va-content>
        </template>

        <template #cell(password)="{ rowIndex }">
          <va-input v-model="editableUsers[rowIndex].password" />
        </template>

        <template #cell(userClass)="{ rowIndex }">
          <va-select
              v-model="editableUsers[rowIndex].userClass"
              :options="userClassOptions"
          />
        </template>

        <template v-slot:cell(operation)="{ rowIndex }">
          <va-button @click="submitUser(rowIndex)" color="primary" size="small">
            提交
          </va-button>
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
