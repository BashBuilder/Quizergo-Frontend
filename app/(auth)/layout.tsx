import Logo from "@/components/global/Logo";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative">
      <div className="absolute top-5 left-5 z-50 max-sm:top-4 max-sm:left-4">
        <Logo />
      </div>
      {children}
    </div>
  );
}
