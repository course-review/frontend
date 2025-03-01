<script setup lang="ts">
import { fetchLatestReviews, fetchStats, type Course, type Stats} from '@/services/api';
import { onMounted, ref } from 'vue';

const latestReviews = ref<Course[]>([]);
const stats = ref<Stats>();

onMounted(async () => {
  const response = await fetchLatestReviews();
  latestReviews.value = response.data;
});

onMounted(async () => {
  const response = await fetchStats();
  stats.value = response.data;
});
</script>

<template>
  <main>
    <h1>Welcome!</h1>
    Here you can add and read reviews about your courses at ETHZ.<br>
    We have currently have <b>{{ stats?.TotalCourses }}</b> courses reviewed with <b>{{ stats?.TotalReviews }}</b> reviews.<br>
    <br>    
    Here are also the results of the Teaching Evaluations you get every semester for exams and courses:<br>
    <a href="https://ergebnisseub.sp.ethz.ch/" target="_blank">https://ergebnisseub.sp.ethz.ch/</a><br>
    <br>
    We also made a Browser Extensions for VVZ:<br>
    <a href="https://chrome.google.com/webstore/detail/vvz-coursereview/pjgjdmehkhpdhlpdgfbbpgekfajlhhgn" target="_blank">Chrome</a><br>
    <a href="https://addons.mozilla.org/en-GB/firefox/addon/vvz-coursereview/" target="_blank">Firefox</a><br>
    Makes it nicer to use VVZ and lets you quickly look at the reviews and ratings of a course inside VVZ.<br>
    <br>
    <h2>Latest Reviews</h2>
    <ul>
      <li v-for="course in latestReviews.slice(0, 10)" :key="course.CourseNumber">
        <router-link :to="'/course/' + course.CourseNumber">{{ course.CourseName }}</router-link>
      </li>
    </ul>
  </main>
</template>
