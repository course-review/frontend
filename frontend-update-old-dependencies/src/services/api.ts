import type { Rating } from '@/components/Rating.types'
import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { useCookies } from 'vue3-cookies'
const { cookies } = useCookies()

// Define the expected structure of the course data (adjust as needed)
export interface Course {
  CourseNumber: string
  CourseName: string
  Date: string
}

export interface UserReview {
  Review: string
  Published: { Status: string; Valid: boolean }
  RequestedChanges: string
  Recommended: number
  Engaging: number
  Difficulty: number
  Effort: number
  Resources: number
  Semester: string
  CourseNumber: string
  CourseName: string
  Evaluationid: number
  Rating: { [key: string]: Rating }
}

export interface UnverifiedReview {
  Review: string
  OldReview: string
  RequestedChanges: string
  CourseNumber: string
  CourseName: string
  UserID: string
  ID: number
}
export interface UsageData {
  time: string
  value: string
}
export interface UsageStats {
  paths: UsageData[]
  users: UsageData[]
}

export interface Review {
  Review: string
  Semester: string
}

export interface Rating2 {
  [key: string]: number
}

export interface Stats {
  TotalCourses: number
  TotalReviews: number
}

// Create a typed Axios instance
const API: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

function token() : string {
  return cookies.get('jwt')
}

// Define the function with proper typing
export const apiHealth = async (): Promise<AxiosResponse<string>> => {
  return API.get<string>('/')
}

export const fetchCoursesData = async (): Promise<AxiosResponse<Course[]>> => {
  return API.get<Course[]>('/courses')
}

export const fetchReviews = async (courseNumber: string): Promise<AxiosResponse<Review[]>> => {
  return API.get<Review[]>(`/getReviews?course=${courseNumber}`)
}

export const fetchRatings = async (courseNumber: string): Promise<AxiosResponse<Rating2[]>> => {
  return API.get<Rating2[]>(`/getRatings?course=${courseNumber}`)
}

export const fetchLatestReviews = async (): Promise<AxiosResponse<Course[]>> => {
  return API.get<Course[]>('/latestReviews')
}

export const fetchName = async (courseNumber: string): Promise<AxiosResponse<string>> => {
  return API.get<string>(`/courseName?course=${courseNumber}`)
}

export const fetchSemesters = async (): Promise<AxiosResponse<string[]>> => {
  return API.get<string[]>('/currentSemesters')
}

export const fetchStats = async (): Promise<AxiosResponse<Stats>> => {
  return API.get<Stats>('/stats')
}

export const fetchUserData = async (): Promise<AxiosResponse<UserReview[]>> => {
  return API.get<UserReview[]>(`/auth/getUserData?token=${token()}`)
}

export const fetchUnverified = async (): Promise<AxiosResponse<UnverifiedReview[]>> => {
  return API.get<UnverifiedReview[]>(`/auth/moderator/getUnverifiedReviews?token=${token()}`)
}

export const fetchUsageStats = async (): Promise<AxiosResponse<UsageStats>> => {
  return API.get<UsageStats>(`/auth/moderator/usageStats?token=${token()}`)
}

export const pushVerifyReview = async (id: number): Promise<AxiosResponse<string>> => {
  const data = { id: id, token: token() }
  console.log(data)
  return API.post<string>('/auth/moderator/verifyReview', data)
}

export const pushRejectReview = async (
  id: number,
  requested_changes: string
): Promise<AxiosResponse<string>> => {
  const data = { id: id, token: token(), requested_changes: requested_changes }
  return API.post<string>('/auth/moderator/rejectReview', data)
}

export const pushSetCurrentSemesters = async (
  semester: string[]
): Promise<AxiosResponse<string>> => {
  const data = { list: semester, token: token() }
  return API.post<string>('/auth/moderator/setCurrentSemester', data)
}

export const pushSetModerator = async (user: string): Promise<AxiosResponse<string>> => {
  const data = { user: user, token: token() }
  return API.post<string>('/auth/admin/setModerator', data)
}

export const pushUpdateReview = async (
  id: number,
  review: string
): Promise<AxiosResponse<string>> => {
  const data = { id: id, review: review, token: token() }
  return API.post<string>('/auth/updateReview', data)
}

export const pushDeleteReview = async (id: number): Promise<AxiosResponse<string>> => {
  const data = { id: id, token: token() }
  return API.post<string>('/auth/deleteReview', data)
}

export const pushUpdateRating = async (
  id: number,
  rating: { [key: string]: Rating }
): Promise<AxiosResponse<string>> => {
  const data = { id: id, token: token(), ...ratingToRequest(rating) }
  return API.post<string>('/auth/updateRating', data)
}

export const pushNewReview = async (
  review: string,
  courseNumber: string,
  semester: string,
  randomString: string,
  rating: { [key: string]: Rating }
): Promise<AxiosResponse<string>> => {
  const data = {
    review: review,
    courseNumber: courseNumber,
    token: token(),
    semester: semester,
    randomString: randomString,
    ...ratingToRequest(rating)
  }
  return API.post<string>('/insertReview', data)
}

export const pushSemesterChange = async (
  semester: string,
  id: number
): Promise<AxiosResponse<string>> => {
  const data = { semester: semester, id: id, token: token() }
  return API.post<string>('/auth/updateSemester', data)
}

export const pushDeleteRating = async (id: number): Promise<AxiosResponse<string>> => {
  const data = { id: id, token: token() }
  return API.post<string>('/auth/deleteRating', data)
}
export const pushscrapeCourses = async (semester: string): Promise<AxiosResponse<string>> => {
  const data = { semester: semester, token: token() }
  return API.post<string>('/auth/moderator/scrapeCourses', data)
}

function ratingToRequest(rating: { [key: string]: Rating }) {
  const data = {
    recommended: rating['Recommended'].rating,
    engaging: rating['Engaging'].rating,
    difficulty: rating['Difficulty'].rating,
    effort: rating['Effort'].rating,
    resources: rating['Resources'].rating
  }
  return data
}

export const defaultStarRatings = (): { [key: string]: Rating } => {
  return {
    Recommended: {
      rating: 0,
      details: {
        oneStarRatings: 0,
        twoStarRatings: 0,
        threeStarRatings: 0,
        fourStarRatings: 0,
        fiveStarRatings: 0
      }
    },
    Engaging: {
      rating: 0,
      details: {
        oneStarRatings: 0,
        twoStarRatings: 0,
        threeStarRatings: 0,
        fourStarRatings: 0,
        fiveStarRatings: 0
      }
    },
    Difficulty: {
      rating: 0,
      details: {
        oneStarRatings: 0,
        twoStarRatings: 0,
        threeStarRatings: 0,
        fourStarRatings: 0,
        fiveStarRatings: 0
      }
    },
    Effort: {
      rating: 0,
      details: {
        oneStarRatings: 0,
        twoStarRatings: 0,
        threeStarRatings: 0,
        fourStarRatings: 0,
        fiveStarRatings: 0
      }
    },
    Resources: {
      rating: 0,
      details: {
        oneStarRatings: 0,
        twoStarRatings: 0,
        threeStarRatings: 0,
        fourStarRatings: 0,
        fiveStarRatings: 0
      }
    }
  }
}
