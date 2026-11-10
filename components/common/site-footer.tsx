import Link from "next/link";

import { Logo } from "@/components/site/site-header";
import { routesConfig } from "@/config/routes";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const socials = [
    { name: "GitHub", href: siteConfig.links.github },
    { name: "LinkedIn", href: siteConfig.links.linkedin },
    { name: "Stack Overflow", href: siteConfig.links.stackoverflow },
    { name: "dev.to", href: siteConfig.links.devto },
    { name: "X", href: siteConfig.links.twitter },
    { name: siteConfig.company.name, href: siteConfig.company.url },
  ];

  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-10 px-6 py-12">
        <div className="flex max-w-sm flex-col gap-3">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Full-stack product engineer — Flutter, Next.js, NestJS and AI.
            Based in Sahiwal, Pakistan, working remotely worldwide.
          </p>
          <p className="text-sm text-muted-foreground">
            Founder of{" "}
            <a
              href={siteConfig.company.url}
              target="_blank"
              rel="noopener"
              className="text-primary"
            >
              {siteConfig.company.name}
            </a>{" "}
            · {siteConfig.company.legalName}
          </p>
          <a href={`mailto:${siteConfig.email}`} className="text-sm text-primary">
            {siteConfig.email}
          </a>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-12">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
              Site
            </span>
            {routesConfig.footerNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-1 text-sm text-[#C9D1DC] hover:text-foreground"
              >
                {item.title}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
              Elsewhere
            </span>
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="py-1 text-sm text-[#C9D1DC] hover:text-foreground"
              >
                {s.name}
              </a>
            ))}
          </div>
        </nav>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-3 px-6 py-6 text-[13px] text-muted-foreground">
          <span>© {new Date().getFullYear()} {siteConfig.authorName} · Built with Next.js</span>
          <span className="font-mono">“Whatever you are, be the good one.”</span>
        </div>
      </div>
    </footer>
  );
}
