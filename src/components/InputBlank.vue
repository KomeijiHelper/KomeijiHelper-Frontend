<template>
  <input
      ref="inputRef"
      v-model="inputValue"
      class="input-blank"
      :style="{ left: `${position.x}px`, top: `${position.y}px` }"
      :placeholder="placeholder"
      :type="type"
  />
</template>

<script setup>
import { ref, reactive } from "vue";

const props = defineProps({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  placeholder: { type: String, default: "" },
  type: { type: String, default: "text" }
});

const inputValue = ref("");
const position = reactive({ x: props.x, y: props.y });

const getValue = () => inputValue.value;

defineExpose({ getValue });
</script>

<style scoped>
.input-blank {
  position: absolute;
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 4px;
  width: 200px;
}
</style>
