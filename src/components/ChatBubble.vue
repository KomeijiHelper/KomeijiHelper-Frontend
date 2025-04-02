<template>
    <div class="chat-bubble" :class="{ 'chat-bubble--self': isSelf }">
        <!-- TODO: VaSkeleton -->
        <VaAvatar class="chat-avatar" :src="avatarSrc" :fallback-text="avatarName" :style="avatarStyle"
            :color="isSelf ? selfAvatarColor : otherAvatarColor" :text-color="textColor" ></VaAvatar>
        <div class="chat-content">
            <div class="chat-message">
                <slot></slot>
            </div>
            <div class="chat-time">{{ time }}</div>
        </div>
    </div>
</template>

<script setup>
import {VaAvatar} from "vuestic-ui"
import {computed} from "vue"
import {ref} from "vue"

const otherAvatarColor=ref("#F4A460");
const selfAvatarColor=ref("#1E90FF");
const textColor=ref("#FFFFFF");

const props = defineProps({
    avatarSrc:{
        type:String,
        default: ""
    },
    avatarName: {
        type:String,
        required: true
    },
    isSelf: {
        type:Boolean,
    },
    time:{
        type:String,
        required:true
    }
});

const avatarStyle = computed(()=> {
    const maxSize = 20;
    const minSize = 5;
    const size = Math.max(minSize, maxSize - (props.avatarName.length * 0.75));
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
</style>
