<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useDisplay, useTheme } from 'vuetify'
import { ref, onMounted, computed } from 'vue'
import { fetchCoursesData } from '@/services/api'
import fuzzysort from 'fuzzysort'
import { useCourseComparisonStore } from '@/stores/courseComparison'

const theme = useTheme()
const { smAndUp, mdAndUp } = useDisplay()
const snackbar = ref(false)
const $router = useRouter()
const route = useRoute()
const courses = ref<{ label: string; path: string }[]>([])
const searchMenuProps = { width: '600px' }
const addReviewPath = computed(() => {
  if (route.name === 'course' && route.params.id) {
    return `/add?id=${route.params.id}`
  }
  return '/add'
})
const brandLabel = computed(() => (smAndUp.value ? 'CourseReview' : 'CR'))
const selectedCourse = ref<string | null>(null)
const searchQuery = ref('')

const comparisonStore = useCourseComparisonStore()

async function loadCourses() {
  const response = await fetchCoursesData()
  const data = response.data
  if (!Array.isArray(data)) {
    return
  }

  courses.value = data.map((course) => ({
    label: `${course.CourseNumber} ${course.CourseName}`,
    path: course.CourseNumber
  }))
}

const filteredCourses = computed(() => {
  if (!searchQuery.value) {
    return courses.value.map(course => ({
      ...course,
      highlighted: course.label
    }))
  }
  const results = fuzzysort.go(searchQuery.value, courses.value, {
    key: 'label',
  })

  return results.map((r) => ({
    ...r.obj,
    highlighted: r.highlight('<mark>', '</mark>') || r.obj.label
  }))
})

function navigateToPage(path: string) {
  if (path) {
    selectedCourse.value = null
    searchQuery.value = ''
    $router.push('/course/' + path)
  }
}

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  localStorage.setItem('theme', theme.global.name.value)
}

function loadStoredTheme() {
  const storedTheme = localStorage.getItem('theme')
  if (storedTheme) {
    theme.global.name.value = storedTheme
  }
}

function loadSnackbarState() {
  const storedSnackbar = sessionStorage.getItem('snackbar')
  if (!storedSnackbar) {
    snackbar.value = true
    sessionStorage.setItem('snackbar', 'true')
  }
}

onMounted(() => {
  loadCourses()
  loadStoredTheme()
  loadSnackbarState()
})
</script>

<template>
  <v-app>
    <v-container max-width="1200px" class="pa-0">
      <v-app-bar :elevation="2">
        <v-container
          max-width="1200px"
          class="d-flex align-center justify-space-between pa-0"
          fluid
        >
          <v-app-bar-title class="pl-0">
            <router-link to="/" exact class="unstyled-link brand-link">
              {{ brandLabel }}
            </router-link>
          </v-app-bar-title>
          <div class="d-flex align-center ga-2">
            <v-autocomplete
              class="search-autocomplete"
              variant="underlined"
              label="Course Search"
              append-inner-icon="mdi-magnify"
              density="comfortable"
              menu-icon=""
              auto-select-first
              :items="filteredCourses"
              item-title="label"
              item-value="path"
              :model-value="selectedCourse"
              @update:modelValue="navigateToPage"
              v-model:search="searchQuery"
              :custom-filter="() => true"
              :menu-props="searchMenuProps"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :title="undefined">
                  <v-list-item-title>
                    <span v-html="item.raw.highlighted"></span>
                  </v-list-item-title>
                </v-list-item>
              </template>
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-title> No course found. </v-list-item-title>
                </v-list-item>
              </template>
            </v-autocomplete>

            <div v-if="mdAndUp">
              <v-tooltip location="bottom" text="Add a Review">
                <template v-slot:activator="{ props }">
                  <v-btn
                    variant="text"
                    icon="mdi-invoice-text-plus-outline"
                    :to="addReviewPath"
                    v-bind="props"
                  />
                </template>
              </v-tooltip>

              <!-- <v-tooltip location="bottom" text="Your Reviews">
                <template v-slot:activator="{ props }">
                  <v-btn variant="text" icon="mdi-account" to="/user" v-bind="props" />
                </template>
              </v-tooltip> -->

              <v-tooltip location="bottom" text="Compare Courses">
                <template v-slot:activator="{ props }">
                  <v-badge v-if="comparisonStore.selectedCoursesCount > 0" :content="comparisonStore.selectedCoursesCount" color="primary" class="nav-icon-badge" offset-x="10" offset-y="10">
                    <v-btn
                      variant="text"
                      icon="mdi-chart-bar"
                      to="/compare"
                      v-bind="props"
                    />
                  </v-badge>
                  <v-btn v-else
                    variant="text"
                    icon="mdi-chart-bar"
                    to="/compare"
                    v-bind="props"
                  />
                </template>
              </v-tooltip>

              <v-btn
                @click="toggleTheme"
                :icon="
                  theme.global.current.value.dark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'
                "
              ></v-btn>
            </div>
            <div v-else>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-menu" v-bind="props" />
                </template>
                <v-list>
                  <!-- <v-list-item to="/" prepend-icon="mdi-home" title="Home" />  todo: not sure if having a home button can be helpful in there too  -->
                  <v-list-item
                    :to="addReviewPath"
                    prepend-icon="mdi-invoice-text-plus-outline"
                    title="Add a Review"
                  />
                  <v-list-item to="/user" prepend-icon="mdi-account" title="Your Reviews" />
                  
                  <v-list-item to="/compare">
                    <template v-slot:prepend>
                      <v-badge v-if="comparisonStore.selectedCoursesCount > 0" :content="comparisonStore.selectedCoursesCount" color="primary" class="nav-icon-badge">
                        <v-icon>mdi-chart-bar</v-icon>
                      </v-badge>
                      <v-icon v-else>mdi-chart-bar</v-icon>
                    </template>
                    <v-list-item-title>Compare Courses</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    @click="toggleTheme"
                    :title="theme.global.current.value.dark ? 'Light Mode' : 'Dark Mode'"
                    :prepend-icon="
                      theme.global.current.value.dark
                        ? 'mdi-white-balance-sunny'
                        : 'mdi-weather-night'
                    "
                  />
                </v-list>
              </v-menu>
            </div>
          </div>
        </v-container>
      </v-app-bar>

      <v-main max-width="1024px" class="mx-auto">
        <v-snackbar v-model="snackbar" timeout="5000" timer location="top right" max-width="410px">
          CourseReview is neither supported by ETH nor by VSETH, its a private initiative run by
          Students.
        </v-snackbar>

        <router-view :key="$route.fullPath"></router-view>
      </v-main>

      <v-footer :elevation="2" :app="true" class="d-flex flex-column text-center">
        <div>
          <v-btn
            variant="text"
            icon="mdi-github"
            href="https://github.com/orgs/course-review/"
            target="_blank"
            density="comfortable"
          />
          <v-btn
            variant="text"
            icon="mdi-email-fast-outline"
            href="mailto:contact@coursereview.ch"
            density="comfortable"
          />
          <v-btn variant="text" icon="mdi-information-outline" to="/about" density="comfortable" />
          <strong>CourseReview</strong> — {{ new Date().getFullYear() }}
        </div>
      </v-footer>
    </v-container>
  </v-app>
</template>

<style scoped>
.unstyled-link {
  color: inherit;
  text-decoration: none;
}

.brand-link {
  font-family: Roboto, sans-serif;
  font-style: italic;
  font-size: 1.5em;
}

.search-autocomplete {
  width: 264px;
}

.nav-icon-badge {
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
}
</style>
