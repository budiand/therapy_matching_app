import BookClient from "./BookClient";

export default function BookPage({ params }: any) {
    return <BookClient therapistId={params.id} />;
}
