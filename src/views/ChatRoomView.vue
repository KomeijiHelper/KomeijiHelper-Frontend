<template>
    <va-layout class="chat-layout">
        <va-card class="chat-room-card">
          <va-card-title class="chat-title">
            <div class="title-wrapper">
              <div class="title-text">温暖对话空间</div>
              <div class="subtitle-text">愿这里成为您倾诉的港湾</div>
            </div>
            <va-button class="exit-button" @click="leaveChat">
              <span class="exit-text">结束会话</span>
              <span class="exit-icon">👋</span>
            </va-button>
          </va-card-title>
            <va-card-content>
                <div class="chat-container">
                    <VaScrollContainer :items="chatBubbleList" class="chat-messages" ref="scroller" gradient>
                        <ChatBubble v-for="(item) in chatBubbleList" :avatar-name="item.avatarName"
                            :avatar-src="item.avatarSrc" :is-self="item.isSelf" :time="item.time" :type="item.type"
                            :content="item.content">
                        </ChatBubble>
                    </VaScrollContainer>
                    <div class="input-area">
                        <div class="send-part">
                            <div class="input-wrapper">
                                <VaTextarea 
                                    name="sendbox" 
                                    autosize 
                                    v-model="messageContent" 
                                    placeholder="在这里输入您想说的话..." 
                                    class="message-input"
                                    :rows="1"
                                    :max-rows="5"
                                    @keydown.shift.enter.exact="addNewLine"
                                    @keydown.enter.exact="sendMessage" 
                                />
                            </div>
                            <div class="button-group">
                            <VaButton class="sendline-button" @click="toggleEmoji" style="width: 3%;">
                            😊
                        </VaButton>
                        <VaButton class="sendline-button" @click="openImageDialog">
                            <input ref="fileInput" type="file" multiple accept="image/*" style="display: none;"
                                @change="handlerFileChange"></input>
                            <VaIcon name="fa-image"></VaIcon>
                        </VaButton>
                        <VaButton class="sendline-button" @click="sendMessage" style="width:8%;">
                            发送
                        </VaButton>
                            </div>
                        </div>
                        <transition name="slide">
                  <div v-if="showEmoji">
                        <VaCard class="emoji_container">
                            <VaCardTitle>Emoji</VaCardTitle>
                            <div class="emoji-grid">
                                <span v-for="emoji in emojis" :key="emoji" @click="selectEmoji(emoji)"
                                    class="emoji-item">
                                    {{ emoji }}
                                </span>
                            </div>
                        </VaCard>
                    </div>
                    <div>
                        <VaProgressBar v-if="uploadImgCount != 0" indeterminate content-inside size="30px">上传图片中
                        </VaProgressBar>
                        </transition>
                    </div>
                </div>
            </va-card-content>
        </va-card>
      <Rating ref="ratingWidget" />
    </va-layout>
</template>

<script setup>
import {ref, onMounted, watch, nextTick, useTemplateRef, reactive, onUnmounted} from 'vue'
import {
  VaTextarea,
  VaLayout,
  VaCard,
  VaButton,
  VaImage,
  VaCardTitle,
  VaCardContent,
  VaScrollContainer,
    useModal
} from 'vuestic-ui';
import ChatBubble from '../components/ChatBubble.vue';
import MessageType from './Chat/widgets/MessageType.js';
import router from "@/router/index.js";
import emojiList from '@/services/emoji/emoji';
import userApi from '@/api/userApi';
import Rating from "@/components/Rating.vue";

const messageContent = ref('');
const showEmoji = ref(false);
const scroller = useTemplateRef("scroller");
const fileInput = useTemplateRef('fileInput');
const ratingWidget = ref()
let websocket;

const emojis = emojiList;
const chatBubbleList = reactive([])

onMounted(() => {
    websocket = new WebSocket(localStorage.getItem('chatAddress'));
    localStorage.removeItem('chatAddress');
    websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const content = JSON.parse(data.content);
        const time = new Date(data.timestamp);
        const type = data.type;
        chatBubbleList.push({ avatarSrc: '', avatarName: content.userName, isSelf: false, time: time.toLocaleString(),type: type, content: content.content });
    };
    websocket.onopen = () => {
        console.log("WebSocket connected");
    };

    websocket.onclose = (event) => {
        console.log("WebSocket disconnected");
        ratingWidget.value.open();
        if(event.code === 1000) {
            // normal close, do noting
        }
        else if(event.code == 4000) {
            alert("对方已退出，关闭聊天");
        }
        else if(event.code == 4001) {
            alert("超过十分钟未进行对话，自动关闭聊天");
        }
        router.push("/workbench")
    };
});

onUnmounted(() => {
  websocket.close(1000,"normal close");
})

const selectEmoji = (emoji) => {
    messageContent.value += emoji
}

const openImageDialog = () => {
    showEmoji.value = false;
    fileInput.value && fileInput.value.click();
}

const imgType = ['jpg','png','jpeg'];

const checkImage = (files) => {
    for (const file of files) {
        if(file.size / 1024 / 1024 >= 10) {
            alert("单个最大上传图片大小不超过10MB")
            return false;
        }
        if (!file.type.startsWith('image/')) {
            alert("发送的文件存在不为图片类型的文件")
            return false;
        }
        const type = file.type.split('/')[1].toLowerCase();
        if(!imgType.includes(type)) {
            alert("发送图片仅支持PNG和JPG格式");
            return false;
        }
    }
    return true;
}

const handlerFileChange = (event) => {
    const files = event.target.files;
    if (!checkImage(files)) {
        event.target.value='';
        return;
    }
    updateImgProgressBar(files.length);
    for (const file of files) {
        sendImage(file);
    }
    event.target.value='';
}

const sendTextToWebSocket = (type,innerContent)=> {
    const time = new Date();
    const content = {
        userName: localStorage.getItem("userName"),
        content: innerContent,
    }
    const message = {
        type: type,
        content: JSON.stringify(content),
        timestamp: time.getTime(),
    };

    websocket.send(JSON.stringify(message));
    chatBubbleList.push({ avatarSrc: '', avatarName: localStorage.getItem("userName"), isSelf: true, time: time.toLocaleString(),type:type, content: innerContent})
}

const sendMessage = async (event) => {
    if (event.repeat) return;
    event.preventDefault();
    event.stopPropagation();
    if (messageContent.value.trim() === "") return;
    sendTextToWebSocket(MessageType.Text,messageContent.value);
    messageContent.value = "";
};

const scrollToBottom = async () => {
    await nextTick(() => {
        const container = scroller.value?.$el;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    });
};

watch(() => chatBubbleList.length, () => {
    scrollToBottom();
});

const addNewLine = (event) => {
    if (event.repeat) return;
    event.preventDefault();
    event.stopPropagation();
    messageContent.value += '\n';
};

const toggleEmoji = () => {
    showEmoji.value = !showEmoji.value;
}

let uploadImgCount = 0;

const updateImgProgressBar = (count)=>{
    uploadImgCount +=count
}

const sendImage = async (file) => {
    const formData = new FormData();
    formData.append('file',file);

     try {
        const responce = await userApi.fileUpload(formData);
        uploadImgCount--;
        const data = responce.data;
        console.log(data);
        if(data.code === '200') {
            sendTextToWebSocket(MessageType.Image,data.data);
        }
     }catch(error) {
        console.error('error uploading file:', error);
        alert("上传图片错误")
     }
};

const { confirm } = useModal()

const leaveChat = () => {
  confirm('确定要离开聊天室吗?').then(
      (ok) =>
      {
        if(ok)
        {
          leave=true;
          websocket.close()
        }
      })
}
</script>

<style scoped>
.chat-layout {
  padding: 20px;
  background: linear-gradient(120deg, #fdfbfb 0%, #fff5eb 100%);
  min-height: calc(100vh - 40px);
}

.chat-room-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 
    0 10px 30px rgba(149, 157, 165, 0.2),
    0 0 1px rgba(0, 0, 0, 0.1);
  transform-style: preserve-3d;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.chat-room-card:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 15px 35px rgba(149, 157, 165, 0.3),
    0 0 1px rgba(0, 0, 0, 0.1);
}

.chat-container {
    display: flex;
    flex-direction: column;
    height: 80vh;
    background-color: #fefefe;
}

.chat-title {
  background: linear-gradient(135deg, #fff5eb 0%, #ffe0b2 100%);
  border-bottom: 1px solid rgba(255, 167, 38, 0.1);
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
}

.chat-title::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%);
  animation: shimmer 10s infinite linear;
}

.title-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title-text {
  font-size: 1.8em;
  font-weight: 600;
  color: #5d4037;
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
}

.subtitle-text {
  font-size: 0.9em;
  color: #8d6e63;
  font-weight: 400;
}

.chat-messages {
  background: 
    linear-gradient(to right, #fffaf6 0%, #fff8f3 100%);
  border: 1px solid rgba(255, 167, 38, 0.1);
  padding: 25px;
  margin: 15px;
  border-radius: 16px;
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.02),
    0 0 0 1px rgba(255, 248, 243, 0.5);
}

.input-area {
  background: linear-gradient(to bottom, #fff8f3, #fff5eb);
  border-radius: 16px;
  padding: 20px;
  margin: 15px;
  box-shadow: 
    0 -1px 2px rgba(0, 0, 0, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.send-part {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  justify-content: flex-end;
  padding: 10px;
}

.message-input {
  width: 100%;
  min-height: 50px;
  backdrop-filter: blur(5px);
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #ffe0b2;
  padding: 12px;
  border-radius: 12px;
  font-size: 1rem;
  line-height: 1.5;
  resize: none;
  transition: all 0.3s ease;
}

.message-input:focus-within {
  border-color: #ffb74d;
  box-shadow: 0 0 0 3px rgba(255, 183, 77, 0.1);
}

.button-group {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.spacer {
    text-align: center;
}

.emoji_container {
    width: 50%;
    height: 20%;
}

.emoji-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    padding: 8px;
}

.emoji-item {
  font-size: 20px;
  cursor: pointer;
  text-align: center;
  line-height: 1.5;
}

.action-button {
  background: linear-gradient(135deg, #ffb74d, #ffa726);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.action-button:hover {
  background: linear-gradient(135deg, #ffa726, #ff9800);
  transform: translateY(-2px);
}

.send-button {
  background: linear-gradient(135deg, #ffb74d, #ffa726);
  color: white;
  border: none;
  padding: 0 20px;
  height: 40px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.send-button:hover {
  background: linear-gradient(135deg, #ffa726, #ff9800);
  transform: translateY(-2px);
}

.extensions {
    margin-top: 12px;
    display: flex;
    gap: 10px;
}

.extension-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #fff3e0;
    color: #f57c00;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.extension-option:hover {
    background: #ffe0b2;
    transform: translateY(-2px);
}

.extension-icon {
    font-size: 1.2em;
}

/* 过渡动画 */
.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

.exit-button {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: #ff9800;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.exit-button:hover {
  background: #ff9800;
  transform: translateY(-50%) translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 167, 38, 0.2);
}

.input-wrapper {
  flex: 1;
  margin-left: auto;
  max-width: 80%;
}

@keyframes shimmer {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .chat-layout {
    padding: 10px;
  }
  
  .title-text {
    font-size: 1.5em;
  }
  
  .subtitle-text {
    font-size: 0.8em;
  }
  
  .input-area {
    padding: 15px;
  }
  
    .chat-container {
        height: calc(100vh - 100px);
    }
    
    .send-part {
        flex-direction: column;
        gap: 10px;
    }
    
    .button-group {
        width: 100%;
        justify-content: space-between;
    }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .chat-layout {
    background: linear-gradient(120deg, #2d2d2d 0%, #1a1a1a 100%);
  }
  
  .chat-room-card {
    background: rgba(45, 45, 45, 0.95);
  }
  
  /* 其他深色模式样式... */
}
</style>