<script setup>
import InformedConsentForm from "@/components/InformedConsentForm.vue";
import { ref, onMounted, onUnmounted } from 'vue'
import SelectConsultantPopup from "@/components/SelectConsultant.vue";
import { VaButton } from "vuestic-ui";

const showPopup = ref(false)
const consentFormRef = ref(null)
const isVisible = ref(false)

// 粒子动画配置
const createParticle = () => ({
  x: Math.random() * 100,
  y: 100 + (Math.random() * 20),
  size: Math.random() * 4 + 2,
  speed: Math.random() * 0.1 + 0.05,
  opacity: Math.random() * 0.15 + 0.05,
  life: 0,
  maxLife: Math.random() * 300 + 200
});

const particles = ref(Array(20).fill().map(createParticle));
let animationFrame = null;

const animateParticles = () => {
  particles.value = particles.value.map(particle => {
    particle.life += 1;
    const newY = particle.y - particle.speed;
    const newX = particle.x + Math.sin(newY / 50) * 0.1;
    
    let newOpacity = particle.opacity;
    if (particle.y < 60) {
      newOpacity = particle.opacity * (particle.y / 60);
    }

    if (particle.life >= particle.maxLife || newY < 20) {
      return createParticle();
    }

    return {
      ...particle,
      y: newY,
      x: newX,
      opacity: newOpacity
    };
  });
  
  animationFrame = requestAnimationFrame(animateParticles);
};

onMounted(() => {
  isVisible.value = true;
  animateParticles();
});

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
});

const onClick = async () => {
  const confirmed = await consentFormRef.value.open()
  if (!confirmed) return
  showPopup.value = true;
}
</script>

<template>
  <div class="workbench-page">
    <!-- 背景层 -->
    <div class="background-layers">
      <div class="layer layer-1"></div>
      <div class="layer layer-2"></div>
      <div class="layer layer-3"></div>
    </div>

    <!-- 粒子背景 -->
    <div class="particles-container">
      <div v-for="(particle, index) in particles" 
           :key="index" 
           class="particle"
           :style="{ 
             left: particle.x + '%', 
             top: particle.y + '%',
             width: particle.size + 'px',
             height: particle.size + 'px',
             opacity: particle.opacity
           }">
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="content-container">
      <h1 class="page-title">工作台</h1>
      
      <div class="button-container">
        <router-link to="/chat/history" class="button-link">
          <va-button class="primary-button history-button">
            咨询记录
          </va-button>
        </router-link>

        <va-button class="primary-button consult-button" @click="onClick">
          选择咨询师
        </va-button>
      </div>

      <SelectConsultantPopup :show="showPopup" @close="showPopup = false" />
      <informed-consent-form ref="consentFormRef" />
    </div>
  </div>
</template>

<style scoped>
.workbench-page {
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

.particles-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, 
    rgba(255, 255, 255, 0.6),
    rgba(255, 183, 77, 0.1));
  box-shadow: 0 0 8px rgba(255, 183, 77, 0.05);
  pointer-events: none;
  transition: opacity 0.5s ease;
}

.content-container {
  position: relative;
  z-index: 2;
  max-width: 800px;
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

.history-button {
  background: linear-gradient(135deg, #ffe0b2, #ffcc80) !important;
  color: #5d4037 !important;
}

.consult-button {
  background: linear-gradient(135deg, #ffb74d, #ffa726) !important;
  color: white !important;
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
``` 