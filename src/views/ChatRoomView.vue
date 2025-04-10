<template>
    <va-layout>
        <va-card>
            <va-card-title>聊天室</va-card-title>
            <va-card-content>
                <div class="chat-container">
                    <VaScrollContainer :items="chatBubbleList" class="chat-messages" ref="scroller" gradient>
                        <ChatBubble v-for="(item) in chatBubbleList" :avatar-name="item.avatarName"
                            :avatar-src="item.avatarSrc" :is-self="item.isSelf" :time="item.time" :type="item.type"
                            :content="item.content">
                        </ChatBubble>
                    </VaScrollContainer>
                    <div class="send-part">
                        <VaTextarea name="sendbox" autosize v-model="messageContent" placeholder="输入消息..."
                            style="width: 75%;" @keydown.shift.enter.exact="addNewLine"
                            @keydown.enter.exact="sendMessage" />
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
                    </div>
                </div>
            </va-card-content>
        </va-card>
    </va-layout>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, useTemplateRef, reactive, computed } from 'vue'
import { VaTextarea, VaLayout, VaCard, VaButton, VaFileUpload } from 'vuestic-ui';
import ChatBubble from '../components/ChatBubble.vue';
import MessageType from './Chat/widgets/MessageType.js';
import emojiList from '@/services/emoji/emoji';
import userApi from '@/api/userApi';

const messageContent = ref('');
const showEmoji = ref(false);
const scroller = useTemplateRef("scroller");
const fileInput = useTemplateRef('fileInput');
let websocket;

const emojis = emojiList;
const chatBubbleList = reactive([])

onMounted(() => {
    websocket = new WebSocket(localStorage.getItem('chatAddress'));
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

    websocket.onclose = () => {
        console.log("WebSocket disconnected");
    };
});

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

</script>

<style scoped>
.chat-container {
    display: flex;
    flex-direction: column;
    height: 80vh;
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
</style>