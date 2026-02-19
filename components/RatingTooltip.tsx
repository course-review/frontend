'use client';

import { Star } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface RatingDistribution {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
}

interface RatingTooltipProps {
    children: React.ReactNode;
    counts: RatingDistribution;
    total: number;
    className?: string;
}

export function RatingTooltip({ children, counts, total, className = '' }: RatingTooltipProps) {
    if (total === 0) return <>{children}</>;

    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild className={className}>
                    {children}
                </TooltipTrigger>
                <TooltipContent className="bg-popover text-popover-foreground border shadow-lg p-4 w-64">
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = counts[star as keyof RatingDistribution];
                            const percentage = total > 0 ? (count / total) * 100 : 0;

                            return (
                                <div key={star} className="flex items-center gap-3 text-sm">
                                    <div className="flex items-center gap-1 w-8">
                                        <span className="font-medium">{star}</span>
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    </div>
                                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-400 rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <div className="w-8 text-right font-medium text-muted-foreground">
                                        {count}
                                    </div>
                                </div>
                            );
                        })}
                        <div className="pt-2 mt-2 border-t font-medium text-center text-xs text-muted-foreground">
                            {total} rating{total !== 1 ? 's' : ''}
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
