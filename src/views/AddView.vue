<script setup lang="ts">
import { fetchSemesters } from '@/services/api';
import { onMounted, ref } from 'vue';
import { starRatings } from '@/services/api';
import TextReview from '../components/TextReview.vue'
import StarRating from '../components/StarRating.vue';

const semesters = ref<string[]>([])

onMounted(async () => {
    const response = await fetchSemesters();
    semesters.value = response.data;
    semesters.value.push("")
})

function handleRatingChange(id: string, value: number) {
    // console.log(starRatings.value[id].rating)
    // starRatings.value[id].rating = value
    console.log(id, value)
}
</script>

<template v-if="finishedLoadingReviews">

      <v-card class="mx-auto" max-width="500">
          <v-card-title> Search Course here </v-card-title>
      <v-card-subtitle> Course Number </v-card-subtitle>
      <v-container>
          <v-col>
              <div>
                  <v-card-text style="float: left;">Taken in Semester:</v-card-text>
                  <v-select density="compact" variant="underlined" max-width="100px" :items="semesters" />
              </div>
              <StarRating :ratings="starRatings" :editable="true" @update-rating="handleRatingChange"/>
              <TextReview review="" :editable="true" :is-add="true" />
          </v-col>
      </v-container>
      
  </v-card>
</template>
