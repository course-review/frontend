'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpDown, Search } from 'lucide-react';
import type { CourseWithAmount } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface CoursesListProps {
    initialCourses: CourseWithAmount[];
}

type SortKey = 'CourseNumber' | 'CourseName' | 'Count';
type SortDirection = 'asc' | 'desc';

export function CoursesList({ initialCourses }: CoursesListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showZeroReviews, setShowZeroReviews] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
        key: 'Count',
        direction: 'desc',
    });

    const requestSort = (key: SortKey) => {
        let direction: SortDirection = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredAndSortedCourses = useMemo(() => {
        let result = [...initialCourses];

        // Filter out zero reviews if not enabled
        if (!showZeroReviews) {
            result = result.filter(course => course.Count > 0);
        }

        // Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (course) =>
                    course.CourseName.toLowerCase().includes(query) ||
                    course.CourseNumber.toLowerCase().includes(query)
            );
        }

        // Sort
        result.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [initialCourses, searchQuery, sortConfig, showZeroReviews]);

    const [visibleCount, setVisibleCount] = useState(50);
    const visibleCourses = useMemo(() => filteredAndSortedCourses.slice(0, visibleCount), [filteredAndSortedCourses, visibleCount]);

    // Reset visible count when search or sort changes
    useEffect(() => {
        setVisibleCount(50);
    }, [searchQuery, sortConfig, showZeroReviews]);

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Button
                    variant={showZeroReviews ? "default" : "outline"}
                    onClick={() => setShowZeroReviews(!showZeroReviews)}
                    className="ml-auto"
                >
                    {showZeroReviews ? "Hide" : "Show"} courses with no reviews
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Courses ({filteredAndSortedCourses.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[150px]">
                                        <Button
                                            variant="ghost"
                                            onClick={() => requestSort('CourseNumber')}
                                            className="-ml-4 h-8 data-[state=open]:bg-accent"
                                        >
                                            Number
                                            {sortConfig.key === 'CourseNumber' && (
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            )}
                                        </Button>
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                        <Button
                                            variant="ghost"
                                            onClick={() => requestSort('CourseName')}
                                            className="-ml-4 h-8 data-[state=open]:bg-accent"
                                        >
                                            Name
                                            {sortConfig.key === 'CourseName' && (
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            )}
                                        </Button>
                                    </th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[150px]">
                                        <Button
                                            variant="ghost"
                                            onClick={() => requestSort('Count')}
                                            className="h-8 data-[state=open]:bg-accent px-2"
                                        >
                                            Reviews
                                            {sortConfig.key === 'Count' && (
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            )}
                                        </Button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {visibleCourses.map((course) => (
                                    <tr
                                        key={course.CourseNumber}
                                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                    >
                                        <td className="p-4 align-middle font-medium">
                                            <Link
                                                href={`/course/${course.CourseNumber}`}
                                                className="hover:underline text-primary"
                                            >
                                                {course.CourseNumber}
                                            </Link>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Link
                                                href={`/course/${course.CourseNumber}`}
                                                className="hover:underline"
                                            >
                                                {course.CourseName}
                                            </Link>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            {course.Count}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {filteredAndSortedCourses.length > visibleCount && (
                <div className="flex justify-center pt-4">
                    <Button
                        variant="outline"
                        onClick={() => setVisibleCount((prev) => prev + 50)}
                        className="w-full max-w-xs"
                    >
                        Show More
                    </Button>
                </div>
            )}
        </div>
    );
}
