<template>
  <!-- 悬浮按钮 -->
  <div v-if="logged" class="chat-wrapper">
    <button class="chat-button" @click="show = !show">💬</button>
  </div>

  <!-- 聊天窗口 -->
  <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
  >
    <div v-if="show" class="chat-panel">
      <div class="chat-header">
        <span>AI Chat</span>
        <button class="chat-close" @click="show = false">✖️</button>
      </div>
      <div class="chat-body">
        <div v-for="(msg, idx) in messages" :key="idx" class="chat-message" :class="msg.role">
          <div class="chat-bubble">{{ msg.content }}</div>
        </div>
      </div>
      <div class="chat-input">
        <input v-model="input" @keyup.enter="send" :disabled="loading" placeholder="输入…" />
      </div>
    </div>
  </transition>
</template>

<script setup>
import userApi from "@/api/userApi.js";
import {ref} from 'vue'

const show = ref(false)
const logged = ref(localStorage.getItem("logged")==="true"||false);
const input = ref('')
const loading = ref(false)
const messages = ref([
  { role: 'system', content: '你好？我是KomeijiHelper平台的AI咨询师，请问有什么可以帮助您的？' }
])

const send = async () => {
  const content = input.value.trim()
  if (!content || loading.value) return
  messages.value.push({ role: 'user', content })
  input.value = ''
  loading.value = true

  try {
    const reply = await userApi.chatWithAI(content)
    console.log(reply)
    messages.value.push({ role: 'assistant', content: reply.data.data })
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

</script>


<style scoped>
.chat-wrapper {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 9999;
}

.chat-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #2563eb;
  color: white;
  font-size: 24px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.chat-panel {
  position: fixed;  /* ✅ 这句最关键！ */
  bottom: 90px;     /* 调整一下偏移避免遮住按钮 */
  left: 20px;
  width: 360px;
  height: 320px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 9999;  /* ✅ 确保在最上层 */
}

.chat-header {
  background-color: #2563eb;
  color: white;
  padding: 10px 12px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-close {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #f3f4f6;
  font-size: 14px;
}

.chat-message {
  margin-bottom: 8px;
  display: flex;
}
.chat-message.user {
  justify-content: flex-end;
}
.chat-message.assistant {
  justify-content: flex-start;
}
.chat-bubble {
  max-width: 80%;
  padding: 6px 10px;
  border-radius: 6px;
  background-color: #e5e7eb;
  color: #111827;
  word-break: break-word;
}
.chat-message.user .chat-bubble {
  background-color: #bfdbfe;
  color: #1e3a8a;
}

.chat-input {
  padding: 8px;
  border-top: 1px solid #ddd;
}
.chat-input input {
  width: 100%;
  padding: 6px 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
