<template>
  <div class="chart-container">
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const chartRef = ref(null)
let chartInstance = null

const initChart = () => {
  chartInstance = echarts.init(chartRef.value)
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: 'rgba(255, 167, 38, 0.2)',
      borderWidth: 1,
      textStyle: {
        color: '#5d4037'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: '#8d6e63'
        }
      },
      axisLabel: {
        color: '#8d6e63'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#8d6e63'
        }
      },
      axisLabel: {
        color: '#8d6e63'
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 167, 38, 0.1)'
        }
      }
    },
    series: [{
      data: props.data,
      type: 'line',
      smooth: true,
      symbolSize: 8,
      itemStyle: {
        color: '#ffa726'
      },
      lineStyle: {
        width: 3,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: '#ffa726'
        }, {
          offset: 1,
          color: '#ffcc80'
        }])
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgba(255, 167, 38, 0.3)'
        }, {
          offset: 1,
          color: 'rgba(255, 167, 38, 0.1)'
        }])
      }
    }]
  }
  
  chartInstance.setOption(option)
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (chartInstance) {
    chartInstance.dispose()
  }
})

const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

watch(() => props.data, (newData) => {
  if (chartInstance) {
    chartInstance.setOption({
      series: [{
        data: newData
      }]
    })
  }
}, { deep: true })
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>
