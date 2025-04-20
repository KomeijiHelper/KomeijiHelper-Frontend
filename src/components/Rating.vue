<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
  <va-card class="p-4 w-96 mx-auto mt-20 text-center">
    <h2 class="text-xl font-bold mb-4">请为我们的服务打分</h2>
    <div class="flex justify-center space-x-2 mb-4">
      <va-icon
          v-for="star in 5"
          :key="star"
          :name="star <= rating ? 'mdi-star' : 'mdi-star-outline'"
          color="warning"
          size="36px"
          class="cursor-pointer transition"
          :class="{ 'opacity-50': loading }"
          @click="handleRating(star)"
      />
    </div>

    <va-progress-bar
        v-if="loading"
        indeterminate
        color="primary"
        class="mb-2"
    />

    <p v-if="submitted" class="text-success font-medium">
      感谢您的评分：{{ rating }} 星！
    </p>
  </va-card>
  </div>
</template>

<script setup>
import userApi from "@/api/userApi.js";
import {ref} from 'vue'
import {VaCard, VaIcon, VaProgressBar} from "vuestic-ui";

const rating = ref(0)
const visible = ref(false)
const loading = ref(false)
const submitted = ref(false)
let resolveAfterClose = null
async function handleRating(star) {
  if (loading.value) return

  rating.value = star
  loading.value = true
  submitted.value = false

  await userApi.rating(rating.value === 0 ? 0 : 1, rating.value)
  submitted.value = true
  visible.value = false
  resolveAfterClose?.(rating.value) // 👉 通知外部评分已完成
  resolveAfterClose = null
  loading.value = false
}

function open() {
  rating.value = 0
  loading.value = false
  submitted.value = false
  visible.value = true

  return new Promise((resolve) => {
    resolveAfterClose = resolve
  })
}

function close() {
  visible.value = false
}

defineExpose({
  open,
  close
})
</script>

<style scoped>
.va-icon {
  transition: transform 0.2s;
}
.va-icon:hover {
  transform: scale(1.2);
}
</style>
