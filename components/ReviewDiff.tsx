'use client';

import { diffWords } from 'diff';
import { useMemo } from 'react';

interface ReviewDiffProps {
    oldText?: string;
    newText: string;
}

export function ReviewDiff({ oldText, newText }: ReviewDiffProps) {
    const diffs = useMemo(() => {
        // If there is no old text (new review), just return the new text as added
        if (!oldText) {
            return [{ value: newText, added: true, removed: false }];
        }
        return diffWords(oldText, newText);
    }, [oldText, newText]);

    if (!oldText) {
        return <p className="text-sm whitespace-pre-wrap">{newText}</p>;
    }

    return (
        <div className="text-sm whitespace-pre-wrap">
            {diffs.map((part, index) => {
                const color = part.added
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : part.removed
                        ? 'bg-red-100 text-red-800 line-through dark:bg-red-900/30 dark:text-red-300'
                        : '';
                return (
                    <span key={index} className={color}>
                        {part.value}
                    </span>
                );
            })}
        </div>
    );
}
