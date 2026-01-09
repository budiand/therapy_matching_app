import connectMongo from "@/db/mongoose";
import Therapist from "@/models/Therapist";
import Link from "next/link";
import BookSessionButton from "../../components/BookSessionButton";


export const dynamic = "force-dynamic";

type PageProps = {
    params: { id: string };
};

type TherapistDoc = {
    _id: string;
    name: string;
    city: string;
    online: boolean;
    priceRange?: string;
    description?: string;
    specialization?: string;
    approaches?: string[];
};

export default async function TherapistProfilePage({ params }: PageProps) {
    await connectMongo();

    // IMPORTANT: findById -> returnează obiect sau null (nu array)
    const therapist = (await Therapist.findById(params.id).lean()) as TherapistDoc | null;

    if (!therapist) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white border rounded-2xl p-6">
                    <div className="text-lg font-semibold">Therapist not found</div>
                    <Link
                        href="/therapists"
                        className="inline-block mt-4 text-indigo-600 hover:underline"
                    >
                        Back to therapists
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 py-10">
                <Link
                    href="/therapists"
                    className="text-sm text-indigo-600 hover:underline"
                >
                    ← Back to therapists
                </Link>

                <div className="bg-white border rounded-2xl p-6 shadow-sm mt-4">
                    <h1 className="text-2xl font-bold">{therapist.name}</h1>

                    <p className="text-gray-600 mt-2">
                        {therapist.city} • {therapist.online ? "Online available" : "In-person only"}
                        {therapist.priceRange ? ` • ${therapist.priceRange}` : ""}
                    </p>

                    {therapist.specialization ? (
                        <p className="mt-4 text-sm">
                            <span className="font-medium">Specialization:</span>{" "}
                            {therapist.specialization}
                        </p>
                    ) : null}

                    {therapist.approaches?.length ? (
                        <p className="mt-2 text-sm">
                            <span className="font-medium">Approaches:</span>{" "}
                            {therapist.approaches.join(", ")}
                        </p>
                    ) : null}

                    {therapist.description ? (
                        <p className="mt-4 text-gray-700">{therapist.description}</p>
                    ) : (
                        <p className="mt-4 text-gray-500">No description provided.</p>
                    )}

                    <div className="mt-6 flex gap-2">
                    {/* Booking real – Client Component */}
                    <BookSessionButton therapistName={therapist.name} />

                    {/* Pas viitor */}
                    <button
                        className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
                        onClick={() => alert("Next: availability calendar")}
                    >
                        View availability
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
