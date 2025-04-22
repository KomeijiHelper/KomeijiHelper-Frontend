<template>
  <div class="select-consultant">
    <h2>选择咨询师</h2>
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
    <informed-consent-form ref="consentForm" />
  </div>
</template>

<script>
import userApi from '@/api/userApi.js'
import InformedConsentForm from "@/components/InformedConsentForm.vue";
import StarWithPercent from "@/components/StarWithPercent.vue";
import router from "@/router/index.js";
import {useToast} from "vuestic-ui";

const {notify} = useToast();

export default {
  name: 'SelectConsultant',
  components: {StarWithPercent, InformedConsentForm},
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
      console.log(response.data.data)
    } catch (error) {
      console.error('获取咨询师列表失败:', error)
      notify('获取咨询师列表失败')
    }
  },
  methods: {
    async selectConsultant(consultantId) {
      try {
        // 弹出知情同意书
        const confirmed = await this.$refs.consentForm.open()
        if (!confirmed) {
          return // 用户点击了取消
        }

        this.waitingForConfirm = true
        this.currentConsultantId = consultantId
        this.setupWebSocket()
        const result = await userApi.consulting(consultantId)
        console.log(result.data)
        if(result.data.code === 406) {
            notify("您已经取消预约")
            this.waitingForConfirm = false;
        }
        else if(result.data.code === 407) {
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
      this.ws = new WebSocket('ws://127.0.0.1:54950/ws?id='+id)
      
      this.ws.onopen = () => {
        console.log('WebSocket连接已建立')
      }

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        console.log(data)
        if (data.type === 'chat_connect') {
          const newSocketAddress = "ws://127.0.0.1:54950/ws?from="+JSON.parse(data.content).from+"&to="+JSON.parse(data.content).to;
          localStorage.setItem('chatAddress', newSocketAddress)
          router.push("/chat/room")
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
.select-consultant {
  padding: 20px;
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

h2 {
  color: #333;
  margin-bottom: 20px;
}

h3 {
  margin: 0;
  color: #666;
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