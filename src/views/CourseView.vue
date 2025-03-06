<script setup lang="ts">
import TextReview from '@/components/TextReview.vue'
import StarRating from '@/components/StarRating.vue'
import type { RatingDetails } from '@/components/Rating.types'  
import { onMounted, ref } from 'vue';
import { fetchReviews, type Review, type Rating2, fetchRatings, starRatings} from '@/services/api';
import { fetchName } from '@/services/api';
// const loremipsum: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque mi odio, maximus et felis at, cursus congue velit. Integer vitae viverra ligula. Phasellus in lectus velit. In ut interdum elit. Integer ultrices scelerisque turpis. Nullam eros nulla, ultricies tincidunt arcu et, imperdiet rhoncus nisl. Duis in lobortis quam. In in dui tortor. Mauris magna erat, cursus a pellentesque vel, suscipit ac felis. Phasellus suscipit mi vel leo posuere, ac ullamcorper nisi sodales. \nMorbi sed metus eu odio suscipit bibendum. Suspendisse semper ornare lorem eget mollis. Fusce molestie efficitur condimentum. Duis nec imperdiet magna. Vestibulum at justo id neque pulvinar elementum auctor id sapien. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse potenti. \n\n\nPellentesque sollicitudin eu quam id placerat. Suspendisse viverra scelerisque ipsum in euismod. Curabitur convallis porttitor ante vel tempus. Sed a sem sed mi sollicitudin egestas. Fusce eget turpis eleifend, pretium elit sit amet, egestas lectus. Nulla in leo maximus, bibendum est nec, bibendum neque. Suspendisse vel lectus condimentum, luctus odio non, hendrerit erat. Nunc pulvinar, ex id vehicula vulputate, justo magna faucibus neque, vitae sollicitudin neque nulla et massa. Ut quis libero porta, egestas ipsum quis, tincidunt nibh. Duis feugiat leo eu lorem facilisis bibendum. Aliquam erat volutpat. Sed sit amet auctor purus. Curabitur non leo lectus. Suspendisse quis lorem id arcu viverra consequat eget efficitur enim. Duis sed nibh sed tortor vulputate eleifend."

const reviews = ref<Review[]>([]);
const ratings = ref<Rating2[]>([]);

import { useRoute } from 'vue-router';

const route = useRoute();
const courseNumber = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
const courseName = ref<string>('');
const finishedLoadingRatings = ref(false);
const finishedLoadingReviews = ref(false);

onMounted(async () => {
  const response = await fetchReviews(courseNumber);
  reviews.value = response.data;
  finishedLoadingReviews.value = true;
});


onMounted(async () => {
  const response = await fetchName(courseNumber);
  courseName.value = response.data;
});

onMounted(async () => {
  const response = await fetchRatings(courseNumber);
  ratings.value = response.data;
  
  const ratingKeys = ['Difficulty', 'Engaging', 'Effort', 'Recommended', 'Resources'];

  for (const rating of ratings.value) {
    ratingKeys.forEach(key => {
      const tempRating = starRatings[key];
      if (tempRating.details !== null && rating[key] !== undefined) {
        insertIntoStarRatings(tempRating.details, rating[key]);
      }
    });
  }

  //calculate the average rating
  for (const key in starRatings) {
    const rating = starRatings[key];
    const details = rating.details;
    if (details !== null) {
      const totalRatings = details.oneStarRatings + details.twoStarRatings + details.threeStarRatings + details.fourStarRatings + details.fiveStarRatings;
      const averageRating = (details.oneStarRatings + 2 * details.twoStarRatings + 3 * details.threeStarRatings + 4 * details.fourStarRatings + 5 * details.fiveStarRatings) / totalRatings;
      rating.rating = Math.round(averageRating * 100) / 100;
    }
  }
  console.log(starRatings);
  finishedLoadingRatings.value = true
});

function insertIntoStarRatings(ratingDetail: RatingDetails, stars: number) {
  switch (stars) {
    case 1:
      ratingDetail.oneStarRatings += 1;
      break;
    case 2:
      ratingDetail.twoStarRatings += 1;
      break;
    case 3:
      ratingDetail.threeStarRatings += 1;
      break;
    case 4:
      ratingDetail.fourStarRatings += 1;
      break;
    case 5:
      ratingDetail.fiveStarRatings += 1;
      break;
  }
}
</script>

<template>
  
  <v-main>
      <h1>{{ $route.params.id }}: {{ courseName }}</h1>
      
      <v-divider></v-divider>
      
      <template v-if="finishedLoadingRatings">
        <StarRating :ratings="starRatings"/>
      </template>
      
      <!-- for each review in reviews do TextReview -->
      <div v-for="(review, index) in reviews" :key="'Review' + index">
        <TextReview :review="review.Review" :semester="review.Semester" />     
      </div>
  </v-main>
</template>
