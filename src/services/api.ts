import type { Rating } from '@/components/Rating.types';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { useCookies } from 'vue3-cookies';
const { cookies } = useCookies();

// Define the expected structure of the course data (adjust as needed)
export interface Course {
  CourseNumber: string;
  CourseName: string;
  Date: string;
}

export interface UserReview {
  Review: string;
  Recommended: number;
  Engaging: number;
  Difficulty: number;
  Effort: number;
  Resources: number;
  Semester: string;
  CourseNumber: string;
  CourseName: string;
  Evaluationid: number;
}

export interface UnverifiedReview {
  Review: string;
  CourseNumber: string;
  CourseName: string;
  UserID: string;
  Id: number;
}

export interface Review {
  Review: string;
  Semester: string;
}

export interface Rating2 {
  [key: string]: number;
}

export interface Stats {
  TotalCourses: number;
  TotalReviews: number;
}

// Create a typed Axios instance
const API: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const token = cookies.get('jwt');

// Define the function with proper typing
export const fetchCoursesData = async (): Promise<AxiosResponse<Course[]>> => {
  return API.get<Course[]>('/courses');
};

export const fetchReviews = async (courseNumber: string): Promise<AxiosResponse<Review[]>> => {
  return API.get<Review[]>(`/getReviews?course=${courseNumber}`);
}

export const fetchRatings = async (courseNumber: string): Promise<AxiosResponse<Rating2[]>> => {
  return API.get<Rating2[]>(`/getRatings?course=${courseNumber}`);
}

export const fetchLatestReviews = async (): Promise<AxiosResponse<Course[]>> => {
  return API.get<Course[]>('/latestReviews');
}

export const fetchName = async (courseNumber: string): Promise<AxiosResponse<string>> => {
  return API.get<string>(`/courseName?course=${courseNumber}`);
}

export const fetchSemesters = async (): Promise<AxiosResponse<string[]>> => {
  return API.get<string[]>('/currentSemesters');
}

export const fetchStats = async (): Promise<AxiosResponse<Stats>> => {
  return API.get<Stats>('/stats');
}

export const fetchUserData = async (): Promise<AxiosResponse<UserReview[]>> => {
  return API.get<UserReview[]>(`/auth/getUserData?token=${token}`);
}

export const fetchUnverified = async (): Promise<AxiosResponse<UnverifiedReview[]>> => {
  return API.get<UnverifiedReview[]>(`/moderator/getUnverifiedReviews?token=${token}`);
}

export const pushVerifyReview = async (id: number): Promise<AxiosResponse<string>> => {
  return API.post<string>(`/moderator/verifyReview?id=${id}&token=${token}`);
}

export const pushRejectReview = async (id: number): Promise<AxiosResponse<string>> => {
  return API.post<string>(`/moderator/rejectReview?id=${id}&token=${token}`);
}

export const pushSetCurrentSemesters = async (semester: string[]): Promise<AxiosResponse<string>> => {
  return API.post<string>(`/moderator/setCurrentSemester?list=${semester}&token=${token}`);
}

export const pushSetModerator = async (user: string): Promise<AxiosResponse<string>> => {
  return API.post<string>(`/admin/setModerator?user=${user}&token=${token}`);
}

export const pushUpdateReview = async (id: number, review: string): Promise<AxiosResponse<string>> => {
  return API.post<string>(`/auth/updateReview?id=${id}&review=${review}&token=${token}`);
}

export const pushDeleteReview = async (id: number): Promise<AxiosResponse<string>> => {
  return API.post<string>(`/auth/deleteReview?id=${id}&token=${token}`);
}

export const pushUpdateRating = async (id: number, rating: { [key: string]: Rating }): Promise<AxiosResponse<string>> => {
  return API.post<string>(`/auth/updateRating?id=${id}${ratingToRequest(rating)}&token=${token}`);
}

export const pushNewReview = async (review: string, courseNumber: string, userID: string, semester: string, rating: { [key: string]: Rating}): Promise<AxiosResponse<string>> => {
  return API.post<string>(`/auth/newReview?review=${review}&courseNumber=${courseNumber}&userID=${userID}&semester=${semester}${ratingToRequest(rating)}&token=${token}`);
}

export const pushSemesterChange = async (semester: string, id: number): Promise<AxiosResponse<string>> => {
  return API.post<string>(`/auth/updateSemester?Semester=${semester}&id=${id}&token=${token}`);
}

function ratingToRequest(rating: { [key: string]: Rating }): string {
  return `&recommended=${rating['Recommended'].rating}&engaging=${rating['Engaging'].rating}&difficulty=${rating['Difficulty'].rating}&effort=${rating['Effort'].rating}&resources=${rating['Resources'].rating}`;
}


export const starRatings: {[key: string]: Rating} = {
  Recommended: {rating: 0, details: {oneStarRatings: 0, twoStarRatings: 0, threeStarRatings: 0, fourStarRatings: 0, fiveStarRatings: 0}},
  Engaging: {rating: 0, details: {oneStarRatings: 0, twoStarRatings: 0, threeStarRatings: 0, fourStarRatings: 0, fiveStarRatings: 0}},
  Difficulty: {rating: 0, details: {oneStarRatings: 0, twoStarRatings: 0, threeStarRatings: 0, fourStarRatings: 0, fiveStarRatings: 0}},
  Effort: {rating: 0, details: {oneStarRatings: 0, twoStarRatings: 0, threeStarRatings: 0, fourStarRatings: 0, fiveStarRatings: 0}},
  Resources: {rating: 0, details: {oneStarRatings: 0, twoStarRatings: 0, threeStarRatings: 0, fourStarRatings: 0, fiveStarRatings: 0}},
}