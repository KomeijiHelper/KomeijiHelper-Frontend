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
import { VaTextarea, VaLayout, VaCard, VaButton,VaImage} from 'vuestic-ui';
import ChatBubble from './widgets/ChatBubble.vue';

const messageContent = ref('');
const showExtensions = ref(false);
const scroller = useTemplateRef("scroller");


// mock 
const chatBubbleList = ref([
    { avatarSrc: 'data:image/jpeg;base64,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', avatarName: 'Jane D', isSelf: false, time: '10:00', content: "test1" },
    { avatarSrc: 'https://images.freeimages.com/images/large-previews/b0c/letters-web-www-3-1574751.jpg?fmt=webp&w=500', avatarName: 'J.D', isSelf: true, time: '10:00', content: "test2" },
    { avatarSrc: '', avatarName: 'Jane Dsadfaf', isSelf: true, time: '10:00', content: "test3" },
    { avatarSrc: '', avatarName: 'Jane Dsadfaf', isSelf: true, time: '10:00', content: "test4" },
    { avatarSrc: '', avatarName: 'Jane Dsadfaf', isSelf: true, time: '10:00', content: "test5" },
    { avatarSrc: '', avatarName: 'Jane Dsadfaf', isSelf: true, time: '10:00', content: "test6" },
    { avatarSrc: '', avatarName: 'Jane Dsadfaf', isSelf: true, time: '10:00', content: "test7" },
    { avatarSrc: '', avatarName: 'Jane Dsadfaf', isSelf: true, time: '10:00', content: "test8" },
    { avatarSrc: '', avatarName: 'Jane Dsadfaf', isSelf: true, time: '10:00', content: "test9" },
    { avatarSrc: '', avatarName: 'Jane Dsadfaf', isSelf: false, time: '10:00', content: "test0" },
    { avatarSrc: '', avatarName: 'Jane DsadfafChatRoom', isSelf: true, time: '10:00', content: "test for new line test for new line test for new line test for new line test for new line test for new line" },
    { avatarSrc: '', avatarName: 'Jane Dsadfaf', isSelf: false, time: '10:00', content: "test0" },
    { avatarSrc: '', avatarName: 'Jane Dsadfaf', isSelf: false, time: '10:00', content: "<img src='https://tu.sioe.cn/gj/qiege/image.jpg'/>" },
])

// watch(chatBubbleList,async ()=>{
//   await nextTick();
// });

onMounted(() => {
    // TODO: websocket
});

const sendMessage = async (event) => {
    if (event.repeat) return;
    event.preventDefault();
    event.stopPropagation();
    if (messageContent.value === "") return;
    chatBubbleList.value.push({ avatarSrc: '', avatarName: 'J,D', isSelf: true, time: '10:00', content: messageContent.value })
    scrollToBottom();
    messageContent.value = "";
};

const scrollToBottom = async () => {
    nextTick(() => {
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

const sendPisition = () => {
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