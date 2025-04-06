<script setup lang="ts">
import { fetchLatestReviews, fetchStats, type Course, type Stats} from '@/services/api';
import { onMounted, ref } from 'vue';
import slideData from '@/assets/slides.json'

const latestReviews = ref<Course[]>([]);
const stats = ref<Stats>();

const slides = ref([
  {
    "title": "Dummy",
    "description": "Something broke",
    "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "image": "",
    "color": "pink accent-1",
    "links": [
      {
        "link-text": "Google",
        "link": "https://www.google.com"
      }
    ]
  }
])

onMounted(async () => {
  const response = await fetchLatestReviews();
  latestReviews.value = response.data;
  if (latestReviews.value === null) {
    latestReviews.value = [];
  }

  const statsResponse = await fetchStats();
  stats.value = statsResponse.data;

  slides.value = slideData
});
</script>

<template>
  <main>
    <v-carousel cycle hide-delimiter-background show-arrows="hover">
      <v-carousel-item v-for="(slide, index) in slides" :key="index" >
        <v-sheet :color="slide.color" height="100vh" width="100vw" >
          <v-card-title>{{ slide.title }}</v-card-title>
          <v-card-subtitle>{{ slide.description }}</v-card-subtitle>
          <v-card-text>{{ slide.text }}</v-card-text>

          <div v-if="slide.links.length >= 0">
            <v-btn v-for="link in slide.links" :key="link['link-text']" prepend-icon="mdi-link-variant" :href="link.link" target="_blank" color="white">{{ link['link-text'] }}</v-btn>
          </div>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>

    <div class="d-flex justify-start">
      <v-card class="ma-2" max-width="400" elevation="2" style="margin-top: 20px;">
        <v-card-title>Latest Reviews</v-card-title>
        <v-list density="compact">
          <v-list-item v-for="course in latestReviews.slice(0, 10)" :key="course.CourseNumber" :to="'/course/' + course.CourseNumber">{{ course.CourseName }}</v-list-item>
        </v-list>
      </v-card>

      <v-card class="h-50 ma-2" max-width="400" elevation="2" style="margin-top: 20px;">
        <v-card-title>Stats</v-card-title>

        <div class="d-flex justify-center mb-4">
          <v-card color="grey lighten-4 mx-2">
            <v-card-title>{{ stats?.TotalReviews }}</v-card-title>
            <v-card-subtitle>Reviews</v-card-subtitle>
          </v-card>
          <v-card color="grey lighten-4 mx-2">
            <v-card-title>{{ stats?.TotalCourses }}</v-card-title>
            <v-card-subtitle>Courses with reviews</v-card-subtitle>
          </v-card>
        </div>
      </v-card>
    </div>
  </main>
</template>
