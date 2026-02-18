<script setup lang="ts">
import TextReview from '@/components/TextReview.vue'
import StarRating from '@/components/StarRating.vue'
import type { RatingDetails } from '@/components/Rating.types'
import { onMounted, ref, computed } from 'vue'
import {
  fetchReviews,
  type Review,
  type Rating2,
  fetchRatings,
  defaultStarRatings
} from '@/services/api'
import { fetchName } from '@/services/api'
import { useCourseComparisonStore } from '@/stores/courseComparison'

const reviews = ref<Review[]>([])
const ratings = ref<Rating2[]>([])
const starRatings = defaultStarRatings()

import { useRoute } from 'vue-router'

const route = useRoute()
const courseNumber = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
const courseName = ref<string>('')
const finishedLoadingRatings = ref(false)
const finishedLoadingReviews = ref(false)

// comparsion view logic
const comparisonStore = useCourseComparisonStore()
const isSelected = computed(() => comparisonStore.isCourseSelected(courseNumber))
const canAddCourse = computed(() => comparisonStore.canAddMoreCourses || isSelected.value)

function toggleCourseSelection() {
  if (courseName.value) {
    comparisonStore.toggleCourse(courseNumber, courseName.value)
  }
}

onMounted(async () => {
  const response = await fetchReviews(courseNumber)

  if (response.data == null) {
    finishedLoadingReviews.value = true
    return
  }

  reviews.value = response.data
  finishedLoadingReviews.value = true
})

onMounted(async () => {
  const response = await fetchName(courseNumber)
  courseName.value = response.data
})

onMounted(async () => {
  const response = await fetchRatings(courseNumber)
  ratings.value = response.data

  const ratingKeys = ['Difficulty', 'Engaging', 'Effort', 'Recommended', 'Resources']
  if (ratings.value == null) {
    finishedLoadingRatings.value = true

    return
  }

  for (const rating of ratings.value) {
    ratingKeys.forEach((key) => {
      const tempRating = starRatings[key]
      if (tempRating.details !== null && rating[key] !== undefined) {
        insertIntoStarRatings(tempRating.details, rating[key])
      }
    })
  }

  //calculate the average rating
  for (const key in starRatings) {
    const rating = starRatings[key]
    const details = rating.details
    if (details !== null) {
      const totalRatings =
        details.oneStarRatings +
        details.twoStarRatings +
        details.threeStarRatings +
        details.fourStarRatings +
        details.fiveStarRatings
      const averageRating =
        (details.oneStarRatings +
          2 * details.twoStarRatings +
          3 * details.threeStarRatings +
          4 * details.fourStarRatings +
          5 * details.fiveStarRatings) /
        totalRatings
      rating.rating = Math.round(averageRating * 100) / 100
    }
  }
  finishedLoadingRatings.value = true
})

function insertIntoStarRatings(ratingDetail: RatingDetails, stars: number) {
  switch (stars) {
    case 1:
      ratingDetail.oneStarRatings += 1
      break
    case 2:
      ratingDetail.twoStarRatings += 1
      break
    case 3:
      ratingDetail.threeStarRatings += 1
      break
    case 4:
      ratingDetail.fourStarRatings += 1
      break
    case 5:
      ratingDetail.fiveStarRatings += 1
      break
  }
}
</script>

<template>
  <div class="d-flex align-center justify-space-between ma-4">
    <h2 class="flex-grow-1">{{ $route.params.id }}: {{ courseName }}</h2>
    <v-tooltip location="bottom">
      <template v-slot:activator="{ props }">
        <div v-bind="props">
          <v-btn
            :color="isSelected ? 'primary' : 'grey'"
            :disabled="!canAddCourse && !isSelected"
            :variant="isSelected ? 'flat' : 'outlined'"
            @click="toggleCourseSelection"
            size="default"
            class="ml-2 compare-btn"
            elevation="1"
          >
            <v-icon :icon="isSelected ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'" class="mr-1" />
            Compare
          </v-btn>
        </div>
      </template>
      {{ isSelected ? 'Remove from comparison' : (!canAddCourse ? `Max ${comparisonStore.MAX_COURSES} courses can be selected` : 'Add to comparison') }}
    </v-tooltip>
  </div>

  <v-divider class="border-opacity-25 mx-3"></v-divider>

  <v-container>
    <v-row :align="$vuetify.display.smAndUp ? 'start' : 'stretch'" dense>
      <v-col :cols="12" :md="6">
        <template v-if="finishedLoadingRatings">
          <StarRating :ratings="starRatings" />
        </template>
        <template v-else>
          <v-skeleton-loader
            class="mx-auto"
            type="card"
            :loading="!finishedLoadingRatings"
            width="400"
            height="200"
          />
        </template>
      </v-col>

      <v-col :cols="12" :md="6">
        <template v-if="finishedLoadingReviews && reviews.length > 0">
          <!-- Desktop View -->
          <v-virtual-scroll v-if="!$vuetify.display.smAndDown" height="80vh" :items="reviews">
            <template v-slot="{ item: review }">
              <TextReview :review="review.Review" :semester="review.Semester" />
              <v-divider class="border-opacity-0 mt-3" />
            </template>
          </v-virtual-scroll>

          <!-- Mobile View -->
          <div v-else v-for="(review, index) in reviews" :key="index">
            <TextReview :review="review.Review" :semester="review.Semester" />
            <v-divider class="border-opacity-0 mt-3" />
          </div>
        </template>
        <v-skeleton-loader
          v-else-if="!finishedLoadingReviews"
          class="mx-auto"
          type="card"
          :loading="!finishedLoadingRatings"
          width="400"
          height="200"
        />
        <p v-else class="text-center">No reviews available for this course.</p>
      </v-col>
    </v-row>
  </v-container>
</template>
