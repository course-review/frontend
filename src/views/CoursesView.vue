<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import fuzzysort from 'fuzzysort'
import { fetchCourseSummaries, type CourseSummary } from '@/services/api'
import { ratingCategories } from '@/constants/ratingCategories'
import { categorizeCourse } from '@/constants/departments'
import { useCourseComparisonStore } from '@/stores/courseComparison'

const route = useRoute()
const router = useRouter()
const comparisonStore = useCourseComparisonStore()

const DEFAULT_MIN_RATINGS = 1

const summaries = ref<CourseSummary[]>([])
const finishedLoading = ref(false)

const ratingCategoriesArray = Object.entries(ratingCategories).map(([key, label]) => ({
  key,
  label
}))

// Filter/sort state, all URL-synced.
const searchQuery = ref('')
const selectedDepartments = ref<string[]>([])
const selectedTypes = ref<string[]>([])
const minRatings = ref(DEFAULT_MIN_RATINGS)
const sortBy = ref<{ key: string; order: 'asc' | 'desc' }[]>([{ key: 'Overall', order: 'desc' }])

let restoringFromUrl = false

function readFiltersFromUrl() {
  restoringFromUrl = true

  const q = route.query
  searchQuery.value = typeof q.search === 'string' ? q.search : ''
  selectedDepartments.value = typeof q.dept === 'string' && q.dept.length > 0 ? q.dept.split(',') : []
  selectedTypes.value = typeof q.type === 'string' && q.type.length > 0 ? q.type.split(',') : []

  const parsedMin = typeof q.min === 'string' ? Number(q.min) : NaN
  minRatings.value = Number.isFinite(parsedMin) && parsedMin >= 0 ? parsedMin : DEFAULT_MIN_RATINGS

  if (typeof q.sort === 'string' && q.sort.length > 0) {
    const desc = q.sort.startsWith('-')
    const key = desc ? q.sort.slice(1) : q.sort
    sortBy.value = [{ key, order: desc ? 'desc' : 'asc' }]
  } else {
    sortBy.value = [{ key: 'Overall', order: 'desc' }]
  }

  restoringFromUrl = false
}

function writeFiltersToUrl() {
  if (restoringFromUrl) return

  const query: Record<string, string> = {}
  if (searchQuery.value) query.search = searchQuery.value
  if (selectedDepartments.value.length > 0) query.dept = selectedDepartments.value.join(',')
  if (selectedTypes.value.length > 0) query.type = selectedTypes.value.join(',')
  if (minRatings.value !== DEFAULT_MIN_RATINGS) query.min = String(minRatings.value)
  if (sortBy.value.length > 0) {
    const { key, order } = sortBy.value[0]
    query.sort = order === 'desc' ? `-${key}` : key
  }

  router.replace({ query })
}

watch([searchQuery, selectedDepartments, selectedTypes, minRatings, sortBy], writeFiltersToUrl, {
  deep: true
})

interface CourseRow extends CourseSummary {
  department: string
  departmentName: string
  courseType: string
  Overall: number | null
  searchLabel: string
}

const items = computed<CourseRow[]>(() => {
  return summaries.value.map((summary) => {
    const { department, departmentName, courseType } = categorizeCourse(summary.CourseNumber)

    const categoryAverages = [
      summary.RecommendedAvg,
      summary.EngagingAvg,
      summary.DifficultyAvg,
      summary.EffortAvg,
      summary.ResourcesAvg
    ].filter((avg): avg is number => avg !== null && avg !== undefined)

    const overall =
      categoryAverages.length > 0
        ? categoryAverages.reduce((sum, avg) => sum + avg, 0) / categoryAverages.length
        : null

    return {
      ...summary,
      department,
      departmentName,
      courseType,
      Overall: overall,
      searchLabel: `${summary.CourseNumber} ${summary.CourseName}`
    }
  })
})

const departmentOptions = computed(() => {
  const present = new Map<string, string>()
  for (const item of items.value) {
    present.set(item.department, item.departmentName)
  }
  return Array.from(present.entries())
    .map(([value, name]) => ({ value, title: value === 'Other' ? 'Other' : `${value} — ${name}` }))
    .sort((a, b) => a.value.localeCompare(b.value))
})

const typeOptions = computed(() => {
  const present = new Set<string>()
  for (const item of items.value) {
    present.add(item.courseType)
  }
  return Array.from(present).sort()
})

const filteredItems = computed(() => {
  let result = items.value

  result = result.filter((item) => item.RatingCount >= minRatings.value)

  if (selectedDepartments.value.length > 0) {
    result = result.filter((item) => selectedDepartments.value.includes(item.department))
  }

  if (selectedTypes.value.length > 0) {
    result = result.filter((item) => selectedTypes.value.includes(item.courseType))
  }

  if (searchQuery.value.trim().length > 0) {
    const matches = fuzzysort.go(searchQuery.value, result, { key: 'searchLabel' })
    result = matches.map((m) => m.obj)
  }

  return result
})

const tableHeaders = computed(() => [
  { title: 'Course', key: 'CourseNumber', sortable: true },
  { title: 'Department', key: 'department', sortable: true },
  { title: 'Type', key: 'courseType', sortable: true },
  { title: 'Overall', key: 'Overall', sortable: true },
  ...ratingCategoriesArray.map((cat) => ({ title: cat.label, key: `${cat.key}Avg`, sortable: true })),
  { title: 'Ratings', key: 'RatingCount', sortable: true },
  { title: 'Reviews', key: 'ReviewCount', sortable: true },
  { title: 'Compare', key: 'compare', sortable: false }
])

function tableRowValue(item: CourseRow, categoryKey: string): number | null {
  switch (categoryKey) {
    case 'Recommended':
      return item.RecommendedAvg
    case 'Engaging':
      return item.EngagingAvg
    case 'Difficulty':
      return item.DifficultyAvg
    case 'Effort':
      return item.EffortAvg
    case 'Resources':
      return item.ResourcesAvg
    default:
      return null
  }
}

function formatAverage(value: number | null): string {
  return value === null || value === undefined ? 'N/A' : value.toFixed(2)
}

function isSelected(courseNumber: string): boolean {
  return comparisonStore.isCourseSelected(courseNumber)
}

function canToggle(courseNumber: string): boolean {
  return comparisonStore.canAddMoreCourses || isSelected(courseNumber)
}

function toggleCompare(item: CourseRow) {
  comparisonStore.toggleCourse(item.CourseNumber, item.CourseName)
}

function resetFilters() {
  searchQuery.value = ''
  selectedDepartments.value = []
  selectedTypes.value = []
  minRatings.value = DEFAULT_MIN_RATINGS
  sortBy.value = [{ key: 'Overall', order: 'desc' }]
}

onMounted(async () => {
  readFiltersFromUrl()

  try {
    const response = await fetchCourseSummaries()
    summaries.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Failed to load course summaries:', error)
    summaries.value = []
  } finally {
    finishedLoading.value = true
  }
})
</script>

<template>
  <div class="pa-4">
    <div class="mb-4">
      <h1>Browse Courses</h1>
      <p class="text-medium-emphasis">
        Every course with at least one rating or review, sortable by category.
      </p>
    </div>

    <v-card elevation="2" class="mb-4">
      <v-card-text>
        <v-row dense align="center">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="searchQuery"
              label="Search courses"
              prepend-inner-icon="mdi-magnify"
              variant="underlined"
              density="comfortable"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="selectedDepartments"
              :items="departmentOptions"
              item-title="title"
              item-value="value"
              label="Department"
              variant="underlined"
              density="comfortable"
              multiple
              chips
              closable-chips
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-select
              v-model="selectedTypes"
              :items="typeOptions"
              label="Course type"
              variant="underlined"
              density="comfortable"
              multiple
              chips
              closable-chips
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="8" md="2">
            <v-text-field
              v-model.number="minRatings"
              type="number"
              min="0"
              label="Min. ratings"
              hint="Only show courses with at least N ratings"
              persistent-hint
              variant="underlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="12" sm="4" md="1" class="d-flex justify-end">
            <v-btn variant="text" size="small" @click="resetFilters">Reset</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <template v-if="!finishedLoading">
      <v-skeleton-loader type="table" />
    </template>

    <template v-else>
      <p class="text-medium-emphasis mb-2">
        {{ filteredItems.length }} course{{ filteredItems.length === 1 ? '' : 's' }} shown
      </p>

      <div v-if="filteredItems.length === 0" class="text-center pa-8">
        <v-icon size="64" color="grey" class="mb-4">mdi-magnify-close</v-icon>
        <h2 class="mb-2">No courses match these filters</h2>
        <p class="text-grey">Try lowering the minimum ratings or clearing a filter.</p>
        <v-btn class="mt-4" variant="tonal" @click="resetFilters">Reset filters</v-btn>
      </div>

      <!-- Desktop / tablet: full data table -->
      <v-card v-else-if="$vuetify.display.mdAndUp" elevation="2">
        <v-card-text>
          <v-data-table
            :headers="tableHeaders"
            :items="filteredItems"
            v-model:sort-by="sortBy"
            :items-per-page="-1"
            hide-default-footer
            density="comfortable"
            class="elevation-0"
          >
            <template v-slot:item.CourseNumber="{ item }">
              <div>
                <div class="text-caption text-medium-emphasis">{{ item.CourseNumber }}</div>
                <a :href="`/course/${item.CourseNumber}`" class="clickable-course-list">
                  <div class="font-weight-bold course-name">{{ item.CourseName }}</div>
                </a>
              </div>
            </template>

            <template v-slot:item.department="{ item }">
              <v-chip size="small" variant="tonal">{{ item.department }}</v-chip>
            </template>

            <template v-slot:item.courseType="{ item }">
              <v-chip size="small" variant="outlined">{{ item.courseType }}</v-chip>
            </template>

            <template v-slot:item.Overall="{ item }">
              <strong>{{ formatAverage(item.Overall) }}</strong>
            </template>

            <template
              v-for="cat in ratingCategoriesArray"
              :key="cat.key"
              v-slot:[`item.${cat.key}Avg`]="{ item }"
            >
              {{ formatAverage(tableRowValue(item, cat.key)) }}
            </template>

            <template v-slot:item.compare="{ item }">
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">
                  <div v-bind="props">
                    <v-checkbox-btn
                      :model-value="isSelected(item.CourseNumber)"
                      :disabled="!canToggle(item.CourseNumber)"
                      @update:model-value="toggleCompare(item)"
                    />
                  </div>
                </template>
                {{
                  isSelected(item.CourseNumber)
                    ? 'Remove from comparison'
                    : !canToggle(item.CourseNumber)
                      ? `Max ${comparisonStore.MAX_COURSES} courses can be selected`
                      : 'Add to comparison'
                }}
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>

      <!-- Mobile: card-per-course layout -->
      <div v-else>
        <v-card
          v-for="item in filteredItems"
          :key="item.CourseNumber"
          elevation="2"
          class="mb-3"
        >
          <v-card-text>
            <div class="d-flex justify-space-between align-start">
              <div>
                <div class="text-caption text-medium-emphasis">{{ item.CourseNumber }}</div>
                <a :href="`/course/${item.CourseNumber}`" class="clickable-course-list">
                  <div class="font-weight-bold course-name">{{ item.CourseName }}</div>
                </a>
                <div class="mt-1">
                  <v-chip size="small" variant="tonal" class="mr-1">{{ item.department }}</v-chip>
                  <v-chip size="small" variant="outlined">{{ item.courseType }}</v-chip>
                </div>
              </div>
              <v-checkbox-btn
                :model-value="isSelected(item.CourseNumber)"
                :disabled="!canToggle(item.CourseNumber)"
                @update:model-value="toggleCompare(item)"
              />
            </div>

            <v-divider class="my-2" />

            <div class="d-flex justify-space-between mb-1">
              <span class="font-weight-bold">Overall</span>
              <span class="font-weight-bold">{{ formatAverage(item.Overall) }}</span>
            </div>
            <div
              v-for="cat in ratingCategoriesArray"
              :key="cat.key"
              class="d-flex justify-space-between"
            >
              <span class="text-medium-emphasis">{{ cat.label }}</span>
              <span>{{ formatAverage(tableRowValue(item, cat.key)) }}</span>
            </div>

            <v-divider class="my-2" />

            <div class="d-flex justify-space-between text-caption text-medium-emphasis">
              <span>{{ item.RatingCount }} ratings</span>
              <span>{{ item.ReviewCount }} reviews</span>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </template>
  </div>
</template>

<style scoped>
.clickable-course-list {
  text-decoration: none;
  color: inherit;
}

.clickable-course-list:hover {
  text-decoration: underline;
}
</style>
