<template>
    <va-layout>
        <va-card>
            <va-card-title>聊天室</va-card-title>
            <va-card-content>
                <div class="chat-container">
                    <VaScrollContainer :items="chatBubbleList" class="chat-messages" ref="scroller" gradient>
                        <ChatBubble v-for="(item) in chatBubbleList" :avatar-name="item.avatarName"
                            :avatar-src="item.avatarSrc" :is-self="item.isSelf" :time="item.time">{{ item.content }}
                        </ChatBubble>
                    </VaScrollContainer>
                    <div class="send-part">
                        <VaTextarea name="sendbox" autosize v-model="messageContent" placeholder="输入消息..."
                            style="width: 75%;" @keydown.shift.enter.exact="addNewLine"
                            @keydown.enter.exact="sendMessage" />
                        <VaButton class="sendline-button" style="width: 3%;">
                            😊
                        </VaButton>
                        <va-button class="sendline-button" @click="toggleExtensions" style="width: 3%;">
                            +
                        </va-button>
                        <VaButton class="sendline-button" @click="sendMessage" style="width:8%;">
                            发送
                        </VaButton>
                    </div>
                    <div v-if="showExtensions" class="extensions">
                        <va-button @click="sendImage">
                            发送图片
                        </va-button>
                        <va-button @click="shareLocation">
                            发送位置
                        </va-button>
                    </div>
                </div>
            </va-card-content>
        </va-card>
    </va-layout>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, useTemplateRef } from 'vue'
import { VaTextarea, VaLayout, VaCard, VaButton, VaImage} from 'vuestic-ui';
import ChatBubble from '../components/ChatBubble.vue';

const messageContent = ref('');
const showExtensions = ref(false);
const scroller = useTemplateRef("scroller");
let websocket;

const chatBubbleList = ref([])

onMounted(() => {
    websocket = new WebSocket(localStorage.getItem('chatAddress'));
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const content = JSON.parse(data.content);
      const time = new Date(data.timestamp);
      chatBubbleList.value.push({ avatarSrc: '', avatarName: content.userName, isSelf: false, time: time.toLocaleString(), content: content.content });
    };
    websocket.onopen = () => {
      console.log("WebSocket connected");
    };

    websocket.onclose = () => {
      console.log("WebSocket disconnected");
    };
});

const sendMessage = async (event) => {
    if (event.repeat) return;
    event.preventDefault();
    event.stopPropagation();
    if (messageContent.value.trim() === "") return;
    const time = new Date();
    const content = {
      userName: localStorage.getItem("userName"),
      content: messageContent.value,
    }
    const message = {
      type: "text",
      content: JSON.stringify(content),
      timestamp: time.getTime(),
    };

    websocket.send(JSON.stringify(message));
    chatBubbleList.value.push({ avatarSrc: '', avatarName: localStorage.getItem("userName"), isSelf: true, time: time.toLocaleString(), content: messageContent.value })
    await scrollToBottom();
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

const addNewLine = (event) => {
    if (event.repeat) return;
    event.preventDefault();
    event.stopPropagation();
    messageContent.value += '\n';
};

const toggleExtensions = () => {
    showExtensions.value = !showExtensions.value;
};

const sendImage = () => {
    alert('发送图片功能开发中');
};

const sendPosition = () => {
    alert('发送位置功能开发中');
};
</script>

<style scoped>
.chat-container {
    display: flex;
    flex-direction: column;
    height: 600px;
}

.chat-messages {
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px;
    border: 1px solid #ccc;
    margin-bottom: 10px;
    background-color: #F8F8FF;
}

.send-part {
    display: flex;
    align-items: flex-end;
    gap: 1%;
}

.message {
    margin-bottom: 8px;
}


.sendline-button {
    height: 40px;
}
</style>