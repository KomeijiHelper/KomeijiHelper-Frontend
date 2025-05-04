<template>
  <div class="container">
    <va-button @click="showTimeSelect = !showTimeSelect">
      选择时间
    </va-button>
    <div ref="chartRef" style="width: 100%; height: 400px;"></div>
  </div>
  <va-modal v-model="showTimeSelect" hide-default-actions>
    <div class="flex flex-col items-start gap-2">
      <h3 class="va-h3">
        设置查询记录的时间范围
      </h3>
      <span class="va-text-secondary opacity-50">开始时间:</span><VaDateInput v-model="startDate" />
      <span class="va-text-secondary opacity-50">结束时间:</span><VaDateInput v-model="endDate" />
    </div>
    <div class="flex justify-end mt-2 gap-2">
      <VaButton preset="secondary" color="secondary" @click="hideTime">
        取消
      </VaButton>
      <VaButton preset="primary" @click="setDefault">
        恢复默认
      </VaButton>
      <VaButton @click="confirm">
        确定
      </VaButton>
    </div>
  </va-modal>
</template>

<script setup>
import userApi from '@/api/userApi';
import * as echarts from 'echarts'
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { VaButton, VaModal } from 'vuestic-ui'

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const calcDate = (date,days) => {
  const res = new Date(date);
  res.setDate(res.getDate()+days);
  return res;
}

const chartRef = ref(null)
const showTimeSelect = ref(false);
const currentTime = new Date();
const defaultDate = new Date(currentTime.getFullYear(),currentTime.getMonth(),currentTime.getDate());
const endDate = ref(defaultDate);
const startDate = ref(calcDate(defaultDate,-7));
let chartInstance = null;

const getXlabel = ()=>{
  const days = [];
  const msPerDay = 1000*60*60*24;
  const total = Math.floor((endDate.value-startDate.value)/msPerDay);
  for(let i =0;i < total;i++) {
    const date = new Date(startDate.value);
    date.setDate(date.getDate()+i);
    days.push(`${date.getMonth() + 1}/${date.getDate()}`)
  }
  return days;
}


const renderChart = (ydata) => {
  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }

  const option = {
    title: {
      text: '近期咨询数量',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: getXlabel()
    },
    yAxis: {
      type: 'value',
      name: '次数',
      minInterval: 1
    },
    series: [
      {
        name: '咨询数量',
        type: 'line',
        smooth: true,
        data: ydata,
        areaStyle: {
          color: '#d0e6ff'
        },
        lineStyle: {
          color: '#409EFF'
        },
        itemStyle: {
          color: '#409EFF'
        }
      }
    ]
  }

  chartInstance.setOption(option)
}
// watch(() => props.data, renderChart, { deep: true })
onMounted(() => {
  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

onBeforeUnmount(() => {
  chartInstance?.dispose()
})
watch(() => props.data, () => {
  renderChart(props.data)
})

const setDefault = ()=>{
  endDate.value = defaultDate;
  startDate.value = calcDate(defaultDate,-7);
}

const hideTime = ()=>{
  showTimeSelect.value = false;
}

const padding = (n)=> {
  return n < 10? '0'+n:n
}

const confirm = async ()=>{
  const start = `${startDate.value.getFullYear()}-${padding(startDate.value.getMonth()+1)}-${padding(startDate.value.getDate())}`
  const end = `${endDate.value.getFullYear()}-${padding(endDate.value.getMonth()+1)}-${padding(endDate.value.getDate())}`
  const response = await userApi.getPeriodChatRecord(start,end);
  renderChart(response.data.data);
  showTimeSelect.value = false;
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
