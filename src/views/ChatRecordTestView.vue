<template>
    <VaButton preset="primary" @click="toggle">test</VaButton>
        <VaModal 
            v-model="show" 
            fixed-layout
            no-dismiss
            blur
            cancel-text=""
            ok-text="关闭"
        >
            <ChatRecord :jsondata="mockChatJsonString" :is-loading="isLoading" ></ChatRecord>
        </VaModal>
</template>

<script setup>
import { VaButton, VaModal } from 'vuestic-ui';
import { ref } from 'vue';
import ChatRecord from '@/components/ChatRecord.vue';

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
    setTimeout(()=>{
        isLoading.value = false;
    },2000);
}

</script>