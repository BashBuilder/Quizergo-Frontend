import Header from "@/components/global/Header";
import RequireAuth from "@/components/global/RequireAuth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <RequireAuth className="flex-1 pt-14">{children}</RequireAuth>
      {/* <Footer /> */}
    </div>
  );
}
