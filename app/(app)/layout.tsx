import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Header from "@/components/global/Header";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const cookieStore = await cookies();
  // const allCookies = cookieStore.toString();
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
  //   headers: {
  //     Cookie: allCookies,
  //   },
  // });

  // if (!res.ok) {
  //   redirect("/");
  // }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 pt-14">{children}</div>
      {/* <Footer /> */}
    </div>
  );
}
