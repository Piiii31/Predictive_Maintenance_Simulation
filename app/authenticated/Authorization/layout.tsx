// app/authenticated/layout.tsx
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-h-screen w-full">
      <div className="flex-1 w-full">
        {children}
      </div>
    </section>
  );
}