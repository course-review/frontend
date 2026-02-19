'use client';

import Link from 'next/link';
import { Github, Mail, Info } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t mt-auto">
            <div className="container max-w-screen-xl mx-auto px-4 py-6">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <div className="flex items-center gap-2">
                        <Link
                            href="https://github.com/orgs/course-review/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-accent rounded-md transition-colors"
                            title="GitHub"
                        >
                            <Github className="h-5 w-5" />
                        </Link>
                        <Link
                            href="mailto:contact@coursereview.ch"
                            className="p-2 hover:bg-accent rounded-md transition-colors"
                            title="Email"
                        >
                            <Mail className="h-5 w-5" />
                        </Link>
                        <Link
                            href="/about"
                            className="p-2 hover:bg-accent rounded-md transition-colors"
                            title="About"
                        >
                            <Info className="h-5 w-5" />
                        </Link>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        <strong>CourseReview</strong> — {currentYear}
                    </p>
                </div>
            </div>
        </footer>
    );
}
