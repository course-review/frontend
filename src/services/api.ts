import type { Rating } from '@/components/Rating.types';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

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
  baseURL: 'http://127.0.0.1:3000',
});

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

export const fetchUserData = async (username: string): Promise<AxiosResponse<UserReview[]>> => {
  return API.get<UserReview[]>(`/getUserData?user=${username}`);
}

export const fetchSemesters = async (): Promise<AxiosResponse<string[]>> => {
  return API.get<string[]>('/currentSemesters');
}

export const fetchUnverified = async (): Promise<AxiosResponse<UnverifiedReview[]>> => {
  return API.get<UnverifiedReview[]>('/getUnverifiedReviews');
}

export const verifyReview = async (id: number): Promise<AxiosResponse<string>> => {
  return API.post<string>(`/verifyReview?id=${id}`);
}

export const rejectReview = async (id: number): Promise<AxiosResponse<string>> => {
  return API.post<string>(`/rejectReview?id=${id}`);
}

export const setCurrentSemesters = async (semester: string[]): Promise<AxiosResponse<string>> => {
  return API.post<string>(`/setCurrentSemester?list=${semester}`);
}

export const fetchStats = async (): Promise<AxiosResponse<Stats>> => {
  return API.get<Stats>('/stats');
}

export const setModerator = async (user: string): Promise<AxiosResponse<string>> => {
  return API.post<string>(`/setModerator?user=${user}`);
}

export const starRatings: {[key: string]: Rating} = {
  Recommended: {rating: 0, details: {oneStarRatings: 0, twoStarRatings: 0, threeStarRatings: 0, fourStarRatings: 0, fiveStarRatings: 0}},
  Engaging: {rating: 0, details: {oneStarRatings: 0, twoStarRatings: 0, threeStarRatings: 0, fourStarRatings: 0, fiveStarRatings: 0}},
  Difficulty: {rating: 0, details: {oneStarRatings: 0, twoStarRatings: 0, threeStarRatings: 0, fourStarRatings: 0, fiveStarRatings: 0}},
  Effort: {rating: 0, details: {oneStarRatings: 0, twoStarRatings: 0, threeStarRatings: 0, fourStarRatings: 0, fiveStarRatings: 0}},
  Resources: {rating: 0, details: {oneStarRatings: 0, twoStarRatings: 0, threeStarRatings: 0, fourStarRatings: 0, fiveStarRatings: 0}},
}