<script setup>
import {onMounted, ref} from "vue";
import UserTable from "@/components/UserTable.vue";
import {VaCard, VaTab, VaTabs} from "vuestic-ui";
import userApi from "@/api/userApi.js";
import UserStatusChart from "@/components/dashboards/UserStatusChart.vue";

const userClassTabs = [
  { label: "全部", value: -1 },
  { label: "普通用户", value: 0 },
  { label: "咨询师", value: 1 },
  { label: "督导", value: 2 },
];

const selectedUserClass = ref(0);
const userCount = ref([0, 0, 0]);
const onlineCount = ref([0, 0, 0]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const userCountJson = await userApi.getUserCount();
    const onlineCountJson = await userApi.getOnlineCount();
    userCount.value = [
      userCountJson.data.data.Normal,
      userCountJson.data.data.Assistant,
      userCountJson.data.data.Supervisor
    ];
    onlineCount.value = [
      onlineCountJson.data.data.Normal,
      onlineCountJson.data.data.Assistant,
      onlineCountJson.data.data.Supervisor
    ];
  } catch (error) {
    console.error("获取用户数据失败：", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="manager-workbench">
    <!-- 背景层 -->
    <div class="background-layers">
      <div class="layer layer-1"></div>
      <div class="layer layer-2"></div>
      <div class="layer layer-3"></div>
    </div>

    <div class="content-container">
      <h1 class="page-title">管理员工作台</h1>
      
      <div class="dashboard-section">
        <transition name="fade">
          <div v-if="!isLoading" class="chart-container">
            <UserStatusChart 
              :total-counts="userCount" 
              :online-counts="onlineCount"
            />
          </div>
        </transition>
      </div>

      <div class="users-section">
        <va-card class="user-card">
          <va-tabs v-model="selectedUserClass" grow class="custom-tabs">
            <va-tab
              v-for="tab in userClassTabs"
              :key="tab.value"
              :value="tab.value"
              class="tab-item"
            >
              {{ tab.label }}
            </va-tab>
          </va-tabs>

          <user-table :query-user-class="selectedUserClass - 1" />
        </va-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.manager-workbench {
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
  max-width: 1200px;
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

.dashboard-section {
  margin-bottom: 30px;
}

.chart-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(255, 167, 38, 0.1);
  backdrop-filter: blur(10px);
}

.user-card {
  background: rgba(255, 255, 255, 0.95) !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 32px rgba(255, 167, 38, 0.1) !important;
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.custom-tabs {
  background: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(255, 167, 38, 0.2);
}

.tab-item {
  padding: 12px 24px;
  color: #5d4037;
  transition: all 0.3s ease;
}

.tab-item:hover {
  background: rgba(255, 167, 38, 0.1);
}

.tab-item.active {
  color: #ffa726;
  border-bottom: 2px solid #ffa726;
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
  
  .chart-container,
  .user-card {
    padding: 15px;
  }
}
</style>
