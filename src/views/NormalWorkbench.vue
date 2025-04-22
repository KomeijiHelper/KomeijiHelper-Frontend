<script setup>
import InformedConsentForm from "@/components/InformedConsentForm.vue";
import { ref } from 'vue'
import SelectConsultantPopup from "@/components/SelectConsultant.vue";
import { VaButton } from "vuestic-ui";

const showPopup = ref(false)
const consentFormRef = ref(null)
const onClick = async () => {
  const confirmed = await consentFormRef.value.open()
  if (!confirmed) return
  showPopup.value = true;
}
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
    <SelectConsultantPopup :show="showPopup" @close="showPopup = false" />
    <va-button color="primary" @click="onClick">选择咨询师</va-button>
    <informed-consent-form ref="consentFormRef" />
  </div>
</template>

<style scoped>

</style>