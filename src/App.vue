<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useTheme } from 'vuetify'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchCoursesData } from '@/services/api'
import fuzzysort from 'fuzzysort'

const theme = useTheme()
const snackbar = ref(false)
const $router = useRouter()
const courses = ref<{ label: string; path: string }[]>([])
const route = ref($router.currentRoute)
const addReviewPath = computed(() => {
  if (route.value.name === 'course' && route.value.params.id) {
    return `/add?id=${route.value.params.id}`
  }
  return '/add' // Default path
})
const selectedCourse = ref<string | null>(null)
const searchQuery = ref('')

fetchCoursesData().then((response) => {
  const data = response.data

  if (!Array.isArray(data)) {
    return
  }

  const fetchedCourses = response.data.map((course) => ({
    label: `${course.CourseNumber} ${course.CourseName}`,
    path: course.CourseNumber
  }))
  courses.value.push(...fetchedCourses)
})

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
    selectedCourse.value = null // Reset the autocomplete search
    searchQuery.value = '' // Reset the search query
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
            <div v-if="$vuetify.display.smAndUp">
              <router-link
                to="/"
                exact
                class="unstyled-link"
                style="font-family: 'Roboto', sans-serif; font-style: italic; font-size: 1.5em"
                >CourseReview</router-link
              >
            </div>
            <div v-else class="ml-1">
              <router-link
                to="/"
                exact
                class="unstyled-link"
                style="font-family: 'Roboto', sans-serif; font-style: italic; font-size: 1.5em"
                >CR</router-link
              >
            </div>
          </v-app-bar-title>
          <div class="d-flex align-center ga-2">
            <!-- maybe dont have the search just that specific pixel value? -->
            <v-autocomplete
              variant="underlined"
              label="Course Search"
              width="264px"
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
              :menu-props="{ width: '600px'}"
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

            <div v-if="$vuetify.display.smAndUp">
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

              <v-tooltip location="bottom" text="Your Reviews">
                <template v-slot:activator="{ props }">
                  <v-btn variant="text" icon="mdi-account" to="/user" v-bind="props" />
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
</style>
