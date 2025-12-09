export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}
