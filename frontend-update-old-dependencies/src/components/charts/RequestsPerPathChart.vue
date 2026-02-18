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
}>()

// Remove Entries with less than 5 views
const filteredData = props.data.filter((d) => d.count >= 100)

// Sort data by count descending
const sortedData = [...filteredData].sort((a, b) => b.count - a.count)

const chartData = {
  labels: sortedData.map((d) => d.label),
  datasets: [
    {
      label: 'Views per Path',
      data: sortedData.map((d) => d.count),
      backgroundColor: 'orange'
    }
  ]
}

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  indexAxis: 'y',
  scales: {
    x: {
      beginAtZero: true
    }
  }
}
</script>
