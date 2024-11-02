<script setup lang="ts">
const { editable = false } = defineProps<{review: string, semester: string, editable?: boolean}>()
</script>

<template>
  <v-card max-width="500" class="border mt-2">
    <v-card-text>
      <div v-for="(block, index) in review.split('\n')" :key="index">
        {{ block }}
        <br v-if="block.length == 0" />
      </div>
    </v-card-text>
    <v-card-subtitle v-if="!editable">{{ semester }}</v-card-subtitle>
    <v-card-actions v-if="editable">
      <v-btn variant="tonal" color="orange">Edit</v-btn>
      <v-btn variant="tonal" color="red">Delete</v-btn>
    </v-card-actions>
  </v-card>
</template>
