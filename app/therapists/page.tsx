import { Suspense } from "react";
import TherapistsClient from "./TherapistsClient";

export default function TherapistsPage() {
  return (
    <Suspense fallback={
      <div className="p-10 min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200">
        Se încarcă...
      </div>
    }>
      <TherapistsClient />
    </Suspense>
  );
}
