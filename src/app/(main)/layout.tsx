import Header from "@/components/layout/Header";
import BottomMenu from "@/components/layout/BottomMenu";
import AuthGuard from "@/components/layout/AuthGuard";
import Alert from "@/components/ui/Alert";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-base-black">
        <Header />
        <Alert />
        <main className="pt-6 pb-32">{children}</main>
        <BottomMenu />
      </div>
    </AuthGuard>
  );
}
