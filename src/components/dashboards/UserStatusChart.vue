<template>
  <div ref="chartRef" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  onlineCounts: {
    type: Array,
    required: true
  },
  totalCounts: {
    type: Array,
    required: true
  }
})

const chartRef = ref(null)
let chartInstance = null

const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

  const option = {
    title: {
      text: '用户在线情况'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['在线人数', '总人数']
    },
    xAxis: {
      type: 'category',
      data: ['普通用户', '咨询师', '管理员']
    },
    yAxis: {
      type: 'value',
      minInterval: 1
    },
    series: [
      {
        name: '在线人数',
        type: 'bar',
        data: props.onlineCounts,
        itemStyle: {
          color: '#409EFF'
        }
      },
      {
        name: '总人数',
        type: 'bar',
        data: props.totalCounts,
        itemStyle: {
          color: '#C0C4CC'
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

onMounted(() => {
  initChart()
})

watch(() => [props.onlineCounts, props.totalCounts], () => {
  if (chartInstance) {
    chartInstance.setOption({
      series: [
        { data: props.onlineCounts },
        { data: props.totalCounts }
      ]
    })
  }
}, { deep: true })

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
})
</script>
