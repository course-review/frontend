<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useTheme } from 'vuetify'
import { ref, onMounted } from 'vue'

const theme = useTheme()

function toggleTheme () {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  localStorage.setItem('theme', theme.global.name.value)
}

const snackbar = ref(true)

function loadStoredTheme () {
  const storedTheme = localStorage.getItem('theme')
  if (storedTheme) {
    theme.global.name.value = storedTheme
  }
}

onMounted(() => {
  loadStoredTheme()
})
</script>

<template>
  <v-app>
    <v-app-bar :elevation="2">
      <v-app-bar-title>CourseReview</v-app-bar-title>
      <template v-slot:append>
        <v-autocomplete variant="underlined" label="Course Search" width="264px" append-inner-icon="mdi-magnify" density="comfortable" menu-icon="" auto-select-first></v-autocomplete>
        <v-btn variant="text" icon="mdi-invoice-text-plus-outline"></v-btn>
        <v-btn variant="text" icon="mdi-account" to="/user" />
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
        <v-btn variant="text" icon="mdi-github" href="https://github.com/" target="_blank" density="comfortable" />
        <v-btn variant="text" icon="mdi-email-fast-outline" density="comfortable" />
        <v-btn variant="text" icon="mdi-information-outline" to="/about" density="comfortable" />
      </div>

      <v-divider></v-divider>

      <div>{{ new Date().getFullYear() }} — <strong>CourseReview</strong></div>
    </v-footer>
  </v-app>
</template>

<style scoped>
</style>
