<script setup>
import { defineAsyncComponent } from 'vue';

const UserProfile = defineAsyncComponent(() => import('../components/Profile.vue'));
</script>

<template>
  <Suspense>
    <UserProfile />
    <template #fallback>
      <div>加载中，请稍候...</div>
    </template>
  </Suspense>
</template>
