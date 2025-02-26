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
    <h1>Welcome!</h1>
    Here you can add and read reviews about your courses at ETHZ.<br>
    Here are also the results of the Teaching Evaluations you get every semester for exams and courses: <a href="https://ergebnisseub.sp.ethz.ch/" target="_blank">https://ergebnisseub.sp.ethz.ch/</a><br>
    
    We also made a Browser Extensions for VVZ:<br>
    <a href="https://chrome.google.com/webstore/detail/vvz-coursereview/pjgjdmehkhpdhlpdgfbbpgekfajlhhgn" target="_blank">Chrome</a><br>
    <a href="https://addons.mozilla.org/en-GB/firefox/addon/vvz-coursereview/" target="_blank">Firefox</a><br>
    Makes it nicer to use VVZ and lets you quickly look at the reviews and ratings of a course inside VVZ.<br>

    <h2>Latest Reviews</h2>
    <div v-for="course in latestReviews.slice(0, 10)" :key="course.CourseNumber">
      <v-card padding="10" class="mb-2">
        <a :href="'/course/' + course.CourseNumber">{{ course.CourseName }}</a>
      </v-card>
    </div>
  </main>
</template>
