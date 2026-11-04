import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-5xl font-black text-primary">404</p>
      <h1 className="mt-3 text-2xl font-bold">We couldn&apos;t find that page</h1>
      <p className="mt-2 text-muted-foreground">The bike or page you were looking for may have moved or been discontinued.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/bikes" className="inline-flex min-h-12 items-center rounded-xl bg-primary px-5 font-bold text-primary-foreground">Browse bikes</Link>
        <Link href="/" className="inline-flex min-h-12 items-center rounded-xl border border-border px-5 font-semibold">Home</Link>
      </div>
    </div>
  );
}
