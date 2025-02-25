<script setup lang="ts">
import TextReview from './TextReview.vue'
import StarRating from './StarRating.vue';
import type { Rating } from './Rating.types'
import { onMounted, ref } from 'vue'
import { fetchSemesters, fetchUserData, starRatings } from '@/services/api';

const semesters = ref<string[]>([])

const UserData = ref()


onMounted(async () => {
    const response = await fetchUserData("4021821@ethz.ch");
    UserData.value = response.data;
});

onMounted(async () => {
    const response = await fetchSemesters();
    semesters.value = response.data;
})

const loremipsum: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque mi odio, maximus et felis at, cursus congue velit. Integer vitae viverra ligula. Phasellus in lectus velit. In ut interdum elit. Integer ultrices scelerisque turpis. Nullam eros nulla, ultricies tincidunt arcu et, imperdiet rhoncus nisl. Duis in lobortis quam. In in dui tortor. Mauris magna erat, cursus a pellentesque vel, suscipit ac felis. Phasellus suscipit mi vel leo posuere, ac ullamcorper nisi sodales. \nMorbi sed metus eu odio suscipit bibendum. Suspendisse semper ornare lorem eget mollis. Fusce molestie efficitur condimentum. Duis nec imperdiet magna. Vestibulum at justo id neque pulvinar elementum auctor id sapien. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse potenti. \n\n\nPellentesque sollicitudin eu quam id placerat. Suspendisse viverra scelerisque ipsum in euismod. Curabitur convallis porttitor ante vel tempus. Sed a sem sed mi sollicitudin egestas. Fusce eget turpis eleifend, pretium elit sit amet, egestas lectus. Nulla in leo maximus, bibendum est nec, bibendum neque. Suspendisse vel lectus condimentum, luctus odio non, hendrerit erat. Nunc pulvinar, ex id vehicula vulputate, justo magna faucibus neque, vitae sollicitudin neque nulla et massa. Ut quis libero porta, egestas ipsum quis, tincidunt nibh. Duis feugiat leo eu lorem facilisis bibendum. Aliquam erat volutpat. Sed sit amet auctor purus. Curabitur non leo lectus. Suspendisse quis lorem id arcu viverra consequat eget efficitur enim. Duis sed nibh sed tortor vulputate eleifend."

function handleRatingChange(id: string, value: number) {
    // console.log(starRatings.value[id].rating)
    // starRatings.value[id].rating = value 
    console.log(id, value)
}
</script>

<template>
    <v-card class="mx-auto" max-width="500">
        <v-card-title>Hello, I am course [see number below] and my name is</v-card-title>
        <v-card-subtitle>000-0000-00L</v-card-subtitle>
        <v-container>
            <v-col>
                <div>
                    <v-card-text style="float: left;">Taken in Semester:</v-card-text>
                    <v-select density="compact" variant="underlined" max-width="100px" :items="semesters" label="FS21" />
                </div>
                <StarRating :ratings="starRatings" :editable="true" @update-rating="handleRatingChange"/>
                <TextReview :review="loremipsum" :editable="true" />
            </v-col>
        </v-container>

    </v-card>
</template>
