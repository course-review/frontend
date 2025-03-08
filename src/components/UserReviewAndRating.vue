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

</script>

<template v-if="finishedLoadingReviews">

    <div v-for="(review, index) in UserData" :key="'Review' + index">
        <v-card class="mx-auto" max-width="500" style="margin-top: 10px;">
            <v-card-title>{{ review.CourseName }}</v-card-title>
        <v-card-subtitle> {{ review.CourseNumber }}</v-card-subtitle>
        <div v-if="review.Published.Status == 'pending'">
            <v-card-subtitle> Review is pending </v-card-subtitle>
        </div>
        <div v-if="review.Published.Status == 'rejected'">
            <v-card-subtitle style="color: red; font-size: 1.2em;"> Review got rejected because:</v-card-subtitle>
            <v-card-subtitle> {{ review.RequestedChanges != "" ? review.RequestedChanges : "No reason provided" }}</v-card-subtitle>
        </div>
        <v-container>
            <v-col>
                <div>
                    <v-card-text style="float: left;">Taken in Semester:</v-card-text>
                    <v-select density="compact" variant="underlined" max-width="100px" :items="semesters" :label="review.Semester" @update:model-value="(value: string | null) => handleSemesterChange(value, review.Evaluationid)" />
                </div>
                <StarRating :ratings="starRatings" :rating-id="review.Evaluationid" :editable="true" :review="review"/>
                <TextReview :review="review.Review" :review-id="review.Evaluationid" :editable="true" />
            </v-col>
        </v-container>
        
    </v-card>
</div>
</template>
