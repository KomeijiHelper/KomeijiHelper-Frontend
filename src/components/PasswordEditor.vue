<!-- components/PasswordEditor.vue -->
<template>
  <div class="password-editor">
    <div class="form-group">
      <label for="oldPassword">旧密码</label>
      <input v-model="oldPassword" type="password" id="oldPassword" placeholder="请输入现在的密码" />
    </div>
    <div class="form-group">
      <label for="newPassword">新密码</label>
      <input v-model="newPassword" type="password" id="newPassword" placeholder="请输入新的密码"/>
    </div>
    <button @click="submitPassword">提交密码修改</button>
    <button @click="close">取消</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['close', 'submit']);

const oldPassword = ref("");
const newPassword = ref("");

const submitPassword = () => {
  emit('submit', {
    oldPassword: oldPassword.value,
    newPassword: newPassword.value
  });
  emit('close');
};

const close= () => {
  emit('close');
}
</script>

<style scoped>
.password-editor {
  margin-left: 20px;
  padding: 20px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-radius: 8px;
  width: 300px;
}
.form-group {
  margin-bottom: 15px;
}
label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

input, textarea {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  margin-top: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}
</style>
