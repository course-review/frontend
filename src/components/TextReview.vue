<script setup lang="ts">
const {course = "", editable = false} = defineProps<{course?: string, review: string, semester: string, editable?: boolean}>()
</script>

<template>
  <v-card max-width="500" class="border mt-2">
    <v-card-title v-if="course.length > 0"><v-btn variant="text" :to="`/course/${course}`">{{ course }}</v-btn></v-card-title>
    <v-card-text>
      <div v-for="(block, index) in review.split('\n')" :key="index">
        {{ block }}
        <br v-if="block.length == 0" />
      </div>
    </v-card-text>
    <v-card-subtitle class="text-right mb-1">{{ semester }}</v-card-subtitle>
    <v-card-actions v-if="editable">
      <v-btn variant="tonal" color="red">Edit</v-btn>
    </v-card-actions>
  </v-card>
</template>
