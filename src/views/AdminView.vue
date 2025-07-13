<script setup lang="ts">
import {
  fetchSemesters,
  fetchUnverified,
  pushRejectReview,
  pushSetCurrentSemesters,
  pushSetModerator,
  type UnverifiedReview,
  pushVerifyReview,
  pushscrapeCourses,
  fetchUsageStats,
  type UsageStats
} from '@/services/api'
import { onMounted, ref } from 'vue'
import { useTheme } from 'vuetify'
import CheckAuth from '@/components/CheckAuth.vue'
const user = ref('')

const semesters = ref<string[]>([])
const newSemester = ref<string>('')
const scrapeSemester = ref<string>('')
const reviews = ref<UnverifiedReview[]>([])
const usageStats = ref<UsageStats>()
const usersPerDay = ref<{ label: string; count: number }[]>([])
const requestsPerDay = ref<{ label: string; count: number }[]>([])
const requestsPerPath = ref<{ label: string; count: number }[]>([])
const requestsPerHour = ref<{ label: string; count: number }[]>([])
const newUsersPerDay = ref<{ label: string; count: number }[]>([])
const totalUsersPerDay = ref<{ label: string; count: number }[]>([])
const chartData = ref(false)
const selectedDate = ref<string>()
const counter = ref(0)


import { DiffView, DiffModeEnum } from '@git-diff-view/vue'
import { generateDiffFile } from '@git-diff-view/file'
import '@git-diff-view/vue/styles/diff-view.css'
import { transformUsageData } from '@/services/transformData'
import StatChartTime from '@/components/charts/StatChartTime.vue'
import RequestsPerPathChart from '@/components/charts/RequestsPerPathChart.vue'
import StatChartBar from '@/components/charts/StatChartBar.vue'
const theme = useTheme()

function getDiffFile(oldReview: string, newReview: string) {
  const diffFile = generateDiffFile('', oldReview || '', '', newReview, '', '')
  diffFile.init()
  return diffFile
}

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

onMounted(async () => {
  const response = await fetchUsageStats()
  usageStats.value = response.data

  setData(usageStats.value)

  chartData.value = true
})

function onDateChange() {
  if (usageStats.value) {
    setData(usageStats.value, selectedDate.value)
    counter.value++
    console.log(usersPerDay.value)
  }
}

function setData(rawData: UsageStats, cutoffDate?: string) {
  const {
    usersPerDay: upd,
    requestsPerDay: rpd,
    requestsPerPath: rpp,
    requestsPerHour: rph,
    newUsersPerDay: nupd
  } = transformUsageData(rawData, cutoffDate)

  usersPerDay.value = upd
  requestsPerDay.value = rpd
  requestsPerPath.value = rpp
  requestsPerHour.value = rph
  newUsersPerDay.value = nupd
  totalUsersPerDay.value = makeCumulative(nupd)

  //sort data
  requestsPerHour.value = [...requestsPerHour.value].sort((a, b) => {
    const [aHour, aMin] = a.label.split(':').map(Number)
    const [bHour, bMin] = b.label.split(':').map(Number)
    return aHour * 60 + aMin - (bHour * 60 + bMin)
  })

  requestsPerPath.value = [...requestsPerPath.value].sort((a, b) => b.count - a.count)
}

function makeCumulative(data: { label: string; count: number }[]) {
  let sum = 0
  return data.map((d) => {
    sum += d.count
    return {
      label: d.label,
      count: sum
    }
  })
}


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
  <main class="ml-4">
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
              <DiffView
                :diff-file="getDiffFile(review.OldReview, review.Review)"
                :diff-view-font-size="14"
                :diff-view-mode="DiffModeEnum.Unified"
                :diff-view-highlight="true"
                :diff-view-add-widget="false"
                :diff-view-theme="theme.global.name.value as 'dark' | 'light'"
                :diff-view-wrap="true"
              ></DiffView>
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
    <br />
    <h2>Statistics</h2>
    <div v-if="chartData">
      <!-- field to enter date -->
      <input
        type="date"
        v-model="selectedDate"
        class="input-semester"
      />
      <button @click="onDateChange" class="btn">Apply Date Filter</button>
      <br />
      <!-- Could be bargraph -->
      <StatChartBar :key="counter + '-usersPerDay'" :data="usersPerDay" title="Users per Day" />
      <StatChartBar :key="counter + '-newUsersPerDay'" :data="newUsersPerDay" title="New Users per Day" />
      <StatChartTime :key="counter + '-totalUsersPerDay'" :data="totalUsersPerDay" title="Total Users" />
      <StatChartTime :key="counter + '-requestsPerDay'" :data="requestsPerDay" title="Requests per Day" :pointRadius="2" />
      <!-- <RequestsPerPathChart :data="requestsPerPath" /> -->
      <StatChartBar :key="counter + '-requestsPerHour'" :data="requestsPerHour" title="Views per Hour"/>
    </div>
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
