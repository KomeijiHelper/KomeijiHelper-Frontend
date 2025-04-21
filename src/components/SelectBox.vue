<template>
  <select v-model="selectedValue" class="input-blank" @change="handleChange">
    <option disabled value="">{{ placeholder }}</option>
    <option v-for="option in options" :key="option" :value="option">
      {{ option }}
    </option>
  </select>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  placeholder: { type: String, default: "请选择一个选项" },
  options: { type: Array, required: true } // 👈 需要传入选项
});
const emit = defineEmits(["change"]);
const selectedValue = ref("");
const handleChange = () => {
  emit("change", selectedValue.value);
};
const getValue = () => selectedValue.value;
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
