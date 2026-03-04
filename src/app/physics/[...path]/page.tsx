interface Props {
  params: Promise<{ path: string[] }>;
}

export default async function PhysicsSubPage({ params }: Props) {
  const { path } = await params;
  const subPath = path.join('/');
  return (
    <main className="pt-12">
      <iframe
        src={`https://learnvibecoding.vercel.app/physicsdemo/${subPath}`}
        className="w-full border-0"
        style={{ height: 'calc(100vh - 48px)' }}
        allow="microphone; clipboard-write"
      />
    </main>
  );
}
