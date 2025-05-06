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
import {useToast} from "vuestic-ui";

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
    await this.fetchConsultants();
  },
  watch: {
    show: {
      immediate: false, // 是否在初始时立即执行
      handler(newVal) {
        if (newVal) {
          this.onShow();
          console.log("show")
        }
      }
    }
  },
  methods: {
    async onShow(){
      await this.fetchConsultants();
    },
    async fetchConsultants() {
      try {
        const response = await userApi.getConsultants();
        this.consultants = response.data.data;
        if(!this.consultants || this.consultants.length === 0) {
          console.log("empty")
        }
      } catch (error) {
        console.error('获取咨询师列表失败:', error)
        notify('获取咨询师列表失败')
      }
    },
    async selectConsultant(consultantId) {
      try {
        this.waitingForConfirm = true
        this.currentConsultantId = consultantId
        this.setupWebSocket()
        const result = await userApi.consulting(consultantId)
        console.log(result);

        if (result.data.code === '406') {
          notify("您已经取消预约")
          this.waitingForConfirm = false;
        } else if (result.data.code === '407') {
          notify("咨询师拒绝了请求")
          this.waitingForConfirm = false;
        } else if(result.data.code === '408') {
          notify("请求超时")
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
      this.ws = new WebSocket('wss://komeiji.cyou:54950/ws?id='+id)

      this.ws.onopen = () => {
        console.log('WebSocket连接已建立')
      }

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'chat_connect') {
          this.waitingForConfirm = false
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
      userApi.cancelConsulting(this.currentConsultantId)
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
  background: rgba(93, 64, 55, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.popup {
  background: linear-gradient(135deg, #fff5eb 0%, #fff 100%);
  padding: 30px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(255, 167, 38, 0.15);
  animation: slideUp 0.4s ease;
}

.popup-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(255, 167, 38, 0.2);
}

.popup-header h2 {
  color: #5d4037;
  font-size: 1.8em;
}

.close-btn {
  color: #8d6e63;
  font-size: 28px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #5d4037;
  transform: rotate(90deg);
}

.consultant-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.consultant-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 167, 38, 0.1);
}

.consultant-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(255, 167, 38, 0.2);
  border-color: rgba(255, 167, 38, 0.3);
}

.waiting-message {
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(255, 167, 38, 0.1);
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 25px;
  border: 4px solid #ffe0b2;
  border-top: 4px solid #ffa726;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.cancel-btn {
  margin-top: 25px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #ff9e80, #ff6e40);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 110, 64, 0.3);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
