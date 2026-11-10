import Image from "next/image";
import Link from "next/link";

import { Chip } from "@/components/site/section-heading";
import type { ProjectInterface } from "@/config/projects";
import { siteConfig } from "@/config/site";

const eyebrow = "font-mono text-[13px] text-primary";
const h2 = "font-heading text-[28px] font-semibold leading-[1.15] sm:text-[34px]";

export function CaseStudyView({ project }: { project: ProjectInterface }) {
  const cs = project.caseStudy!;
  const sections = [
    { id: "problem", label: "The problem" },
    { id: "architecture", label: "Architecture" },
    { id: "decisions", label: "Key decisions" },
    ...(cs.code ? [{ id: "code", label: "Code excerpt" }] : []),
  ];

  return (
    <>
      <div className="pt-8">
        <Link href="/projects" className="inline-block py-2.5 text-[15px] text-primary">
          ← All work
        </Link>
      </div>

      <section className="flex flex-col gap-6 pb-8 pt-10">
        <div className="flex flex-wrap items-center gap-2">
          {cs.status && (
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
              {cs.status}
            </span>
          )}
          <span className="font-mono text-[13px] text-muted-foreground">
            Case study · {project.category.join(" · ")}
          </span>
        </div>
        <h1 className="max-w-[960px] font-heading text-[36px] font-bold leading-[1.06] tracking-[-0.02em] sm:text-[52px] lg:text-[60px]">
          {cs.headline}
        </h1>
        <p className="max-w-[760px] text-lg text-[#AEB7C4] sm:text-[19px]">{cs.intro}</p>
        <dl className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cs.meta.map((m) => (
            <div key={m.label} className="border-t border-border pt-3">
              <dt className="text-[13px] text-muted-foreground">{m.label}</dt>
              <dd className="font-semibold">{m.value}</dd>
            </div>
          ))}
          {(project.websiteLink || project.githubLink) && (
            <div className="border-t border-border pt-3">
              <dt className="text-[13px] text-muted-foreground">Links</dt>
              <dd className="flex flex-wrap gap-x-3 font-semibold">
                {project.websiteLink && (
                  <a href={project.websiteLink} target="_blank" rel="noreferrer" className="text-primary">
                    Live demo ↗
                  </a>
                )}
                {project.githubLink && (
                  <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-primary">
                    GitHub ↗
                  </a>
                )}
              </dd>
            </div>
          )}
        </dl>
      </section>

      <section className="pb-12">
        <div className="rounded-[20px] border border-border bg-card p-4 sm:p-6">
          <Image
            src={project.companyLogoImg}
            alt={`${project.companyName} screenshot`}
            width={1080}
            height={600}
            className="block w-full rounded-xl border border-border"
            priority
          />
        </div>
      </section>

      <div className="flex flex-wrap gap-14 pb-16 pt-6">
        <aside aria-label="On this page" className="flex min-w-0 flex-[1_1_220px] flex-col gap-1 text-sm">
          <span className="mb-2 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
            On this page
          </span>
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="py-1.5 text-[#AEB7C4] hover:text-foreground">
              {s.label}
            </a>
          ))}
          <div className="mt-6 flex flex-wrap gap-2">
            {project.techStack.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
        </aside>

        <article className="flex min-w-0 flex-[999_1_640px] flex-col gap-14">
          <section id="problem" className="flex scroll-mt-24 flex-col gap-3.5">
            <span className={eyebrow}>01 / The problem</span>
            <h2 className={h2}>{cs.problem.title}</h2>
            <p className="text-[17px] text-[#C9D1DC]">{cs.problem.body}</p>
          </section>

          <section id="architecture" className="flex scroll-mt-24 flex-col gap-[18px]">
            <span className={eyebrow}>02 / Architecture</span>
            <h2 className={h2}>{cs.architecture.title}</h2>
            <figure className="flex flex-col gap-[18px] rounded-2xl border border-border bg-[#0D1117] p-5 sm:p-7">
              <ol className="flex flex-wrap items-center gap-3" aria-label="Request flow">
                {cs.architecture.flow.map((node, i) => (
                  <li key={node.name} className="flex flex-[1_1_160px] items-center gap-3">
                    <div
                      className={
                        node.highlight
                          ? "flex-1 rounded-xl border border-[#1F3B38] bg-[#0E1A1A] p-3.5"
                          : "flex-1 rounded-xl border border-input bg-card p-3.5"
                      }
                    >
                      <div className="font-semibold">{node.name}</div>
                      <div className="text-[13px] text-muted-foreground">{node.note}</div>
                    </div>
                    {i < cs.architecture.flow.length - 1 && (
                      <span aria-hidden="true" className="font-mono text-primary">
                        →
                      </span>
                    )}
                  </li>
                ))}
              </ol>
              <div className="grid gap-3 md:grid-cols-2">
                {cs.architecture.pipelines.map((p) => (
                  <div
                    key={p.label}
                    className="flex flex-col gap-1.5 rounded-xl border border-dashed border-input p-4"
                  >
                    <span className="font-mono text-xs text-primary">{p.label}</span>
                    <span className="text-sm text-[#C9D1DC]">{p.text}</span>
                  </div>
                ))}
              </div>
            </figure>
          </section>

          <section id="decisions" className="flex scroll-mt-24 flex-col gap-[18px]">
            <span className={eyebrow}>03 / Key decisions</span>
            <h2 className={h2}>Trade-offs I made on purpose.</h2>
            <div className="flex flex-col gap-3">
              {cs.decisions.map((d) => (
                <div key={d.title} className="flex flex-col gap-1.5 rounded-[14px] border border-border bg-card p-5">
                  <h3 className="font-heading text-[19px] font-semibold">{d.title}</h3>
                  <p className="text-[15px] text-[#AEB7C4]">{d.why}</p>
                </div>
              ))}
            </div>
          </section>

          {cs.code && (
            <section id="code" className="flex scroll-mt-24 flex-col gap-3.5">
              <span className={eyebrow}>04 / Code excerpt</span>
              <pre className="overflow-x-auto rounded-[14px] border border-border bg-[#0D1117] p-5 font-mono text-[13.5px] leading-[1.7] text-[#C9D1DC]">
                <span className="text-muted-foreground">{`// ${cs.code.file}\n`}</span>
                {cs.code.snippet}
              </pre>
            </section>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[18px] border border-[#1F3B38] bg-[#0E1716] p-7">
            <span className="font-heading text-[22px] font-semibold">
              Want this kind of ownership on your team?
            </span>
            <a
              href={siteConfig.links.calendly}
              target="_blank"
              rel="noreferrer"
              className="rounded-[10px] bg-primary px-[18px] py-3 font-semibold text-primary-foreground"
            >
              Let&apos;s talk
            </a>
          </div>

          <nav
            aria-label="More case studies"
            className="flex flex-wrap justify-between gap-4 border-t border-[#1C222C] pt-6"
          >
            <Link href="/projects" className="text-[#AEB7C4] hover:text-foreground">
              ← All work
            </Link>
            {cs.next && (
              <Link href={cs.next.href} className="font-semibold hover:text-primary">
                Next: {cs.next.label} →
              </Link>
            )}
          </nav>
        </article>
      </div>
    </>
  );
}
