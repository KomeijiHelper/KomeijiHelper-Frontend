<template>
  <!-- 遮罩层 -->
  <div class="modal-overlay" @click.self="$emit('close')">
    <!-- 弹窗内容 -->
    <div class="modal-content">
      <p>请输入要绑定的督导</p>
      <br>
      <input-blank ref="nameRef" placeholder=""></input-blank>
      <div style="margin-top: 10px;">
        <va-button @click="submit">提交</va-button>
        <va-button @click="$emit('close')">关闭</va-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import userApi from "@/api/userApi.js";
import InputBlank from "@/components/InputBlank.vue";
import {ref, watch} from 'vue'
import {useToast, VaButton} from "vuestic-ui";

const props = defineProps({
  initValue: String
})
const nameRef = ref(null)
const storedValue = ref('')
const {notify} = useToast();

// 监听初始值并赋给 storedValue
watch(() => props.initValue, (newVal) => {
  storedValue.value = newVal
}, { immediate: true })

async function submit() {
  const res = await userApi.bindSupervisor(storedValue.value, nameRef.value.getValue())
  if (res.data.code === '200') {
    notify("绑定成功")
  }else if(res.data.code === '407') {
    notify("绑定失败")
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明背景 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
