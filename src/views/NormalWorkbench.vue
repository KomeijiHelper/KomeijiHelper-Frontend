<script setup>
import Records from "@/components/Records.vue";
import selectConsultant from "@/components/SelectConsultant.vue";
import {VaButton} from "vuestic-ui";

</script>

<template>
  <div class="top-button">
    <router-link to="/chat/history">
    <va-button color="primary">
      咨询记录
    </va-button>
    </router-link>
  </div>
  <div>
    <select-consultant></select-consultant>
  </div>
</template>

<style scoped>

</style>