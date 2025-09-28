<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useCourseComparisonStore } from '@/stores/courseComparison'
import { fetchRatings, type Rating2 } from '@/services/api'
import { ratingCategories } from '@/constants/ratingCategories'
import RadarChart from '@/components/charts/RadarChart.vue'

const comparisonStore = useCourseComparisonStore()

const courseRatings = ref<Record<string, Rating2[]>>({})
const loading = ref(false)

const ratingCategoriesArray = Object.entries(ratingCategories).map(([key, label]) => ({ key, label }))

const tableHeaders = computed(() => [
  { title: 'Course', key: 'courseNumber', sortable: true },
  { title: '#Reviews', key: 'reviewCount', sortable: true },
  ...ratingCategoriesArray.map(cat => ({ title: cat.label, key: cat.key, sortable: true }))
])

const tableItems = computed(() => {
  return comparisonStore.selectedCourses.map(course => {
    const item: any = {
      courseNumber: course.courseNumber,
      courseName: course.courseName,
      reviewCount: courseRatings.value[course.courseNumber]?.length || 0
    }
    ratingCategoriesArray.forEach(cat => {
      item[cat.key] = getAverageRating(course.courseNumber, cat.key)
    })
    return item
  })
})

const radarCourses = computed(() => {
  return tableItems.value.map(item => ({
    courseNumber: item.courseNumber,
    courseName: item.courseName,
    ratings: Object.fromEntries(ratingCategoriesArray.map(cat => [cat.key, item[cat.key]]))
  }))
})

function getAverageRating(courseNumber: string, category: string): number | null {
  const ratings = courseRatings.value[courseNumber]
  if (!ratings || ratings.length === 0) return null

  const categoryRatings = ratings
    .map(r => r[category])
    .filter(r => r !== undefined && r !== null)

  if (categoryRatings.length === 0) return null

  let sum = 0
  for (const rating of categoryRatings) {
    sum += rating
  }
  return Math.round((sum / categoryRatings.length) * 10) / 10
}

function getRatingDistribution(courseNumber: string, category: string): number[] {
  const ratings = courseRatings.value[courseNumber]
  if (!ratings) return [0, 0, 0, 0, 0]

  const counts = [0, 0, 0, 0, 0]
  ratings.forEach(r => {
    const val = r[category as keyof typeof r]
    if (typeof val === 'number' && val >= 1 && val <= 5) {
      counts[val - 1]++
    }
  })
  return counts.reverse() // start w/ 5 start counts
}

function removeCourse(courseNumber: string) {
  comparisonStore.removeCourse(courseNumber)
}

async function loadCourseRatings() {
  loading.value = true
  courseRatings.value = {}

  const promises = comparisonStore.selectedCourses.map(async (course) => {
    try {
      const response = await fetchRatings(course.courseNumber)
      if (response.data) {
        courseRatings.value[course.courseNumber] = response.data
      }
    } catch (error) {
      console.error(`Failed to load ratings for course ${course.courseNumber}:`, error)
    }
  })

  await Promise.all(promises)

  loading.value = false
}

onMounted(() => {
  if (comparisonStore.selectedCourses.length > 0) {
    loadCourseRatings()
  }
})

watch(() => comparisonStore.selectedCourses, () => {
  if (comparisonStore.selectedCourses.length > 0) {
    loadCourseRatings()
  }
}, { deep: true })
</script>

<template>
  <div class="pa-4">
    <div class="mb-4">
      <h1>Course Comparison</h1>
    </div>

    <!-- No courses selected -->
    <div v-if="comparisonStore.selectedCourses.length === 0" class="text-center pa-8">
      <v-icon size="64" color="grey" class="mb-4">mdi-chart-bar</v-icon>
      <h2 class="mb-2">No courses selected for comparison</h2>
      <p class="text-grey">Visit course pages and click the compare button to add courses.</p>
    </div>

    <!-- Comparison table -->
    <div v-else>
      <v-card elevation="2" class="mb-4">
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Selected Courses ({{ comparisonStore.selectedCourses.length }}/{{ comparisonStore.MAX_COURSES }})</span>
          <v-btn 
            variant="plain"
            @click="comparisonStore.clearSelection()"
          >
            Clear All
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-chip
            v-for="course in comparisonStore.selectedCourses"
            :key="course.courseNumber"
            variant="tonal"
            closable
            @click:close="removeCourse(course.courseNumber)"
            class="ma-1"
          >
            {{ course.courseNumber }}: {{ course.courseName }}
          </v-chip>
        </v-card-text>
      </v-card>

      <div v-if="loading" class="text-center pa-8">
        <v-progress-circular indeterminate size="64" />
        <p class="mt-4">Loading course ratings...</p>
      </div>

      <v-card v-else elevation="2">
        <v-card-title>
          Rating Table
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="tableHeaders"
            :items="tableItems"
            :items-per-page="-1"
            hide-default-footer
            density="comfortable"
            class="elevation-0"
          >
            <template v-slot:item.courseNumber="{ item }">
              <div>
                <div class="font-weight-bold">{{ item.courseNumber }}</div>
                <div class="text-caption text-medium-emphasis">{{ item.courseName }}</div>
              </div>
            </template>

            <template v-for="cat in ratingCategoriesArray" :key="cat.key" v-slot:[`item.${cat.key}`]="{ item }">
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">
                  <span v-bind="props">{{ item[cat.key] ?? 'N/A' }}</span>
                </template>
                <div class="pa-2" style="min-width: 200px;">
                  <div v-for="(count, index) in getRatingDistribution(item.courseNumber, cat.key)" :key="index" class="d-flex align-center mb-1">
                    <span class="mr-2 text-caption font-weight-bold">{{ 5 - index }}</span>
                    <v-icon small class="mr-1" color="amber">mdi-star</v-icon>
                    <v-progress-linear
                      :model-value="count"
                      :max="Math.max(...getRatingDistribution(item.courseNumber, cat.key)) || 1"
                      height="10"
                      color="amber"
                      class="flex-grow-1"
                    />
                    <span class="ml-2 text-caption font-weight-bold">{{ count }}</span>
                  </div>
                </div>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>

      <v-card elevation="2" class="mt-4">
        <v-card-title>Rating Profiles</v-card-title>
        <v-card-text class="pa-2">
          <RadarChart v-if="radarCourses.length > 0" :courses="radarCourses" :categories="ratingCategoriesArray" />
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
</style>
