'use client';

import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    type TooltipItem,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import type { Rating2 } from '@/types';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

interface ComparisonChartProps {
    courses: {
        courseNumber: string;
        courseName: string;
        ratings: Rating2[];
    }[];
}

const distinctColors = [
    { border: 'rgba(255, 99, 132, 1)', background: 'rgba(255, 99, 132, 0.2)' }, // Red
    { border: 'rgba(54, 162, 235, 1)', background: 'rgba(54, 162, 235, 0.2)' }, // Blue
    { border: 'rgba(255, 206, 86, 1)', background: 'rgba(255, 206, 86, 0.2)' }, // Yellow
    { border: 'rgba(75, 192, 192, 1)', background: 'rgba(75, 192, 192, 0.2)' }, // Teal
    { border: 'rgba(153, 102, 255, 1)', background: 'rgba(153, 102, 255, 0.2)' }, // Purple
];

const ratingCategories = [
    { key: 'Recommended', label: 'Recommended' },
    { key: 'Engaging', label: 'Engaging' },
    { key: 'Difficulty', label: 'Difficulty' },
    { key: 'Effort', label: 'Effort' },
    { key: 'Resources', label: 'Resources' },
];

export function ComparisonChart({ courses }: ComparisonChartProps) {
    const getAverageRating = (ratings: Rating2[], category: string): number => {
        const categoryRatings = ratings
            .map((r) => r[category as keyof Rating2])
            .filter((r) => r !== undefined && r !== null && typeof r === 'number');

        if (categoryRatings.length === 0) return 0;

        const sum = categoryRatings.reduce((acc, val) => acc + (val as number), 0);
        return Math.round((sum / categoryRatings.length) * 10) / 10;
    };

    const data = {
        labels: ratingCategories.map((cat) => cat.label),
        datasets: courses.map((course, index) => {
            const color = distinctColors[index % distinctColors.length];
            return {
                label: `${course.courseNumber} - ${course.courseName}`,
                data: ratingCategories.map((cat) => getAverageRating(course.ratings, cat.key)),
                backgroundColor: color.background,
                borderColor: color.border,
                borderWidth: 2,
                pointBackgroundColor: color.border,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: color.border,
            };
        }),
    };

    const options = {
        scales: {
            r: {
                angleLines: {
                    color: 'rgba(128, 128, 128, 0.2)',
                },
                grid: {
                    color: 'rgba(128, 128, 128, 0.2)',
                },
                pointLabels: {
                    color: 'rgba(156, 163, 175, 1)', // text-muted-foreground / gray-400
                    font: {
                        size: 12,
                    },
                },
                ticks: {
                    display: false, // Hide numeric ticks on the axis lines for cleaner look
                    stepSize: 1,
                    backdropColor: 'transparent',
                },
                suggestedMin: 0,
                suggestedMax: 5,
            },
        },
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: 'rgba(156, 163, 175, 1)', // text-muted-foreground / gray-400
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context: TooltipItem<'radar'>) {
                        return `${context.dataset.label}: ${context.raw}`;
                    },
                },
            },
        },
        maintainAspectRatio: false,
        responsive: true,
    };

    return (
        <div className="w-full h-[400px] flex items-center justify-center p-4">
            <Radar data={data} options={options} />
        </div>
    );
}
