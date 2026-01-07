export default function TherapistCard({ therapist }: any) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
      <h2 className="text-xl font-semibold text-indigo-700">
        {therapist?.name ?? "Fără nume"}
      </h2>

      <p className="text-sm text-gray-600">
        {therapist?.specialization ?? "Specializare necunoscută"}
      </p>

      {therapist?.description ? (
        <p className="mt-3 text-gray-700 text-sm line-clamp-3">
          {therapist.description}
        </p>
      ) : (
        <p className="mt-3 text-gray-500 text-sm italic">
          Fără descriere
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {therapist?.city && (
          <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
            {therapist.city}
          </span>
        )}

        {therapist?.online && (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
            Online
          </span>
        )}
      </div>
    </div>
  );
}
