import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-8 mx-auto pt-16 lg:pt-8 w-[80vw] max-w-[1500px]">
        {children}
      </main>
    </div>
  );
}
