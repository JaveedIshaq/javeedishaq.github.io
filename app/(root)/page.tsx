import { ArrowRight, Download } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import { AnimatedSection } from "@/components/common/animated-section";
import { PostCard } from "@/components/blog/post-card";
import { Chip, SectionHeading } from "@/components/site/section-heading";
import { experiences } from "@/config/experience";
import { clientApps, community, heroStats, pipeline, skillGroups } from "@/config/home";
import { pagesConfig } from "@/config/pages";
import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/blog";
import profileImg from "@/public/mydp.jpeg";
import leafwellImg from "@/public/projects/ai-plant/logo.jpg";
import huntkitImg from "@/public/projects/huntkit/screenshot.png";

export const metadata: Metadata = {
  title: {
    absolute: "Javeed Ishaq — Full-Stack Product Engineer (Flutter, Next.js, NestJS & AI)",
  },
  description:
    "Javeed Ishaq — full-stack product engineer. I ship complete mobile and web products end-to-end with Flutter, Next.js, NestJS, PostgreSQL and practical AI (RAG, pgvector, OpenAI).",
  alternates: {
    canonical: "/",
  },
};

function monthYear(d: Date | "Present") {
  if (d === "Present") return "Now";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-[22px] py-3.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90";
const btnOutline =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-input px-[22px] py-3.5 font-medium text-foreground transition-colors hover:border-muted-foreground";

export default async function IndexPage() {
  const posts = (await getAllPosts()).slice(0, 3);

  const company = {
    "@type": "Organization",
    "@id": `${siteConfig.company.url}/#organization`,
    name: siteConfig.company.name,
    legalName: siteConfig.company.legalName,
    description: siteConfig.company.description,
    url: siteConfig.company.url,
    foundingDate: siteConfig.company.foundingDate,
    founder: { "@id": `${siteConfig.url}/#person` },
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.authorName,
        publisher: { "@id": `${siteConfig.url}/#person` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteConfig.url}/#profile`,
        url: siteConfig.url,
        mainEntity: { "@id": `${siteConfig.url}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#person`,
        name: siteConfig.authorName,
        url: siteConfig.url,
        image: `${siteConfig.url}/mydp.jpeg`,
        jobTitle: "Full-Stack Product Engineer",
        description: siteConfig.description,
        email: `mailto:${siteConfig.email}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Sahiwal",
          addressRegion: "Punjab",
          addressCountry: "PK",
        },
        worksFor: { "@id": `${siteConfig.company.url}/#organization` },
        knowsAbout: [
          "Flutter", "Dart", "Next.js", "React", "NestJS", "Node.js", "TypeScript",
          "PostgreSQL", "Supabase", "RAG", "pgvector", "OpenAI API", "Mobile app development",
        ],
        sameAs: [
          siteConfig.links.github,
          siteConfig.links.linkedin,
          siteConfig.links.twitter,
          siteConfig.links.stackoverflow,
          siteConfig.links.devto,
        ],
      },
      company,
    ],
  };

  return (
    <>
      <Script
        id="schema-person"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* HERO */}
      <section className="flex flex-wrap items-center gap-14 pb-14 pt-12 md:pt-[72px]">
        <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-6">
          {siteConfig.availability && (
            <div className="inline-flex items-center gap-2.5 self-start rounded-full border border-[#1F3B38] bg-[#0E1A1A] py-1.5 pl-3.5 pr-3.5 text-[13px] text-[#A7F3E4]">
              <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
              {siteConfig.availability}
            </div>
          )}
          <h1 className="font-heading text-[40px] font-bold leading-[1.04] tracking-[-0.02em] sm:text-[56px] lg:text-[68px]">
            I ship complete products — from Postgres schema to the App Store.
          </h1>
          <p className="max-w-[560px] text-lg text-[#AEB7C4] sm:text-[19px]">
            Full-stack product engineer with 8+ years of Flutter depth and modern TypeScript
            delivery. I build the API, the admin panel, the mobile app and the AI feature — and
            own the outcome, not the ticket.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="#work" className={btnPrimary}>
              See shipped work <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
            </Link>
            <a href={siteConfig.resume} target="_blank" rel="noreferrer" className={btnOutline}>
              <Download className="h-[18px] w-[18px]" aria-hidden="true" /> Download resume (PDF)
            </a>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {heroStats.map((s) => (
              <div key={s.label} className="border-t border-border pt-3.5">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-heading text-[28px] font-semibold sm:text-[30px]">{s.value}</dd>
                <dd className="text-[13px] text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Hero visual: web + backend + AI + mobile in one picture */}
        <div
          className="relative hidden h-[560px] min-w-0 flex-[1_1_440px] sm:block"
          aria-hidden="true"
        >
          <div className="absolute left-0 top-6 w-[86%] overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_60px_rgba(0,0,0,0.45)]">
            <div className="flex items-center gap-1.5 border-b border-[#1C222C] px-3.5 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#2A3240]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#2A3240]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#2A3240]" />
              <span className="ml-2.5 font-mono text-xs text-muted-foreground">
                hunt-kit.netlify.app · Next.js
              </span>
            </div>
            <Image
              src={huntkitImg}
              alt=""
              className="block h-[260px] w-full object-cover object-left-top"
              priority
            />
          </div>
          <div className="absolute bottom-4 left-[4%] w-[54%] rounded-[14px] border border-border bg-[#0D1117] p-4 font-mono text-[12.5px] leading-[1.7] shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
            <div className="text-muted-foreground">{"// NestJS · pgvector retrieval"}</div>
            <div>
              <span className="text-[#C4B5FD]">SELECT</span> content, 1 - (embedding
            </div>
            <div>
              &nbsp;&nbsp;<span className="text-primary">&lt;=&gt;</span> $1){" "}
              <span className="text-[#C4B5FD]">AS</span> score
            </div>
            <div>
              <span className="text-[#C4B5FD]">FROM</span> profile_chunks
            </div>
            <div>
              <span className="text-[#C4B5FD]">ORDER BY</span> score{" "}
              <span className="text-[#C4B5FD]">DESC LIMIT</span> 8;
            </div>
          </div>
          <div className="absolute right-0 top-[150px] flex h-[400px] w-[210px] flex-col overflow-hidden rounded-[34px] border-8 border-[#1C222C] bg-[#0D1117] shadow-[0_30px_60px_rgba(0,0,0,0.55)]">
            <Image src={leafwellImg} alt="" className="block h-[190px] w-full object-cover" />
            <div className="flex flex-col gap-2 p-3">
              <div className="font-heading text-sm font-semibold">Leafwell · Diagnosis</div>
              <div className="text-[11.5px] leading-[1.45] text-[#AEB7C4]">
                Likely early leaf spot. Remove affected leaves and water at the base.
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full border border-[#1F3B38] px-2 py-0.5 text-[10.5px] text-[#A7F3E4]">
                  Flutter
                </span>
                <span className="rounded-full border border-input px-2 py-0.5 text-[10.5px] text-[#AEB7C4]">
                  OpenAI
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* END-TO-END PIPELINE */}
      <section
        aria-labelledby="how"
        className="rounded-2xl border border-[#1C222C] bg-[#0D1015] px-6 py-10"
      >
        <h2
          id="how"
          className="mb-5 font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground"
        >
          One engineer, the whole product
        </h2>
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {pipeline.map((step) => (
            <li
              key={step.n}
              className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4"
            >
              <span className="font-mono text-xs text-primary">{step.n}</span>
              <span className="font-heading text-[17px] font-semibold">{step.title}</span>
              <span className="text-[13px] text-muted-foreground">{step.tech}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* SELECTED WORK */}
      <AnimatedSection direction="up" className="flex flex-col gap-8 pb-10 pt-24" id="work">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="01 / Selected work" title="Products, not just screens." id="work-h" />
          <Link href="/projects" className="text-[15px] text-primary">
            All projects →
          </Link>
        </div>

        <article className="flex flex-wrap overflow-hidden rounded-[20px] border border-border bg-card">
          <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-[18px] p-7 sm:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                LIVE
              </span>
              <span className="text-[13px] text-muted-foreground">Solo build · Jul–Oct 2026</span>
            </div>
            <h3 className="font-heading text-[28px] font-semibold leading-[1.15] sm:text-[34px]">
              HuntKit — a RAG job coach that never invents experience
            </h3>
            <p className="text-[17px] text-[#AEB7C4]">
              Paste a job description. HuntKit retrieves the most relevant chunks of your real
              resume with pgvector and returns a match score, strengths and gaps, tailored bullets
              and interview questions — each citing its source.
            </p>
            <ul className="flex flex-col gap-2 text-[15px] text-[#C9D1DC]">
              <li>→ NestJS JWT auth, chunk + embed ingest, cosine retrieval</li>
              <li>→ Job pipeline tracking and AI-run observability</li>
              <li>→ Turborepo monorepo · Netlify + Render</li>
            </ul>
            <div className="flex flex-wrap gap-2">
              {["NestJS", "PostgreSQL", "pgvector", "Prisma", "Next.js", "OpenAI"].map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-3">
              <Link
                href="/projects/huntkit"
                className="rounded-[10px] bg-primary px-[18px] py-3 text-[15px] font-semibold text-primary-foreground"
              >
                Read case study
              </Link>
              <a
                href="https://hunt-kit.netlify.app/"
                target="_blank"
                rel="noreferrer"
                className="rounded-[10px] border border-input px-[18px] py-3 text-[15px]"
              >
                Live demo ↗
              </a>
              <a
                href="https://github.com/JaveedIshaq/job-huntkit-workspace"
                target="_blank"
                rel="noreferrer"
                className="rounded-[10px] border border-input px-[18px] py-3 text-[15px]"
              >
                Code ↗
              </a>
            </div>
          </div>
          <div className="flex min-w-0 flex-[1_1_420px] items-center border-t border-[#1C222C] bg-[#0D1117] p-6 sm:p-8 lg:border-l lg:border-t-0">
            <Image
              src={huntkitImg}
              alt="HuntKit landing page: Land the right role with your own AI job coach"
              className="block w-full rounded-xl border border-border"
            />
          </div>
        </article>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/projects/ai-plant-care"
            className="flex flex-col overflow-hidden rounded-[20px] border border-border bg-card transition-colors hover:border-[#3A4454]"
          >
            <Image
              src={leafwellImg}
              alt="Leafwell app scanning a plant"
              className="block h-60 w-full object-cover"
            />
            <div className="flex flex-col gap-3 p-7">
              <span className="text-[13px] text-muted-foreground">Mobile + AI · Portfolio product</span>
              <h3 className="font-heading text-[26px] font-semibold">Leafwell — AI plant care</h3>
              <p className="text-[#AEB7C4]">
                Flutter app, NestJS + PostgreSQL backend and Next.js admin, with diagnosis, care
                plans and follow-ups powered by pgvector search and OpenAI structured outputs.
              </p>
              <span className="font-mono text-xs text-muted-foreground">
                Flutter · NestJS · Supabase · OpenAI
              </span>
            </div>
          </Link>
          <div className="flex flex-col gap-4 rounded-[20px] border border-border bg-card p-7">
            <span className="text-[13px] text-muted-foreground">Client &amp; production apps</span>
            <h3 className="font-heading text-[26px] font-semibold">Shipped for real users</h3>
            <ul className="flex flex-col">
              {clientApps.map((app) => (
                <li key={app.id} className="border-b border-[#1C222C] last:border-b-0">
                  <Link
                    href={`/projects/${app.id}`}
                    className="flex justify-between gap-4 py-3 hover:text-primary"
                  >
                    <span className="font-semibold">{app.name}</span>
                    <span className="text-right text-sm text-muted-foreground">{app.what}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AnimatedSection>

      {/* EXPERIENCE */}
      <AnimatedSection direction="up" className="flex flex-wrap gap-12 pb-10 pt-20" id="experience">
        <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-3">
          <SectionHeading
            eyebrow="02 / Experience"
            title="Remote since 2020, across three continents."
            id="exp-h"
          />
          <p className="text-[#AEB7C4]">
            South Africa, South Korea and Pakistan — async-first, overlapping hours, shipping on
            schedule.
          </p>
          <Image
            src={profileImg}
            alt="Portrait of Javeed Ishaq"
            className="mt-3 h-40 w-40 rounded-[20px] border border-border object-cover"
          />
          <p className="mt-2 text-[15px] text-[#AEB7C4]">
            Also founder of{" "}
            <a
              href={siteConfig.company.url}
              target="_blank"
              rel="noopener"
              className="font-semibold text-primary"
            >
              {siteConfig.company.name} ↗
            </a>{" "}
            — a Flutter + AI studio building apps, ready-made templates and AI features for
            agencies and growing businesses.
          </p>
        </div>
        <ol className="flex min-w-0 flex-[2_1_560px] flex-col">
          {experiences.map((job) => (
            <li key={job.id} className="border-b border-[#1C222C]">
              <Link
                href={`/experience/${job.id}`}
                className="group flex flex-wrap gap-x-6 gap-y-2 py-[22px]"
              >
                <span className="flex-[0_0_170px] pt-[3px] font-mono text-[13px] text-muted-foreground">
                  {monthYear(job.startDate)} — {monthYear(job.endDate)}
                </span>
                <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-1">
                  <span className="font-heading text-xl font-semibold group-hover:text-primary">
                    {job.position}
                  </span>
                  <span className="text-[15px] text-primary">
                    {job.company} · {job.location}
                  </span>
                  <span className="text-[15px] text-[#AEB7C4]">{job.description[0]}</span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </AnimatedSection>

      {/* STACK */}
      <AnimatedSection direction="up" className="flex flex-col gap-7 pb-10 pt-20" id="stack">
        <SectionHeading eyebrow="03 / Stack" title="Tools I reach for in production." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g) => (
            <div
              key={g.title}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-[22px]"
            >
              <span className="font-heading text-lg font-semibold">{g.title}</span>
              <span className="text-sm leading-[1.7] text-[#AEB7C4]">{g.items}</span>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* WRITING */}
      {posts.length > 0 && (
        <AnimatedSection direction="up" className="flex flex-col gap-7 pb-10 pt-20" id="writing">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="04 / Writing" title="Notes from shipping." />
            <Link href="/blogs" className="text-[15px] text-primary">
              All articles →
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </AnimatedSection>
      )}

      {/* COMMUNITY */}
      <section aria-label="Community" className="pb-6 pt-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {community.map((c) => (
            <div key={c.title} className="border-t border-border pt-4">
              <div className="font-semibold">{c.title}</div>
              <div className="text-sm text-muted-foreground">{c.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section aria-labelledby="contact-h" className="pt-16">
        <div className="flex flex-wrap items-center justify-between gap-8 rounded-3xl border border-[#1F3B38] bg-[#0E1716] px-7 py-12 sm:px-10 sm:py-14">
          <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-3">
            <h2
              id="contact-h"
              className="font-heading text-[32px] font-semibold leading-[1.1] sm:text-[44px]"
            >
              Need one engineer who can own the whole feature?
            </h2>
            <p className="text-[17px] text-[#AEB7C4]">
              I usually reply within a day. Based in Sahiwal, Pakistan — working with teams
              across time zones.
            </p>
          </div>
          <div className="flex flex-[0_1_320px] flex-col gap-3">
            <a href={siteConfig.links.calendly} target="_blank" rel="noreferrer" className={btnPrimary}>
              Book a 15-min call
            </a>
            <a href={`mailto:${siteConfig.email}`} className={btnOutline}>
              {siteConfig.email}
            </a>
            <div className="flex justify-center gap-3 text-sm">
              <a href={siteConfig.links.github} target="_blank" rel="noreferrer" className="p-2.5 text-primary">
                GitHub
              </a>
              <a href={siteConfig.links.linkedin} target="_blank" rel="noreferrer" className="p-2.5 text-primary">
                LinkedIn
              </a>
              <a href={siteConfig.links.stackoverflow} target="_blank" rel="noreferrer" className="p-2.5 text-primary">
                Stack Overflow
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
