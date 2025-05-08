<script setup lang="ts">
import { pushDeleteRating, pushUpdateRating } from '@/services/api'
import RatingOverview from '../components/RatingOverview.vue'
import type { Rating } from './Rating.types'
import { computed, nextTick } from 'vue'

const {
  ratings,
  editable = false,
  isAdd = false,
  ratingId = -1,
  reloadData
} = defineProps<{
  ratings: { [key: string]: Rating }
  ratingId?: number
  editable?: boolean
  isAdd?: boolean
  reloadData?: () => any
}>()

const localRatings = computed(() => ratings)

const ratingCategories: { [key: string]: string } = {
  Recommended: 'I would recommend it',
  Engaging: 'The content is interesting',
  Difficulty: 'The difficulty is appropriate',
  Effort: 'The required effort is appropriate',
  Resources: 'The resources are useful'
}

function updateRating(id: string, value: number) {
  console.log(`API call to update rating '${id}' to: ${value}`)
  localRatings.value[id].rating = value
  if (!isAdd) {
    pushUpdateRating(ratingId, localRatings.value)
  }
}

async function clearAllRatings() {
  if (!isAdd) {
    await pushDeleteRating(ratingId)
    if (reloadData != undefined) {
      nextTick(() => {
        reloadData()
      })
    }
  }
  for (const key in localRatings.value) {
    localRatings.value[key].rating = 0
  }
}
</script>

<template>
  <v-card class="border">
    <v-container v-for="(label, key) in ratingCategories" :key="key" class="pa-2">
      <v-row no-gutters>
        <v-col class="flex-grow-1 flex-shrink-0">
          <v-card-text style="float: left; margin: auto" class="pa-0 align-baseline"
            >{{ label }}:</v-card-text
          >
        </v-col>
        <v-col>
          <!-- todo: clearable field might be of interest -->
          <v-rating
            class="ml-6 flex-shrink-1"
            :model-value="localRatings[key].rating"
            color="amber"
            :size="30"
            hover
            :readonly="!editable"
            @update:modelValue="updateRating(key as string, $event as number)"
          />
        </v-col>
        <v-col class="flex-grow-0 flex-shrink-1">
          <RatingOverview v-if="!editable" :ratingInformation="ratings[key]" />
        </v-col>
      </v-row>
    </v-container>
    <v-card-actions v-if="editable">
      <v-btn variant="flat" color="red-lighten-1" @click.stop="clearAllRatings"
        >Clear all Ratings</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
