<script setup>
import { ref, computed, onMounted } from "vue";
import userApi from "@/api/userApi.js";
import {
  VaButton,
  VaCard,
  VaCardContent,
  VaCardTitle,
  VaContent,
  VaInput,
  VaSelect,
  VaPagination,
} from "vuestic-ui";

const users = ref([]);
const editableUsers = ref([]);
const search = ref("");

// 每页显示条数
const perPage = ref(5);
const currentPage = ref(1);

const userClassOptions = ["Normal", "Assistant", "Supervisor", "Manager"];

const fetchUsers = async () => {
  const response = await userApi.getUsersByUserClass(-1);
  users.value = JSON.parse(response.data.data);
  editableUsers.value = users.value.map(user => ({ ...user }));
};

onMounted(fetchUsers);

const submitUser = async (userIndex) => {
  try {
    const userToSubmit = pagedUsers.value[userIndex]; // 注意这里用 pagedUsers
    console.log(JSON.stringify(userToSubmit));
    await userApi.submitUserChange(userToSubmit);
    await fetchUsers()
  } catch (err) {
    console.error(err);
    alert("提交失败");
  }
};

// 搜索过滤后的数据
const filteredUsers = computed(() => {
  if (!search.value) return editableUsers.value;
  return editableUsers.value.filter(user =>
      user.userName.toLowerCase().includes(search.value.toLowerCase())
  );
});

// 当前页的数据
const pagedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredUsers.value.slice(start, start + perPage.value);
});

// 页数
const pageCount = computed(() => Math.ceil(filteredUsers.value.length / perPage.value));
</script>

<template>
  <va-card>
    <va-card-title>用户列表</va-card-title>
    <va-card-content>
      <va-input v-model="search" placeholder="搜索用户..." class="mb-3" />

      <va-data-table
          :items="pagedUsers"
          :columns="[
          { key: 'id', label: 'ID' },
          { key: 'userName', label: '用户名' },
          { key: 'password', label: '密码' },
          { key: 'userClass', label: '身份类别', sortable: true },
          { key: 'operation', label: '操作' },
        ]"
          :filter="''"
      >
      <template #cell(userName)="{ rowIndex }">
        <va-content>{{ pagedUsers[rowIndex].userName }}</va-content>
      </template>

      <template #cell(password)="{ rowIndex }">
        <va-input v-model="pagedUsers[rowIndex].password" />
      </template>

      <template #cell(userClass)="{ rowIndex }">
        <va-select
            v-model="pagedUsers[rowIndex].userClass"
            :options="userClassOptions"
        />
      </template>

      <template v-slot:cell(operation)="{ rowIndex }">
        <va-button @click="submitUser(rowIndex)" color="primary" size="small">
          提交
        </va-button>
      </template>
      </va-data-table>

      <!-- 手动分页器 -->
      <div class="mt-4 flex justify-center">
        <va-pagination
            v-model="currentPage"
            :pages="pageCount"
        />
      </div>
    </va-card-content>
  </va-card>
</template>

<style scoped>
.va-card {
  padding: 20px;
}
</style>
