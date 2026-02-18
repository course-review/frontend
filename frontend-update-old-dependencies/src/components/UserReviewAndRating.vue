<script setup lang="ts">
import TextReview from './TextReview.vue'
import StarRating from './StarRating.vue'
import { onMounted, ref } from 'vue'
import {
  fetchSemesters,
  fetchUserData,
  pushSemesterChange,
  defaultStarRatings,
  type UserReview
} from '@/services/api'

const semesters = ref<string[]>([])

const UserData = ref<UserReview[]>()

const finishedLoadingReviews = ref(false)

async function loadUserData() {
  const response = await fetchUserData()
  UserData.value = response.data
  for (const review of UserData.value) {
    const localRatings = ref(defaultStarRatings())
    localRatings.value['Recommended'].rating = review.Recommended
    localRatings.value['Engaging'].rating = review.Engaging
    localRatings.value['Difficulty'].rating = review.Difficulty
    localRatings.value['Effort'].rating = review.Effort
    localRatings.value['Resources'].rating = review.Resources
    review.Rating = localRatings.value
  }

  finishedLoadingReviews.value = true
}

onMounted(() => {
  loadUserData()
})

onMounted(async () => {
  const response = await fetchSemesters()
  semesters.value = response.data == null ? [] : response.data
})

function handleSemesterChange(value: string | null, ReviewId: number) {
  if (value == null) {
    value = ''
  }
  pushSemesterChange(value, ReviewId)
  console.log(value)
}
</script>

<template>
  <v-skeleton-loader
    v-if="!finishedLoadingReviews"
    class="mx-auto"
    type="card"
    :loading="!finishedLoadingReviews"
    width="400"
    height="200"
  />
  <template v-else>
    <div v-if="UserData == null">
      <v-card class="mx-auto" style="margin-top: 10px">
        <v-card-title>No reviews found.</v-card-title>
        <v-card-text>You haven't reviewed anything yet :O</v-card-text>
      </v-card>
    </div>
    <div v-for="(review, index) in UserData" :key="'Review' + index">
      <v-card :title="review.CourseName" class="mx-auto my-3">
        <template v-slot:append>
          <v-tooltip
            v-if="review.Published.Status == 'pending'"
            text="Pending Review"
            location="bottom"
          >
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" size="30" color="warning" icon="mdi-timer-sand" />
            </template>
          </v-tooltip>
          <v-tooltip
            v-else-if="review.Published.Status == 'rejected'"
            text="Rejected"
            location="bottom"
          >
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" size="30" color="error" icon="mdi-close" />
            </template>
          </v-tooltip>
          <v-tooltip v-else text="Accepted" location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" size="30" color="success" icon="mdi-check" />
            </template>
          </v-tooltip>
        </template>

        <v-card-subtitle> {{ review.CourseNumber }}</v-card-subtitle>
        <v-container no-gutters>
          <v-row>
            <v-select
              class="ml-3"
              density="comfortable"
              variant="underlined"
              max-width="170px"
              :items="semesters"
              hint="Taken in Semester"
              persistent-hint
              :label="review.Semester"
              @update:model-value="
                (value: string | null) => handleSemesterChange(value, review.Evaluationid)
              "
            />
          </v-row>
          <v-row>
            <v-col>
              <StarRating
                :ratings="review.Rating"
                :rating-id="review.Evaluationid"
                :editable="true"
                :review="review"
                :reload-data="loadUserData"
              />
            </v-col>
            <v-col>
              <TextReview
                v-model:review="review.Review"
                :review-id="review.Evaluationid"
                :editable="true"
                :reload-data="loadUserData"
              />
            </v-col>
          </v-row>
          <v-row v-if="review.Published.Status == 'rejected'">
            <v-col>
              <v-card-text
                ><b>Why This Was Not Approved</b><br />
                {{
                  review.RequestedChanges != null ? review.RequestedChanges : 'No reason provided'
                }}</v-card-text
              >
            </v-col>
            <v-col />
          </v-row>
        </v-container>
      </v-card>
    </div>
  </template>
</template>
