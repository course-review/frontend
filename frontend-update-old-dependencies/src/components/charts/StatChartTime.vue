<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const props = defineProps<{
  data: { label: string; count: number }[]
  title: string
  pointRadius?: number
}>()

import { computed } from 'vue'

const chartData = computed(() => ({
  labels: props.data.map((d) => d.label),
  datasets: [
    {
      label: props.title,
      data: props.data.map((d) => d.count),
      pointRadius: props.pointRadius || 0,
      borderColor: 'red',
      backgroundColor: 'white',
      hoverRadius: 5
    }
  ]
}))

const chartOptions = {
  responsive: true
}
</script>
