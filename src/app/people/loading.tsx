export default function PeopleLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)', fontFamily: 'var(--font-sans)' }}>
      <header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b"
        style={{ backgroundColor: 'rgba(255, 253, 249, 0.9)', borderColor: 'var(--color-warm-border)' }}
      >
        <div className="max-w-2xl mx-auto px-6 py-3 flex justify-between items-center">
          <span className="text-sm" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>codevibing</span>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-6 pt-20 pb-12">
        <div className="mb-8">
          <div className="h-8 w-28 rounded bg-[#F5F0EB] animate-pulse mb-2" />
          <div className="h-4 w-56 rounded bg-[#F5F0EB] animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl p-4 border text-center" style={{ backgroundColor: 'white', borderColor: 'var(--color-warm-border)' }}>
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#F5F0EB] animate-pulse" />
              <div className="h-4 w-20 mx-auto rounded bg-[#F5F0EB] animate-pulse mb-1" />
              <div className="h-3 w-16 mx-auto rounded bg-[#F5F0EB] animate-pulse" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
