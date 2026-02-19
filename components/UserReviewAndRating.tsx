'use client';

import { useState, useEffect } from 'react';
import { StarRating } from './StarRating';
import { Pencil, Trash2, Save, X } from 'lucide-react';
import type { Rating } from '@/types';

interface UserReviewAndRatingProps {
    evaluationId: number;
    courseNumber: string;
    courseName: string;
    review: string;
    semester: string;
    ratings: { [key: string]: Rating };
    published: { Status: string; Valid: boolean };
    requestedChanges: string;
    onUpdate?: (id: number, review: string, ratings: { [key: string]: Rating }) => Promise<void>;
    onDelete?: (id: number) => Promise<void>;
}

export function UserReviewAndRating({
    evaluationId,
    courseNumber,
    courseName,
    review,
    semester,
    ratings,
    published,
    requestedChanges,
    onUpdate,
    onDelete,
}: UserReviewAndRatingProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedReview, setEditedReview] = useState(review);
    const [editedRatings, setEditedRatings] = useState(ratings);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!onUpdate) return;

        setIsLoading(true);
        try {
            await onUpdate(evaluationId, editedReview, editedRatings);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update review:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!onDelete || !confirm('Are you sure you want to delete this review?')) return;

        setIsLoading(true);
        try {
            await onDelete(evaluationId);
        } catch (error) {
            console.error('Failed to delete review:', error);
            setIsLoading(false);
        }
    };

    const handleRatingChange = (category: string, value: number) => {
        setEditedRatings({
            ...editedRatings,
            [category]: {
                ...editedRatings[category],
                rating: value,
            },
        });
    };

    useEffect(() => {
        setEditedReview(review);
        setEditedRatings(ratings);
    }, [review, ratings]);

    return (
        <div className="border rounded-lg p-6 space-y-4">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold">
                        {courseNumber} {courseName}
                    </h3>
                    <p className="text-sm text-muted-foreground">Semester: {semester}</p>

                    {/* only show if published valid true and Status not verified */}
                    {published.Valid && published.Status !== 'verified' && (
                        <div className="flex items-center gap-2 mt-1">
                            <span
                                className={`text-xs px-2 py-1 rounded ${published.Status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}
                            >
                                {published.Status === 'pending'
                                    ? 'Pending Review'
                                    : 'Rejected'}
                            </span>
                        </div>
                    )}
                </div>

                {!isEditing && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 hover:bg-accent rounded-md transition-colors"
                            title="Edit"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="p-2 hover:bg-destructive/10 text-destructive rounded-md transition-colors"
                            title="Delete"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>

            {requestedChanges && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <p className="text-sm font-medium text-yellow-900">Requested Changes:</p>
                    <p className="text-sm text-yellow-800 mt-1">{requestedChanges}</p>
                </div>
            )}

            {isEditing ? (
                <div className="space-y-6">
                    <textarea
                        value={editedReview}
                        onChange={(e) => setEditedReview(e.target.value)}
                        className="w-full min-h-[150px] p-3 border rounded-md"
                        placeholder="Write your review..."
                    />

                    <div className="border-t pt-4">
                        <StarRating
                            ratings={editedRatings}
                            editable
                            onChange={handleRatingChange}
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            <Save className="h-4 w-4" />
                            Save
                        </button>
                        <button
                            onClick={() => {
                                setEditedReview(review);
                                setEditedRatings(ratings);
                                setIsEditing(false);
                            }}
                            disabled={isLoading}
                            className="px-4 py-2 border rounded-md hover:bg-accent transition-colors flex items-center gap-2"
                        >
                            <X className="h-4 w-4" />
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{review}</div>

                    <div className="border-t pt-4">
                        <StarRating ratings={ratings} />
                    </div>
                </div>
            )}
        </div>
    );
}
