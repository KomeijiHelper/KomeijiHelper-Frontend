<template>
  <div class="supervisor-dashboard">
    <h2>督导工作台</h2>
    <div v-if="currentRequest" class="request-panel">
      <h3>新的求助请求</h3>
      <p>用户ID: {{ currentRequest.userId }}</p>
      <p>消息: {{currentRequest.message}}</p>
      <div class="button-group">
        <button @click="handleRequest(true)" class="accept-btn">接受</button>
        <button @click="handleRequest(false)" class="reject-btn">拒绝</button>
      </div>
    </div>
    <div v-else class="no-request">
      <p>等待新的咨询请求...</p>
    </div>
  </div>
</template>

<script>
import userApi from "@/api/userApi.js";
import router from "@/router/index.js";

export default {
  name: 'SupervisorDashboard',
  data() {
    return {
      ws: null,
      currentRequest: null
    }
  },
  created() {
    this.setupWebSocket()
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
        if (data.type === 'chat_request') {
          const requestJson = JSON.parse(data.content)
          this.currentRequest = {
            userId: requestJson.patientId,
            message: requestJson.message,
          }
        } else if (data.type === 'chat_connect') {
          const newSocketAddress = "ws://127.0.0.1:54950/ws?from="+JSON.parse(data.content).from+"&to="+JSON.parse(data.content).to;
          localStorage.setItem('chatAddress', newSocketAddress)
          router.push("/chat")
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
    handleRequest(accept) {
      if (!this.currentRequest) return
      userApi.responseToRequest(this.currentRequest.userId, accept)
      this.currentRequest = null
    }
  }
}
</script>

<style scoped>
.supervisor-dashboard {
  padding: 20px;
  max-width: 800px;
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