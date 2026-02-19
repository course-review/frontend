'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { StarRating } from '@/components/StarRating';
import { useAuth } from '@/lib/AuthContext';
import { defaultStarRatings, pushNewReview, fetchSemesters } from '@/lib/api';
import type { Rating } from '@/types';
import { useEffect } from 'react';

function AddReviewForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { token, isAuthenticated } = useAuth();

    const [courseNumber, setCourseNumber] = useState('');
    const [review, setReview] = useState('');
    const [semester, setSemester] = useState('');
    const [semesters, setSemesters] = useState<string[]>([]);
    const [ratings, setRatings] = useState<{ [key: string]: Rating }>(defaultStarRatings());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const course = searchParams.get('course');
        if (course) {
            setCourseNumber(course);
        }

        fetchSemesters()
            .then((data) => {
                setSemesters(data);
                if (data.length > 0) {
                    setSemester(data[0]);
                }
            })
            .catch((err) => console.error('Failed to fetch semesters:', err));
    }, [searchParams]);

    const handleRatingChange = (category: string, value: number) => {
        setRatings({
            ...ratings,
            [category]: {
                ...ratings[category],
                rating: value,
            },
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isAuthenticated || !token) {
            setError('You must be logged in to submit a review');
            return;
        }

        if (!courseNumber.trim() || !review.trim()) {
            setError('Please fill in all required fields');
            return;
        }

        // Check if at least one rating has been set
        const hasRatings = Object.values(ratings).some((r) => r.rating > 0);
        if (!hasRatings) {
            setError('Please rate at least one category');
            return;
        }

        setIsSubmitting(true);

        try {
            const randomString = Math.random().toString(36).substring(7);
            await pushNewReview(review, courseNumber, semester, randomString, ratings, token);
            router.push(`/course/${courseNumber}`);
        } catch (err) {
            console.error('Failed to submit review:', err);
            setError('Failed to submit review. Please try again.');
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
                <p className="text-muted-foreground">
                    Please log in to submit a review.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Add Course Review</h1>
                <p className="text-muted-foreground mt-1">
                    Share your experience to help other students
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="courseNumber" className="block text-sm font-medium mb-2">
                        Course Number *
                    </label>
                    <input
                        id="courseNumber"
                        type="text"
                        value={courseNumber}
                        onChange={(e) => setCourseNumber(e.target.value.toUpperCase())}
                        placeholder="e.g., 252-0028-00L"
                        className="w-full p-3 border rounded-md"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="semester" className="block text-sm font-medium mb-2">
                        Semester *
                    </label>
                    <select
                        id="semester"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="w-full p-3 border rounded-md"
                        required
                    >
                        {semesters.map((sem) => (
                            <option key={sem} value={sem}>
                                {sem}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="review" className="block text-sm font-medium mb-2">
                        Review *
                    </label>
                    <textarea
                        id="review"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Share your thoughts about the course..."
                        className="w-full min-h-[200px] p-3 border rounded-md"
                        required
                    />
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Rate the Course</h3>
                    <StarRating ratings={ratings} editable onChange={handleRatingChange} />
                </div>

                {error && (
                    <div className="p-4 border border-destructive bg-destructive/10 rounded-md">
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                )}

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 border rounded-md hover:bg-accent transition-colors"
                    >
                        Cancel
                    </button>
                </div>

                <p className="text-sm text-muted-foreground">
                    Your text will be reviewed by moderators before being published.
                </p>
            </form>
        </div>
    );
}

export default function AddReviewPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AddReviewForm />
        </Suspense>
    );
}
