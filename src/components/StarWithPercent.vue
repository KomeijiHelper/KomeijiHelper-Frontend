<template>
  <div class="star-rating">
    <span
      v-for="index in maxStars"
      :key="index"
      class="star"
      @mouseenter="hoverScore = index"
      @mouseleave="hoverScore = 0"
    >
      <span 
        class="star-fill" 
        :style="{ width: getStarWidth(score, index) + '%' }"
        :class="{ 'is-hover': hoverScore >= index }"
      >★</span>
      <span class="star-empty">★</span>
    </span>
    <span class="score-number">（{{ score.toFixed(1) }}）</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  maxStars: {
    type: Number,
    default: 5,
  },
});

const hoverScore = ref(0)

function getStarWidth(score, starIndex) {
  const starValue = starIndex;
  if (score >= starValue) {
    return 100; // 满星
  } else if (score + 1 > starValue) {
    return (score - starValue + 1) * 100; // 部分星
  } else {
    return 0; // 空星
  }
}
</script>

<style scoped>
.star-rating {
  display: inline-flex;
  align-items: center;
  font-size: 1.4em;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(255, 167, 38, 0.1);
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}

.star-rating:hover {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 12px rgba(255, 167, 38, 0.15);
  transform: translateY(-1px);
}

.star {
  position: relative;
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.star:hover {
  transform: scale(1.15);
}

.star-empty {
  position: absolute;
  color: rgba(255, 167, 38, 0.2);
  z-index: 0;
  transition: color 0.3s ease;
}

.star-fill {
  position: absolute;
  background: linear-gradient(135deg, #ffd54f, #ffb300);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  overflow: hidden;
  white-space: nowrap;
  z-index: 1;
  transition: all 0.3s ease;
  text-shadow: 0 2px 4px rgba(255, 167, 38, 0.2);
}

.star-fill.is-hover {
  background: linear-gradient(135deg, #ffb74d, #ffa726);
  -webkit-background-clip: text;
  background-clip: text;
  transform: scale(1.1);
}

.score-number {
  margin-left: 8px;
  font-size: 0.9em;
  color: #5d4037;
  font-weight: 500;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.star-rating:hover .score-number {
  opacity: 1;
}

@media (max-width: 768px) {
  .star-rating {
    font-size: 1.2em;
    padding: 6px 10px;
  }
  
  .score-number {
    font-size: 0.85em;
  }
}
</style>
