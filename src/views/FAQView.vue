<template>
  <div class="faq-page">
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

    <div class="faq-container">
      <h1 class="page-title">常见问题</h1>
      <div class="faq-section">
        <div class="faq-item" 
             v-for="(item, index) in faqs" 
             :key="index"
             :class="{ 'is-open': item.isOpen }">
          <div class="faq-question" @click="toggleAnswer(index)">
            <h2>{{ item.question }}</h2>
            <span class="toggle-icon">{{ item.isOpen ? '−' : '+' }}</span>
          </div>
          <transition name="fade-slide">
            <div v-show="item.isOpen" class="faq-answer">
              <p>{{ item.answer }}</p>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, onUnmounted, reactive, ref} from 'vue';

// FAQ数据
const faqs = reactive([
  {
    question: "如何预约心理咨询服务？",
    answer: "您可以通过我们的平台查看选择当前有空的咨询师，提交后等待确认。",
    isOpen: false,
  },
  {
    question: "在线心理咨询的流程是怎样的？",
    answer: "在线咨询通过文字对话的方式进行，咨询师将在咨询时间与您进行沟通，帮助您解决心理问题。",
    isOpen: false,
  },
  {
    question: "如何查看我的咨询记录？",
    answer: "在平台上，您可以通过个人页面查看您的历史咨询记录。",
    isOpen: false,
  },
  {
    question: "咨询服务的保密性如何保障？",
    answer: "我们承诺对所有用户信息和咨询内容保密，所有数据都会加密存储，只有您和您的咨询师、以及该咨询师的督导可以查看。",
    isOpen: false,
  },
]);

// 修改粒子配置
const createParticle = () => ({
  x: Math.random() * 100,
  y: 100 + (Math.random() * 20),
  size: Math.random() * 4 + 2, // 2-6px的大小
  speed: Math.random() * 0.1 + 0.05, // 更慢的速度
  opacity: Math.random() * 0.15 + 0.05, // 更低的不透明度
  life: 0,
  maxLife: Math.random() * 300 + 200 // 更长的生命周期
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
  animateParticles();
});

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
});

const toggleAnswer = (index) => {
  faqs[index].isOpen = !faqs[index].isOpen;
};
</script>

<style scoped>
/* 修改容器样式 */
.faq-page {
  min-height: calc(100vh - 60px);
  padding-top: 60px;
  background: linear-gradient(135deg, #fff5eb 0%, #ffecd2 100%);
  position: relative;
  overflow: hidden;
  z-index: 1; /* 确保在导航栏下方 */
}

/* 修改背景层样式 */
.background-layers {
  position: absolute; /* 改为 absolute */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 修改粒子容器样式 */
.particles-container {
  position: absolute; /* 改为 absolute */
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 2;
}

/* 修改内容容器样式 */
.faq-container {
  position: relative;
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
  z-index: 3;
}

.layer {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.3;
}

.layer-1 {
  background: linear-gradient(135deg, #fff5eb 0%, #ffecd2 100%);
  animation: layer1Move 20s ease-in-out infinite;
}

.layer-2 {
  background: radial-gradient(circle at 30% 70%, #ffcc80 0%, transparent 60%);
  animation: layer2Move 15s ease-in-out infinite alternate;
}

.layer-3 {
  background: radial-gradient(circle at 70% 30%, #ffe0b2 0%, transparent 60%);
  animation: layer3Move 25s ease-in-out infinite alternate;
}

.particles-container {
  position: fixed;
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
    rgba(255, 255, 255, 0.8),
    rgba(255, 183, 77, 0.2));
  box-shadow: 0 0 10px rgba(255, 183, 77, 0.1);
  transition: opacity 1s ease;
  pointer-events: none;
}

.faq-container {
  position: relative;
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
  z-index: 2;
}

.page-title {
  text-align: center;
  font-size: 2.5em;
  color: #5d4037;
  margin-bottom: 40px;
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

.faq-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(255, 167, 38, 0.1);
  backdrop-filter: blur(10px);
  padding: 30px;
}

.faq-item {
  margin-bottom: 20px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #fff8f3;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.faq-question:hover {
  background: #fff3e0;
  transform: translateY(-2px);
}

.faq-question h2 {
  font-size: 1.1em;
  color: #5d4037;
  margin: 0;
  font-weight: 500;
}

.toggle-icon {
  font-size: 1.5em;
  color: #ffa726;
  transition: all 0.3s ease;
}

.is-open .toggle-icon {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 20px;
  color: #8d6e63;
  line-height: 1.6;
  background: #fff;
  border-radius: 0 0 12px 12px;
  margin-top: 2px;
}

/* 动画效果 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .faq-container {
    padding: 20px 15px;
  }
  
  .page-title {
    font-size: 2em;
  }
  
  .faq-question {
    padding: 12px 15px;
  }
  
  .faq-question h2 {
    font-size: 1em;
  }
}

@keyframes layer1Move {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-2%, -2%); }
}

@keyframes layer2Move {
  0% { transform: scale(1) translate(0, 0); }
  50% { transform: scale(1.1) translate(2%, 2%); }
  100% { transform: scale(1) translate(0, 0); }
}

@keyframes layer3Move {
  0% { transform: scale(1.1) translate(0, 0); }
  50% { transform: scale(1) translate(-2%, 2%); }
  100% { transform: scale(1.1) translate(0, 0); }
}
</style>