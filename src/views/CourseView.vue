<script setup lang="ts">
import TextReview from '@/components/TextReview.vue'
import StarRating from '@/components/StarRating.vue'
import { Rating } from '../components/Rating.types.ts'

const loremipsum: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque mi odio, maximus et felis at, cursus congue velit. Integer vitae viverra ligula. Phasellus in lectus velit. In ut interdum elit. Integer ultrices scelerisque turpis. Nullam eros nulla, ultricies tincidunt arcu et, imperdiet rhoncus nisl. Duis in lobortis quam. In in dui tortor. Mauris magna erat, cursus a pellentesque vel, suscipit ac felis. Phasellus suscipit mi vel leo posuere, ac ullamcorper nisi sodales. \nMorbi sed metus eu odio suscipit bibendum. Suspendisse semper ornare lorem eget mollis. Fusce molestie efficitur condimentum. Duis nec imperdiet magna. Vestibulum at justo id neque pulvinar elementum auctor id sapien. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse potenti. \n\n\nPellentesque sollicitudin eu quam id placerat. Suspendisse viverra scelerisque ipsum in euismod. Curabitur convallis porttitor ante vel tempus. Sed a sem sed mi sollicitudin egestas. Fusce eget turpis eleifend, pretium elit sit amet, egestas lectus. Nulla in leo maximus, bibendum est nec, bibendum neque. Suspendisse vel lectus condimentum, luctus odio non, hendrerit erat. Nunc pulvinar, ex id vehicula vulputate, justo magna faucibus neque, vitae sollicitudin neque nulla et massa. Ut quis libero porta, egestas ipsum quis, tincidunt nibh. Duis feugiat leo eu lorem facilisis bibendum. Aliquam erat volutpat. Sed sit amet auctor purus. Curabitur non leo lectus. Suspendisse quis lorem id arcu viverra consequat eget efficitur enim. Duis sed nibh sed tortor vulputate eleifend."

const starRatings: {[key: string]: Rating} = {
  "recommended": {rating: 4.3, oneStarRatings: 1, twoStarRatings: 2, threeStarRatings: 3, fourStarRatings: 4, fiveStarRatings: 5},
  "engaging": {rating: 3.0, oneStarRatings: 0, twoStarRatings: 3, threeStarRatings: 1, fourStarRatings: 8, fiveStarRatings: 9},
  "difficulty": {rating: 2.2, oneStarRatings: 4, twoStarRatings: 2, threeStarRatings: 1, fourStarRatings: 41, fiveStarRatings: 0},
  "effort": {rating: 1.9, oneStarRatings: 0, twoStarRatings: 0, threeStarRatings: 0, fourStarRatings: 0, fiveStarRatings: 0},
  "resources": {rating: 0.5, oneStarRatings: 10, twoStarRatings: 20, threeStarRatings: 1, fourStarRatings: 2, fiveStarRatings: 33},
}
</script>

<template>
  <v-main>
    <h1>Course with id: {{ $route.params.id }} [here will be the course name]</h1>
    
    <v-divider></v-divider>

    <StarRating :ratings="starRatings"/>

    <TextReview review="Lots of zeros in this course" semester="FS2021" />
    <TextReview :review="loremipsum" semester="FS2021" />
  </v-main>
</template>
