// Course types
export interface Course {
  CourseNumber: string;
  CourseName: string;
  Date: string;
}

export interface CourseWithAmount {
  CourseNumber: string;
  CourseName: string;
  Count: number;
}

// Rating types
export interface RatingDetails {
  oneStarRatings: number;
  twoStarRatings: number;
  threeStarRatings: number;
  fourStarRatings: number;
  fiveStarRatings: number;
}

export interface Rating {
  rating: number;
  details: RatingDetails;
}

export interface Rating2 {
  [key: string]: number;
}

// Review types
export interface Review {
  Review: string;
  Semester: string;
}

export interface UserReview {
  Review: string;
  Published: { Status: string; Valid: boolean };
  RequestedChanges: string;
  Recommended: number;
  Engaging: number;
  Difficulty: number;
  Effort: number;
  Resources: number;
  Semester: string;
  CourseNumber: string;
  CourseName: string;
  Evaluationid: number;
  Rating: { [key: string]: Rating };
}

export interface UnverifiedReview {
  Review: string;
  OldReview: string;
  RequestedChanges: string;
  CourseNumber: string;
  CourseName: string;
  UserID: string;
  ID: number;
}

// Stats types
export interface Stats {
  TotalCourses: number;
  TotalReviews: number;
}

export interface UsageData {
  time: string;
  value: string;
}

export interface UsageStats {
  paths: UsageData[];
  users: UsageData[];
  TotalReviews: number;
  TotalRatings: number;
  TotalUsers: number;
}

// JWT token properties
export interface TokenProperties {
  student: boolean;
  exp: number;
  unique_id: string;
}
