<template>
  <div class="profile-container">
    <!-- 背景层 -->
    <div class="background-layers">
      <div class="layer layer-1"></div>
      <div class="layer layer-2"></div>
      <div class="layer layer-3"></div>
    </div>

    <div class="content-container">
      <h1 class="page-title">个人信息</h1>
      
      <div class="profile-layout">
        <div class="profile-form">
          <div class="form-group">
            <label for="userName">用户名</label>
            <va-content class="display-username"> {{profile.userName}} </va-content>
          </div>
          
          <div class="form-group">
            <label for="name">昵称</label>
            <input v-model="profile.nickName" type="text" id="name" placeholder="请输入您的昵称" />
          </div>
          
          <div class="form-group">
            <label for="email">邮箱</label>
            <input v-model="profile.email" type="email" id="email" placeholder="请输入您的邮箱" />
          </div>
          
          <div class="form-group" v-if="userClass.classCode === 0">
            <label for="emergencyContact">紧急联系人</label>
            <input v-model="profile.emergencyContact" type="text" id="emergencyContact" placeholder="请输入紧急联系人" />
          </div>
          
          <div class="form-group" v-if="userClass.classCode === 1 || userClass.classCode === 2">
            <label for="qualification">资质证书编号</label>
            <input v-model="profile.qualification" type="text" id="qualification" placeholder="请输入资质证书编号" />
          </div>
          
          <div class="button-group">
            <button class="update-btn password-btn" @click="togglePasswordEditor">
              修改密码
            </button>
            <button class="update-btn save-btn" @click="saveProfile">
              保存修改
            </button>
          </div>
        </div>

        <!-- 密码编辑器 -->
        <transition name="fade">
          <PasswordEditor
              v-if="showPasswordEditor"
              @close="showPasswordEditor = false"
              @submit="handlePasswordChange"
          />
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import userApi from "@/api/userApi.js";
import PasswordEditor from "@/components/PasswordEditor.vue";
import {reactive, ref} from 'vue';
import {useToast, VaContent} from "vuestic-ui";

const {notify} = useToast()
const userData = await userApi.checkSession();
console.log(userData)

const profile = reactive({
  id: userData.id,
  nickName: userData.nickName,
  userName: userData.userName,
  email: userData.email,
  password: userData.password,
  emergencyContact: userData.emergencyContact,
  qualification: userData.qualification,
});

const userClass = reactive({
  classCode: userData.userClass === "Normal"?0:userData.userClass==="Assistant"?1:userData.userClass==="Supervisor"?2:3,
})

const showPasswordEditor = ref(false);

const togglePasswordEditor = () => {
  showPasswordEditor.value = !showPasswordEditor.value;
};

const saveProfile = async () => {
  const response = await userApi.changeUserInfo(JSON.stringify(profile));
  console.log(response);
  if (response.data.code === '200')
    notify("保存成功");
};

const handlePasswordChange = async ({oldPassword, newPassword}) => {
  console.log("修改密码：", oldPassword, " -> ", newPassword);
  const response = await userApi.changePassword(oldPassword, newPassword);
  if (response.data.code !== "200") {
    console.log(response.data.msg)
    notify(response.data.msg);
  }
};
</script>

<style scoped>
.profile-container {
  min-height: calc(100vh - 60px);
  padding-top: 60px;
  background: linear-gradient(135deg, #fff5eb 0%, #ffecd2 100%);
  position: relative;
}

.background-layers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.layer {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.2;
}

.layer-1 {
  background: linear-gradient(135deg, #fff5eb 0%, #ffecd2 100%);
  animation: layer1Move 30s ease-in-out infinite;
}

.layer-2 {
  background: radial-gradient(circle at 30% 70%, #ffcc80 0%, transparent 70%);
  animation: layer2Move 25s ease-in-out infinite alternate;
}

.layer-3 {
  background: radial-gradient(circle at 70% 30%, #ffe0b2 0%, transparent 70%);
  animation: layer3Move 35s ease-in-out infinite alternate;
}

.content-container {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: 2.5em;
  color: #5d4037;
  margin-bottom: 40px;
  text-align: center;
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(to right, #ffb74d, #ffa726);
  border-radius: 2px;
}

.profile-layout {
  display: flex;
  justify-content: center;
  gap: 30px;
  padding: 20px;
}

.profile-form {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(255, 167, 38, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 500px;
  backdrop-filter: blur(10px);
}

.form-group {
  margin-bottom: 25px;
}

label {
  font-weight: 500;
  color: #5d4037;
  margin-bottom: 8px;
  display: block;
  font-size: 1.1em;
}

input {
  width: 100%;
  padding: 12px;
  border: 2px solid rgba(255, 167, 38, 0.2);
  border-radius: 8px;
  font-size: 1em;
  color: #5d4037;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
}

input:focus {
  outline: none;
  border-color: #ffa726;
  box-shadow: 0 0 0 3px rgba(255, 167, 38, 0.2);
}

.display-username {
  padding: 12px;
  background: rgba(255, 167, 38, 0.1);
  border-radius: 8px;
  color: #5d4037;
  font-weight: 500;
}

.button-group {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.update-btn {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.password-btn {
  background: linear-gradient(135deg, #ffe0b2, #ffcc80);
  color: #5d4037;
}

.save-btn {
  background: linear-gradient(135deg, #ffb74d, #ffa726);
  color: white;
}

.update-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 167, 38, 0.2);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

@keyframes layer1Move {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-3%, -3%); }
}

@keyframes layer2Move {
  0% { transform: scale(1) translate(0, 0); }
  50% { transform: scale(1.2) translate(3%, 3%); }
  100% { transform: scale(1) translate(-3%, -3%); }
}

@keyframes layer3Move {
  0% { transform: scale(1.1) translate(0, 0); }
  50% { transform: scale(1) translate(-3%, 3%); }
  100% { transform: scale(1.1) translate(3%, -3%); }
}

@media (max-width: 768px) {
  .content-container {
    padding: 15px;
  }
  
  .page-title {
    font-size: 2em;
    margin-bottom: 30px;
  }
  
  .profile-form {
    padding: 20px;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .update-btn {
    width: 100%;
  }
}
</style>