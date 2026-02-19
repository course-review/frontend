import Link from 'next/link';
import { fetchCoursesWithReviewsOrRatings } from '@/lib/api';

export default async function AllCoursesPage() {
    try {
        const courses = await fetchCoursesWithReviewsOrRatings();

        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">All Reviewed Courses</h1>
                    <p className="text-muted-foreground mt-1">
                        Browse all courses that have received reviews or ratings
                    </p>
                </div>

                {courses.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <Link
                                key={course.CourseNumber}
                                href={`/course/${course.CourseNumber}`}
                                className="block p-4 border rounded-lg hover:border-primary transition-colors"
                            >
                                <h3 className="font-semibold">{course.CourseNumber}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {course.CourseName}
                                </p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-12">
                        No reviewed courses found.
                    </p>
                )}
            </div>
        );
    } catch (error) {
        console.error('Error fetching courses:', error);
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">
                    Unable to load courses. Please try again later.
                </p>
            </div>
        );
    }
}
