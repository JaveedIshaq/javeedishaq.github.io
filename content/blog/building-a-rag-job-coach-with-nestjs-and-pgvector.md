---
title: "Building a RAG job coach with NestJS and pgvector"
description: "How HuntKit retrieves the right evidence from a resume for every job description — and makes the model cite it."
date: "2026-11-10"
tags: ["ai", "rag", "nestjs", "postgresql"]
topic: "AI"
featured: true
draft: false
cover: "/projects/huntkit/screenshot.png"
---

Every AI resume tool I tried had the same flaw: it wrote impressive bullets about work I had never done. For a job seeker that is worse than useless — it becomes a liability in the interview. So I gave [HuntKit](https://hunt-kit.netlify.app/) one rule: **no claim without a source.**

This post walks through how that rule is enforced, from ingest to the final answer.

## The shape of the system

HuntKit is a Turborepo monorepo with two apps:

- a **NestJS API** (auth, profile, jobs, analyze and admin modules) on Render
- a **Next.js dashboard** on Netlify

Everything lives in one PostgreSQL database with the `pgvector` extension, accessed through Prisma.

## 1. Ingest: chunk and embed the profile once

A resume and a few project write-ups are split into small, self-contained chunks. Each chunk is embedded with OpenAI's `text-embedding-3-small` (1536 dimensions) and stored next to its text.

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE profile_chunks (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_source_id uuid NOT NULL,
  user_id           uuid NOT NULL,
  chunk_index       int  NOT NULL,
  content           text NOT NULL,
  embedding         vector(1536)
);
```

Embedding happens once per source, not on every analysis — that keeps each job analysis fast and cheap.

## 2. Retrieve: top 8 chunks by cosine similarity

When a job description comes in, it is embedded the same way and compared against that user's chunks. The eight closest chunks become the **only** evidence the model is allowed to use.

```ts
const results = await this.prisma.$queryRaw<RetrievedChunk[]>`
  SELECT c.id, c.content, ps.title AS source_title,
         1 - (c.embedding <=> ${vectorLiteral}::vector) AS score
  FROM profile_chunks c
  JOIN profile_sources ps ON ps.id = c.profile_source_id
  WHERE c.user_id = ${userId}::uuid AND ps.status = 'ready'
  ORDER BY c.embedding <=> ${vectorLiteral}::vector
  LIMIT ${limit}
`;
```

> **Why not a separate vector database?** For an MVP, keeping vectors in the same Postgres as users and jobs means one backup, simple joins and one bill.

## 3. Refuse to guess when there is no evidence

If retrieval returns nothing — for example, the user has not added a profile yet — the API does not call the model at all. It records a `low_context` run and tells the user to add profile sources first. An honest "I don't know" beats a confident invention.

## 4. Generate with citations

Each retrieved chunk is passed to the model labelled with its id and source:

```text
[chunkId: 3f2c…] (source: Resume, score: 0.712)
Designed and shipped NestJS, TypeScript and PostgreSQL backend services…
```

The model (`gpt-4o-mini`) returns structured JSON — match score, strengths, gaps, tailored bullets and likely interview questions — where strengths reference the `chunkId` they came from. The API returns those citations to the dashboard, so every suggestion can be traced back to a line of the user's real profile.

## 5. Log every AI run

Every analysis writes a row to an `ai_runs` table: model, prompt and completion tokens, latency, status, and the ids of the retrieved chunks. When an answer looks wrong, I can see exactly what the model was given instead of guessing.

Try the [live demo](https://hunt-kit.netlify.app/) or read the [code on GitHub](https://github.com/JaveedIshaq/job-huntkit-workspace).
