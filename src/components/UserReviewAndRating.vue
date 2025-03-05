<script setup lang="ts">
import TextReview from './TextReview.vue'
import StarRating from './StarRating.vue';
import { onMounted, ref } from 'vue'
import { fetchSemesters, fetchUserData, pushSemesterChange, starRatings, type UserReview } from '@/services/api';

const semesters = ref<string[]>([])

const UserData = ref<UserReview[]>()

const finishedLoadingReviews = ref(false);
console.log("loading")
onMounted(async () => {
    const response = await fetchUserData();
    UserData.value = response.data;
    finishedLoadingReviews.value = true;
});

onMounted(async () => {
    const response = await fetchSemesters();
    semesters.value = response.data;
})

function handleSemesterChange(value: string | null, ReviewId: number) {
    if (value == null) {
        value = ""
    }
    pushSemesterChange(value, ReviewId)
    console.log(value)
}

function handleRatingChange(id: string, value: number) {
    // console.log(starRatings.value[id].rating)
    // starRatings.value[id].rating = value 
    console.log(id, value)
}
</script>

<template v-if="finishedLoadingReviews">

    <div v-for="(review, index) in UserData" :key="'Review' + index">
        <v-card class="mx-auto" max-width="500">
            <v-card-title>{{ review.CourseName }}</v-card-title>
        <v-card-subtitle> {{ review.CourseNumber }}</v-card-subtitle>
        <v-container>
            <v-col>
                <div>
                    <v-card-text style="float: left;">Taken in Semester:</v-card-text>
                    <v-select density="compact" variant="underlined" max-width="100px" :items="semesters" :label="review.Semester" @update:model-value="(value) => handleSemesterChange(value, review.ReviewId)" />
                </div>
                <StarRating :ratings="starRatings" :id="review.RatingId" :editable="true" @update-rating="handleRatingChange"/>
                <TextReview :review="review.Review" :review-id="review.ReviewId" :editable="true" />
            </v-col>
        </v-container>
        
    </v-card>
</div>
</template>
