import type {
    Course,
    CourseWithAmount,
    Review,
    Rating,
    Rating2,
    Stats,
    UserReview,
    UnverifiedReview,
    UsageStats,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

/**
 * Get JWT token from cookie (client-side only)
 */
function getClientToken(): string {
    if (typeof document === 'undefined') return '';

    const cookies = document.cookie.split(';');
    const jwtCookie = cookies.find(c => c.trim().startsWith('jwt='));
    return jwtCookie ? jwtCookie.split('=')[1] : '';
}

// ============================================================================
// Public API endpoints (no auth required)
// ============================================================================

export async function apiHealth(): Promise<string> {
    return apiFetch<string>('/');
}

export async function fetchCoursesData(): Promise<Course[]> {
    return apiFetch<Course[]>('/courses', { next: { revalidate: 86400 } });
}

export async function fetchCoursesWithReviewAmount(): Promise<CourseWithAmount[]> {
    return apiFetch<CourseWithAmount[]>('/coursesWithReviewAmount');
}

export async function fetchReviews(courseNumber: string): Promise<Review[]> {
    return apiFetch<Review[]>(`/getReviews?course=${courseNumber}`);
}

export async function fetchRatings(courseNumber: string): Promise<Rating2[]> {
    return apiFetch<Rating2[]>(`/getRatings?course=${courseNumber}`);
}

export async function fetchLatestReviews(): Promise<Course[]> {
    return apiFetch<Course[]>('/latestReviews');
}

export async function fetchName(courseNumber: string): Promise<string> {
    return apiFetch<string>(`/courseName?course=${courseNumber}`, { next: { revalidate: 86400 } }); // Names rarely change
}

export async function fetchSemesters(): Promise<string[]> {
    return apiFetch<string[]>('/currentSemesters', { next: { revalidate: 86400 } });
}

export async function fetchStats(): Promise<Stats> {
    return apiFetch<Stats>('/stats', { next: { revalidate: 3600 } });
}

export async function fetchCoursesWithReviewsOrRatings(): Promise<Course[]> {
    return apiFetch<Course[]>('/coursesWithRatingsOrReviews');
}

// ============================================================================
// Authenticated API endpoints (require JWT token)
// ============================================================================

export async function fetchUserData(token?: string): Promise<UserReview[]> {
    const jwt = token || getClientToken();
    return apiFetch<UserReview[]>(`/auth/getUserData?token=${jwt}`, { cache: 'no-store' }); //TODO Not sure if no-store is good here
}

export async function fetchUnverified(token?: string): Promise<UnverifiedReview[]> {
    const jwt = token || getClientToken();
    return apiFetch<UnverifiedReview[]>(`/auth/moderator/getUnverifiedReviews?token=${jwt}`);
}

export async function fetchUsageStats(token?: string): Promise<UsageStats> {
    const jwt = token || getClientToken();
    return apiFetch<UsageStats>(`/auth/moderator/usageStats?token=${jwt}`);
}

// ============================================================================
// POST endpoints
// ============================================================================

export async function pushVerifyReview(id: number, token?: string): Promise<string> {
    const jwt = token || getClientToken();
    return apiFetch<string>('/auth/moderator/verifyReview', {
        method: 'POST',
        body: JSON.stringify({ id, token: jwt }),
    });
}

export async function pushRejectReview(
    id: number,
    requested_changes: string,
    token?: string
): Promise<string> {
    const jwt = token || getClientToken();
    return apiFetch<string>('/auth/moderator/rejectReview', {
        method: 'POST',
        body: JSON.stringify({ id, token: jwt, requested_changes }),
    });
}

export async function pushSetCurrentSemesters(
    semester: string[],
    token?: string
): Promise<string> {
    const jwt = token || getClientToken();
    return apiFetch<string>('/auth/moderator/setCurrentSemester', {
        method: 'POST',
        body: JSON.stringify({ list: semester, token: jwt }),
    });
}

export async function pushSetModerator(user: string, token?: string): Promise<string> {
    const jwt = token || getClientToken();
    return apiFetch<string>('/auth/admin/setModerator', {
        method: 'POST',
        body: JSON.stringify({ user, token: jwt }),
    });
}

export async function pushUpdateReview(
    id: number,
    review: string,
    token?: string
): Promise<string> {
    const jwt = token || getClientToken();
    return apiFetch<string>('/auth/updateReview', {
        method: 'POST',
        body: JSON.stringify({ id, review, token: jwt }),
    });
}

export async function pushDeleteReview(id: number, token?: string): Promise<string> {
    const jwt = token || getClientToken();
    return apiFetch<string>('/auth/deleteReview', {
        method: 'POST',
        body: JSON.stringify({ id, token: jwt }),
    });
}

export async function pushUpdateRating(
    id: number,
    rating: { [key: string]: Rating },
    token?: string
): Promise<string> {
    const jwt = token || getClientToken();
    const ratingData = ratingToRequest(rating);
    return apiFetch<string>('/auth/updateRating', {
        method: 'POST',
        body: JSON.stringify({ id, token: jwt, ...ratingData }),
    });
}

export async function pushNewReview(
    review: string,
    courseNumber: string,
    semester: string,
    randomString: string,
    rating: { [key: string]: Rating },
    token?: string
): Promise<string> {
    const jwt = token || getClientToken();
    const ratingData = ratingToRequest(rating);
    return apiFetch<string>('/insertReview', {
        method: 'POST',
        body: JSON.stringify({
            review,
            courseNumber,
            token: jwt,
            semester,
            randomString,
            ...ratingData,
        }),
    });
}

export async function pushSemesterChange(
    semester: string,
    id: number,
    token?: string
): Promise<string> {
    const jwt = token || getClientToken();
    return apiFetch<string>('/auth/updateSemester', {
        method: 'POST',
        body: JSON.stringify({ semester, id, token: jwt }),
    });
}

export async function pushDeleteRating(id: number, token?: string): Promise<string> {
    const jwt = token || getClientToken();
    return apiFetch<string>('/auth/deleteRating', {
        method: 'POST',
        body: JSON.stringify({ id, token: jwt }),
    });
}

export async function pushScrapeCourses(semester: string, token?: string): Promise<string> {
    const jwt = token || getClientToken();
    return apiFetch<string>('/auth/moderator/scrapeCourses', {
        method: 'POST',
        body: JSON.stringify({ semester, token: jwt }),
    });
}

// ============================================================================
// Helper functions
// ============================================================================

function ratingToRequest(rating: { [key: string]: Rating }) {
    return {
        recommended: rating['Recommended'].rating,
        engaging: rating['Engaging'].rating,
        difficulty: rating['Difficulty'].rating,
        effort: rating['Effort'].rating,
        resources: rating['Resources'].rating,
    };
}

export function defaultStarRatings(): { [key: string]: Rating } {
    return {
        Recommended: {
            rating: 0,
            details: {
                oneStarRatings: 0,
                twoStarRatings: 0,
                threeStarRatings: 0,
                fourStarRatings: 0,
                fiveStarRatings: 0,
            },
        },
        Engaging: {
            rating: 0,
            details: {
                oneStarRatings: 0,
                twoStarRatings: 0,
                threeStarRatings: 0,
                fourStarRatings: 0,
                fiveStarRatings: 0,
            },
        },
        Difficulty: {
            rating: 0,
            details: {
                oneStarRatings: 0,
                twoStarRatings: 0,
                threeStarRatings: 0,
                fourStarRatings: 0,
                fiveStarRatings: 0,
            },
        },
        Effort: {
            rating: 0,
            details: {
                oneStarRatings: 0,
                twoStarRatings: 0,
                threeStarRatings: 0,
                fourStarRatings: 0,
                fiveStarRatings: 0,
            },
        },
        Resources: {
            rating: 0,
            details: {
                oneStarRatings: 0,
                twoStarRatings: 0,
                threeStarRatings: 0,
                fourStarRatings: 0,
                fiveStarRatings: 0,
            },
        },
    };
}
