import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const allCookies = cookieStore.toString();
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: {
        Cookie: allCookies,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    redirect("/");
  }

  return <main>{children}</main>;
}
