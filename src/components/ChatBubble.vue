<template>
  <div class="chat-bubble" :class="{ 'chat-bubble--self': isSelf }">
    <!-- TODO: VaSkeleton -->
    <div class='chat-meta' :class="{'chat-meta--self':isSelf}">
      <div class="avatar-name" :style="avatarStyle">{{avatarName}}</div>
      <VaAvatar class="chat-avatar" :src="avatarSrc" fallback-icon="person"
              :color="isSelf ? selfAvatarColor : otherAvatarColor" :text-color="textColor"></VaAvatar>
    </div>
    <div class="chat-content">
      <div class="chat-message" @click="showBigger = !showBigger">
        <!-- TODO -->
        <template v-if="type === MessageType.Image">
          <VaModal
            v-model="showBigger"
            hideDefaultActions
            size='large'
          >
          <img :src="content"  class="image-fit"/>
        </VaModal>
          <img :src="content"/>
        </template>
        <template v-else-if="type === MessageType.Text">
          <slot>{{ content }}</slot>
        </template>
        <template v-else-if="type == MessageType.ChatRecord">
          <span><i class="fa-solid fa-clock-rotate-left">{{ "聊天记录" }}</i></span>
          <VaModal
            v-model="showBigger"
            fixed-layout
            no-dismiss
            blur
            cancel-text=""
            ok-text="关闭" 
          >
          <ChatRecord :jsondata="content"></ChatRecord>
        </VaModal>
        </template>
      </div>
      <div class="chat-time">{{ time }}</div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from "vue"
import {VaAvatar, VaModal} from "vuestic-ui"
import MessageType from "../views/Chat/widgets/MessageType.js";
import ChatRecord from "./ChatRecord.vue";

const props = defineProps({
  avatarSrc: {
    type: String,
    default: ""
  },
  avatarName: {
    type: String,
    required: true
  },
  isSelf: {
    type: Boolean,
  },
  time: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    default: MessageType.Text
  }
});


const otherAvatarColor = ref("#F4A460");
const selfAvatarColor = ref("#1E90FF");
const textColor = ref("#FFFFFF");

const showBigger=ref(false);

const avatarStyle = computed(() => {
  const maxSize = 20;
  const minSize = 5;
  const size = Math.max(minSize, maxSize - (props.avatarName.length * 0.7));
  return {
    fontSize: `${size}px`,
  }
})

</script>

<style scoped>
.chat-bubble {
  display: flex;
  align-items: flex-start;
  margin: 10px 0;
}

.chat-bubble--self {
  flex-direction: row-reverse;
  /* 自己的消息靠右 */
}

.chat-avatar {
  width: 40px;
  height: 40px;
  margin: 0 10px;
}

.chat-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 40%;
  margin-top: 35px;
}

.chat-bubble--self .chat-content {
  align-items: flex-end;
}

.chat-message {
  background-color: #FFFFFF;
  border-radius: 18px;
  padding: 10px 15px;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  white-space: break-spaces;
}

.chat-bubble--self .chat-message {
  background-color: #9EEA6A;
  /* 自己的消息颜色 */
}

.chat-time {
  font-size: 13px;
  color: #999;
  margin-top: 6px;
}

.image-fit {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 确保图片自适应且保持比例 */
}

.chat-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
}

.chat-meta--self {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.avatar-name {
  font-weight: 600;
  color: #555;
  padding: 2px 8px;
  border-radius: 12px;
  margin-bottom: 4px;
  max-width: 100px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

</style>
