<script setup lang="ts">
import { fetchLatestReviews, type Course} from '@/services/api';
import { onMounted, ref } from 'vue';

const latestReviews = ref<Course[]>([]);

onMounted(async () => {
  const response = await fetchLatestReviews();
  latestReviews.value = response.data;
});
</script>

<template>
  <main>
    <h1>Home</h1>
    <v-row>
      <v-col cols="12" md="4" v-for="course in latestReviews" :key="course.CourseNumber">
        <v-card>
          <a :href="'/course/' + course.CourseNumber">{{ course.CourseName }}</a>
        </v-card>
      </v-col>
    </v-row>
  </main>
</template>
