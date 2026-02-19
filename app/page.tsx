import Link from 'next/link';
import { fetchStats, fetchLatestReviews } from '@/lib/api';

import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const stats = await fetchStats();
    return {
      description: `Review courses from ETHZ: ${stats.TotalReviews} reviews & ratings for ${stats.TotalCourses} courses`,
      openGraph: {
        description: `Review courses from ETHZ: ${stats.TotalReviews} reviews & ratings for ${stats.TotalCourses} courses`,
      },
    };
  } catch (error) {
    return {
      description: 'A forum to rate and review all courses at ETH Zurich.',
    };
  }
}

export default async function HomePage() {
  let stats;
  let latestReviews;

  try {
    [stats, latestReviews] = await Promise.all([fetchStats(), fetchLatestReviews()]);
  } catch (error) {
    console.error('Failed to fetch homepage data:', error);
  }

  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">CourseReview ETH</h1>
        <p className="text-xl text-muted-foreground mb-2">
          A forum to rate and review all courses at ETH Zurich
        </p>
        <p className="text-sm text-muted-foreground">
          CourseReview is neither supported by ETH nor by VSETH, it&apos;s a private initiative
          run by students.
        </p>
      </section>

      {stats && (
        <section className="grid gap-6 md:grid-cols-2">
          <Link href="/courses" className="p-6 border rounded-lg text-center hover:border-primary transition-colors block">
            <div className="text-4xl font-bold text-primary">{stats.TotalCourses}</div>
            <p className="text-muted-foreground mt-2">Total Courses</p>
          </Link>
          <div className="p-6 border rounded-lg text-center">
            <div className="text-4xl font-bold text-primary">{stats.TotalReviews}</div>
            <p className="text-muted-foreground mt-2">Total Reviews</p>
          </div>
        </section>
      )}

      {latestReviews && latestReviews.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Latest Reviews</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {latestReviews.slice(0, 6).map((course) => (
              <Link
                key={course.CourseNumber}
                href={`/course/${course.CourseNumber}`}
                className="p-4 border rounded-lg hover:border-primary transition-colors"
              >
                <h3 className="font-semibold">{course.CourseNumber}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.CourseName}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(course.Date).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-6 md:grid-cols-3">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Search Courses</h2>
          <p className="text-muted-foreground">
            Use the search bar above to find any course at ETH Zurich
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Read Reviews</h2>
          <p className="text-muted-foreground">
            Browse authentic student reviews and ratings for courses
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Share Your Experience</h2>
          <p className="text-muted-foreground">
            Help other students by sharing your course experiences
          </p>
        </div>
      </section>
    </div>
  );
}
