/** Скелетон для страниц кабинета во время загрузки. */
export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 animate-pulse" aria-busy="true" aria-label="Загрузка">
      <div className="h-3 w-24 bg-line rounded-full mb-4" />
      <div className="h-8 w-72 bg-line rounded-xl mb-10" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-2xl border border-line card-solid" />
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-64 rounded-2xl border border-line card-solid" />
        <div className="h-64 rounded-2xl border border-line card-solid" />
      </div>
    </div>
  );
}
