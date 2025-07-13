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
  data: { path: string; count: number }[]
  title: string
}>()

const chartData = {
  labels: props.data.map((d) => d.path),
  datasets: [
    {
      label: props.title,
      data: props.data.map((d) => d.count),
      borderColor: 'blue',
      backgroundColor: 'lightblue'
    }
  ]
}

const chartOptions = {
  responsive: true
}
</script>
