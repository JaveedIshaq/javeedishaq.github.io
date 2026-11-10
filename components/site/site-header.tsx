"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { routesConfig } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-foreground">
      <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary font-heading text-[15px] font-bold text-primary-foreground">
        JI
      </span>
      <span className="font-heading text-[17px] font-semibold">
        {siteConfig.authorName}
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-4"
      >
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {routesConfig.mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "rounded-lg px-3.5 py-2.5 text-[15px] transition-colors hover:text-foreground",
                isActive(item.href)
                  ? "font-semibold text-foreground"
                  : "text-[#AEB7C4]"
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2.5 md:flex">
          <a
            href={siteConfig.resume}
            target="_blank"
            rel="noreferrer"
            className="rounded-[10px] border border-input px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-muted-foreground"
          >
            Resume
          </a>
          <a
            href={siteConfig.links.calendly}
            target="_blank"
            rel="noreferrer"
            className="rounded-[10px] bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Book a call
          </a>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-input md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-border bg-background px-6 pb-6 pt-2 md:hidden"
        >
          <div className="flex flex-col">
            {routesConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "border-b border-border/60 py-3.5 text-base",
                  isActive(item.href) ? "font-semibold" : "text-[#AEB7C4]"
                )}
              >
                {item.title}
              </Link>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <a
              href={siteConfig.resume}
              target="_blank"
              rel="noreferrer"
              className="rounded-[10px] border border-input px-4 py-3 text-center text-sm font-medium"
            >
              Resume
            </a>
            <a
              href={siteConfig.links.calendly}
              target="_blank"
              rel="noreferrer"
              className="rounded-[10px] bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
            >
              Book a call
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
