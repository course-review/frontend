import { fetchName, fetchReviews, fetchRatings } from '@/lib/api';
import { RatingOverview } from '@/components/RatingOverview';
import { TextReview } from '@/components/TextReview';
import { AddToCompareButton } from '@/components/AddToCompareButton';
import { defaultStarRatings } from '@/lib/api';
import type { Rating, Rating2, Review } from '@/types';
import { Metadata } from 'next';

interface CoursePageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
    const { id } = await params;
    try {
        const [courseName, ratingsData] = await Promise.all([
            fetchName(id),
            fetchRatings(id).catch(() => [] as Rating2[]),
        ]);

        const title = `${id}: ${courseName}`;

        // aggregate ratings
        const aggregated = aggregateRatings(ratingsData);

        const categories = [
            { key: 'Recommended', label: 'Would recommend it' },
            { key: 'Engaging', label: 'Interesting content' },
            { key: 'Difficulty', label: 'Appropriate difficulty' },
            { key: 'Effort', label: 'Appropriate amount of effort' },
            { key: 'Resources', label: 'Amount and quality of resources' },
        ];

        const descriptionParts = categories.map(({ key, label }) => {
            const score = aggregated[key]?.rating || 0;
            return score > 0 ? `[${label}: ${score.toFixed(2)}]` : null;
        }).filter(Boolean);

        const description = descriptionParts.length > 0
            ? descriptionParts.join(' ')
            : `Read reviews and ratings for ${id} - ${courseName} at ETH Zurich.`;

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                type: 'article',
            },
        };
    } catch {
        return {
            title: 'Course | CourseReview ETH',
        };
    }
}

export function aggregateRatings(ratingsData: Rating2[]): { [key: string]: Rating } {
    const aggregated = defaultStarRatings();

    if (!ratingsData || ratingsData.length === 0) {
        return aggregated;
    }

    // Count ratings by category and star value
    ratingsData.forEach((rating) => {
        Object.keys(rating).forEach((key) => {
            const value = Math.round(rating[key]);
            if (value >= 1 && value <= 5 && aggregated[key]) {
                const detailKey =
                    `${['one', 'two', 'three', 'four', 'five'][value - 1]}StarRatings` as keyof Rating['details'];
                aggregated[key].details[detailKey]++;
            }
        });
    });

    // Calculate averages
    Object.keys(aggregated).forEach((key) => {
        const details = aggregated[key].details;
        const total =
            details.oneStarRatings +
            details.twoStarRatings +
            details.threeStarRatings +
            details.fourStarRatings +
            details.fiveStarRatings;

        if (total > 0) {
            const sum =
                details.oneStarRatings * 1 +
                details.twoStarRatings * 2 +
                details.threeStarRatings * 3 +
                details.fourStarRatings * 4 +
                details.fiveStarRatings * 5;
            aggregated[key].rating = sum / total;
        }
    });

    return aggregated;
}

export default async function CoursePage({ params }: CoursePageProps) {
    const { id } = await params;

    let courseName: string;
    try {
        courseName = await fetchName(id);
    } catch (error) {
        console.error(`Error fetching course name for ${id}:`, error);
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
                <p className="text-muted-foreground">
                    Unable to verify course {id}
                </p>
            </div>
        );
    }

    const [reviews, ratingsData] = await Promise.all([
        fetchReviews(id).catch((err) => {
            console.warn(`Failed to fetch reviews for ${id}:`, err);
            return [] as Review[];
        }),
        fetchRatings(id).catch((err) => {
            console.warn(`Failed to fetch ratings for ${id}:`, err);
            return [] as Rating2[];
        }),
    ]);

    const aggregatedRatings = aggregateRatings(ratingsData);

    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{courseName}</h1>
                    <p className="text-xl text-muted-foreground mt-1">{id}</p>
                </div>
                <AddToCompareButton courseNumber={id} courseName={courseName} />
            </div>

            {ratingsData && ratingsData.length > 0 && (
                <div className="border rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Overall Ratings</h2>
                    <RatingOverview ratings={aggregatedRatings} />
                    <p className="text-sm text-muted-foreground mt-4">
                        Based on {ratingsData.length} rating{ratingsData.length !== 1 ? 's' : ''}
                    </p>
                </div>
            )}

            <div>
                <h2 className="text-xl font-semibold mb-4">
                    Reviews ({reviews?.length ?? 0})
                </h2>
                {reviews && reviews.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.map((review, index) => (
                            <TextReview
                                key={index}
                                review={review.Review}
                                semester={review.Semester}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">
                        No reviews yet. Be the first to review this course!
                    </p>
                )}
            </div>
        </div>
    );
}
