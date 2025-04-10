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
  useModal, useToast,
} from "vuestic-ui";

const users = ref([]);
const editableUsers = ref([]);
const search = ref("");

// 每页显示条数
const perPage = ref(5);
const currentPage = ref(1);

const userClassOptions = [
  { label: '普通用户', value: 'Normal' },
  { label: '咨询师', value: 'Assistant' },
  { label: '督导', value: 'Supervisor' },
  { label: '管理员', value: 'Manager' },
];

const fetchUsers = async () => {
  const response = await userApi.getUsersByUserClass(-1);
  users.value = JSON.parse(response.data.data);
  editableUsers.value = users.value.map(user => ({ ...user }));
  console.log(users.value);
};

onMounted(fetchUsers);
const { confirm } = useModal()
const {notify} = useToast()
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

const resetPassword = (userIndex) => {
  confirm('确定将该用户密码重置为123456吗?').then(
      async (ok) => {
        if (ok) {
          userApi.resetPassword(pagedUsers.value[userIndex].id).then((response) => {
            if (response.data.code === '200') notify("修改成功")
          });
          await fetchUsers();
        }
      }
  )
}

// 页数
const pageCount = computed(() => Math.ceil(filteredUsers.value.length / perPage.value));

// 设置每一列的固定宽度
const columnWidths = {
  id: '100px',
  userName: '150px',
  password: '200px',
  userClass: '150px',
  operation: '100px',
};
</script>

<template>
  <va-card>
    <va-card-title>用户列表</va-card-title>
    <va-card-content>
      <va-input v-model="search" placeholder="搜索用户..." class="mb-3" />

      <va-data-table
          :items="pagedUsers"
          :columns="[
          { key: 'id', label: 'ID', style: { width: columnWidths.id } },
          { key: 'userName', label: '用户名', style: { width: columnWidths.userName } },
          { key: 'password', label: '密码', style: { width: columnWidths.password } },
          { key: 'userClass', label: '身份类别', sortable: true, style: { width: columnWidths.userClass } },
          { key: 'operation', label: '操作', style: { width: columnWidths.operation } },
        ]"
          :filter="''"
      >
      <template #cell(userName)="{ rowIndex }">
        <va-content>{{ pagedUsers[rowIndex].userName }}</va-content>
      </template>

      <template #cell(password)="{ rowIndex }">
        <va-button @click="resetPassword(rowIndex)" color="primary" size="small">重置密码</va-button>
      </template>

      <template #cell(userClass)="{ rowIndex }">
        <va-select
            v-model="pagedUsers[rowIndex].userClass"
            :options="userClassOptions"
            track-by="value"
            text-by="label"
            value-by="value"
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
