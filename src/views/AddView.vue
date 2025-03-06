<script setup lang="ts">
import { fetchCoursesData, fetchSemesters } from '@/services/api';
import { onMounted, ref } from 'vue';
import { starRatings } from '@/services/api';
import TextReview from '../components/TextReview.vue'
import StarRating from '../components/StarRating.vue';

const semesters = ref<string[]>([])
const reviewAdd = ref("")
const starRatingsAdd = ref(starRatings)
const selectedSemester = ref("")
const courses =  ref<{ label: string; number: string }[]>([])
const selectedCourseNumber = ref("")

const url = new URL(window.location.href);
const course = url.searchParams.get('id') || '';
selectCourse(course)

onMounted(async () => {
    const response = await fetchSemesters();
    semesters.value = response.data;
    semesters.value.unshift("");
})

onMounted(async () => {
    const response = await fetchCoursesData();
    const fetchedCourses = response.data.map(course => ({
        label: `${course.CourseNumber} ${course.CourseName}`,
        number: course.CourseNumber,
    }));
    courses.value.push(...fetchedCourses);
})

function selectCourse(number: string) {
    selectedCourseNumber.value = number
}
</script>


<template>
    <v-card class="mx-auto" max-width="500">
        <v-container>
            <v-autocomplete label="Course" append-inner-icon="mdi-magnify" density="comfortable" menu-icon="" auto-select-first :items="courses" item-title="label" item-value="number" v-model="selectedCourseNumber" @update:modelValue="selectCourse" />
            <v-col>
                <div>
                    <v-card-text style="float: left;">Taken in Semester:</v-card-text>
                    <v-select density="compact" variant="underlined" max-width="100px" :items="semesters" v-model="selectedSemester" />
                </div>
                <StarRating v-model:ratings="starRatingsAdd" :editable="true" :is-add="true"/>
                <TextReview v-model:review="reviewAdd" :editable="true" :is-add="true" :ratings="starRatingsAdd" :semester="selectedSemester" :course-number="selectedCourseNumber"/>
            </v-col>
        </v-container>  
    </v-card>
</template>
