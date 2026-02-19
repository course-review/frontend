import { fetchCoursesWithReviewAmount } from '@/lib/api';
import { CoursesList } from '@/components/CoursesList';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
    const courses = await fetchCoursesWithReviewAmount();

    return (
        <div className="container py-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
                <p className="text-muted-foreground mt-2">
                    Browse all courses and their review counts.
                </p>
            </div>

            <CoursesList initialCourses={courses} />
        </div>
    );
}
