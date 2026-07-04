import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="min-h-screen flex-1 bg-neutral-50 p-8">{children}</main>
    </div>
  );
}
