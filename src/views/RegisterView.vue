<template>
  <div class="register-wrapper">
    <div class="register-container">
      <div class="register-content">
        <div class="welcome-section">
          <h1 class="register-title">开启心灵之旅</h1>
          <p class="register-subtitle">每一次倾诉都是走向治愈的开始</p>
        </div>

        <div class="form-group">
          <InputBlank ref="usernameRef" placeholder="用户名" @focus="showHint('name')" @blur="disableHint('name')"/>
          <div v-if="showNameHint" class="hints">
            <p class="hint">只能包含字母、数字，并以字母开头</p>
            <p class="hint">长度为5-19个字符</p>
          </div>
          <InputBlank ref="passwordRef" placeholder="密码" type="password" @focus="showHint('pwd')" @blur="disableHint('pwd')" />
          <div class="hints" v-if="showPwdHint">
            <p class="hint">不能包含空格</p>
            <p class="hint">长度为8-16个字符</p>
            <p class="hint">必须包含字母、数字、符号中至少两种</p>
          </div>
          <InputBlank ref="passwordRepeatRef" placeholder="请重复你的密码" type="password" />
          <InputBlank ref="emailRef" placeholder="请输入你的邮箱" />
          <div class="mail-container">
            <button class="email-button" @click="emailVerify">进行邮箱验证</button>
            <div class="mail-check" style="width: 60%;">
              <InputBlank ref="captchaRef" v-if="showEmailInput" placeholder="请输入邮箱验证码"/>
              <p v-if="showTimeOut">请在{{ remainTime }}秒后重试</p>
            </div>
          </div>
          <SelectBox ref="userClassRef" placeholder="请选择你要注册的身份" :options="['普通用户', '咨询师', '督导']"
            @change="handleChange" />
          <InputBlank v-if="qualificationVisible" ref="qualificationRef" placeholder="请输入资质证书编号" />
          <InputBlank v-if="emergencyContactVisible" ref="emergencyContactRef" placeholder="请输入紧急联系人" />
        </div>

        <button class="register-button" @click="handleRegister">
          <span>开始心理咨询之旅</span>
        </button>

        <router-link class="login-link" to="/login">
          已有账号？<span>温暖回归</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import userApi from "@/api/userApi.js";
import InputBlank from "@/components/InputBlank.vue";
import SelectBox from "@/components/SelectBox.vue";
import {ref} from "vue";
import {useToast} from "vuestic-ui";

const usernameRef = ref(null);
const passwordRef = ref(null);
const passwordRepeatRef = ref(null);
const emailRef = ref(null);
const userClassRef = ref(null);
const qualificationRef = ref(null);
const emergencyContactRef = ref(null);

const qualificationVisible = ref(false);
const emergencyContactVisible = ref(true);

const showNameHint = ref(false);
const showPwdHint = ref(false);

// email
const showEmailInput = ref(false);
const showTimeOut = ref(false);
let checkMaiButtonValid = true;
let emailChecked = false;
const remainTime = ref(60);
const captchaRef = ref(null);

const { notify } = useToast();
const userClass = ref(0);

const showHint = (kind)=> {
  if(kind === 'name') {
    showNameHint.value = true;
  }
  else if(kind === 'pwd') {
    showPwdHint.value = true;
  }
}

const disableHint = (kind) => {
  if(kind === 'name') {
    showNameHint.value = false;
  }
  else if(kind === 'pwd') {
    showPwdHint.value = false;
  }
}

const handleChange = (value) => {
  userClass.value = value === "普通用户" ? 0 : value === "咨询师" ? 1 : value === "督导" ? 2 : 0;
  qualificationVisible.value = userClass.value !== 0;
  emergencyContactVisible.value = userClass.value === 0;
  console.log("选择了：", userClass.value);
};

const emailVerify = async ()=>{
  console.log("emailVerify");
  if(!checkMaiButtonValid) return;

  const username = usernameRef.value.getValue();
  const email = emailRef.value.getValue();
  if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    notify("邮件格式错误")
    return;
  }
  const response = await userApi.sendRegisterCaptcha(username,email);
  if(response.data.code !== '200') {
    notify(response.data.msg);
    return;
  }
  showEmailInput.value = true;
  showTimeOut.value = true;
  checkMaiButtonValid = false;
  emailChecked = true;
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

const handleRegister = async () => {
  const username = usernameRef.value.getValue();
  const password = passwordRef.value.getValue();
  const passwordRepeat = passwordRepeatRef.value.getValue();
  const qualification = qualificationRef.value === null ? 0 : qualificationRef.value.getValue();
  const emergencyContact = emergencyContactRef.value === null ? 0 : emergencyContactRef.value.getValue();
  const userClassCode = userClass.value;
  const email = emailRef.value.getValue();
  let captcha;
  if(captchaRef.value) {
     captcha = captchaRef.value.getValue();
  }
  if (!username || !password) {
    notify("请输入用户名和密码！");
    return;
  }

  if(!/^[A-Za-z][A-Za-z0-9]{4,18}$/.test(username)) {
    notify("输入用户名不合法");
    return;
  }


  if(!/^(?!.*\s)(?=.*[A-Za-z].*)(?=.*[\d\W_].*|.*\W.*)[^\s]{8,16}$/.test(password)) {
    notify("输入密码不合法");
    return;
  }


  if (passwordRepeat !== password) {
    notify("密码似乎不一致呢");
    return;
  }

  if(!email) {
    notify("请输入邮箱");
    return;
  }

  if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    notify("邮件格式错误")
    return;
  }

  if(!emailChecked) {
    notify("请验证邮箱");
    return;
  }

  if(!captcha) {
    notify("请输入邮箱验证码")
    return;
  }


  if (qualificationVisible.value && !qualification) {
    notify("请输入资质证书编号");
    return;
  }

  if (emergencyContactVisible.value) {
    if (!emergencyContact) {
      notify("请输入紧急联系人");
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(emergencyContact)) {
      notify("紧急联系人格式不正确");
      return;
    }
  }

  try {
    const emailRes = await userApi.checkRegisterCaptcha(email,captcha);
    if(emailRes.data.code !== '200') {
      notify(emailRes.data.msg);
      return;
    }
  } catch(err) {
    console.log(err);
  }

  try {
    const res = await userApi.register(username, password, userClassCode,email,qualification, emergencyContact);
    if (res.status === 200) {
      notify("注册成功");
      await (new Promise(resolve => setTimeout(resolve, 1000)));
      window.location.reload();
    } else {
      console.log(res);
      notify(`注册失败！${res}.data.msg`);
    }
  } catch (err) {
    notify(`注册失败，${err.response.data.msg}`)
    console.log(err)
  }
};
</script>

<style scoped>
.register-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5eb 0%, #ffecd2 100%);
  padding: 20px;
}

.register-container {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 15px 35px rgba(255, 178, 107, 0.1);
  width: 100%;
  max-width: 420px;
  text-align: center;
  animation: containerFadeIn 0.8s ease-out;
}

.register-content {
  opacity: 0;
  animation: contentFadeIn 0.8s ease-out forwards;
  animation-delay: 0.3s;
}

.welcome-section {
  margin-bottom: 35px;
}

.register-title {
  color: #5d4037;
  font-size: 2.2em;
  font-weight: 600;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.register-subtitle {
  color: #8d6e63;
  font-size: 1.1em;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group :deep(input) {
  background: #fff8e1;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

.form-group :deep(input:focus) {
  border-color: #ffb74d;
  background: white;
}

.email-button {
  width: 40%;
  background-color: #ffb74d;
  color: white;
  border: none;
  border-radius: 15px ;
  font-size: 0.8em;
  padding: 25px;
}

.register-button {
  width: 100%;
  padding: 14px;
  margin-top: 20px;
  background: #ffb74d;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.register-button:hover {
  background: #ffa726;
  transform: translateY(-2px);
}

.register-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.5s ease-out;
}

.register-button:active::after {
  transform: translate(-50%, -50%) scale(2);
}

.login-link {
  display: block;
  margin-top: 25px;
  font-size: 0.95em;
  color: #8d6e63;
  text-decoration: none;
  transition: color 0.3s ease;
}

.login-link span {
  color: #ff9800;
  font-weight: 500;
  position: relative;
}

.login-link span::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background: #ff9800;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.login-link:hover span::after {
  transform: scaleX(1);
}

@keyframes containerFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes contentFadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: 30px 20px;
  }

  .register-title {
    font-size: 1.8em;
  }
}

.mail-container{
  display: flex;
  flex-direction: row;
  padding-bottom: 10px;
  gap: 15px;
}

.mail-check {
  display: flex;
  flex-direction: column;
}

.mail-check p {
  align-self: flex-end;
  font-size: 8px;
  color: #888;
  margin: 0;
}

.hints {
  margin-bottom: 15px;
}

.hint {
  font-size: 14px;
  color: #666;
  margin: 4px 0;
  padding-left: 20px;
  position: relative;
  text-align: left;
}
.hint::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #999;
  font-size: 16px;
  line-height: 1;
}
</style>
