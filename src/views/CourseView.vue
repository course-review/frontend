<script setup lang="ts">
import TextReview from '@/components/TextReview.vue'
import StarRating from '@/components/StarRating.vue'
import type { RatingDetails } from '@/components/Rating.types'  
import { onMounted, ref } from 'vue';
import { fetchReviews, type Review, type Rating2, fetchRatings, defaultStarRatings} from '@/services/api';
import { fetchName } from '@/services/api';

const reviews = ref<Review[]>([]);
const ratings = ref<Rating2[]>([]);
const starRatings = defaultStarRatings();

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
  if (ratings.value == null) {
    return;
  }
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
    <h1 class="ma-4">{{ $route.params.id }}: {{ courseName }}</h1>
    
    <v-divider class="border-opacity-25 mx-3"></v-divider>
    
    <div class="d-flex flex-column align-center justify-center my-5">
      <template v-if="finishedLoadingRatings">
        <StarRating :ratings="starRatings"/>
      </template>
    
      <!-- for each review in reviews do TextReview -->
      <div v-for="(review, index) in reviews" :key="'Review' + index">
        <TextReview :review="review.Review" :semester="review.Semester" />     
      </div>
      <div v-if="reviews == null">
        <p>We do not have a review for this course yet.</p>
        <p>Would be nice if you add one if you took this course.</p>
      </div>
    </div>
</template>
