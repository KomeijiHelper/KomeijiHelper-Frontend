<script setup>
import userApi from '@/api/userApi';

// 定义一个方法来处理点击事件
const handleButtonClick = async () => {
  try {
    const response = await userApi.getUsersByUserClass(1); // 调用 userApi.test 方法
    console.log(response.data.data);
  } catch (error) {
    console.error('Error calling test API:', error); // 处理错误
  }
};

const handleButtonClick1 = async () => {
  try {
    const response = await userApi.test();
    console.log(response);
  } catch (error) {
    console.error('Error calling test API:', error); // 处理错误
  }
};



</script>

<template>
  <div class="about-group">
    <img src="https://raw.githubusercontent.com/KomeijiHelper/KomeijiHelper-Frontend/refs/heads/master/src/assets/logo.svg" class="link-icon"  alt=""/>
    <h1>关于我们</h1>
    <p class="description">
      我们是 <strong>软件开发实践小组2</strong>。<br>
      <a href="https://github.com/orgs/KomeijiHelper/repositories" target="_blank">我们的项目主页</a>。
    </p>

    <h2>成员介绍</h2>
    <ul class="member-list">
      <li>
        <strong>杨程文</strong> - 前端开发，后端打杂，版本管理。
      </li>
      <li>
        <strong>朱炎</strong> - 项目经理，架构师。
      </li>
      <li>
        <strong>陈俊桥</strong> - 后端开发，前端打杂，部署。
      </li>
      <li>
        <strong>陈俊伟</strong> - 后端开发。
      </li>
      <li>
        <strong>王晨楠</strong> - 需求分析，测试。
      </li>
      <li>
        <strong>李智</strong> - 前端开发，测试。
      </li>
    </ul>

    <h2>我们的目标</h2>
    <p class="description">
      通过团队协作，完成 KomeijiHelper 心理咨询平台 web 应用项目，提升实际开发能力与团队协作经验。
    </p>
  </div>
</template>

<style scoped>
.about-group {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #333;
  font-size: 28px;
  margin-bottom: 20px;
}

h2 {
  margin-top: 30px;
  color: #4CAF50;
}

.description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
}

.member-list {
  list-style-type: disc;
  padding-left: 20px;
  font-size: 16px;
  color: #444;
}

a {
  color: blue;
  text-decoration: underline;
}
</style>
