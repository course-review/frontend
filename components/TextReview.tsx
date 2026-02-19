'use client';

interface TextReviewProps {
    review: string;
    semester: string;
}

export function TextReview({ review, semester }: TextReviewProps) {
    return (
        <div className="p-4 border rounded-lg bg-card text-muted-foreground">
            <p className="text-sm whitespace-pre-wrap text-foreground mb-1">{review}</p>
            {semester && (
                <div className="flex justify-end">
                    <span className="text-xs italic opacity-70">
                        {semester}
                    </span>
                </div>
            )}
        </div>
    );
}
