<script setup lang="ts">
import { pushDeleteReview, pushNewReview, pushUpdateReview } from '@/services/api';
import { ref } from 'vue';
import type { Rating } from './Rating.types';
const { editable = false, reviewId = -1, review, isAdd = false, ratings, semester, courseNumber } = defineProps<{review: string, reviewId?: number, semester?: string, editable?: boolean, isAdd?: boolean, courseNumber?: string, ratings?: {[key: string]: Rating}}>()

const isEditing = ref(false);
const old_review = ref(review);
const reviewText = ref(review);

if (isAdd) {
  isEditing.value = true;
}

function toggleEdit() {
  isEditing.value = !isEditing.value;
  //reset value when canceling
  reviewText.value = old_review.value;
}

async function submitEdit() {
  await pushUpdateReview(reviewId, reviewText.value);
  old_review.value = reviewText.value;
  isEditing.value = false;
}

function deleteReview() {
  console.log('Delete review')
  //todo: show confirmation dialog
  pushDeleteReview(reviewId)
}

async function submitNewReview() {
    console.log("Submit new review")
    if (ratings == undefined || semester == undefined || courseNumber == undefined) {
      console.log("Ratings undefined")
    } else {
      const userId = "";
      await pushNewReview(reviewText.value, courseNumber, userId, semester, ratings);
      //todo something here: clear ratings, review, semester, courseNumber and show text
    }
}
</script>
<template>
  <v-card max-width="500" class="border mt-2">
    <v-card-text>
      <div v-if="!editable">
        <div v-for="(block, index) in review.split('\n')" :key="index">
          {{ block }}
          <br v-if="block.length == 0" />
        </div>
      </div>
      <v-textarea
        v-else
        v-model="reviewText"
        rows="5"
        auto-grow
        :readonly="!isEditing"
    ></v-textarea>
    </v-card-text>
    <v-card-subtitle v-if="!editable">{{ semester }}</v-card-subtitle>
    <v-card-actions v-if="!isAdd && editable">
      <v-btn variant="tonal" color="orange" @click.stop="toggleEdit">{{ isEditing ? 'Cancel' : 'Edit' }}</v-btn>
      <v-btn v-if="isEditing" variant="tonal" color="green" @click.stop="submitEdit">Submit</v-btn>
      <v-btn variant="tonal" color="red" @click.stop="deleteReview">Delete</v-btn>
    </v-card-actions>
  </v-card>
  <v-btn v-if=isAdd style="margin-top: 10px;" variant="tonal" color="green" @click.stop="submitNewReview">Submit</v-btn>
</template>
