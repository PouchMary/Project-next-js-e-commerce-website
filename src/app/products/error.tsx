"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold">
          Something went wrong!
        </h2>

        <p className="mt-2 text-gray-500">
          We couldn't load the products.
        </p>

        <button
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-black px-6 py-3 text-white"
        >
          Try again
        </button>
      </div>
    </main>
  );
}