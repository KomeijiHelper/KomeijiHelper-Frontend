<template>
  <div class="star-rating">
    <span
        v-for="index in maxStars"
        :key="index"
        class="star"
    >
      <span class="star-fill" :style="{ width: getStarWidth(score, index) + '%' }">★</span>
      <span class="star-empty">★</span>
    </span>
    <span class="score-number">（{{ score.toFixed(1) }}）</span>
  </div>
</template>

<script setup>
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
  display: flex;
  align-items: center;
  font-size: 1.2em;
  color: #ccc;
  gap: 4px;
}

.star {
  position: relative;
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
}

.star-empty {
  position: absolute;
  color: #ccc;
  z-index: 0;
}

.star-fill {
  position: absolute;
  color: gold;
  overflow: hidden;
  white-space: nowrap;
  z-index: 1;
}

.score-number {
  margin-left: 6px;
  font-size: 0.95em;
  color: #666;
}
</style>
