<template>
  <div class="assistant-workbench">
    <h2>咨询师工作台</h2>
    <div style="display: flex;">
      <ConsultantChart :data="recentChats" />
      <div>
        <StarWithPercent :score="avgScore" />
        <p>总咨询数: {{totalChats}}</p>
        <p>被评价次数: {{totalRecordedChats}}</p>
        <va-button @click="jumpTo('/chat/history')">对话记录</va-button>
      </div>
    </div>
    <div v-if="requests.length" class="request-list">
      <div v-for="(request, index) in requests" :key="index" class="request-panel">
        <h3>新的咨询请求</h3>
        <p>用户ID: {{ request.userId }}</p>
        <p>消息: {{ request.message }}</p>
        <div class="button-group">
          <button @click="handleRequest(true, index)" class="accept-btn">接受</button>
          <button @click="handleRequest(false, index)" class="reject-btn">拒绝</button>
        </div>
      </div>
    </div>
    <div v-else class="no-request">
      <p>等待新的咨询请求...</p>
    </div>
  </div>
</template>

<script>
import userApi from "@/api/userApi.js";
import ConsultantChart from "@/components/dashboards/ConsultantChart.vue"
import StarWithPercent from "@/components/StarWithPercent.vue";
import {VaButton} from "vuestic-ui";

export default {
  name: 'AssistantWorkbench',
  components: {VaButton, StarWithPercent, ConsultantChart},
  data() {
    return {
      ws: null,
      requests: [],
      recentChats: [],
      avgScore: 0,
      totalChats: 0,
      totalRecordedChats: 0,
    }
  },
  async created() {
    this.setupWebSocket()
    this.recentChats = (await userApi.getDashboardInfo()).data.data
    this.avgScore = (await userApi.getConsultantInfo()).data.data.avgScore
    this.totalChats = (await userApi.getConsultantInfo()).data.data.totalRecord
    this.totalRecordedChats = (await userApi.getConsultantInfo()).data.data.scoreRecord
  },
  beforeUnmount() {
    if (this.ws) {
      this.ws.close()
    }
  },
  methods: {
    setupWebSocket() {
      const id = localStorage.getItem('userName');
      this.ws = new WebSocket('ws://127.0.0.1:54950/ws?id='+id)
      
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
    jumpTo(location){
      window.location.href=location;
    }
  }
}
</script>

<style scoped>
.assistant-workbench {
  padding: 20px;
  margin: 0 auto;
}

.request-panel {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.no-request {
  text-align: center;
  padding: 40px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-top: 20px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.accept-btn, .reject-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.accept-btn {
  background-color: #4CAF50;
  color: white;
}

.accept-btn:hover {
  background-color: #45a049;
}

.reject-btn {
  background-color: #f44336;
  color: white;
}

.reject-btn:hover {
  background-color: #da190b;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}

h3 {
  color: #666;
  margin-bottom: 15px;
}

p {
  margin: 10px 0;
  color: #666;
}
</style> 