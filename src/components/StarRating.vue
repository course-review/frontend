<script setup lang="ts">
import RatingOverview from '@/components/RatingOverview.vue'
import { Rating } from './Rating.types'

defineProps<{ratings: {[key: string]: Rating}}>()

const ratingCategories: {[key: string]: labels} = {
  "recommended": "I would recommend it",
  "engaging": "The content is interesting",
  "difficulty": "The difficulty is appropriate",
  "effort": "The required effort is appropriate",
  "resources": "The resources are useful"
}
</script>

<template>
  <v-card max-width="500">
    <div v-for="(label, key) in ratingCategories" :key="key">
      <v-card-text style="float: left;">{{ label }}:</v-card-text>
      <v-rating half-increments :length="5" :model-value="ratings[key].rating" color="amber" readonly ></v-rating>
      <RatingOverview :ratingDetails="ratings[key]"/>
    </div>
  </v-card>
</template>
