'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CourseSelection {
    courseNumber: string;
    courseName: string;
}

interface CourseComparisonContextType {
    selectedCourses: CourseSelection[];
    canAddMoreCourses: boolean;
    hasSelectedCourses: boolean;
    selectedCoursesCount: number;
    maxCourses: number;
    isCourseSelected: (courseNumber: string) => boolean;
    addCourse: (courseNumber: string, courseName: string) => boolean;
    removeCourse: (courseNumber: string) => boolean;
    toggleCourse: (courseNumber: string, courseName: string) => boolean;
    clearSelection: () => void;
}

const CourseComparisonContext = createContext<CourseComparisonContextType | undefined>(
    undefined
);

const STORAGE_KEY = 'courseComparison_selectedCourses';
const MAX_COURSES = 5;

export function CourseComparisonProvider({ children }: { children: ReactNode }) {
    const [selectedCourses, setSelectedCourses] = useState<CourseSelection[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setSelectedCourses(JSON.parse(stored));
            }
        } catch (error) {
            console.warn('Failed to load course comparison data from localStorage:', error);
        }
        setIsInitialized(true);
    }, []);

    // Save to localStorage whenever selection changes
    useEffect(() => {
        if (isInitialized) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedCourses));
            } catch (error) {
                console.warn('Failed to save course comparison data to localStorage:', error);
            }
        }
    }, [selectedCourses, isInitialized]);

    const isCourseSelected = (courseNumber: string): boolean => {
        return selectedCourses.some((course) => course.courseNumber === courseNumber);
    };

    const addCourse = (courseNumber: string, courseName: string): boolean => {
        if (selectedCourses.length >= MAX_COURSES) {
            console.warn('Cannot add more courses. Maximum limit reached.');
            return false;
        }

        if (isCourseSelected(courseNumber)) {
            console.warn('Course already selected for comparison.');
            return false;
        }

        setSelectedCourses([...selectedCourses, { courseNumber, courseName }]);
        return true;
    };

    const removeCourse = (courseNumber: string): boolean => {
        const index = selectedCourses.findIndex(
            (course) => course.courseNumber === courseNumber
        );
        if (index >= 0) {
            setSelectedCourses(selectedCourses.filter((_, i) => i !== index));
            return true;
        }
        return false;
    };

    const toggleCourse = (courseNumber: string, courseName: string): boolean => {
        if (isCourseSelected(courseNumber)) {
            return removeCourse(courseNumber);
        } else {
            return addCourse(courseNumber, courseName);
        }
    };

    const clearSelection = () => {
        setSelectedCourses([]);
    };

    const value = {
        selectedCourses,
        canAddMoreCourses: selectedCourses.length < MAX_COURSES,
        hasSelectedCourses: selectedCourses.length > 0,
        selectedCoursesCount: selectedCourses.length,
        maxCourses: MAX_COURSES,
        isCourseSelected,
        addCourse,
        removeCourse,
        toggleCourse,
        clearSelection,
    };

    return (
        <CourseComparisonContext.Provider value={value}>
            {children}
        </CourseComparisonContext.Provider>
    );
}

export function useCourseComparison() {
    const context = useContext(CourseComparisonContext);
    if (context === undefined) {
        throw new Error('useCourseComparison must be used within a CourseComparisonProvider');
    }
    return context;
}
