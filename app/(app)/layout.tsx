import { getMe } from "@/hooks/auth";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMe();

  if (!user.email) {
    redirect("/");
  }

  return <main>{children}</main>;
}
