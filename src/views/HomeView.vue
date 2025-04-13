<script setup lang="ts">
import { apiHealth, fetchLatestReviews, fetchStats, type Course, type Stats} from '@/services/api';
import { onMounted, ref } from 'vue';
import slideData from '@/assets/slides.json'
import slideStyle from '@/assets/slide.module.css'

const showSlides = ref(false);

const latestReviews = ref<Course[]>([     
  {
    CourseName: "-",
    CourseNumber: "000-0000-00L",
    Date: "0000-00-00T00:00:00Z",
  }
]);
const stats = ref<Stats>();

const slides = ref([
  {
    "title": "CourseReview Unavailable",
    "description": "If this message persists, please contact us so we can fix it.",
    "text": "Looks like our API took a coffee break ☕. Try again soon!",
    "image": "",
    "color": "red-darken-4",
    "links": [
      {
        "link-text": "Contact Us",
        "link": "mailto:contact@coursereview.ch",
        "icon": "mdi-email-fast-outline"
      }
    ]
  }
])

onMounted(async () => {
  try {
    await apiHealth();
    slides.value = slideData;
  } catch (error) {
    return;
  } finally {
    showSlides.value = true;
  }

  const response = await fetchLatestReviews();
  latestReviews.value = response.data;
  if (latestReviews.value === null) {
    latestReviews.value = [];
  }

  const statsResponse = await fetchStats();
  stats.value = statsResponse.data;
});
</script>

<template>
  <div v-if="showSlides">
    <!-- <v-carousel cycle hide-delimiter-background interval="10000" show-arrows="hover" class="mt-10"> -->
    <v-carousel hide-delimiter-background show-arrows="hover" class="mt-10">
      <v-carousel-item v-for="(slide, index) in slides" :key="index" >
        <v-sheet :color="slide.color" height="100%" class="pa-10" :class="slideStyle.slide">
          <h1>{{ slide.title }}</h1>
          <h3>{{ slide.description }}</h3>
          <p>{{ slide.text }}</p>
          
          <div class="slide_buttons">
            <v-btn v-for="link in slide.links" :key="link['link-text']" :prepend-icon="link.icon" :href="link.link" target="_blank" color="white">{{ link['link-text'] }}</v-btn>
          </div>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  
    <div class="d-flex justify-start mt-4">
      <v-card class="" max-width="400" elevation="2">
        <v-card-title>Latest Reviews</v-card-title>
        <v-list density="compact">
          <v-list-item v-for="course in latestReviews.slice(0, 10)" :key="course.CourseNumber" :to="'/course/' + course.CourseNumber">{{ course.CourseName }}</v-list-item>
        </v-list>
      </v-card>
  
      <v-card class="h-25 ml-4" max-width="400" elevation="2">
        <v-card-title>Stats</v-card-title>
  
        <div class="d-flex justify-center mb-4">
          <v-card color="grey lighten-4 mx-2">
            <v-card-title>{{ stats?.TotalReviews ?? "NaN" }}</v-card-title>
            <v-card-subtitle>Reviews</v-card-subtitle>
          </v-card>
          <v-card color="grey lighten-4 mx-2">
            <v-card-title>{{ stats?.TotalCourses ?? "NaN" }}</v-card-title>
            <v-card-subtitle>Courses with reviews</v-card-subtitle>
          </v-card>
        </div>
      </v-card>
    </div>
  </div>
</template>
