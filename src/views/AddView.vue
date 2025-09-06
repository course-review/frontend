<script setup lang="ts">
import { fetchCoursesData, fetchSemesters } from '@/services/api'
import { onMounted, ref } from 'vue'
import { defaultStarRatings } from '@/services/api'
import TextReview from '../components/TextReview.vue'
import StarRating from '../components/StarRating.vue'
import CheckAuth from '@/components/CheckAuth.vue'

const semesters = ref<string[]>([])
const reviewAdd = ref('')
const starRatingsAdd = ref(defaultStarRatings())
const selectedSemester = ref('')
const courses = ref<{ label: string; number: string }[]>([])
const selectedCourseNumber = ref('')

const url = new URL(window.location.href)
const course = url.searchParams.get('id') || ''
selectCourse(course)

onMounted(async () => {
  const response = await fetchSemesters()
  semesters.value = response.data == null ? [] : response.data
  semesters.value.unshift('')
})

onMounted(async () => {
  const response = await fetchCoursesData()
  const fetchedCourses = response.data.map((course) => ({
    label: `${course.CourseNumber} ${course.CourseName}`,
    number: course.CourseNumber
  }))
  courses.value.push(...fetchedCourses)
})

function selectCourse(number: string) {
  selectedCourseNumber.value = number
}
function blankPage() {
  console.log('Blank page')
  starRatingsAdd.value = defaultStarRatings()
  console.log(starRatingsAdd.value)
  selectedSemester.value = ''
  selectedCourseNumber.value = ''
}
const panels = ref([0])
</script>

<template>
  <CheckAuth />
  <v-card class="mx-auto mt-5">
    <v-container>
      <v-autocomplete
        label="Course"
        append-inner-icon="mdi-magnify"
        density="comfortable"
        menu-icon=""
        auto-select-first
        :items="courses"
        item-title="label"
        item-value="number"
        v-model="selectedCourseNumber"
        @update:modelValue="selectCourse"
      />
      <v-row>
        <v-select
          density="comfortable"
          variant="underlined"
          max-width="170px"
          hint="Taken in Semester"
          persistent-hint
          class="ml-3"
          :items="semesters"
          v-model="selectedSemester"
        />
      </v-row>
      <v-row>
        <v-col>
          <StarRating v-model:ratings="starRatingsAdd" :editable="true" :is-add="true" />
        </v-col>
        <v-col>
          <TextReview
            v-model:review="reviewAdd"
            :editable="true"
            :is-add="true"
            :ratings="starRatingsAdd"
            :semester="selectedSemester"
            :course-number="selectedCourseNumber"
            :reload-data="blankPage"
          />
          <br>
          <v-expansion-panels v-model="panels" multiple>
            <v-expansion-panel>
              <v-expansion-panel-title class="text-body-2" style="font-size: 1rem; min-height: 40px;">
                What not to write
              </v-expansion-panel-title>
              <v-expansion-panel-text class="text-body-2" style="font-size: 0.95rem;">
                <ul>
                  <li>Prof is bad.</li>
                  <li>Worst course ever.</li>
                  <li>TAs are useless.</li>
                </ul>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title class="text-body-2" style="font-size: 1rem; min-height: 40px;">
                What to write instead:
              </v-expansion-panel-title>
              <v-expansion-panel-text class="text-body-2" style="font-size: 0.95rem;">
                <ul>
                  <li>Did not like teaching style.</li>
                  <li>Could not follow the prof during the lecture</li>
                  <li>The TAs did not dive deeper or differently into the material but just repeated the lecture content</li>
                  <li>The exercise sessions did not help me.</li>
                </ul>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title class="text-body-2" style="font-size: 1rem; min-height: 40px;">
                In short:
              </v-expansion-panel-title>
              <v-expansion-panel-text class="text-body-2" style="font-size: 0.95rem;">
                Especially when writing bad things try to state things in a subjective way and give an example or explanation for the opinion.
                Do not attack a person but rather state what you did not like: Prof is boring -> The lectures were monotonous (because of ...).
                If it is a positive review, it is still good if you do the same, but here we do not have to fear of people being angry about the content that we host.
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
