import { Suspense } from "react";
import MatchesClient from "./MatchesClient";

export default function MatchesPage() {
    return (
        <Suspense
            fallback={
                <div className="p-10 min-h-screen bg-gray-50">
                    Loading matches...
                </div>
            }
        >
            <MatchesClient />
        </Suspense>
    );
}
