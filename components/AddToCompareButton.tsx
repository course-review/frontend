'use client';

import { useCourseComparison } from '@/lib/CourseComparisonContext';
import { Plus, Check } from 'lucide-react';

interface AddToCompareButtonProps {
    courseNumber: string;
    courseName: string;
    className?: string;
}

export function AddToCompareButton({
    courseNumber,
    courseName,
    className = '',
}: AddToCompareButtonProps) {
    const comparison = useCourseComparison();
    const isSelected = comparison.isCourseSelected(courseNumber);

    const isMaxReached = !isSelected && !comparison.canAddMoreCourses;

    const handleClick = () => {
        if (isMaxReached) return;

        if (isSelected) {
            comparison.removeCourse(courseNumber);
        } else {
            comparison.addCourse(courseNumber, courseName);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isMaxReached}
            title={isMaxReached ? "Maximum courses reached" : ""}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isSelected
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : isMaxReached
                    ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50 border border-muted'
                    : 'border border-primary text-primary hover:bg-primary/10'
                } ${className}`}
        >
            {isSelected ? (
                <>
                    <Check className="h-4 w-4" />
                    <span>Added to Compare</span>
                </>
            ) : (
                <>
                    <Plus className="h-4 w-4" />
                    <span>Add to Compare</span>
                </>
            )}
        </button>
    );
}
