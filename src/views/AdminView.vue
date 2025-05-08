<script setup lang="ts">
import {
  fetchSemesters,
  fetchUnverified,
  pushRejectReview,
  pushSetCurrentSemesters,
  pushSetModerator,
  type UnverifiedReview,
  pushVerifyReview,
  pushscrapeCourses
} from '@/services/api'
import { onMounted, ref } from 'vue'
import TextReview from '@/components/TextReview.vue'
import CheckAuth from '@/components/CheckAuth.vue'
const user = ref('')

const semesters = ref<string[]>([])
const newSemester = ref<string>('')
const scrapeSemester = ref<string>('')
const reviews = ref<UnverifiedReview[]>([])

onMounted(async () => {
  const response = await fetchSemesters()
  semesters.value = response.data
  if (semesters.value === null) {
    semesters.value = []
  }
})

onMounted(async () => {
  const response = await fetchUnverified()
  reviews.value = response.data
})

const removeSemester = (index: number) => {
  semesters.value.splice(index, 1)
}

const addSemester = () => {
  console.log(newSemester.value)
  if (newSemester.value.trim() !== '') {
    semesters.value.push(newSemester.value)
    newSemester.value = ''
  }
}
const scrape = () => {
  console.log(scrapeSemester.value)
  pushscrapeCourses(scrapeSemester.value)
  //todo some way to show progress
}
async function setModeratorClick() {
  console.log('Set moderator')
  const response = await pushSetModerator(user.value)
  if (response.status == 200) {
    user.value = ''
  }
  //todo show error
}
async function verifyClick(id: number, index: number) {
  await pushVerifyReview(id)
  reviews.value.splice(index, 1)
}
async function rejectClick(id: number, requestedChanges: string, index: number) {
  console.log(requestedChanges)
  await pushRejectReview(id, requestedChanges)
  reviews.value.splice(index, 1)
}
</script>

<template>
  <CheckAuth />
  <main>
    <h2>Moderator</h2>
    <input v-model="user" placeholder="numbers@ethz.ch" class="input-semester" />
    <button @click="setModeratorClick" class="btn">Set Moderator</button>
    <br />

    <h2>Semesters</h2>
    <ul>
      <li v-for="(semester, index) in semesters" :key="index" class="semester-item">
        {{ semester }}
        <button @click="removeSemester(index)" class="btn-remove">Remove</button>
      </li>
    </ul>
    <input v-model="newSemester" placeholder="XSYZ" class="input-semester" />
    <button @click="addSemester" class="btn">Add Semester</button>
    <br />
    <button @click="pushSetCurrentSemesters(semesters)" class="btn">Save Current Semesters</button>
    <br />
    <input v-model="scrapeSemester" placeholder="20XZ(S|W)" class="input-semester" />
    <button @click="scrape" class="btn">Scrape Semester</button>
    <br />
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
        <input
          v-model="review.RequestedChanges"
          placeholder="Too aggressive or stuff idk"
          class="input-semester"
        />
        <button @click="verifyClick(review.ID, index)" class="btn">Verify</button>
        <button @click="rejectClick(review.ID, review.RequestedChanges, index)" class="btn-remove">
          Reject
        </button>
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
