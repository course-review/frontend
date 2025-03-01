<script setup lang="ts">
import { fetchSemesters, fetchUnverified, rejectReview, setCurrentSemesters, setModerator, type UnverifiedReview, verifyReview } from '@/services/api';
import { onMounted, ref } from 'vue';
import TextReview from '@/components/TextReview.vue';
const user = ""

const semesters = ref<string[]>([])
const newSemester = ref<string>('')
const reviews = ref<UnverifiedReview[]>([])

onMounted(async () => {
    const response = await fetchSemesters();
    semesters.value = response.data;    
})

onMounted(async () => {
    const response = await fetchUnverified();
    reviews.value = response.data;
})

const removeSemester = (index: number) => {
    semesters.value.splice(index, 1);
}

const addSemester = () => {
    if (newSemester.value.trim() !== '') {
        semesters.value.push(newSemester.value);
        newSemester.value = '';
    }
}

</script>

<template>
<main>
    <h2>Moderator</h2>
    <input v-model="user" placeholder="numbers@ethz.ch" class="input-semester" />
    <button @click="setModerator(user)" class="btn">Set Moderator</button>
    <br>

    <h2>Semesters</h2>
    <ul>
        <li v-for="(semester, index) in semesters" :key="index" class="semester-item">
            {{ semester }}
            <button @click="removeSemester(index)" class="btn-remove">Remove</button>
        </li>
    </ul>
    <input v-model="newSemester" placeholder="XSYZ" class="input-semester" />
    <button @click="addSemester" class="btn">Add Semester</button>
    <br>
    <button @click="setCurrentSemesters(semesters)" class="btn">Save Current Semesters</button>
    <br>
    <h2>Unverified Reviews</h2>
    <ul>
        <li v-for="(review, index) in reviews" :key="index" class="semester-item">
            <v-card>
            <v-card-title>{{ review.CourseName }}</v-card-title>
            <v-card-subtitle> {{ review.CourseNumber }}</v-card-subtitle>
            <v-card-subtitle> {{ review.UserID }}</v-card-subtitle>
            <v-container>
                <v-col>
                    <TextReview :review="review.Review" :editable="false" />
                </v-col>
            </v-container>
            
        </v-card>
            <button @click="verifyReview(review.Id)" class="btn">Verify</button>
            <button @click="rejectReview(review.Id)" class="btn-remove">Reject</button>
        </li>
    </ul>
</main>
</template>

<style scoped>
.btn {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    margin: 5px;
    cursor: pointer;
    border-radius: 5px;
    font-size: 16px;
}

.btn:hover {
    background-color: #0056b3;
}

.btn-remove {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 5px 10px;
    margin-left: 10px;
    cursor: pointer;
    border-radius: 5px;
    font-size: 14px;
}

.btn-remove:hover {
    background-color: #c82333;
}

.input-semester {
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 16px;
}

.semester-item {
    list-style-type: none;
    margin: 10px 0;
}
</style>
