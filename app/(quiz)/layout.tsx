import RequireAuth from "@/components/global/RequireAuth";

export default async function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RequireAuth>{children}</RequireAuth>;
    </>
  );
}
