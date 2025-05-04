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
    <button @click="emailVerify">进行邮箱验证</button>
    <div class="mail-check">
      <input v-model="captcha" v-if="showEmailInput" placeholder="请输入邮箱验证码"></input>
      <p v-if="showTimeOut">请在{{ remainTime }}秒后重试</p>
    </div>
    <!-- <VaButton @click="checkCaptcha">check</VaButton> -->
    <button @click="submitPassword">提交密码修改</button>
    <button @click="close">取消</button>
  </div>
  <VaModal v-model="showNotify" size="auto">
    <p>邮件发送成功，请确认验证码</p>
    <p>您的邮件可能被回收到垃圾箱中，请注意查收</p>
  </VaModal>
</template>

<script setup>
import userApi from '@/api/userApi';
import {ref} from 'vue';
import { useToast, VaModal,VaButton } from 'vuestic-ui';

const emit = defineEmits(['close', 'submit']);

const {notify} = useToast();

const emailCheck = ref(false);
const showNotify = ref(false);
const showEmailInput = ref(false);
const showTimeOut = ref(false);
const remainTime = ref(60);
let checkMaiButtonValid = true;

const emailVerify = async ()=> {
  if(!checkMaiButtonValid) {
    return;
  }
  // send email
  const response = await userApi.sendCaptcha("changePwd");
  if(response.data.code !== '200') {
    notify(response.data.msg);
    return;
  }
  showNotify.value = true;
  checkMaiButtonValid = false;
  showTimeOut.value = true;
  showEmailInput.value = true;
  const intervalId = setInterval(()=>{
    remainTime.value--;
    if(remainTime.value <= 0) {
      checkMaiButtonValid = true;
      clearInterval(intervalId);
      showTimeOut.value = false;
      remainTime.value = 60;
    }
  },1000);
}

const checkCaptcha = async ()=> {
  // check
  const response = await userApi.checkCaptcha(captcha.value,"changePwd");
  if(response.data.code !== '200') {
    notify(response.data.msg);
  }
  else {
    emailCheck.value = true;
  }
  captcha.value = "";
}

const oldPassword = ref("");
const newPassword = ref("");
const captcha = ref("");

const submitPassword = async () => {
  if(!showEmailInput.value) {
    notify("请进行邮箱验证");
    return;
  }
  await checkCaptcha();
  if(!emailCheck.value) {
    return;
  }
  notify("修改密码成功");
  emailCheck.value = false;
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

.mail-check {
  display: flex;
  flex-direction: column;
}

.mail-check p {
  align-self: flex-end;
  font-size: 15px;
  color: #888;
  margin: 0;
}

</style>
