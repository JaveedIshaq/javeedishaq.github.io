import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  id?: string;
  className?: string;
  as?: "h1" | "h2";
}

export function SectionHeading({ eyebrow, title, id, className, as: Tag = "h2" }: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="font-mono text-[13px] text-primary">{eyebrow}</span>
      <Tag
        id={id}
        className="font-heading text-[34px] font-semibold leading-[1.1] tracking-[-0.015em] sm:text-[44px]"
      >
        {title}
      </Tag>
    </div>
  );
}

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-lg border border-input px-2.5 py-1 font-mono text-xs text-[#C9D1DC]">
      {children}
    </span>
  );
}
