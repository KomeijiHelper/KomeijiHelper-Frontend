<template>
  <div class="chat-container">
    <div class="chat-box">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <strong>{{ JSON.parse(message.content).userName }}:</strong> {{ JSON.parse(message.content).content }}
      </div>
    </div>
    <div class="input-box">
      <input v-model="messageInput" @keydown.enter="sendMessage" placeholder="Type a message..." />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      websocket: null,
      messages: [],
      messageInput: "",
      username: localStorage.getItem("userName"), // 用随机用户名称
    };
  },
  mounted() {
    // 建立 WebSocket 连接
    this.websocket = new WebSocket(localStorage.getItem('chatAddress')); // 替换为你的 WebSocket 地址

    // 监听 WebSocket 消息
    this.websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messages.push(data); // 将新消息添加到消息数组
    };

    this.websocket.onopen = () => {
      console.log("WebSocket connected");
    };

    this.websocket.onclose = () => {
      console.log("WebSocket disconnected");
    };
  },
  methods: {
    sendMessage() {
      if (this.messageInput.trim() === "") return;
      const content = {
        userName: localStorage.getItem("userName"),
        content: this.messageInput,
      }
      const message = {
        type: "text",
        content: JSON.stringify(content),
      };

      // 发送消息到 WebSocket 服务器
      this.websocket.send(JSON.stringify(message));
      this.messages.push(message);
      // 清空输入框
      this.messageInput = "";
    },
  },
};
</script>

<style scoped>
.chat-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.chat-box {
  height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 10px;
}

.message {
  margin-bottom: 10px;
}

.input-box {
  display: flex;
  gap: 10px;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
