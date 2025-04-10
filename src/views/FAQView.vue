<template>
  <div class="faq-container">
    <h1>常见问题</h1>
    <div class="faq-section">
      <div class="faq-item" v-for="(item, index) in faqs" :key="index">
        <div class="faq-question" @click="toggleAnswer(index)">
          <h2>{{ item.question }}</h2>
          <span>{{ item.isOpen ? '−' : '+' }}</span>
        </div>
        <div v-show="item.isOpen" class="faq-answer">
          <p>{{ item.answer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const faqs = reactive([
  {
    question: "如何预约心理咨询服务？",
    answer: "您可以通过我们的平台查看选择当前有空的咨询师，提交后等待确认。",
    isOpen: false,
  },
  {
    question: "在线心理咨询的流程是怎样的？",
    answer: "在线咨询通过文字对话的方式进行，咨询师将在咨询时间与您进行沟通，帮助您解决心理问题。",
    isOpen: false,
  },
  {
    question: "如何查看我的咨询记录？",
    answer: "在平台上，您可以通过个人页面查看您的历史咨询记录。",
    isOpen: false,
  },
  {
    question: "咨询服务的保密性如何保障？",
    answer: "我们承诺对所有用户信息和咨询内容保密，所有数据都会加密存储，只有您和您的咨询师、以及该咨询师的督导可以查看。",
    isOpen: false,
  },
]);

const toggleAnswer = (index) => {
  faqs[index].isOpen = !faqs[index].isOpen;
};
</script>

<style scoped>
.faq-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f5f5f5;
}

h1 {
  text-align: center;
  font-size: 2.5em;
  margin-bottom: 20px;
}

.faq-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.faq-item {
  margin-bottom: 15px;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
  font-weight: bold;
}

.faq-question:hover {
  background-color: #f0f0f0;
}

.faq-answer {
  padding: 10px 15px;
  background-color: #fafafa;
  border-radius: 5px;
  font-size: 1em;
  line-height: 1.6;
}

.faq-answer p {
  margin: 0;
}
</style>
