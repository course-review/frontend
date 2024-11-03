<script setup lang="ts">
import { ref } from 'vue';
const { editable = false, review } = defineProps<{review: string, editable?: boolean}>()

function deleteReview() {
  console.log('Delete review')
}

const isEditing = ref(false);
const reviewText = ref(review);

function toggleEdit() {
  isEditing.value = !isEditing.value;
  //reset value when canceling
  reviewText.value = review;
}

function submitEdit() {
  // todo: handle submit
  isEditing.value = false;
}
</script>

<template>
  <v-card max-width="500" class="border mt-2">
    <v-card-text>
      <div v-if="!isEditing">
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
    ></v-textarea>
    </v-card-text>
    <v-card-actions v-if="editable">
      <v-btn variant="tonal" color="orange" @click.stop="toggleEdit">{{ isEditing ? 'Cancel' : 'Edit' }}</v-btn>
      <v-btn v-if="isEditing" variant="tonal" color="green" @click.stop="submitEdit">Submit</v-btn>
      <v-btn variant="tonal" color="red" @click.stop="deleteReview">Delete</v-btn>
    </v-card-actions>
  </v-card>
</template>
