<template>
  <ChatBubble avatar-name="test" time="test" content="test"></ChatBubble>
  <ChatBubble avatar-name="test" time="test" :type="ImageType.Image"
    content="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu1wK2MlTz_9k7zKtRn2gf_BdirdeyLT9rOw&s"></ChatBubble>
  <ChatBubble avatar-name="test" time="test" :type="ImageType.ChatRecord"
    :content="{ 'header': '测试聊天记录', 'src': mockChatJsonString }"></ChatBubble>
</template>

<script setup>
import ChatBubble from '@/components/ChatBubble.vue';
import { ref } from 'vue';
import ImageType from "./Chat/widgets/MessageType"

const isLoading = ref(true);

const mockChatJsonString = `{
  "meta": {
    "uuid": "1bc60f8c-c995-490c-b299-50de77db45a3",
    "timestamp": 1744706219374,
    "characters": [
      {
        "token": {
          "token": "85b5a6d6add3f0fa4322db60b06202a52025-04-15 16:36:58"
        }
      },
      {
        "token": {
          "token": "c287fe48a7e630731807bb9a08cf06722025-04-15 16:36:58"
        }
      }
    ],
    "storePath": "chats/1bc60f8c-c995-490c-b299-50de77db45a3/1744706219374.json"
  },
  "messages": [
    {
      "token": {
        "token": "85b5a6d6add3f0fa4322db60b06202a52025-04-15 16:36:58"
      },
      "timestamp": 1744706221783,
      "type": "text",
      "data": "{\\"userName\\":\\"tofweod\\",\\"content\\":\\"nihao\\"}"
    },
    {
      "token": {
        "token": "c287fe48a7e630731807bb9a08cf06722025-04-15 16:36:58"
      },
      "timestamp": 1744706229663,
      "type": "text",
      "data": "{\\"userName\\":\\"tofweod2\\",\\"content\\":\\"haozainalewo请问\\"}"
    }
  ]
}`
const show = ref(false);

const toggle = () => {
  show.value = !show.value;
  setTimeout(() => {
    isLoading.value = false;
  }, 2000);
}

</script>