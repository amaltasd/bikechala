export default function Loading() {
  return (
    <div className="container mx-auto max-w-7xl space-y-4 px-4 py-6" aria-busy="true" aria-label="Loading">
      <div className="skeleton h-8 w-2/3" />
      {[0, 1, 2].map((i) => <div key={i} className="skeleton h-24 w-full" />)}
    </div>
  );
}
