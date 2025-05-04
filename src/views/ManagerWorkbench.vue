<script setup>
import userApi from "@/api/userApi.js";
import UserStatusChart from "@/components/dashboards/UserStatusChart.vue";
import UserTable from "@/components/UserTable.vue";
import {onMounted, ref} from "vue";
import {VaCard, VaTab, VaTabs} from "vuestic-ui";

const userClassTabs = [
  { label: "全部", value: -1 },
  { label: "普通用户", value: 0 },
  { label: "咨询师", value: 1 },
  { label: "督导", value: 2 },
];

const selectedUserClass = ref(0);
const userCount = ref([0, 0, 0]);
const onlineCount = ref([0, 0, 0]);

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
  }
});
</script>

<template>
  <UserStatusChart :total-counts="userCount" :online-counts="onlineCount"/>
  <va-card>
    <!-- 顶部 Tab 切换 -->
    <va-tabs
        v-model="selectedUserClass"
        grow
    >
      <va-tab
          v-for="tab in userClassTabs"
          :key="tab.value"
          :value="tab.value"
      >
        {{ tab.label }}
      </va-tab>
    </va-tabs>

    <user-table :query-user-class="selectedUserClass - 1" />
  </va-card>
</template>
