'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import {
    fetchUnverified,
    pushVerifyReview,
    pushRejectReview,
    fetchSemesters,
    pushSetCurrentSemesters,
} from '@/lib/api';
import type { UnverifiedReview } from '@/types';
import { ReviewDiff } from '@/components/ReviewDiff';

export default function AdminPage() {
    const { token, isAuthenticated } = useAuth();
    const [unverifiedReviews, setUnverifiedReviews] = useState<UnverifiedReview[]>([]);
    const [currentSemesters, setCurrentSemesters] = useState<string[]>([]);
    const [newSemester, setNewSemester] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCriticalData = async () => {
            if (!token) return;

            try {
                const [unverified, semesters] = await Promise.all([
                    fetchUnverified(token),
                    fetchSemesters(),
                ]);

                setUnverifiedReviews(unverified || []);
                setCurrentSemesters(semesters);
                setLoading(false);
            } catch (error) {
                console.error('Failed to load admin data:', error);
                setLoading(false);
            }
        };

        if (isAuthenticated && token) {
            loadCriticalData();
        } else {
            const timer = setTimeout(() => setLoading(false), 0);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, token]);

    const handleVerify = async (id: number) => {
        if (!token) return;

        try {
            await pushVerifyReview(id, token);
            setUnverifiedReviews(unverifiedReviews.filter((r) => r.ID !== id));
        } catch (error) {
            console.error('Failed to verify review:', error);
            alert('Failed to verify review');
        }
    };

    const handleReject = async (id: number) => {
        if (!token) return;

        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;

        try {
            await pushRejectReview(id, reason, token);
            setUnverifiedReviews(unverifiedReviews.filter((r) => r.ID !== id));
        } catch (error) {
            console.error('Failed to reject review:', error);
            alert('Failed to reject review');
        }
    };

    const handleAddSemester = async () => {
        if (!token || !newSemester.trim()) return;

        try {
            const updatedSemesters = [...currentSemesters, newSemester.trim()];
            await pushSetCurrentSemesters(updatedSemesters, token);
            setCurrentSemesters(updatedSemesters);
            setNewSemester('');
        } catch (error) {
            console.error('Failed to add semester:', error);
            alert('Failed to add semester');
        }
    };

    const handleRemoveSemester = async (semester: string) => {
        if (!token) return;

        try {
            const updatedSemesters = currentSemesters.filter((s) => s !== semester);
            await pushSetCurrentSemesters(updatedSemesters, token);
            setCurrentSemesters(updatedSemesters);
        } catch (error) {
            console.error('Failed to remove semester:', error);
            alert('Failed to remove semester');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                <p className="text-muted-foreground">
                    You don&apos;t have permission to access this page.
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
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            {/* Semester Management */}
            <section className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Manage Semesters</h2>
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newSemester}
                            onChange={(e) => setNewSemester(e.target.value)}
                            placeholder="e.g., HS24"
                            className="flex-1 p-2 border rounded-md"
                        />
                        <button
                            onClick={handleAddSemester}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                        >
                            Add Semester
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {currentSemesters.map((sem) => (
                            <div
                                key={sem}
                                className="flex items-center gap-2 px-3 py-1 bg-accent rounded-full"
                            >
                                <span>{sem}</span>
                                <button
                                    onClick={() => handleRemoveSemester(sem)}
                                    className="text-destructive hover:text-destructive/80"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Unverified Reviews */}
            <section>
                <h2 className="text-xl font-semibold mb-4">
                    Pending Reviews ({unverifiedReviews.length})
                </h2>
                {unverifiedReviews.length > 0 ? (
                    <div className="space-y-4">
                        {unverifiedReviews.map((review) => (
                            <div key={review.ID} className="border rounded-lg p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-semibold">
                                            <Link href={`/course/${review.CourseNumber}`} className="hover:underline">
                                                {review.CourseNumber} - {review.CourseName}
                                            </Link>
                                        </h3>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleVerify(review.ID)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(review.ID)}
                                            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                                <ReviewDiff oldText={review.OldReview} newText={review.Review} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-8 border rounded-lg">
                        No pending reviews
                    </p>
                )}
            </section>
        </div>
    );
}
