<template>
  <div class="profile-container">
    <h1>编辑个人信息</h1>
    <div class="profile-form">
      <div class="form-group">
        <label for="name">姓名</label>
        <input v-model="profile.name" type="text" id="name" placeholder="请输入您的姓名" />
      </div>
      <div class="form-group">
        <label for="age">年龄</label>
        <input v-model="profile.age" type="number" id="age" placeholder="请输入您的年龄" />
      </div>
      <div class="form-group">
        <label for="email">邮箱</label>
        <input v-model="profile.email" type="email" id="email" placeholder="请输入您的邮箱" />
      </div>
      <div class="form-group">
        <label for="bio">简介</label>
        <textarea v-model="profile.bio" id="bio" placeholder="简要介绍自己"></textarea>
      </div>
      <div class="form-group">
        <label for="picture">头像链接</label>
        <input v-model="profile.picture" type="url" id="picture" placeholder="请输入头像图片链接" />
      </div>
      <button @click="saveProfile">保存</button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const profile = reactive({
  name: '张三',
  age: 25,
  email: 'zhangsan@example.com',
  bio: '一名热爱编程的大学生，喜欢探索新技术。',
  picture: 'https://via.placeholder.com/150'
});

const saveProfile = () => {
  // 模拟保存操作，可以根据需要实现实际的保存逻辑
  console.log('保存个人信息：', profile);
  alert('个人信息已保存！');
};
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.profile-form {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 400px;
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

textarea {
  height: 100px;
  resize: vertical;
}

button {
  padding: 10px 20px;
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
