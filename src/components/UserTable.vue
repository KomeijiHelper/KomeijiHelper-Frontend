<script setup>
import userApi from "@/api/userApi.js";
import BindSupervisorWindow from "@/components/BindSupervisorWindow.vue";
import {computed, onMounted, ref, watchEffect} from "vue";
import {
  useModal,
  useToast,
  VaButton,
  VaCard,
  VaCardContent,
  VaCardTitle,
  VaContent,
  VaDataTable,
  VaInput,
  VaPagination,
  VaSelect
} from "vuestic-ui";

const { queryUserClass } = defineProps({
  queryUserClass: {
    type: [Number],
    default: -1
  }
})

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
  const response = await userApi.getUsersByUserClass(queryUserClass);
  console.log(response);
  users.value = JSON.parse(response.data.data);
  editableUsers.value = users.value.map(user => ({ ...user }));
};

onMounted(fetchUsers);

watchEffect(() => {
  fetchUsers();  // 每次 defaultUserClass 变化时都会触发
});

const { confirm } = useModal()
const { notify } = useToast()
const submitUser = async (userIndex) => {
  try {
    const copiedUser = { ...pagedUsers.value[userIndex] };
    copiedUser.userClass = copiedUser.userClass === 'Normal' ? 0 : copiedUser.userClass === "Assistant" ? 1 : copiedUser.userClass === "Supervisor" ? 2 : copiedUser.userClass === "Manager" ? 3 : 0;
    await userApi.submitUserChange(copiedUser);
    await fetchUsers()
  } catch (err) {
    console.error(err);
    notify("提交失败");
  }
};

const showWindow = ref(false)
const valueToPass = ref('')
function OpenBindWindow(val) {
  valueToPass.value = val;
  showWindow.value = true;
}

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
  confirm('确定为该用户重置密码吗?').then(
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

const dynamicColumns = computed(() => {
  const baseColumns = [
    { key: 'id', label: 'ID', style: { width: columnWidths.id } },
    { key: 'userName', label: '用户名', style: { width: columnWidths.userName } },
    { key: 'password', label: '密码', style: { width: columnWidths.password } },
    { key: 'email', label: '邮箱', style: { width: '200px' } },
    { key: 'userClass', label: '身份类别', sortable: true, style: { width: columnWidths.userClass } },
  ];

  // 根据 userClassCode 决定显示哪些列
  if (queryUserClass === -1 || queryUserClass === 0) {
    return baseColumns.concat([
      { key: 'operation', label: '操作', style: { width: columnWidths.operation } },
    ]);
  } else if (queryUserClass === 1) {
    return baseColumns.concat([
      { key: 'qualification', label: '资质编号', style: { width: '150px' } },
      { key: 'operation', label: '操作', style: { width: columnWidths.operation } },
    ]);
  } else if (queryUserClass === 2) {
    return baseColumns.concat([
      { key: 'qualification', label: '资质编号', style: { width: '150px' } },
      { key: 'operation', label: '操作', style: { width: columnWidths.operation } },
    ]);
  }

  return baseColumns;
});

</script>

<template>
  <BindSupervisorWindow v-if="showWindow" :init-value="valueToPass" @close="showWindow = false" />
  <va-card>
    <va-card-title>用户列表</va-card-title>
    <va-card-content>
      <va-input v-model="search" placeholder="搜索用户..." class="mb-3" />

      <va-data-table :items="pagedUsers" :columns="dynamicColumns" :filter="''">
        <template #cell(userName)="{ rowIndex }">
          <va-content>{{ pagedUsers[rowIndex].userName }}</va-content>
        </template>

        <template #cell(password)="{ rowIndex }">
          <va-button @click="resetPassword(rowIndex)" color="primary" size="small">重置密码</va-button>
        </template>

        <template #cell(email)="{ rowIndex }">
          <va-content>{{ pagedUsers[rowIndex].email }}</va-content>
        </template>

        <template #cell(userClass)="{ rowIndex }">
          <va-select v-model="pagedUsers[rowIndex].userClass" :options="userClassOptions" track-by="value"
            text-by="label" value-by="value" />
        </template>
        <template #cell(qualification)="{ rowIndex }" v-if="dynamicColumns.some(col => col.key === 'qualification')">
          <va-content>{{ pagedUsers[rowIndex].qualification }}</va-content>
        </template>
        <template v-slot:cell(operation)="{ rowIndex }">
          <div class="button-group">
            <va-button @click="submitUser(rowIndex)" color="primary" size="small">
              提交
            </va-button>
            <va-button v-if="pagedUsers[rowIndex].userClass === 'Assistant'"
              @click="OpenBindWindow(pagedUsers[rowIndex].userName)" color="primary" size="small">
              绑定督导
            </va-button>
          </div>
        </template>
      </va-data-table>

      <!-- 手动分页器 -->
      <div class="mt-4 flex justify-center">
        <va-pagination v-model="currentPage" :pages="pageCount" />
      </div>
    </va-card-content>
  </va-card>
</template>

<style scoped>
.va-card {
  padding: 20px;
}

.button-group {
  display: flex;
  gap: 10px;
}
</style>
