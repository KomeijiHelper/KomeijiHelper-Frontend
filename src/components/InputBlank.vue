<template>
  <input
      v-model="inputValue"
      class="input-blank"
      :placeholder="placeholder"
      :type="type"
  />
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  placeholder: { type: String, default: "" },
  type: { type: String, default: "text" }
});

const inputValue = ref("");

const getValue = () => inputValue.value;
defineExpose({ getValue });
</script>

<style scoped>
.input-blank {
  display: block;
  width: 100%;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 16px;
  box-sizing: border-box;
}
</style>
