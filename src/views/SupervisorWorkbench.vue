<template>
  <div class="supervisor-workbench">
    <!-- 背景层 -->
    <!-- <div class="background-layers">
      <div class="layer layer-1"></div>
      <div class="layer layer-2"></div>
      <div class="layer layer-3"></div>
    </div> -->

    <div class="content-container">
      <h1 class="page-title">督导工作台</h1>
      
      <div class="dashboard-container">
        <div class="chart-panel">
          <ConsultantChart :data="recentChats" />
        </div>
        
        <div class="info-panel">
          <div class="stats-card">
            <h3>数据统计</h3>
            <p class="stats-number">总咨询数: {{totalChats}}</p>
            <va-button class="history-btn" @click="jumpTo('/chat/history')">
              查看对话记录
            </va-button>
          </div>
        </div>
      </div>

      <transition-group name="fade-list" tag="div" class="request-container">
        <div v-if="requests.length" class="request-list">
          <div v-for="(request, index) in requests" 
               :key="index" 
               class="request-panel">
            <div class="request-content">
              <h3>新的咨询请求</h3>
              <p>用户ID: {{ request.userId }}</p>
              <p>消息: {{ request.message }}</p>
            </div>
            <div class="button-group">
              <button @click="handleRequest(true, index)" class="accept-btn">
                <span>接受</span>
              </button>
              <button @click="handleRequest(false, index)" class="reject-btn">
                <span>拒绝</span>
              </button>
            </div>
          </div>
        </div>
        <div v-else class="no-request">
          <p>等待新的咨询请求...</p>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import userApi from "@/api/userApi.js";
import ConsultantChart from "@/components/dashboards/ConsultantChart.vue";
import StarWithPercent from "@/components/StarWithPercent.vue";
import {useToast, VaButton} from "vuestic-ui";

const {notify} = useToast();

export default {
  name: 'SupervisorWorkbench',
  components: {VaButton, StarWithPercent, ConsultantChart},
  data() {
    return {
      ws: null,
      requests: [],
      totalChats: 0,
      recentChats: [],
    }
  },
  async created() {
    this.setupWebSocket()
    this.recentChats = (await userApi.getDashboardInfo()).data.data
    this.totalChats = (await userApi.getConsultantInfo()).data.data.totalRecord
  },
  beforeUnmount() {
    if (this.ws) {
      this.ws.close()
    }
  },
  methods: {
    setupWebSocket() {
      const id = localStorage.getItem('userName');
      this.ws = new WebSocket('wss://komeiji.cyou:54950/ws?id='+id)

      this.ws.onopen = () => {
        console.log('WebSocket连接已建立')
      }

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        console.log(data)
        if (data.type === 'chat_request') {
          const requestJson = JSON.parse(data.content)
          this.requests.push({
            userId: requestJson.patientId,
            message: requestJson.message,
          });
        } else if (data.type === 'chat_connect') {
          const from =JSON.parse(data.content).from
          const to=JSON.parse(data.content).to
          const url = `/chat/room?from=${from}&to=${to}`
          window.open(url, '_blank')
        } else if (data.type === 'chat_reject') {
          const content = JSON.parse(data.content);
          const cancelId = content.cancel_id;
          const reason = content.reason;
          notify(reason);
          this.requests = this.requests.filter(item=>item.userId !== cancelId);
        }
      }

      this.ws.onerror = (error) => {
        console.error('WebSocket错误:', error)
        alert('连接错误')
      }

      this.ws.onclose = () => {
        console.log('WebSocket连接已关闭')
      }
    },
    handleRequest(accept, index) {
      const request = this.requests[index]
      if (!request) return

      userApi.responseToRequest(request.userId, accept)
      if (accept) {
      }
      this.requests.splice(index, 1)
    },
    jumpTo(path) {
      window.location.href = path;
    }
  }
}
</script>

<style scoped>
.supervisor-workbench {
  min-height: calc(100vh - 60px);
  padding-top: 60px;
  background: linear-gradient(135deg, #fff5eb 0%, #ffecd2 100%);
  position: relative;
}

.background-layers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.layer {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.2;
}

.layer-1 {
  background: linear-gradient(135deg, #fff5eb 0%, #ffecd2 100%);
  animation: layer1Move 30s ease-in-out infinite;
}

.layer-2 {
  background: radial-gradient(circle at 30% 70%, #ffcc80 0%, transparent 70%);
  animation: layer2Move 25s ease-in-out infinite alternate;
}

.layer-3 {
  background: radial-gradient(circle at 70% 30%, #ffe0b2 0%, transparent 70%);
  animation: layer3Move 35s ease-in-out infinite alternate;
}

.content-container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: 2.5em;
  color: #5d4037;
  margin-bottom: 40px;
  text-align: center;
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(to right, #ffb74d, #ffa726);
  border-radius: 2px;
}

.dashboard-container {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
}

.chart-panel {
  flex: 2;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(255, 167, 38, 0.1);
  backdrop-filter: blur(10px);
}

.info-panel {
  flex: 1;
}

.stats-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(255, 167, 38, 0.1);
  backdrop-filter: blur(10px);
}

.stats-number {
  font-size: 1.2em;
  color: #5d4037;
  margin: 20px 0;
}

.history-btn {
  width: 100%;
  background: linear-gradient(135deg, #ffb74d, #ffa726) !important;
  color: white !important;
  border-radius: 8px !important;
  padding: 12px !important;
  transition: all 0.3s ease !important;
}

.history-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 167, 38, 0.3);
}

.request-container {
  margin-top: 30px;
}

.request-panel {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(255, 167, 38, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.request-panel:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(255, 167, 38, 0.15);
}

.request-content {
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  gap: 15px;
}

.accept-btn,
.reject-btn {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1em;
  transition: all 0.3s ease;
}

.accept-btn {
  background: linear-gradient(135deg, #66bb6a, #43a047);
  color: white;
}

.reject-btn {
  background: linear-gradient(135deg, #ef5350, #e53935);
  color: white;
}

.accept-btn:hover,
.reject-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.no-request {
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  color: #8d6e63;
  box-shadow: 0 8px 32px rgba(255, 167, 38, 0.1);
  backdrop-filter: blur(10px);
}

h3 {
  color: #5d4037;
  font-size: 1.3em;
  margin-bottom: 15px;
}

p {
  color: #8d6e63;
  margin: 8px 0;
}

/* 动画效果 */
.fade-list-enter-active,
.fade-list-leave-active {
  transition: all 0.5s ease;
}

.fade-list-enter-from,
.fade-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

@keyframes layer1Move {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-3%, -3%); }
}

@keyframes layer2Move {
  0% { transform: scale(1) translate(0, 0); }
  50% { transform: scale(1.2) translate(3%, 3%); }
  100% { transform: scale(1) translate(-3%, -3%); }
}

@keyframes layer3Move {
  0% { transform: scale(1.1) translate(0, 0); }
  50% { transform: scale(1) translate(-3%, 3%); }
  100% { transform: scale(1.1) translate(3%, -3%); }
}

@media (max-width: 1024px) {
  .dashboard-container {
    flex-direction: column;
  }
  
  .chart-panel,
  .info-panel {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .content-container {
    padding: 15px;
  }
  
  .page-title {
    font-size: 2em;
  }
  
  .button-group {
    flex-direction: column;
  }
}
</style>