import Logo from "@/components/global/Logo";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative bg-exam">
      <div className="absolute left-5 top-5 z-20 max-sm:left-4 max-sm:top-4">
        <Logo tone="paper" />
      </div>
      {children}
    </div>
  );
}
