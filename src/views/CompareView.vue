<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useCourseComparisonStore } from '@/stores/courseComparison'
import { fetchRatings, type Rating2 } from '@/services/api'
import { ratingCategories } from '@/constants/ratingCategories'

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

function getAverageRating(courseNumber: string, category: string): string {
  const ratings = courseRatings.value[courseNumber]
  if (!ratings || ratings.length === 0) return 'N/A'

  const categoryRatings = ratings
    .map(r => r[category])
    .filter(r => r !== undefined && r !== null)

  if (categoryRatings.length === 0) return 'N/A'

  const sum = categoryRatings.reduce((acc, rating) => acc + rating, 0)
  return (Math.round((sum / categoryRatings.length) * 10) / 10).toString()
}


function removeCourse(courseNumber: string) {
  comparisonStore.removeCourse(courseNumber)
}

async function loadCourseRatings() {
  loading.value = true
  courseRatings.value = {}

  for (const course of comparisonStore.selectedCourses) {
    try {
      const response = await fetchRatings(course.courseNumber)
      if (response.data) {
        courseRatings.value[course.courseNumber] = response.data
      }
    } catch (error) {
      console.error(`Failed to load ratings for course ${course.courseNumber}:`, error)
    }
  }

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
        <v-card-title>Rating Comparison</v-card-title>
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
          </v-data-table>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
</style>
