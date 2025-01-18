export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-1 flex-col p-4 md:p-8">
      <div className="w-full">{children}</div>
    </section>
  );
}
