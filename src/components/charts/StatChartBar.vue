<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'

import {
  Chart as ChartJS,
  type ChartOptions,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{
  data: { label: string; count: number }[]
  title: string
}>()

const chartData = {
  labels: props.data.map((d) => d.label),
  datasets: [
    {
      label: props.title,
      data: props.data.map((d) => d.count),
      backgroundColor: 'orange',
    }
  ]
}

const chartOptions: ChartOptions<'bar'> = {
  responsive: true
}
</script>
