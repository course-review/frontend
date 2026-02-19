export default function AboutPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">About CourseReview</h1>

            <div className="space-y-4">
                <section>
                    <h2 className="text-xl font-semibold mb-2">What is CourseReview?</h2>
                    <p className="text-muted-foreground">
                        CourseReview is a platform for ETH Zurich students to share and read authentic
                        reviews about courses. It helps students make informed decisions about which
                        courses to take based on real experiences from fellow students.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">How It Works</h2>
                    <p className="text-muted-foreground mb-3">
                        CourseReview integrates with SwitchAAI (ETH's authentication system) to
                        verify that reviews come from actual ETH students. Here's how it works:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                        <li>Students log in using their ETH credentials via SwitchAAI</li>
                        <li>They can write reviews and rate courses on multiple criteria</li>
                        <li>Reviews are moderated before publication to ensure quality</li>
                        <li>Student privacy is maintained - only a unique ID is stored</li>
                    </ol>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">Privacy & Anonymity</h2>
                    <p className="text-muted-foreground">
                        We take your privacy seriously. When you submit a review, we only store your
                        unique ETH ID (e.g., "string-of-numbers@ethz.ch"). This allows you to edit
                        your reviews later while maintaining anonymity. Your name and other personal
                        information are never stored or displayed.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">Independent Initiative</h2>
                    <p className="text-muted-foreground">
                        CourseReview is neither supported by ETH Zurich nor by VSETH. It's a private
                        initiative run by students, for students.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">Contact</h2>
                    <p className="text-muted-foreground">
                        Questions, feedback, or issues? Reach out to us at{' '}
                        <a
                            href="mailto:contact@coursereview.ch"
                            className="text-primary hover:underline"
                        >
                            contact@coursereview.ch
                        </a>
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">Open Source</h2>
                    <p className="text-muted-foreground">
                        CourseReview is open source! Check out our code on{' '}
                        <a
                            href="https://github.com/orgs/course-review/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            GitHub
                        </a>
                        .
                    </p>
                </section>
            </div>
        </div>
    );
}
