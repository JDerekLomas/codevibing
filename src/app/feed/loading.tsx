export default function FeedLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}>
      <main className="max-w-2xl mx-auto px-6 pt-20 pb-12">
        <div className="mb-8">
          <div className="h-8 w-24 rounded bg-[#F5F0EB] animate-pulse mb-2" />
          <div className="h-4 w-64 rounded bg-[#F5F0EB] animate-pulse" />
        </div>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl p-5 border" style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#F5F0EB] animate-pulse" />
                <div>
                  <div className="h-4 w-24 rounded bg-[#F5F0EB] animate-pulse mb-1" />
                  <div className="h-3 w-40 rounded bg-[#F5F0EB] animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-[#F5F0EB] animate-pulse" />
                <div className="h-3 w-3/4 rounded bg-[#F5F0EB] animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
