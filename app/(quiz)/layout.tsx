import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const allCookies = cookieStore.toString();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: {
      Cookie: allCookies,
    },
  });

  if (!res.ok) {
    redirect("/");
  }

  return <div>{children}</div>;
}
