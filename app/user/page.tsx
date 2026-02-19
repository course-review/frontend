'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { fetchUserData, pushUpdateReview, pushDeleteReview, pushUpdateRating } from '@/lib/api';
import { UserReviewAndRating } from '@/components/UserReviewAndRating';
import type { UserReview } from '@/types';

export default function UserPage() {
    const { token, isAuthenticated, user } = useAuth();
    const [reviews, setReviews] = useState<UserReview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || !token) {
            setLoading(false);
            return;
        }

        fetchUserData(token)
            .then((data) => {
                setReviews(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch user data:', err);
                setLoading(false);
            });
    }, [isAuthenticated, token]);

    const handleUpdate = async (id: number, review: string, ratings: any) => {
        if (!token) return;

        try {
            await pushUpdateReview(id, review, token);
            await pushUpdateRating(id, ratings, token);

            // Refresh user data
            const data = await fetchUserData(token);
            setReviews(data);
        } catch (error) {
            console.error('Failed to update review:', error);
            throw error;
        }
    };

    const handleDelete = async (id: number) => {
        if (!token) return;

        try {
            await pushDeleteReview(id, token);

            // Remove from local state
            setReviews(reviews.filter((r) => r.Evaluationid !== id));
        } catch (error) {
            console.error('Failed to delete review:', error);
            throw error;
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
                <p className="text-muted-foreground">
                    Please log in to view your profile.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">My Reviews</h1>
                {user && (
                    <p className="text-muted-foreground mt-1">
                        {user.student ? 'Student Account' : 'Moderator Account'}
                    </p>
                )}
            </div>

            {reviews.length > 0 ? (
                <div className="space-y-4">
                    {reviews.map((review) => {
                        // Construct ratings object if missing, using flat fields
                        let ratings = review.Rating;
                        if (!ratings) {
                            ratings = {
                                Recommended: { rating: review.Recommended || 0, details: { oneStarRatings: 0, twoStarRatings: 0, threeStarRatings: 0, fourStarRatings: 0, fiveStarRatings: 0 } },
                                Engaging: { rating: review.Engaging || 0, details: { oneStarRatings: 0, twoStarRatings: 0, threeStarRatings: 0, fourStarRatings: 0, fiveStarRatings: 0 } },
                                Difficulty: { rating: review.Difficulty || 0, details: { oneStarRatings: 0, twoStarRatings: 0, threeStarRatings: 0, fourStarRatings: 0, fiveStarRatings: 0 } },
                                Effort: { rating: review.Effort || 0, details: { oneStarRatings: 0, twoStarRatings: 0, threeStarRatings: 0, fourStarRatings: 0, fiveStarRatings: 0 } },
                                Resources: { rating: review.Resources || 0, details: { oneStarRatings: 0, twoStarRatings: 0, threeStarRatings: 0, fourStarRatings: 0, fiveStarRatings: 0 } },
                            };
                        }

                        return (
                            <UserReviewAndRating
                                key={review.Evaluationid}
                                evaluationId={review.Evaluationid}
                                courseNumber={review.CourseNumber}
                                courseName={review.CourseName}
                                review={review.Review}
                                semester={review.Semester}
                                ratings={ratings}
                                published={review.Published}
                                requestedChanges={review.RequestedChanges}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12 border rounded-lg">
                    <p className="text-muted-foreground">
                        You haven't submitted any reviews yet.
                    </p>
                    <a
                        href="/add"
                        className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                        Submit Your First Review
                    </a>
                </div>
            )}
        </div>
    );
}
