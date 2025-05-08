<script setup lang="ts">
import { ref } from 'vue'
import { studentAuth } from '@/router/index'

// check if user is logged in
const notLoggedIn = ref(false)
async function setAuth() {
  notLoggedIn.value = !(await studentAuth())
}
setAuth()

function redirectToLogin() {
  const redirectUrl = `${window.location.origin}/tokenset`
  const originUrl = window.location.pathname
  const authorizationUrl = 'https://n.ethz.ch/~lteufelbe/auth' //todo set as env var
  window.location.href = `${authorizationUrl}?redirect=${encodeURI(redirectUrl)}&origin=${encodeURI(originUrl)}`
}
</script>

<template>
  <v-dialog v-model="notLoggedIn" max-width="50%">
    <v-card class="mx-auto" style="margin-top: 10px">
      <v-card-title>Not logged in!</v-card-title>
      <v-card-text>Please log in to view your reviews and add reviews.</v-card-text>
      <v-btn @click="redirectToLogin" class="ma-5" color="blue-lighten-1">Login</v-btn>
    </v-card>
  </v-dialog>
</template>
