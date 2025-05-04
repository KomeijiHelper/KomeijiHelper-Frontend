<template>
  <va-modal v-model="isVisible" hide-default-actions no-padding class="consent-modal">
    <div class="consent-container">
      <h2 class="consent-title">知情同意书</h2>
      
      <div class="consent-content">
        <p>亲爱的来访者：</p>
        <p>欢迎您来到心理咨询室！请您在咨询开始前，认真阅读以下内容，这将帮助您更好地了解心理咨询，并在充分知情的基础上，决定是否进行咨询。</p>
        <p><strong>一、心理咨询的目标与过程</strong></p>
        <p>心理咨询是一种助人过程，咨询师运用专业知识和技巧，与来访者建立良好的咨询关系，通过倾听、共情、分析、引导等方式，帮助来访者更好地认识自我、接纳自我、解决问题、提升心理健康水平。心理咨询并不能提供快速解决问题的“特效药”，它是一个渐进的过程，通常需要多个阶段、多个会谈。</p>
        <p><strong>二、保密原则与例外情况</strong></p>
        <p>我们承诺对您的个人信息和咨询内容严格保密，未经您的书面同意，不会将相关信息透露给第三方。但在以下特殊情况下，咨询师有责任或义务打破保密原则：</p>
        <ul>
          <li>1. 您或他人面临严重的危险，如自杀、自伤、伤害他人等情况时；</li>
          <li>2. 有法律法规规定或司法机关要求披露时；</li>
          <li>3. 未成年人或无民事行为能力者的监护人有权知情的部分内容。</li>
        </ul>
        <p><strong>三、咨询师的专业伦理与职责</strong></p>
        <p>本咨询服务由接受过专业培训的咨询师提供，咨询师承诺遵守心理咨询师的职业伦理和行为规范，包括尊重来访者、保持中立、不进行任何形式的歧视或伤害、不建立超越咨询关系的私人关系等。咨询师将持续接受督导与专业成长，以保障咨询品质。</p>
        <p><strong>四、您在咨询中的权利与义务</strong></p>
        <p>作为来访者，您有权了解咨询师的资格、咨询方法和流程，有权在任何时候提出疑问、表达感受，也有权终止咨询。同时，您有义务提供真实的信息，遵守预约时间，积极参与咨询过程。</p>
        <p><strong>五、特别说明</strong></p>
        <p>1. 心理咨询不同于医疗诊断和治疗，不能开具药物或出具病历证明；</p>
        <p>2. 咨询过程中可能出现情绪波动，这是探索内心的一部分，请您做好心理准备；</p>
        <p>3. 若您目前存在严重心理障碍或精神疾病，请先前往专业医疗机构就诊，待病情稳定后再接受心理咨询。</p>
        <p><strong>六、同意与签署</strong></p>
        <p>我已阅读并充分理解上述内容，同意在知情、自愿的基础上接受心理咨询服务。如有任何疑问，我会及时与咨询师沟通。</p>
        <p>感谢您的信任，祝您在心理成长的旅程中收获力量与希望！</p>
      </div>

      <div class="consent-actions">
        <va-button @click="cancel" class="cancel-btn">
          暂不同意
        </va-button>
        <va-button @click="confirm" class="confirm-btn">
          已阅读并同意
        </va-button>
      </div>
    </div>
  </va-modal>
</template>

<script setup>
import {defineEmits, ref} from 'vue'
import {VaButton, VaModal} from 'vuestic-ui'

const emit = defineEmits(['confirm', 'cancel'])

const isVisible = ref(false)
const resolveCallback = ref(null)

const confirm = () => {
  emit('confirm')
  isVisible.value = false
  resolveCallback.value?.(true)
}
const cancel = () => {
  emit('cancel')
  isVisible.value = false
  resolveCallback.value?.(false)
}

// 提供给外部使用
defineExpose({
  open() {
    isVisible.value = true
    return new Promise((resolve) => {
      resolveCallback.value = resolve
    })
  }
})
</script>

<style scoped>
.consent-modal {
  :deep(.va-modal__container) {
    background: linear-gradient(135deg, #fff5eb 0%, #fff 100%);
    border-radius: 16px;
    max-width: 800px;
    max-height: 90vh;
  }
}

.consent-container {
  padding: 30px;
}

.consent-title {
  font-size: 2em;
  color: #5d4037;
  text-align: center;
  margin-bottom: 30px;
  position: relative;
}

.consent-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(to right, #ffb74d, #ffa726);
  border-radius: 2px;
}

.consent-content {
  max-height: calc(90vh - 200px);
  overflow-y: auto;
  padding: 20px;
  line-height: 1.8;
  color: #5d4037;

  p {
    margin-bottom: 15px;
  }

  strong {
    color: #d84315;
  }

  ul {
    margin: 15px 0;
    padding-left: 20px;
  }

  li {
    margin-bottom: 10px;
  }
}

.consent-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 167, 38, 0.2);
}

.cancel-btn {
  background: #f5f5f5 !important;
  color: #8d6e63 !important;
}

.confirm-btn {
  background: linear-gradient(135deg, #ffb74d, #ffa726) !important;
  color: white !important;
}

.cancel-btn,
.confirm-btn {
  padding: 12px 24px !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
}

.cancel-btn:hover,
.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 167, 38, 0.2);
}
</style>


