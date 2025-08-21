import BrandLogo  from "../BrandLogo";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted/30 flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">{children}</div>
      <div className="mt-8">
        <BrandLogo />
      </div>
    </div>
  );
}