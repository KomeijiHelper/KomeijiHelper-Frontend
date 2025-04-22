<script setup lang="js">
import {onMounted, ref} from 'vue';

const isVisible = ref(false);
const quotes = ref([
  "每个人都值得被倾听",
  "在这里,我们共同成长",
  "愿温暖常伴左右"
]);

const particles = ref(Array(25).fill().map(() => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 1,
  speed: Math.random() + 0.5,
  opacity: Math.random() * 0.3 + 0.1,
  type: Math.random() > 0.5 ? 'circle' : 'square'
})));

onMounted(() => {
  isVisible.value = true;
  animateParticles();
});

const animateParticles = () => {
  particles.value = particles.value.map(particle => ({
    ...particle,
    y: particle.y <= 100 ? particle.y + particle.speed : -10,
    x: particle.x + Math.sin(particle.y / 30) * 0.3
  }));
  requestAnimationFrame(animateParticles);
};
</script>

<template>
  <div class="home-container">
    <!-- 添加多层背景效果 -->
    <div class="background-layers">
      <div class="layer layer-1"></div>
      <div class="layer layer-2"></div>
      <div class="layer layer-3"></div>
    </div>

    <!-- 粒子背景 -->
    <div class="particles-container">
      <div v-for="(particle, index) in particles" 
           :key="index" 
           :class="['particle', particle.type]"
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
    <Transition name="fade-in">
      <div v-if="isVisible" class="theme">
        <div class="content-wrapper">
          <h1 class="main-title">
            心灵港湾
          </h1>
          <div class="quote-container">
            <p v-for="(quote, index) in quotes" 
               :key="index" 
               class="quote"
               :style="{ animationDelay: `${index * 0.5}s` }">
              {{ quote }}
            </p>
          </div>
        </div>

        <!-- 装饰圆圈 -->
        <div class="decoration">
          <div class="circle pulse"></div>
          <div class="circle pulse"></div>
          <div class="circle pulse"></div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.home-container {
  min-height: calc(100vh - 60px);
  padding-top: 60px; /* 使用 padding-top 替代 margin-top */
  margin-top: 0; /* 移除 margin-top */
  background: linear-gradient(135deg, #fff5eb 0%, #ffecd2 100%);
  overflow: hidden;
  position: relative;
  z-index: 1; /* 确保内容在导航栏之下 */
}

/* 粒子样式 */
.particles-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 2;
}

.particle {
  position: absolute;
  transition: opacity 0.5s ease;
}

.particle.circle {
  border-radius: 50%;
  background: linear-gradient(135deg, #ffb74d, #ffa726);
}

.particle.square {
  background: linear-gradient(135deg, #ffe0b2, #ffcc80);
  transform: rotate(45deg);
}

/* 主题内容样式 */
.theme {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
  padding: 20px;
  position: relative;
  z-index: 3;
}

.content-wrapper {
  text-align: center;
  animation: contentFadeIn 1s ease-out forwards;
}

/* 修改 main-title 相关样式 */
.main-title {
  font-size: 4rem;
  color: #5d4037;  /* 使用纯色 */
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 4px;
  position: relative;
}

/* 修改下划线样式 */
.main-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(to right, #ffb74d, #ffa726);
  border-radius: 2px;
  animation: expandLine 0.8s ease-out forwards;
}

.quote-container {
  text-align: center;
  margin-top: 2rem;
}

.quote {
  font-size: 1.5rem;
  color: #8d6e63;
  margin: 1rem 0;
  opacity: 0;
  transform-origin: left;
  animation: slideUpFade 0.8s ease forwards, wave 2s ease-in-out infinite;
}

/* 装饰元素样式 */
.decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  background: linear-gradient(135deg, #ffb74d, #ffa726);
}

.circle.pulse {
  animation: float 15s infinite ease-in-out, pulse 2s infinite ease-in-out;
}

.circle:nth-child(1) {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -150px;
}

.circle:nth-child(2) {
  width: 200px;
  height: 200px;
  top: 50%;
  right: -100px;
  animation-delay: -5s;
}

.circle:nth-child(3) {
  width: 150px;
  height: 150px;
  bottom: -75px;
  left: 50%;
  animation-delay: -7s;
}

/* 添加新的背景层样式 */
.background-layers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
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

/* 动画关键帧 */
@keyframes contentFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-150%) skewX(-20deg);
  }
  100% {
    transform: translateX(150%) skewX(-20deg);
  }
}

@keyframes expandLine {
  from {
    width: 0;
  }
  to {
    width: 60px;
  }
}

@keyframes slideUpFade {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes wave {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.15;
  }
  100% {
    transform: scale(1);
    opacity: 0.1;
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, -20px);
  }
}

/* 添加新的动画关键帧 */
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

/* 响应式适配 */
@media (max-width: 768px) {
  .particles-container {
    opacity: 0.5;
  }
  
  .layer {
    opacity: 0.2;
  }

  .main-title {
    font-size: 2.5rem;
  }
  
  .quote {
    font-size: 1.2rem;
  }

  .circle {
    opacity: 0.05;
  }
}
</style>
