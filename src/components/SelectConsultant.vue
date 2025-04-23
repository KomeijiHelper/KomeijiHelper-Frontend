<template>
  <div v-if="show" class="overlay">
    <div class="popup">
      <div class="popup-header">
        <h2>选择咨询师</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      <div v-if="waitingForConfirm" class="waiting-message">
        <div class="spinner"></div>
        <p>等待咨询师确认...</p>
        <button @click="cancelRequest" class="cancel-btn">取消请求</button>
      </div>
      <div v-else class="consultant-list">
        <div v-for="consultant in consultants"
             :key="consultant.consultantId"
             class="consultant-card"
             @click="selectConsultant(consultant.consultantName)">
          <h3>咨询师 {{ consultant.consultantName }}</h3>
          <StarWithPercent :score="consultant.avgScore" />
          <p>咨询数：{{ consultant.totalRecord }}</p>
          <p>有评分咨询数：{{ consultant.scoreRecord }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userApi from '@/api/userApi.js'
import InformedConsentForm from "@/components/InformedConsentForm.vue";
import StarWithPercent from "@/components/StarWithPercent.vue";
import router from "@/router/index.js";
import { useToast } from "vuestic-ui";

const { notify } = useToast();

export default {
  name: 'SelectConsultantPopup',
  props: {
    show: Boolean
  },
  components: { StarWithPercent, InformedConsentForm },
  data() {
    return {
      consultants: [],
      waitingForConfirm: false,
      currentConsultantId: null,
      ws: null
    }
  },
  async created() {
    try {
      const response = await userApi.getConsultants();
      this.consultants = response.data.data;
    } catch (error) {
      console.error('获取咨询师列表失败:', error)
      notify('获取咨询师列表失败')
    }
  },
  methods: {
    async selectConsultant(consultantId) {
      try {
        this.waitingForConfirm = true
        this.currentConsultantId = consultantId
        this.setupWebSocket()
        const result = await userApi.consulting(consultantId)

        if (result.data.code === 406) {
          notify("您已经取消预约")
          this.waitingForConfirm = false;
        } else if (result.data.code === 407) {
          notify("咨询师拒绝了请求")
          this.waitingForConfirm = false;
        }
      } catch (error) {
        console.error('选择咨询师失败:', error)
        notify('选择咨询师失败')
        this.waitingForConfirm = false
      }
    },
    setupWebSocket() {
      const id = localStorage.getItem('userName');
      this.ws = new WebSocket('ws://127.0.0.1:54950/ws?id=' + id)

      this.ws.onopen = () => {
        console.log('WebSocket连接已建立')
      }

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'chat_connect') {
          const from = JSON.parse(data.content).from
          const to = JSON.parse(data.content).to
          const url = `/chat/room?from=${from}&to=${to}`
          window.open(url, '_blank')
        }
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket错误:', error)
        notify('连接错误')
        this.waitingForConfirm = false
      }

      this.ws.onclose = () => {
        console.log('WebSocket连接已关闭')
        this.waitingForConfirm = false
      }
    },
    cancelRequest() {
      if (this.ws) {
        this.ws.close()
      }
      userApi.cancelConsulting()
      this.waitingForConfirm = false
      this.currentConsultantId = null
    }
  },
  beforeUnmount() {
    if (this.ws) {
      this.ws.close()
    }
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup {
  background: white;
  padding: 20px;
  width: 90%;
  max-width: 800px;
  max-height: 90%;
  overflow-y: auto;
  border-radius: 10px;
  position: relative;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.consultant-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.consultant-card {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.consultant-card:hover {
  background-color: #e0e0e0;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.waiting-message {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 20px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.cancel-btn {
  margin-top: 20px;
  padding: 8px 16px;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-btn:hover {
  background-color: #cc0000;
}
</style>
