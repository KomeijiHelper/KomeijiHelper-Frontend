<template>
    <VaCard>
        <VaCardTitle>聊天记录</VaCardTitle>
        <VaCardContent>
            <div :aria-busy="isLoading">
                <VaInnerLoading v-if="isLoading" loading/>
                <VaScrollContainer v-else :items="chatBubbleList" class="chat-messages" gradient>
                    <ChatBubble v-for="(item) in chatBubbleList" :avatar-name="item.avatarName"
                        :avatar-src="item.avatarSrc" :is-self="item.isSelf" :time="item.time" :type="item.type"
                        :content="item.content">
                    </ChatBubble>
                </VaScrollContainer>
            </div>
        </VaCardContent>
    </VaCard>
</template>

<script setup>
import {ref,onMounted} from 'vue';
import ChatBubble from './ChatBubble.vue';


const isLoading = ref(true);

const props = defineProps({
  jsondata:String,
});


const chatBubbleList = [];

const isFirstCharacter = (meta,message)=> {
  const firstCharacter = meta.characters[0].token;
  const messageCharacter = message.token;
  return firstCharacter.token === messageCharacter.token;
}

onMounted(() => {
    const conversation = JSON.parse(props.jsondata);
    const localUserName = localStorage.getItem("userName");
    const meta = conversation.meta;
    for (const message of conversation.messages) {
        const data = JSON.parse(message.data);
        let isSelf = data.userName === localUserName;
        const userRole = localStorage.getItem("userRole");
        if (!isSelf && [2,3].includes(userRole)) {
            isSelf = isFirstCharacter(meta,message);
        }
        chatBubbleList.push({
            avatarSrc: '',
            avatarName: data.userName,
            isSelf: isSelf,
            time: new Date(message.timestamp).toLocaleString(),
            type: message.type,
            content: data.content
        })
    }
    // for mock
    chatBubbleList.push(...chatBubbleList);
    chatBubbleList.push(...chatBubbleList);
    chatBubbleList.push(...chatBubbleList);
    isLoading.value = false;
})

</script>

<style scoped>
.chat-messages {
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px;
    margin-bottom: 10px;
    background-color: #E8E8E8;
}
</style>