import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CSPostHogProvider } from "./providers";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});

const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Therapy Match",
    description: "Therapy matching platform",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ro" data-theme="cupcake">
        <body
            className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-base-200 text-base-content`}
        >
        <CSPostHogProvider>{children}</CSPostHogProvider>
        </body>
        </html>
    );
}
