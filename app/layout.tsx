import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { AuthProvider } from '@/lib/AuthContext';
import { CourseComparisonProvider } from '@/lib/CourseComparisonContext';
import { fetchCoursesData } from '@/lib/api';
import { Analytics } from '@/components/Analytics';

export const metadata: Metadata = {
  title: {
    default: 'CourseReview ETH',
    template: '%s | CourseReview ETH',
  },
  description: 'A forum to rate and review all courses at ETH Zurich. CourseReview is a private initiative run by students.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://coursereview.ch',
    siteName: 'CourseReview ETH',
    title: 'CourseReview ETH',
    description: 'A forum to rate and review all courses at ETH Zurich',
  },
  metadataBase: new URL('https://coursereview.ch'),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch courses for the search functionality
  let courses: { label: string; path: string }[] = [];
  try {
    const coursesData = await fetchCoursesData();
    courses = coursesData.map((course) => ({
      label: `${course.CourseNumber} ${course.CourseName}`,
      path: course.CourseNumber,
    }));
  } catch (error) {
    console.error('Failed to fetch courses:', error);
  }

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <CourseComparisonProvider>
            <Navigation courses={courses} />
            <main className="flex-1 container max-w-screen-lg mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
            <Analytics />
          </CourseComparisonProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
