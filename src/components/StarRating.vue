<script setup lang="ts">
import RatingOverview from '../components/RatingOverview.vue'
import type { Rating } from './Rating.types'
import { ref } from 'vue'

const { ratings, editable = false } = defineProps<{ ratings: {[key: string]: Rating}, editable?: boolean }>()

const localRatings = ref(ratings)

const ratingCategories: {[key: string]: string} = {
  Recommended: "I would recommend it",
  Engaging: "The content is interesting",
  Difficulty: "The difficulty is appropriate",
  Effort: "The required effort is appropriate",
  Resources: "The resources are useful"
}

function updateRating(id: string, value: number) {
  console.log(`API call to update rating '${id}' to: ${value}`)
}

function clearAllRatings() {
  console.log('API call to clear all ratings or call updateRating for each rating :)')
}
</script>

<template>
  <v-card max-width="500">
    <div v-for="(label, key) in ratingCategories" :key="key">
      <v-card-text style="float: left;">{{ label }}:</v-card-text>
      <v-rating :model-value="Math.round(localRatings[key].rating*2)/2 " color="amber" half-increments hover :readonly="!editable" @update:modelValue="updateRating(key as string, $event as number)"/>
      <RatingOverview v-if="!editable" :ratingInformation="ratings[key]"/>
    </div>
    <v-card-actions v-if="editable">
      <v-btn variant="tonal" color="red" @click.stop="clearAllRatings">Clear all Ratings</v-btn>
    </v-card-actions>
  </v-card>
</template>
