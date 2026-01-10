import TherapistPublicClient from "./TherapistPublicClient";

export default function TherapistProfilePage({ params }: any) {
    return <TherapistPublicClient id={params.id} />;
}
