<script setup lang="ts">
import { Rating } from './Rating.types'
import { ref } from 'vue'

defineProps<{ratingDetails: Rating}>()
const totalRatings = ref(0)
const ratingCountList = ref([0, 0, 0, 0, 0])

function sumRatings(rds: Rating): number {
  totalRatings.value = Object.values(rds).reduce((sum, rating) => sum + rating, 0) - rds.rating
  ratingCountList.value = Object.values(rds).slice(1)
  return totalRatings.value
}
</script>

<template>
  <v-menu open-on-hover location="end" >
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon="mdi-information" variant="text" density="compact" />
    </template>

    <v-card class="d-flex flex-column mx-auto py-8" elevation="10" height="500" width="360">
      <div class="d-flex justify-center mt-auto text-h5">Rating overview</div>

      <div class="d-flex align-center flex-column my-auto">
        <div class="text-h2 mt-5">
          {{ ratingDetails.rating }}
          <span class="text-h6 ml-n3">/5</span>
        </div>

        <v-rating :model-value="ratingDetails.rating" color="amber" half-increments />

        <div class="px-3">{{ sumRatings(ratingDetails) }}</div>
      </div>

      <v-list bg-color="transparent" class="d-flex flex-column-reverse" density="compact">
        <v-list-item v-for="(i, key) in 5" :key="key">
          <v-progress-linear :model-value="ratingCountList[key]" :max="totalRatings" class="mx-n5" color="amber" height="20" />

          <template v-slot:prepend>
            <span>{{ i }}</span>
            <v-icon class="mx-3" icon="mdi-star" />
          </template>

          <template v-slot:append>
            <div class="rating-values">
              <span class="d-flex justify-end"> {{ ratingCountList[key] }} </span>
            </div>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>
