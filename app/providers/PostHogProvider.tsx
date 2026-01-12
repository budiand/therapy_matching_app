"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

export default function PHProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (typeof window === "undefined") return;

        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
            api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
            capture_pageview: true,      // web analytics
            capture_pageleave: true,
        });
    }, []);

    return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
