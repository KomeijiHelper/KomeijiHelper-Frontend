<script setup>
import InformedConsentForm from "@/components/InformedConsentForm.vue";
import { ref, onMounted, onUnmounted } from 'vue'
import SelectConsultantPopup from "@/components/SelectConsultant.vue";
import { VaButton } from "vuestic-ui";

const showPopup = ref(false)
const consentFormRef = ref(null)
const isVisible = ref(false)

const onClick = async () => {
  const confirmed = await consentFormRef.value.open()
  if (!confirmed) return
  showPopup.value = true;
}

onMounted(() => {
  isVisible.value = true
})
</script>

<template>
  <div class="workbench-page">
    <!-- 背景层 -->
    <div class="background-layers">
      <div class="layer layer-1"></div>
      <div class="layer layer-2"></div>
      <div class="layer layer-3"></div>
    </div>

    <div class="content-container">
      <transition name="fade-up">
        <div v-show="isVisible">
          <h1 class="page-title">心理咨询室</h1>
          
          <div class="welcome-section">
            <p class="welcome-text">欢迎来到心理咨询室，这里是一个安全、温暖的空间</p>
            <p class="sub-text">我们随时准备倾听您的故事</p>
          </div>
          
          <div class="button-container">
            <router-link to="/chat/history" class="button-link">
              <va-button class="primary-button history-button">
                咨询记录
              </va-button>
            </router-link>

            <va-button class="primary-button consult-button" @click="onClick">
              开始咨询
            </va-button>
          </div>
        </div>
      </transition>
    </div>

    <SelectConsultantPopup :show="showPopup" @close="showPopup = false" />
    <informed-consent-form ref="consentFormRef" />
  </div>
</template>

<style scoped>
.workbench-page {
  min-height: calc(100vh - 60px);
  padding-top: 60px;
  background: linear-gradient(135deg, #fff5eb 0%, #ffecd2 100%);
  position: relative;
}

.content-container {
  position: relative;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
}

.page-title {
  font-size: 2.5em;
  color: #5d4037;
  margin-bottom: 60px;
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

.button-container {
  display: flex;
  gap: 30px;
  justify-content: center;
  margin-top: 40px;
}

.primary-button {
  min-width: 160px;
  padding: 12px 24px;
  font-size: 1.1em;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 167, 38, 0.2);
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 167, 38, 0.3);
}

.consult-button {
  background: linear-gradient(135deg, #ffb74d, #ffa726) !important;
  color: white !important;
}

.welcome-section {
  margin-bottom: 40px;
  animation: fadeIn 1s ease-out;
}

.welcome-text {
  font-size: 1.4em;
  color: #5d4037;
  margin-bottom: 10px;
}

.sub-text {
  font-size: 1.1em;
  color: #8d6e63;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.8s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
    padding: 20px;
  }
  
  .page-title {
    font-size: 2em;
    margin-bottom: 40px;
  }
  
  .button-container {
    flex-direction: column;
    align-items: center;
  }
  
  .primary-button {
    width: 100%;
    max-width: 200px;
  }
}
</style>