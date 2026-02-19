'use client';

import { useEffect, useState } from 'react';
import { useCourseComparison } from '@/lib/CourseComparisonContext';
import { fetchRatings, fetchReviews } from '@/lib/api';
import type { Rating2 } from '@/types';
import { X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { ComparisonChart } from '@/components/ComparisonChart';
import { RatingTooltip } from '@/components/RatingTooltip';

const ratingCategories = [
    { key: 'Recommended', label: 'I would recommend it' },
    { key: 'Engaging', label: 'The content is interesting' },
    { key: 'Difficulty', label: 'The difficulty is appropriate' },
    { key: 'Effort', label: 'The required effort is appropriate' },
    { key: 'Resources', label: 'The resources are useful' },
];

interface CourseRatingsData {
    [courseNumber: string]: Rating2[];
}

export default function ComparePage() {
    const comparison = useCourseComparison();
    const [courseRatings, setCourseRatings] = useState<CourseRatingsData>({});
    const [courseReviewCounts, setCourseReviewCounts] = useState<{ [key: string]: number }>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (comparison.selectedCourses.length === 0) {
                setCourseRatings({});
                setCourseReviewCounts({});
                return;
            }

            setLoading(true);
            const newRatings: CourseRatingsData = {};
            const newReviewCounts: { [key: string]: number } = {};

            await Promise.all(
                comparison.selectedCourses.map(async (course) => {
                    try {
                        const [ratings, reviews] = await Promise.all([
                            fetchRatings(course.courseNumber),
                            fetchReviews(course.courseNumber)
                        ]);
                        newRatings[course.courseNumber] = ratings || [];
                        newReviewCounts[course.courseNumber] = reviews?.length || 0;
                    } catch (error) {
                        console.error(`Failed to load data for ${course.courseNumber}:`, error);
                        newRatings[course.courseNumber] = [];
                        newReviewCounts[course.courseNumber] = 0;
                    }
                })
            );

            setCourseRatings(newRatings);
            setCourseReviewCounts(newReviewCounts);
            setLoading(false);
        };

        loadData();
    }, [comparison.selectedCourses]);

    const getAverageRating = (courseNumber: string, category: string): number | null => {
        const ratings = courseRatings[courseNumber];
        if (!ratings || ratings.length === 0) return null;

        const categoryRatings = ratings
            .map((r) => r[category as keyof Rating2])
            .filter((r) => r !== undefined && r !== null);

        if (categoryRatings.length === 0) return null;

        const sum = categoryRatings.reduce((acc, val) => acc + val, 0);
        return Math.round((sum / categoryRatings.length) * 10) / 10;
    };

    const getRatingCount = (courseNumber: string): number => {
        return courseRatings[courseNumber]?.length || 0;
    };

    const getReviewCount = (courseNumber: string): number => {
        return courseReviewCounts[courseNumber] || 0;
    };

    // Prepare data for chart
    const chartData = comparison.selectedCourses.map(course => ({
        courseNumber: course.courseNumber,
        courseName: course.courseName,
        ratings: courseRatings[course.courseNumber] || []
    }));

    if (comparison.selectedCourses.length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Compare Courses</h1>
                    <p className="text-muted-foreground mt-1">
                        Compare ratings and reviews across multiple courses
                    </p>
                </div>

                <div className="border rounded-lg p-12 text-center">
                    <div className="max-w-md mx-auto space-y-4">
                        <div className="text-6xl">📊</div>
                        <h2 className="text-2xl font-semibold">No courses selected</h2>
                        <p className="text-muted-foreground">
                            Visit course pages and click the &quot;Add to Compare&quot; button to add courses for
                            comparison.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            You can compare up to {comparison.maxCourses} courses at once.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Compare Courses</h1>
                <p className="text-muted-foreground mt-1">
                    Comparing {comparison.selectedCoursesCount} of {comparison.maxCourses} courses
                </p>
            </div>

            {/* Selected Courses */}
            <div className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Selected Courses</h2>
                    <button
                        onClick={comparison.clearSelection}
                        className="text-sm text-destructive hover:text-destructive/80"
                    >
                        Clear All
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {comparison.selectedCourses.map((course) => (
                        <div
                            key={course.courseNumber}
                            className="flex items-center gap-2 px-3 py-2 bg-accent rounded-lg"
                        >
                            <Link
                                href={`/course/${course.courseNumber}`}
                                target="_blank"
                                className="hover:underline flex items-center gap-1"
                            >
                                <span className="font-medium">{course.courseNumber}</span>
                                <span className="text-muted-foreground hidden sm:inline truncate max-w-[200px]">
                                    - {course.courseName}
                                </span>
                                <ExternalLink className="h-3 w-3" />
                            </Link>
                            <button
                                onClick={() => comparison.removeCourse(course.courseNumber)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading course data...</p>
                </div>
            ) : (
                <>
                    {/* Comparison Chart */}
                    <div className="border rounded-lg p-6 bg-card">
                        <h2 className="text-xl font-semibold mb-4">Rating Profile</h2>
                        <ComparisonChart courses={chartData} />
                    </div>

                    {/* Comparison Table */}
                    <div className="border rounded-lg overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="text-left p-4 font-semibold">Course</th>
                                    <th className="text-center p-4 font-semibold"># Ratings</th>
                                    {ratingCategories.map((cat) => (
                                        <th key={cat.key} className="text-center p-4 font-semibold">
                                            {cat.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {comparison.selectedCourses.map((course, idx) => (
                                    <tr
                                        key={course.courseNumber}
                                        className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/30'}
                                    >
                                        <td className="p-4">
                                            <div>
                                                <div className="text-sm text-muted-foreground">
                                                    {course.courseNumber}
                                                </div>
                                                <Link
                                                    href={`/course/${course.courseNumber}`}
                                                    target="_blank"
                                                    className="font-medium hover:underline"
                                                >
                                                    {course.courseName}
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="text-center p-4">
                                            {getRatingCount(course.courseNumber)}
                                        </td>
                                        {ratingCategories.map((cat) => {
                                            const ratings = courseRatings[course.courseNumber];
                                            const rating = getAverageRating(course.courseNumber, cat.key);

                                            // Calculate detailed counts for tooltip
                                            const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
                                            if (ratings && ratings.length > 0) {
                                                ratings.forEach(r => {
                                                    const val = Math.round(r[cat.key as keyof Rating2] as number);
                                                    if (val >= 1 && val <= 5) {
                                                        counts[val as keyof typeof counts]++;
                                                    }
                                                });
                                            }

                                            return (
                                                <td key={cat.key} className="text-center p-4">
                                                    <RatingTooltip
                                                        counts={counts}
                                                        total={ratings?.length || 0}
                                                        className="cursor-pointer"
                                                    >
                                                        <span
                                                            className={`font-medium border-b border-dotted border-muted-foreground/30 ${rating === null
                                                                ? 'text-muted-foreground'
                                                                : rating >= 4
                                                                    ? 'text-green-600'
                                                                    : rating >= 3
                                                                        ? 'text-yellow-600'
                                                                        : 'text-red-600'
                                                                }`}
                                                        >
                                                            {rating !== null ? rating.toFixed(1) : 'N/A'}
                                                        </span>
                                                    </RatingTooltip>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="border rounded-lg p-4">
                            <h3 className="font-semibold mb-2">Top Rated Course (Overall)</h3>
                            {(() => {
                                const averages = comparison.selectedCourses.map((course) => {
                                    const ratings = ratingCategories
                                        .map((cat) => getAverageRating(course.courseNumber, cat.key))
                                        .filter((r) => r !== null) as number[];
                                    const avg =
                                        ratings.length > 0
                                            ? ratings.reduce((a, b) => a + b) / ratings.length
                                            : 0;
                                    return { course, avg };
                                });
                                const best = averages.reduce((a, b) => (a.avg > b.avg ? a : b));
                                return (
                                    <div>
                                        <div className="font-medium">
                                            {best.course.courseNumber} - {best.course.courseName}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Average: {best.avg.toFixed(1)} / 5.0
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        <div className="border rounded-lg p-4">
                            <h3 className="font-semibold mb-2">Most Reviewed</h3>
                            {(() => {
                                const reviewed = comparison.selectedCourses.map((course) => ({
                                    course,
                                    count: getReviewCount(course.courseNumber),
                                }));
                                const most = reviewed.reduce((a, b) => (a.count > b.count ? a : b));
                                return (
                                    <div>
                                        <div className="font-medium">
                                            {most.course.courseNumber} - {most.course.courseName}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {most.count} review{most.count !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
