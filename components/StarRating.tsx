'use client';

import { Star } from 'lucide-react';
import type { Rating } from '@/types';

interface StarRatingProps {
    ratings: { [key: string]: Rating };
    editable?: boolean;
    onChange?: (category: string, value: number) => void;
}

const categories = [
    { key: 'Recommended', label: 'Recommended', description: 'Would you recommend this course?' },
    { key: 'Engaging', label: 'Engaging', description: 'How engaging was the content?' },
    { key: 'Difficulty', label: 'Difficulty', description: 'How difficult was the course?' },
    { key: 'Effort', label: 'Effort', description: 'How much effort did you need?' },
    { key: 'Resources', label: 'Resources', description: 'Quality of course materials?' },
];

export function StarRating({ ratings, editable = false, onChange }: StarRatingProps) {
    const handleStarClick = (category: string, value: number) => {
        if (editable && onChange) {
            onChange(category, value);
        }
    };

    return (
        <div className="space-y-4">
            {categories.map(({ key, label, description }) => {
                const rating = ratings[key]?.rating || 0;
                const roundedRating = Math.round(rating);

                return (
                    <div key={key} className="space-y-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="font-medium">{label}</span>
                                {description && (
                                    <span className="text-sm text-muted-foreground ml-2">
                                        {description}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleStarClick(key, star)}
                                        disabled={!editable}
                                        className={`${editable ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
                                    >
                                        <Star
                                            className={`h-5 w-5 ${star <= roundedRating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    </button>
                                ))}
                                <span className="ml-2 text-sm font-medium w-8">
                                    {rating.toFixed(1)}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
