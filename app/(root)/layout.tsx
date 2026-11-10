import { SiteFooter } from "@/components/common/site-footer";
import { SiteHeader } from "@/components/site/site-header";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
