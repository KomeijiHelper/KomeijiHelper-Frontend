<template>
  <va-card class="custom-card">
    <va-card-title>
      聊天记录
    </va-card-title>
    <va-card-content>
      <va-select v-model="perPage" :options="[5, 10, 20, 50]" label="每页数量" class="w-32" />
      <va-data-table :columns="columns" :items="chatRecords" :per-page="perPage" :current-page="currentPage"
        @update:current-page="currentPage = $event" :loading="isLoading" loading-text="加载中...">
        <template #cell(score)="{ row }">
          {{ row.rowData.score === 0 ? '-' : row.rowData.score }}
        </template>
        <template #cell(actions)="{ row }">
          <va-button @click="viewChat(row.rowData.id)" color="primary">
            查看记录
          </va-button>
          <va-button @click="downloadChat(row.rowData.id)" color="primary">
            导出记录
          </va-button>
          <va-button v-if="isNormalUser && row.rowData.score===0" @click="rating(row.rowData.id)" color="primary">
            打分
          </va-button>
        </template>
      </va-data-table>
      <VaModal v-model="showRecord" fixed-layout no-dismiss blur cancel-text="关闭" @cancel="closeModal">
        <ChatRecord :jsondata="recordContent"></ChatRecord>
      </VaModal>
      <div class="flex justify-between items-center mt-2">
        <va-pagination v-model="currentPage" :pages="totalPages" />
      </div>
    </va-card-content>
  </va-card>
  <Rating ref="ratingWidget" />
</template>

<script setup>
import userApi from '@/api/userApi'
import Rating from "@/components/Rating.vue";
import {computed, onMounted, ref} from 'vue'
import {useToast, VaButton, VaCard, VaCardContent, VaCardTitle, VaDataTable, VaPagination, VaSelect} from "vuestic-ui";
import ChatRecord from './ChatRecord.vue';

const chatRecords = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const perPage = ref(5)

const isNormalUser = ref(localStorage.getItem("userRole") === '0');

const recordContent = ref();
const showRecord = ref(false);

const ratingWidget = ref()
const {notify} = useToast()

const columns = [
  { key: 'patientName', label: '咨询者' },
  { key: 'consultantName', label: '咨询师' },
  { key: 'timeStamp', label: '时间' },
  { key: "score", label: "评分"},
  { key: 'actions', label: '操作' },
]

onMounted(async () => {
  isLoading.value = true
  try {
    const response = await userApi.getHistoryChat()
    console.log(response)
    if (response.data.code === '200') {
      chatRecords.value = response.data.data
      console.log(chatRecords.value)
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

const downloadChat = async (id) => {
  console.log(id);
  try {
    userApi.downloadChat(id)
  } catch (err) {
    console.error(err)
    alert('操作失败')
  }
}

const viewChat = async (id) => {
  try {
    const response = await userApi.getChatContent(id);
    console.log(response);
    if(response.data.code !== '200') {
      notify(response.data.msg);
      return;
    }
    recordContent.value = response.data.data;
    showRecord.value = true;
  }
  catch (err) {
    console.error(err);
  }
}

const rating = async(id) => {
  try{
    await ratingWidget.value.open(id)
    notify("打分成功")
    await (new Promise(resolve => setTimeout(resolve, 1000)));
    window.location.reload();
  } catch (error) {
    console.error(error)
  }
}

const closeModal = () => {
  showRecord.value = false;
  recordContent.value = null;
}
</script>

<style scoped>
.custom-card {
  margin: auto;
  background-color: transparent;
  box-shadow: none;
}
</style>
