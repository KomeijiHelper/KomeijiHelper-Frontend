<script setup>
import { ref } from "vue";
import UserTable from "@/components/UserTable.vue";
import {VaCard, VaTab, VaTabs} from "vuestic-ui";

// tab 对应的用户类型值
const userClassTabs = [
  { label: "全部", value: -1 },
  { label: "普通用户", value: 0 },
  { label: "咨询师", value: 1 },
  { label: "督导", value: 2 },
];

const selectedUserClass = ref(0);
</script>

<template>
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

    <!-- 子组件，传入 userClass -->
    <user-table :query-user-class="selectedUserClass - 1" />
  </va-card>
</template>
