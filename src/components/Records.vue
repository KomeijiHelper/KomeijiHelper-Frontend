<template>
  <va-card class="custom-card">
    <va-card-title>
      聊天记录
    </va-card-title>
    <va-card-content>
      <va-select
          v-model="perPage"
          :options="[5, 10, 20, 50]"
          label="每页数量"
          class="w-32"
      />
      <va-data-table
          :columns="columns"
          :items="chatRecords"
          :per-page="perPage"
          :current-page="currentPage"
          @update:current-page="currentPage = $event"
          :loading="isLoading"
          loading-text="加载中..."
      >
        <template #cell(actions)="{ row }">
          <va-button @click="handleAction(row.id)" color="primary">
            传送ID
          </va-button>
        </template>
      </va-data-table>
      <div class="flex justify-between items-center mt-2">
        <va-pagination
            v-model="currentPage"
            :pages="totalPages"
        />
      </div>
    </va-card-content>
  </va-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import userApi from '@/api/userApi'
import {VaButton, VaCard, VaCardContent, VaCardTitle, VaPagination, VaSelect} from "vuestic-ui";

const chatRecords = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const perPage = ref(5)

const columns = [
  { key: 'patientName', label: '咨询者' },
  { key: 'consultantName', label: '咨询师' },
  { key: 'timeStamp', label: '时间戳' },
  { key: 'actions', label: '操作' },
]

onMounted(async () => {
  isLoading.value = true
  try {
    const response = await userApi.getHistoryChat()
    console.log(response)
    if (response.data.code === '200') {
      chatRecords.value = response.data.data
    }
  } catch (error) {
    console.error('加载失败', error)
  } finally {
    isLoading.value = false
  }
})

const totalPages = computed(() =>
    Math.ceil(chatRecords.value.length / perPage.value)
)

const handleAction = async (id) => {
  try {
    await userApi.sendId(id)
    alert(`已成功传送ID: ${id}`)
  } catch (err) {
    console.error(err)
    alert('操作失败')
  }
}
</script>

<style scoped>
.custom-card {
  max-width: 1000px;
  margin: auto;
  background-color: transparent;
  box-shadow: none;
}
</style>
