<script setup lang="js">
import { ref, onMounted } from 'vue';

const isVisible = ref(false);

onMounted(() => {
  isVisible.value = true;
});
</script>

<template>
  <Transition name="fade-in">
    <div v-if="isVisible" class="theme">
      <h1>Keep happy, Keep friendly</h1>
    </div>
  </Transition>
</template>

<style scoped>
.theme {
  display: grid;
  place-items: center;
  height: 100vh;
  font-size: 50px;
}

/* Vue transition classes for fade-in */
.fade-in-enter-active {
  animation: fadeInAnimation 5s forwards; /* Using custom keyframes animation */
}

.fade-in-enter, 
.fade-in-leave-to {
  opacity: 0;
}

/* Custom fade-in animation */
@keyframes fadeInAnimation {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
