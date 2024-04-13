import "./globals.css";
import Navbar from "@/components/admin/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-[960px] mx-auto">
      <Navbar />
      <main className="py-[102px] min-h-screen">{children}</main>
    </div>
  );
}
