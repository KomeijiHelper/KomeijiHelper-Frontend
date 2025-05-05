<script setup>
import Records from "@/components/Records.vue";
import { onMounted, ref } from 'vue';

const isVisible = ref(false);

onMounted(() => {
  isVisible.value = true;
});
</script>

<template>
  <div class="chat-records-view">
    <!-- 背景层 -->
    <!-- <div class="background-layers">
      <div class="layer layer-1"></div>
      <div class="layer layer-2"></div>
      <div class="layer layer-3"></div>
    </div> -->

    <div class="content-container">
      <h1 class="page-title">咨询记录</h1>
      <transition name="fade">
        <div v-show="isVisible" class="records-wrapper">
          <Records />
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.chat-records-view {
  min-height: calc(100vh - 60px);
  padding-top: 60px;
  background: linear-gradient(135deg, #fff5eb 0%, #ffecd2 100%);
  position: relative;
}

.background-layers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.layer {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.2;
}

.layer-1 {
  background: linear-gradient(135deg, #fff5eb 0%, #ffecd2 100%);
  animation: layer1Move 30s ease-in-out infinite;
}

.layer-2 {
  background: radial-gradient(circle at 30% 70%, #ffcc80 0%, transparent 70%);
  animation: layer2Move 25s ease-in-out infinite alternate;
}

.layer-3 {
  background: radial-gradient(circle at 70% 30%, #ffe0b2 0%, transparent 70%);
  animation: layer3Move 35s ease-in-out infinite alternate;
}

.content-container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: 2.5em;
  color: #5d4037;
  margin-bottom: 40px;
  text-align: center;
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(to right, #ffb74d, #ffa726);
  border-radius: 2px;
}

.records-wrapper {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(255, 167, 38, 0.1);
  backdrop-filter: blur(10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes layer1Move {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-3%, -3%); }
}

@keyframes layer2Move {
  0% { transform: scale(1) translate(0, 0); }
  50% { transform: scale(1.2) translate(3%, 3%); }
  100% { transform: scale(1) translate(-3%, -3%); }
}

@keyframes layer3Move {
  0% { transform: scale(1.1) translate(0, 0); }
  50% { transform: scale(1) translate(-3%, 3%); }
  100% { transform: scale(1.1) translate(3%, -3%); }
}

@media (max-width: 768px) {
  .content-container {
    padding: 15px;
  }
  
  .page-title {
    font-size: 2em;
    margin-bottom: 30px;
  }
  
  .records-wrapper {
    padding: 15px;
  }
}
</style>