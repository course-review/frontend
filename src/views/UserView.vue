<script setup lang="ts">
import TextReview from '@/components/TextReview.vue'
</script>

<template>
  <v-main>
    <h1>User</h1>

    <TextReview course="000-0000-00L" review="Lots of zeros in this course" semester="FS2021" :editable="true" />
  </v-main>
</template>
