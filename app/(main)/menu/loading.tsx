export default function Loading() {
  return (
    <section className="py-16 bg-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl h-72 animate-pulse"
            />
          ))}
        </div>
      </div>
    </section>
  );
}