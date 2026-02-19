'use client';

import { Star, StarHalf, Info } from 'lucide-react';
import type { Rating } from '@/types';
import { RatingTooltip } from './RatingTooltip';

interface RatingOverviewProps {
    ratings: { [key: string]: Rating };
    className?: string;
}

const categories = [
    { key: 'Recommended', label: 'I would recommend it' },
    { key: 'Engaging', label: 'The content is interesting' },
    { key: 'Difficulty', label: 'The difficulty is appropriate' },
    { key: 'Effort', label: 'The required effort is appropriate' },
    { key: 'Resources', label: 'The resources are useful' },
];

export function RatingOverview({ ratings, className = '' }: RatingOverviewProps) {
    return (
        <div className={`space-y-4 ${className}`}>
            {categories.map(({ key, label }) => {
                const rating = ratings[key]?.rating || 0;
                const details = ratings[key]?.details;

                const counts = {
                    5: details?.fiveStarRatings || 0,
                    4: details?.fourStarRatings || 0,
                    3: details?.threeStarRatings || 0,
                    2: details?.twoStarRatings || 0,
                    1: details?.oneStarRatings || 0,
                };

                const total = Object.values(counts).reduce((a, b) => a + b, 0);

                return (
                    <div key={key} className="flex items-center justify-between group py-1">
                        <span className="text-sm text-foreground/90 font-medium">{label}:</span>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold tabular-nums w-8 text-right">
                                {rating > 0 ? rating.toFixed(1) : '-'}
                            </span>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => {
                                    // Custom visual rounding logic
                                    // >= 0.75 -> round up to next full star
                                    // < 0.25 -> round down to current full star
                                    // 0.25 - 0.75 -> half star
                                    const decimal = rating % 1;
                                    let effectiveRating;

                                    if (decimal >= 0.75) {
                                        effectiveRating = Math.ceil(rating);
                                    } else if (decimal < 0.25) {
                                        effectiveRating = Math.floor(rating);
                                    } else {
                                        effectiveRating = Math.floor(rating) + 0.5;
                                    }

                                    const isFull = star <= Math.floor(effectiveRating);
                                    const isHalf = !isFull && star === Math.ceil(effectiveRating) && effectiveRating % 1 !== 0;

                                    if (isHalf) {
                                        return (
                                            <div key={star} className="relative">
                                                <Star className="h-5 w-5 text-muted/30 stroke-muted-foreground/30 absolute top-0 left-0" />
                                                <StarHalf className="h-5 w-5 fill-yellow-400 text-yellow-400 relative z-10" />
                                            </div>
                                        );
                                    }

                                    return (
                                        <Star
                                            key={star}
                                            className={`h-5 w-5 ${isFull
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-muted/30 stroke-muted-foreground/30'
                                                }`}
                                        />
                                    );
                                })}
                            </div>
                            <RatingTooltip counts={counts} total={total}>
                                <Info className="h-4 w-4 text-muted-foreground/50 hover:text-foreground cursor-pointer transition-colors" />
                            </RatingTooltip>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
