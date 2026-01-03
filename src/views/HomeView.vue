<script setup lang="ts">
import { apiHealth, fetchLatestReviews, fetchStats, type Course, type Stats } from '@/services/api'
import { onMounted, ref } from 'vue'
import slideData from '@/assets/slides.json'
import slideStyle from '@/assets/slide.module.css'

const showSlides = ref(false)

const latestReviews = ref<Course[]>([
  {
    CourseName: '-',
    CourseNumber: '000-0000-00L',
    Date: '0000-00-00T00:00:00Z'
  }
])
const stats = ref<Stats>()

const slides = ref([
  {
    title: 'CourseReview Unavailable',
    subtitle: 'Looks like our API took a coffee break ☕. Try again soon!',
    text: 'If this message persists, please contact us so we can fix it.',
    image: '',
    color: 'red-darken-4',
    links: [
      {
        'link-text': 'Contact Us',
        link: 'mailto:contact@coursereview.ch',
        icon: 'mdi-email-fast-outline'
      }
    ]
  }
])

onMounted(async () => {
  try {
    await apiHealth()
    slides.value = slideData
  } catch (error) {
    return
  } finally {
    showSlides.value = true
  }

  const response = await fetchLatestReviews()
  latestReviews.value = response.data
  if (latestReviews.value === null) {
    latestReviews.value = []
  }

  const statsResponse = await fetchStats()
  stats.value = statsResponse.data
})
</script>

<template>
  <div v-if="showSlides">
    <v-carousel hide-delimiter-background show-arrows="hover" class="mt-10">
      <v-carousel-item v-for="(slide, index) in slides" :key="index">
        <v-sheet :color="slide.color" height="100%" class="pa-10" :class="slideStyle.slide">
          <v-card height="100%" class="d-flex flex-column" flat variant="text">
            <v-card-title>{{ slide.title }}</v-card-title>
            <v-card-subtitle>{{ slide.subtitle }}</v-card-subtitle>
            <v-card-text style="white-space: pre-line;">{{ slide.text }}</v-card-text>

            <v-card-actions class="px-4">
              <v-btn
                v-for="link in slide.links"
                :key="link['link-text']"
                :prepend-icon="link.icon"
                :href="link.link"
                target="_blank"
                color="white"
                >{{ link['link-text'] }}</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>

    <v-row class="mt-4" justify="start">
      <v-col cols="12" md="6" class="order-2 order-md-1">
        <v-card class="ml-2 mr-2" elevation="2">
          <v-card-title>Latest Reviews</v-card-title>
          <v-list density="compact">
            <v-list-item
              v-for="course in latestReviews.slice(0, 10)"
              :key="course.CourseNumber"
              :to="'/course/' + course.CourseNumber"
              >{{ course.CourseName }}</v-list-item
            >
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" class="order-1 order-md-2">
        <v-card class="ml-2 mr-2" elevation="2">
          <v-card-title>Stats</v-card-title>

          <div class="d-flex justify-center mb-4">
            <v-card color="grey lighten-4 mx-2">
              <v-card-title>{{ stats?.TotalReviews ?? 'NaN' }}</v-card-title>
              <v-card-subtitle>Reviews</v-card-subtitle>
            </v-card>
            <v-card color="grey lighten-4 mx-2">
              <v-card-title>{{ stats?.TotalCourses ?? 'NaN' }}</v-card-title>
              <v-card-subtitle>Courses with reviews</v-card-subtitle>
            </v-card>
          </div>
        </v-card>
        <v-card class="ma-2" elevation="2">
          <v-card-title>New Homepage!</v-card-title>
          <v-card-text>
            Welcome to our new CourseReview homepage! <br />
            We moved away from <a href="https://n.ethz.ch/~lteufelbe/coursereview">https://n.ethz.ch/~lteufelbe/coursereview</a> to <a href="https://coursereview.ch">https://coursereview.ch</a> <br />
            If you believe you can improve the website or have any suggestions, please reach out to us or directly make a pull request: <a href="https://github.com/course-review/">https://github.com/course-review/</a><br />
            If you have any questions check out our <a href="https://coursereview.ch/about">about page</a>.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
