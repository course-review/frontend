import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

// Define the expected structure of the course data (adjust as needed)
export interface Course {
  CourseNumber: string;
  CourseName: string;
  Date: string;
}

interface Review {
  Review: string;
  Semester: string;
}


// Create a typed Axios instance
const API: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:3000',
});

// Define the function with proper typing
export const coursesData = async (): Promise<AxiosResponse<Course[]>> => {
  return API.get<Course[]>('/courses');
};

export const fetchReviews = async (courseNumber: string): Promise<AxiosResponse<Review[]>> => {
  return API.get<Review[]>(`/getReviews/${courseNumber}`);
}


export const fetchLatestReviews = async (): Promise<AxiosResponse<Course[]>> => {
  return API.get<Course[]>('/latestReviews');
}