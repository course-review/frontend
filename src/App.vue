<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useTheme } from 'vuetify'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const theme = useTheme()
const snackbar = ref(false)
const $router = useRouter()

const courses = [
  { label: '000-0000-00L', path: '000-0000-00L' },
  { label: '000-0000-01L', path: '000-0000-01L' },
  { label: '[NR] ja hallo erst mal', path: '000-0000-02L' }
]

function navigateToPage (path: string) {
  if (path) {
    $router.push("/course/" + path)
  }
}

function toggleTheme () {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  localStorage.setItem('theme', theme.global.name.value)
}

function loadStoredTheme () {
  const storedTheme = localStorage.getItem('theme')
  if (storedTheme) {
    theme.global.name.value = storedTheme
  }
}

function loadSnackbarState () {
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
    <v-app-bar :elevation="2">
      <v-app-bar-title>
        <router-link to="/" exact class="unstyled-link" >CourseReview</router-link>
      </v-app-bar-title>
      <template v-slot:append>
        <v-autocomplete variant="underlined" label="Course Search" width="264px" append-inner-icon="mdi-magnify" density="comfortable" menu-icon="" auto-select-first :items="courses" item-title="label" item-value="path" @update:modelValue="navigateToPage" />

        <v-tooltip location="bottom" text="Add a Review">
          <template v-slot:activator="{ props }">
            <v-btn variant="text" icon="mdi-invoice-text-plus-outline" v-bind="props" />
          </template>
        </v-tooltip>

        <v-tooltip location="bottom" text="Your Reviews">
          <template v-slot:activator="{ props }">
            <v-btn variant="text" icon="mdi-account" to="/user" v-bind="props" />
          </template>
        </v-tooltip>

        <v-btn @click="toggleTheme" :icon="theme.global.current.value.dark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"></v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <v-snackbar v-model="snackbar" timeout="5000" timer location="top right" max-width="410px">
        CourseReview is neither supported by ETH nor by VSETH, its a private initiative run by Students.
      </v-snackbar>

      <RouterView />
    </v-main>

    <v-footer :elevation="2" :app="true" class="d-flex flex-column text-center">
      <div>
        <v-btn variant="text" icon="mdi-github" href="https://github.com/orgs/course-review/" target="_blank" density="comfortable" />
        <v-btn variant="text" icon="mdi-email-fast-outline" density="comfortable" />
        <v-btn variant="text" icon="mdi-information-outline" to="/about" density="comfortable" />
      </div>

      <v-divider></v-divider>

      <div>{{ new Date().getFullYear() }} — <strong>CourseReview</strong></div>
    </v-footer>
  </v-app>
</template>

<style scoped>
.unstyled-link {
  color: inherit;
  text-decoration: none;
}
</style>
