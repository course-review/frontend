<template>
  <div :style="containerStyle">
    <Radar :data="chartData" :options="chartOptions" :key="chartKey" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Radar } from 'vue-chartjs'
import { useTheme, useDisplay } from 'vuetify'

import {
  Chart as ChartJS,
  type ChartOptions,
  Title,
  Tooltip,
  Legend,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, RadarController, RadialLinearScale, PointElement, LineElement)

const theme = useTheme()
const display = useDisplay()

const props = defineProps<{
  courses: { courseNumber: string; courseName: string; ratings: Record<string, number | null> }[]
  categories: { key: string; label: string }[]
}>()

const labels = computed(() => props.categories.map(cat => display.xs.value ? cat.key : cat.label))

const datasets = computed(() => props.courses.map((course, index) => {
  const fullLabel = `${course.courseNumber}: ${course.courseName}`
  const truncatedLabel = fullLabel.length > 50 ? fullLabel.substring(0, 47) + '...' : fullLabel
  return {
    label: truncatedLabel,
    data: props.categories.map(cat => course.ratings[cat.key] ?? null),
    backgroundColor: `hsl(${index * 360 / props.courses.length}, 50%, 50%, 1)`,
    borderColor: `hsl(${index * 360 / props.courses.length}, 50%, 50%)`,
    borderWidth: 2,
  }
}))

const chartData = computed(() => ({
  labels: labels.value,
  datasets: datasets.value
}))

const containerStyle = computed(() => ({
  height: display.xs.value ? '350px' : '400px'
}))

const chartKey = computed(() => JSON.stringify(chartData.value))

const chartOptions = computed<ChartOptions<'radar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 100,
    easing: 'easeOutQuart'
  },
  layout: {
    padding: display.xs.value ? 10 : 0
  },
  plugins: {
    title: {
      display: false
    },
    legend: {
      position: display.xs.value ? 'bottom' : 'right',
      align: display.xs.value ? 'start' : 'center',
      labels: {
        font: {
          size: display.xs.value ? 12 : 14
        },
        color: theme.global.current.value.colors['on-surface']
      }
    }
  },
  scales: {
    r: {
      beginAtZero: false,
      min: 1,
      max: 5,
      ticks: {
        stepSize: 1,
        font: {
          size: display.xs.value ? 12 : 14
        },
        backdropColor: 'transparent',
        color: theme.global.current.value.colors['on-surface']
      },
      grid: {
        color: theme.global.current.value.dark ? '#555555' : '#dddddd'
      },
      angleLines: {
        color: theme.global.current.value.dark ? '#555555' : '#dddddd'
      },
      pointLabels: {
        display: true,
        font: {
          size: display.xs.value ? 12 : 14
        },
        color: theme.global.current.value.colors['on-surface']
      }
    }
  }
}))
</script>