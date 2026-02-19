'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useMemo } from 'react';
import { Menu, Search, Sun, Moon, Plus, BarChart3, User } from 'lucide-react';
import { useCourseComparison } from '@/lib/CourseComparisonContext';

interface NavigationProps {
    courses: { label: string; path: string }[];
}

export function Navigation({ courses }: NavigationProps) {
    const pathname = usePathname();
    const comparison = useCourseComparison();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    const addReviewPath = useMemo(() => {
        // Extract course ID from pathname if on a course page
        const match = pathname?.match(/^\/course\/(.+)$/);
        if (match) {
            return `/add?id=${match[1]}`;
        }
        return '/add';
    }, [pathname]);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', newTheme);
    };

    // Simple fuzzy filter for course search
    const filteredCourses = useMemo(() => {
        if (!searchQuery) return courses.slice(0, 10); // Show first 10 when empty

        const query = searchQuery.toLowerCase();
        return courses
            .filter(course => course.label.toLowerCase().includes(query))
            .slice(0, 10); // Limit results
    }, [searchQuery, courses]);

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container max-w-screen-xl mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="text-2xl font-bold italic hover:opacity-80 transition-opacity"
                        >
                            <span className="hidden sm:inline">CourseReview</span>
                            <span className="sm:hidden">CR</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Course Search */}
                        <div className="relative w-64">
                            <input
                                type="text"
                                placeholder="Course Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-3 py-2 pr-10 border rounded-md bg-background"
                            />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                            {/* Search Dropdown */}
                            {searchQuery && (
                                <div className="absolute top-full mt-1 w-full max-w-md bg-popover border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
                                    {filteredCourses.length > 0 ? (
                                        filteredCourses.map((course) => (
                                            <Link
                                                key={course.path}
                                                href={`/course/${course.path}`}
                                                onClick={() => setSearchQuery('')}
                                                className="block px-4 py-2 hover:bg-accent transition-colors"
                                            >
                                                {course.label}
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-muted-foreground">
                                            No course found.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <Link
                            href={addReviewPath}
                            className="p-2 hover:bg-accent rounded-md transition-colors"
                            title="Add a Review"
                        >
                            <Plus className="h-5 w-5" />
                        </Link>

                        <Link
                            href="/compare"
                            className="relative p-2 hover:bg-accent rounded-md transition-colors"
                            title="Compare Courses"
                        >
                            <BarChart3 className="h-5 w-5" />
                            {comparison.selectedCoursesCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                    {comparison.selectedCoursesCount}
                                </span>
                            )}
                        </Link>

                        <Link
                            href="/user"
                            className="p-2 hover:bg-accent rounded-md transition-colors"
                            title="My Reviews"
                        >
                            <User className="h-5 w-5" />
                        </Link>

                        <button
                            onClick={toggleTheme}
                            className="p-2 hover:bg-accent rounded-md transition-colors"
                            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        >
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 hover:bg-accent rounded-md"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 space-y-2">
                        <Link
                            href={addReviewPath}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-md"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Plus className="h-5 w-5" />
                            Add a Review
                        </Link>
                        <Link
                            href="/compare"
                            className="flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-md"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <BarChart3 className="h-5 w-5" />
                            Compare Courses
                            {comparison.selectedCoursesCount > 0 && (
                                <span className="ml-auto bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                                    {comparison.selectedCoursesCount}
                                </span>
                            )}
                        </Link>
                        <Link
                            href="/user"
                            className="flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-md"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <User className="h-5 w-5" />
                            My Reviews
                        </Link>
                        <button
                            onClick={() => {
                                toggleTheme();
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-md w-full text-left"
                        >
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
