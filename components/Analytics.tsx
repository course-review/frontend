'use client';

import Script from 'next/script';

export function Analytics() {
    const scriptUrl = process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL;
    const websiteId = process.env.NEXT_PUBLIC_ANALYTICS_WEBSITE_ID;

    if (!scriptUrl || !websiteId) {
        return null;
    }

    return (
        <Script
            defer
            src={scriptUrl}
            data-website-id={websiteId}
            strategy="afterInteractive"
        />
    );
}
