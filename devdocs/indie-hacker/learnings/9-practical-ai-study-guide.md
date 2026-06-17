# Practical AI — Study Guide for Product Engineering Interviews

---

## 1. Topic Positioning

**What this is:** Practical AI is the discipline of integrating language models, embeddings, and retrieval into working products—without hype, without fragility, and without runaway cost.

**Where it sits in the Product Engineer stack:** AI is not a separate layer. It is a capability woven into the backend (NestJS services), the database (pgvector in PostgreSQL/Supabase), and the product UX (Flutter mobile + Next.js web). It sits beside—not above—your existing architecture. You are not an "AI engineer." You are a product engineer who adds AI where it improves user outcomes.

**Why it matters for your specific career path:**
- Companies are hiring product engineers who can add *practical* AI, not ML researchers
- Your differentiator in interviews is shipping AI features end-to-end: from database to UI
- AI integration is the single highest-leverage interview topic right now—a weak answer here loses offers faster than any other topic
- Your flagship projects (PlantUSA, AI Botany Analyst, NutriScan) already contain production AI—this guide turns that instinct into articulation

**The brutal truth:** Most candidates talk about AI like they read a blog post. They use words like "agentic," "copilot," and "LLM-native" but can't explain a RAG pipeline or a cost-control strategy. You will win by being the candidate who talks about *systems, reliability, and product outcomes*—not models and hype terminology.

---

## 2. Interview Landscape

### What Interviewers Are Actually Testing

When an interviewer asks about AI, they are probing for five things:

1. **Product judgment:** Can you identify where AI actually helps vs. where it's a shiny distraction?
2. **Engineering discipline:** Do you treat AI like any other system component—with retries, logging, validation, and fallbacks?
3. **Cost awareness:** Do you understand that AI calls are expensive, slow, and occasionally wrong?
4. **Risk understanding:** Can you articulate what happens when the AI fails silently?
5. **Integration depth:** Have you shipped AI into a real product, or did you just call an API from a notebook?

### What a Weak Answer Sounds Like

> "I'd use GPT-4 to power the search. Just embed the data, throw it in a vector database like Pinecone, and use semantic search. Maybe add an AI copilot too. The model handles everything."

**Why it's weak:** Buzzword bingo. No mention of cost, latency, validation, fallback UX, when *not* to use AI, or how to measure success. "The model handles everything" is a red flag—it means the candidate hasn't handled a production failure.

### What a Strong Answer Sounds Like

> "I'd start by asking whether the problem actually needs AI. For search, if users are searching by exact product names, a keyword index with fuzzy matching might be enough and cheaper. If the queries are natural-language—'something for my dry skin'—then I'd build a hybrid approach: keyword for exact matches, vector search via pgvector for semantic relevance, and a reranker to blend results. The AI call is async, queued behind a job worker, with structured output validation, retry with exponential backoff, and a fallback that returns keyword-only results if the AI path fails. Every AI run is logged with input, output, latency, and token cost—visible in the admin dashboard so we can audit quality over time."

**Why it's strong:** Demonstrates product thinking (when NOT to use AI), system design (async, queued, fallback), cost awareness (token logging), reliability (structured output, retries), and measurement (admin dashboard visibility). This is what a shipper sounds like.

### How to Connect This Topic to Shipped Work

Every AI answer must anchor in something you built. Your anchor points:

- **PlantUSA:** AI diagnosis (image → structured output), follow-up workflow suggestions, admin visibility into AI runs
- **NutriScan:** AI extraction from food labels (image → structured nutrition data)
- **AI Botany Analyst:** Production RAG pipeline for botanical knowledge

When asked "Have you used AI in production?", don't say "yes" and list three projects. Say: *"In my plant-care app, I built an AI diagnosis pipeline that takes a plant photo, runs it through GPT-4 Vision with a structured output schema, validates the result against known plant disease taxonomies, stores the diagnosis in PostgreSQL, and shows the user a confidence-labeled result they can accept or correct. Failed runs are logged with full input/output traces visible in the admin panel. That pipeline taught me more about production AI than any tutorial."*

---

## 3. Core Concepts

### Mental Models, Not Definitions

#### Model 1: AI as an Unreliable Employee

Treat every AI call like you would a junior employee who is fast, cheap, creative—and sometimes confidently wrong. You don't fire them. You add:
- Clear instructions (prompts with structure)
- Review checkpoints (output validation)
- An appeals process (user can correct)
- Performance reviews (logging and evaluation)

#### Model 2: The AI Is Not the Product

AI is a feature inside a product, not the product itself. If you removed the AI, the product should still function—worse, but not broken. Users come for the product; they stay because the AI makes it better. If they come *only* for the AI, you're an API wrapper with a UI, and your moat is zero.

#### Model 3: Sync vs. Async Isn't Technical—It's a User Decision

- **Sync AI:** User is waiting. The response must arrive in under ~3 seconds. Use for: search, classification during form fill, instant suggestions. Risk: latency kills UX if the model is slow.
- **Async AI:** User does something else. The AI runs in the background. Use for: document extraction, batch summarization, content generation. Risk: user forgets they asked for it; must notify when done.

#### Model 4: The Cost-Value Threshold

Every AI call costs tokens (money) and time (latency). Before adding AI to any workflow, ask: *Does the user value this outcome more than the cost and delay?* A $0.03 call that saves a support agent 5 minutes is a no-brainer. A $0.03 call that suggests a marginally better emoji is waste.

### Request Flow: Where AI Lives in Your Stack

```
┌─────────────────────────────────────────────────────┐
│  Client (Flutter / Next.js)                         │
│  - Triggers AI action (search, upload, classify)    │
│  - Shows results, confidence, correction UI         │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP / WebSocket
┌──────────────────────▼──────────────────────────────┐
│  NestJS API Layer                                   │
│  - Validates request, checks auth                   │
│  - Decides: sync response or enqueue async job      │
│  - Returns immediate ack for async paths            │
└──────────┬────────────────────┬─────────────────────┘
           │ Sync               │ Async
┌──────────▼──────────┐  ┌──────▼─────────────────────┐
│  AI Service          │  │  BullMQ / Redis Queue      │
│  - Prompt assembly   │  │  - AIJobProcessor          │
│  - Model call        │  │  - Stores result in DB     │
│  - Output validation │  │  - Notifies user (push/WS) │
│  - Logging           │  │  - Handles retries         │
└──────────┬──────────┘  └──────┬─────────────────────┘
           │                    │
┌──────────▼────────────────────▼─────────────────────┐
│  PostgreSQL + pgvector                               │
│  - ai_runs table (input, output, model, tokens, ms)  │
│  - Vector embeddings for RAG (1536-dim pgvector)     │
│  - Content being searched/retrieved                  │
└─────────────────────────────────────────────────────┘
```

### System Boundaries and Decision Points

| Decision | When YES | When NO |
|---|---|---|
| Use AI at all | Fuzzy inputs, natural language, unstructured data | Deterministic rules, exact matching, simple calculations |
| Use RAG | Domain-specific knowledge, private data, freshness matters | General knowledge the model already has, static content |
| Sync processing | User is waiting, <3s latency acceptable | Heavy processing, variable latency, batch operations |
| Async processing | Long-running, batch, user can be notified later | User needs immediate answer, simple quick calls |
| Structured output | Downstream code parses response, validation needed | Free-text display only, human review always follows |
| Cache AI results | Same inputs repeat, results stable over time | Unique queries, time-sensitive data, user-specific |
| Show confidence score | User can act on low-confidence differently | Confusing to user, no action they can take |

### Common Mistakes and Red Flags

1. **No output validation:** Parsing a raw string from the model and hoping it's the right shape. Interviewers will ask: "What happens if the model returns JSON with a missing field?"
2. **Hardcoding prompts in code:** No versioning, no ability to iterate without deploying. Use prompt templates stored in the database or config.
3. **Ignoring token limits:** Sending entire documents as context without chunking. Blows past context windows and costs.
4. **AI-only critical decisions:** Letting AI reject a medical claim, block a user, or authorize a transaction without human review.
5. **No fallback UX:** If AI fails, the user sees a spinner forever or a raw error. Design the fallback first, then add the AI path.
6. **Prompt injection naivety:** Letting user input flow raw into prompts without sanitization or boundaries.
7. **Measuring "accuracy" instead of usefulness:** 95% accurate classifications are meaningless if the 5% failure causes 80% of the complaints.

---

## 4. Practical Implementation

### 4.1 AI Service in NestJS

This is the backbone of any AI feature in your stack. It handles prompt assembly, model calls, retries, and logging.

```typescript
// ai/services/openai.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { AiRunLogService } from './ai-run-log.service';

@Injectable()
export class OpenAiService {
  private readonly client: OpenAI;
  private readonly logger = new Logger(OpenAiService.name);

  constructor(
    private config: ConfigService,
    private aiRunLog: AiRunLogService,
  ) {
    this.client = new OpenAI({
      apiKey: this.config.get<string>('OPENAI_API_KEY'),
      maxRetries: 2,
      timeout: 30_000,
    });
  }

  async structuredCompletion<T extends z.ZodTypeAny>(params: {
    model: string;
    systemPrompt: string;
    userPrompt: string;
    schema: T;
    temperature?: number;
    maxTokens?: number;
  }): Promise<z.infer<T>> {
    const startTime = Date.now();

    try {
      const response = await this.client.chat.completions.create({
        model: params.model,
        temperature: params.temperature ?? 0.3,
        max_tokens: params.maxTokens ?? 2000,
        messages: [
          { role: 'system', content: params.systemPrompt },
          { role: 'user', content: params.userPrompt },
        ],
        response_format: zodResponseFormat(params.schema, 'output'),
      });

      const durationMs = Date.now() - startTime;
      const parsed = JSON.parse(
        response.choices[0].message.content ?? '{}',
      ) as z.infer<T>;

      // Log successful run
      await this.aiRunLog.log({
        model: params.model,
        systemPrompt: params.systemPrompt,
        userPrompt: params.userPrompt,
        output: response.choices[0].message.content ?? '',
        tokensUsed: response.usage?.total_tokens ?? 0,
        durationMs,
        status: 'success',
      });

      return params.schema.parse(parsed); // double-validate with Zod
    } catch (error) {
      const durationMs = Date.now() - startTime;
      this.logger.error(`AI call failed after ${durationMs}ms`, error);

      await this.aiRunLog.log({
        model: params.model,
        systemPrompt: params.systemPrompt,
        userPrompt: params.userPrompt,
        output: null,
        tokensUsed: 0,
        durationMs,
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Unknown',
      });

      throw error;
    }
  }
}
```

### 4.2 RAG Pipeline in NestJS + pgvector

Here's what a real, production-grade RAG service looks like in your stack:

```typescript
// ai/services/rag.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OpenAiService } from './openai.service';
import { DocumentChunk } from '../entities/document-chunk.entity';
import { z } from 'zod';

const RAGOutputSchema = z.object({
  answer: z.string(),
  sources: z.array(z.object({
    chunkId: z.string(),
    relevanceScore: z.number(),
    excerpt: z.string(),
  })),
  confidence: z.enum(['high', 'medium', 'low']),
});

@Injectable()
export class RagService {
  private readonly EMBEDDING_MODEL = 'text-embedding-3-small';

  constructor(
    private openAi: OpenAiService,
    @InjectRepository(DocumentChunk)
    private chunkRepo: Repository<DocumentChunk>,
  ) {}

  /**
   * Index a document: chunk it, embed each chunk, store in pgvector.
   * Called asynchronously after document upload.
   */
  async indexDocument(documentId: string, content: string): Promise<void> {
    const chunks = this.chunkText(content, { maxChunkSize: 800, overlap: 100 });

    for (const chunk of chunks) {
      const embedding = await this.openAi.createEmbedding({
        model: this.EMBEDDING_MODEL,
        input: chunk.text,
      });

      await this.chunkRepo.save({
        documentId,
        content: chunk.text,
        embedding: () => `[${embedding.join(',')}]::vector`, // pgvector insert
        chunkIndex: chunk.index,
      });
    }
  }

  /**
   * Query: embed the question, find nearest chunks, generate answer.
   */
  async query(documentId: string, question: string) {
    const questionEmbedding = await this.openAi.createEmbedding({
      model: this.EMBEDDING_MODEL,
      input: question,
    });

    // pgvector cosine similarity search
    const relevantChunks = await this.chunkRepo.query(
      `SELECT id, content, 1 - (embedding <=> $1::vector) AS similarity
       FROM document_chunks
       WHERE document_id = $2
       ORDER BY similarity DESC
       LIMIT 5`,
      [`[${questionEmbedding.join(',')}]`, documentId],
    );

    const context = relevantChunks
      .map((c: any) => c.content)
      .join('\n---\n');

    const answer = await this.openAi.structuredCompletion({
      model: 'gpt-4o-mini', // cheaper model for RAG
      systemPrompt: `You are answering questions based on provided document context.
Only use information from the context. If the context doesn't contain the answer, say so.`,
      userPrompt: `Context:\n${context}\n\nQuestion: ${question}`,
      schema: RAGOutputSchema,
    });

    return answer;
  }

  private chunkText(
    text: string,
    options: { maxChunkSize: number; overlap: number },
  ): { text: string; index: number }[] {
    // Production implementation: sentence-boundary-aware splitting
    const words = text.split(/\s+/);
    const chunks: { text: string; index: number }[] = [];
    let i = 0;
    let chunkIndex = 0;

    while (i < words.length) {
      const chunk = words.slice(i, i + options.maxChunkSize).join(' ');
      chunks.push({ text: chunk, index: chunkIndex });
      i += options.maxChunkSize - options.overlap;
      chunkIndex++;
    }

    return chunks;
  }
}
```

### 4.3 Async AI Job Processor (BullMQ + NestJS)

For long-running AI work—image analysis, batch summarization, document extraction—you must NOT block the HTTP request.

```typescript
// ai/processors/ai-job.processor.ts
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('ai-jobs')
export class AiJobProcessor extends WorkerHost {
  private readonly logger = new Logger(AiJobProcessor.name);

  async process(job: Job<{ type: string; payload: any }>): Promise<any> {
    this.logger.log(`Processing AI job ${job.id} of type ${job.data.type}`);

    switch (job.data.type) {
      case 'plant-diagnosis':
        return this.processPlantDiagnosis(job.data.payload);
      case 'document-summarization':
        return this.processSummarization(job.data.payload);
      case 'batch-classification':
        return this.processClassification(job.data.payload);
      default:
        throw new Error(`Unknown AI job type: ${job.data.type}`);
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `AI job ${job.id} failed after ${job.attemptsMade} attempts`,
      error.stack,
    );
    // Could notify user, trigger fallback, or alert ops
  }

  private async processPlantDiagnosis(payload: {
    imageUrl: string;
    userId: string;
  }) {
    // 1. Download image from storage
    // 2. Call GPT-4 Vision with structured output
    // 3. Validate against taxonomy database
    // 4. Store diagnosis in PostgreSQL
    // 5. Push notification to user via WebSocket
  }
}
```

### 4.4 Validation, Security, Performance, Reliability

**Validation Checklist (Every AI Call):**
- [ ] Output shape validated against Zod schema before storage
- [ ] Required fields present (don't assume the model always returns them)
- [ ] String lengths bounded (models can hallucinate 10KB where 100 chars expected)
- [ ] Enum values checked (don't trust "high"/"medium"/"low" without enum validation)
- [ ] Numeric ranges sanity-checked (confidence 0-1, not -5 or 500)

**Security Checklist:**
- [ ] User input is isolated from system prompt instructions (use role separation, not concatenation)
- [ ] PII is stripped before sending to external AI APIs
- [ ] AI output is treated as untrusted—sanitized before rendering in UI (XSS risk)
- [ ] Rate-limited per user to prevent abuse and cost explosions
- [ ] Hard token budget per user per day, not just per-call limits

**Performance Checklist:**
- [ ] Timeout set (30s for sync, 120s for async jobs)
- [ ] Circuit breaker: if model API fails 5 times in 60s, stop calling for 2 minutes
- [ ] Caching layer for embedding lookups (same text → same embedding, don't re-compute)
- [ ] Streaming responses for chat UX (not relevant for structured extraction, critical for conversational features)

**Scaling Concerns (Solo Shipper Realities):**
- pgvector with IVFFlat indexing is fast enough for ~1M vectors on a single PostgreSQL instance—you do not need a separate vector database until you're well past product-market fit
- Embedding generation is the bottleneck, not vector search. Batch embedding jobs. Cache aggressively.
- AI API rate limits are the real scaling ceiling at your stage, not your own infrastructure

---

## 5. AI Integration Patterns Across Your Stack

Since this topic *is* practical AI, this section shows how AI weaves into each layer of your stack with concrete patterns.

### 5.1 AI + PostgreSQL/pgvector: Semantic Search in Any Product

**What:** Replace or augment keyword search with meaning-based search.

**Tool:** pgvector (already in Supabase and standard PostgreSQL)

**User problem:** Users search with intent ("plant with yellow spots on leaves") not exact terms ("chlorosis treatment").

**Concrete pattern:**

```sql
-- 1. Create the extension and column
CREATE EXTENSION IF NOT EXISTS vector;
ALTER TABLE plants ADD COLUMN embedding vector(1536);

-- 2. Create an index for fast approximate search
CREATE INDEX ON plants USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- 3. Search function (called from NestJS)
CREATE OR REPLACE FUNCTION search_plants(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.description,
    1 - (p.embedding <=> query_embedding) AS similarity
  FROM plants p
  WHERE 1 - (p.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
```

**Cost:** Embedding generation (~$0.02 per 1M tokens with `text-embedding-3-small`) + pgvector query (effectively free at your scale).

**When AI does NOT help here:** If your search is purely on structured fields (price range, category filter, date range), traditional indexing is faster, cheaper, and deterministic. Don't add vector search just to sound sophisticated.

### 5.2 AI + NestJS: Workflow Assistance and Smart Suggestions

**What:** The backend watches user actions and suggests next steps.

**Tool:** OpenAI SDK with function calling

**User problem (PlantUSA context):** A user diagnosed their plant 3 days ago. The app should suggest a follow-up: "Check if the treatment worked. Take a new photo to compare."

**Concrete pattern:**

```typescript
// ai/services/follow-up-suggestion.service.ts
@Injectable()
export class FollowUpSuggestionService {
  async suggestFollowUps(userId: string): Promise<Suggestion[]> {
    // Pull recent diagnoses and care actions from DB
    const recentActivity = await this.getRecentActivity(userId);

    // Low-cost model for this classification task
    const result = await this.openAi.structuredCompletion({
      model: 'gpt-4o-mini',
      systemPrompt: `You are a plant-care workflow assistant.
Based on the user's recent activity, suggest 1-3 follow-up actions.
Each suggestion must be specific and actionable. Do not suggest generic advice.`,
      userPrompt: JSON.stringify(recentActivity),
      schema: z.object({
        suggestions: z.array(z.object({
          type: z.enum(['check_progress', 'retake_photo', 'apply_treatment', 'research', 'none']),
          message: z.string().max(200),
          priority: z.enum(['high', 'medium', 'low']),
        })),
      }),
    });

    return result.suggestions.filter(s => s.type !== 'none');
  }
}
```

**Cost:** $0.15/1M input tokens for gpt-4o-mini. This call costs fractions of a cent.

### 5.3 AI + Next.js Admin: Audit Dashboard for AI Runs

**What:** An admin panel showing every AI call—input, output, tokens, latency, and user feedback.

**Tool:** Next.js + the `ai_runs` PostgreSQL table you already have

**User problem (you, the product engineer):** You need to know if the AI feature is working, what it costs, and where it fails.

**Concrete implementation:**

```typescript
// pages/admin/ai-runs.tsx (Next.js page)
export default function AiRunsDashboard() {
  return (
    <AdminLayout>
      <h1>AI Run Logs</h1>
      <AiRunStats />       {/* Total calls, cost, avg latency, error rate */}
      <AiRunTable           {/* Filterable table of individual runs */}
        filters={['model', 'status', 'dateRange']}
        columns={['timestamp', 'model', 'tokens', 'durationMs', 'status', 'userId', 'review']}
      />
      <AiRunDetail />       {/* Expand a run to see full input/output */}
    </AdminLayout>
  );
}
```

The `ai_runs` table schema:

```sql
CREATE TABLE ai_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  model text NOT NULL,            -- 'gpt-4o', 'gpt-4o-mini', 'text-embedding-3-small'
  system_prompt text,
  user_prompt text,
  output text,
  tokens_used int DEFAULT 0,
  duration_ms int,
  status text NOT NULL,           -- 'success', 'error', 'fallback_used'
  error_message text,
  estimated_cost_cents numeric(10, 5) DEFAULT 0,
  user_id uuid REFERENCES users(id),
  feature_name text,              -- 'plant_diagnosis', 'search', 'follow_up_suggestion'
  user_feedback text,             -- 'accepted', 'corrected', 'rejected' (set by user action)
  user_correction text            -- what the user changed, if they corrected the AI
);

CREATE INDEX idx_ai_runs_feature_date ON ai_runs(feature_name, created_at DESC);
CREATE INDEX idx_ai_runs_user_id ON ai_runs(user_id);
```

### 5.4 When AI Genuinely Does NOT Help

Be honest in interviews. Not every feature needs AI. Examples where AI would be stupid:

- **Password validation:** Rules are deterministic. AI adds latency and hallucination risk for zero gain.
- **Date picker:** No.
- **Simple arithmetic in a business workflow:** A database query is correct 100% of the time. A model is correct ~99% of the time. For finances, that 1% is unacceptable.
- **Displaying a static FAQ:** Embed it, index it, but the retrieval should surface the exact FAQ text—not an AI-generated paraphrase that might distort the answer.

Saying "I wouldn't use AI here" in an interview is a power move if you can explain *why*. It proves you have product judgment, not just AI enthusiasm.

---

## 6. Product-Thinking Interpretation

### What a Product Engineer Thinks About That a Pure Developer Misses

**Pure developer thinks about:**
- Which model to use
- How to format the prompt
- Whether to use streaming
- The technical elegance of the pipeline

**Product engineer thinks about:**
- What happens when the AI is wrong and the user doesn't know it
- How much the feature costs per user per month—and whether the pricing covers it
- Whether the user *trusts* the AI output or ignores it
- What the product does when the AI API is down (it will be down)
- How to measure whether the feature actually made the product better

### How to Explain AI Features to a Non-Technical Stakeholder

> "The feature uses AI to read plant photos and suggest what might be wrong, similar to how a gardening book would help you identify issues. It's not a doctor—it gives its best guess with a confidence level, and we always show the user how to verify or correct the answer. Every suggestion is logged so we can review quality later. If the AI is unavailable, the user can still manually describe the problem and get care guides."

Key elements in that explanation: analogy to something familiar, clear boundaries ("not a doctor"), user control, transparency, graceful degradation.

### The AI Feature Decision Framework

Before adding AI to any workflow, answer these five questions. If you can't answer all five, you're not ready to build:

1. **What specific user problem does this solve?** (Not "add AI." Real: "Users spend 8 minutes manually categorizing each receipt.")
2. **Why can't a deterministic solution work?** (If a regex or database query can do it, AI is overkill.)
3. **What is the cost per successful interaction?** (Token cost + infrastructure cost / number of useful outputs)
4. **What happens when it fails?** (Fallback UX, not just an error message.)
5. **How will we know it's working?** (Metric: "time to categorize receipt dropped from 8 min to 30 seconds with 95% acceptance rate.")

---

## 7. Interview Questions & Strong Model Answers

### Q1: "Walk me through an AI feature you built end-to-end."

**Strong answer:**

> "In my plant-care app, I built an AI diagnosis pipeline. When a user uploads a plant photo, the image goes to our NestJS backend. The request is dropped into a BullMQ queue because the Vision API call can take 5–15 seconds—I don't want to hold the HTTP connection. The worker downloads the image, sends it to GPT-4 Vision with a Zod schema that constrains the output to disease name, confidence, symptoms, and treatment. When the response comes back, the worker validates it against the schema—if a required field is missing, it retries once with a stricter prompt. The validated diagnosis is stored in PostgreSQL with a reference to the user and the image. The user gets a push notification. In the app, the diagnosis card shows the confidence level, and the user can tap 'This is correct' or 'Not quite—let me describe what I see,' which feeds back into the correction log. Over in the admin panel, I can see every diagnosis run: input image URL, model output, tokens consumed, latency, and whether the user accepted or corrected it. That visibility is how I sleep at night—I know when the AI is wrong before the user has to tell me."

**Why it's strong:** Full-stack accountability. Mentions async processing, structured output, validation, user correction loop, admin visibility. Shows shipping mindset.

### Q2: "How do you decide whether to use AI for a problem?"

**Strong answer:**

> "I start by asking if a deterministic solution exists. If users are searching by exact product codes, I don't need vectors—I need a good index. If a regex or a database query can do it, AI adds cost and latency for no gain. I look at three things: Is the input unstructured—natural language, images, free text? Is there genuine ambiguity where the 'right' answer depends on context? And does the user value the outcome more than the latency and cost of an AI call? If all three are yes, AI is worth exploring. Then I build the simplest version—usually a single model call with structured output—and measure before adding complexity like RAG or multi-step agents."

**Why it's strong:** Shows restraint, cost awareness, and a bias toward simpler solutions first.

### Q3: "How do you reduce hallucinations?"

**Strong answer:**

> "Hallucinations happen when the model fills gaps with plausible-sounding fiction. I reduce them in four ways: First, I ground the model in retrieved context via RAG—if the answer isn't in the context, the prompt instructs the model to say so rather than guess. Second, I use structured output schemas that force specific fields, which constrains the model more than free text. Third, I lower the temperature for factual tasks—0.1 or 0.2 instead of 0.7—which makes the output more deterministic. Fourth, and this is the one people miss, I design the UX so the user can detect and correct hallucinations. If the diagnosis says 'this plant has root rot' but the user knows they haven't overwatered, they can reject the diagnosis and provide the real care history. That correction is more valuable than any prompt engineering trick."

**Why it's strong:** Multiple layers—prompt design, structured output, temperature, UX correction loop. Not just "write a better prompt."

### Q4: "When do you use RAG vs. fine-tuning vs. just a good prompt?"

**Strong answer:**

> "I reach for RAG when the model needs access to information it wasn't trained on—private documents, product-specific knowledge, or things that change frequently like inventory or pricing. The point is to ground the answer in retrieved evidence, which also reduces hallucination. I almost never use fine-tuning as a first approach. Fine-tuning changes how the model behaves, not what it knows. It's useful for tone, style, or consistent output formats at scale, but it's expensive, requires a labeled dataset I usually don't have, and the model drifts. A well-structured prompt with few-shot examples and structured output gets me 90% of the way there for most product features. I only consider fine-tuning when I have hundreds of consistently labeled examples and the prompt engineering ceiling has been genuinely reached—which almost never happens in early-stage products."

**Why it's strong:** Practical prioritization. Doesn't reach for the expensive option first. Understands the limits of each approach.

### Q5: "How do you control AI costs in production?"

**Strong answer:**

> "I control costs at multiple levels. At the architecture level, I use the smallest model that can do the job—gpt-4o-mini for classification, tagging, and simple extraction; gpt-4o only when reasoning quality actually matters, like complex diagnoses. At the caching level, I cache embeddings—the same text always produces the same vector, so why pay to recompute it? I also cache deterministic outputs for identical inputs where freshness doesn't matter. At the rate-limiting level, I set hard token budgets per user per day and per feature. If a user triggers 500 classifications in an hour, something is wrong—probably a bug, possibly abuse. At the measurement level, I log token usage per feature in my ai_runs table and review it weekly. A feature that costs $0.50 per user per month is probably fine. One that costs $5 per user per month needs optimization or a pricing change. And I always build a kill switch—if a feature's cost spikes, I can disable the AI path and fall back to a deterministic or manual alternative without taking the product down."

**Why it's strong:** Multi-layered. Specific. Shows production mindset—not just "use cheaper models."

### Q6 (Tradeoff): "When would you choose sync AI processing over async, and what tradeoffs does each create?"

**Strong answer:**

> "I use sync when the user is actively waiting and the response needs to feel instant—typically under 2–3 seconds. Search while typing is the classic case: the user expects results as they type, so the embedding lookup and generation need to complete inline. The tradeoff is that if the model is slow, the UX degrades immediately—the user sees a spinner or lag. I mitigate this with timeouts: if the AI hasn't responded in 2.5 seconds, I fall back to keyword search only.
>
> I use async when the task is inherently slow—image analysis, document extraction, anything that takes 5+ seconds—or when the user isn't waiting. The tradeoff is complexity: now I need a queue, a worker, a notification system, and UI that shows 'processing' and updates when done. The user might also forget they requested the action. But async gives me retries, backpressure handling, and the ability to use slower/cheaper models without hurting UX.
>
> The wrong choice is always making everything sync because it's easier to code. That works in demos. It breaks in production when 50 users upload images simultaneously and your HTTP connections time out."

**Why it's strong:** Clear decision criteria. Honest about tradeoffs. Mentions mitigation strategies for each path.

### Q7: "How do you measure whether an AI feature is actually useful?"

**Strong answer:**

> "I measure at the product outcome level, not the model quality level. For a search feature, I track search-to-result click-through rate and time-to-find—did users find what they wanted faster? For classification, I track how many auto-classified items are manually reclassified—that's the real error rate. For diagnosis, I track acceptance rate and correction rate. If 70% of diagnoses are accepted and 30% are corrected, the feature is useful but needs improvement. If 100% are accepted, the users might not be paying attention—or the feature is genuinely excellent. I also track implicit signals: do users who get AI suggestions return to the app more often? Do they complete tasks faster? And I review the ai_runs log weekly, sampling ~20 recent runs manually. No metric replaces actually reading what the model said and deciding if you'd be happy as the user."

**Why it's strong:** Product metrics, not ML metrics. Manual review. Honest about ambiguity in measurement.

---

## 8. Practical Exercises

### Exercise 1: Build a RAG Pipeline for a Single Document

**Context:** Your plant-care app has a care guide PDF. Users ask questions like "How often should I water a monstera?"

**What to build:**
1. Write a NestJS endpoint `POST /documents/:id/index` that chunks the PDF text and stores embeddings in pgvector
2. Write a NestJS endpoint `POST /documents/:id/query` that accepts a question, retrieves relevant chunks, and returns a grounded answer with source excerpts
3. Add the `ai_runs` logging from the code above—every RAG query gets logged

**Stack used:** NestJS, PostgreSQL + pgvector, OpenAI `text-embedding-3-small` + `gpt-4o-mini`

**Stretch goal:** Add a confidence score to the response. If the highest similarity score among retrieved chunks is below 0.7, set confidence to "low" and tell the user the document might not cover this topic.

### Exercise 2: Add AI-Powered Tagging to an Admin List

**Context:** Your admin dashboard shows a table of user-submitted plant issues. Currently, someone manually tags them ("pest," "watering," "lighting," "unknown"). Automate this.

**What to build:**
1. Create a NestJS endpoint that accepts an array of issue IDs
2. For each issue (title + description), call gpt-4o-mini with a structured output schema expecting `{ tag: string; confidence: number }`
3. Process this as an async BullMQ job—the admin clicks "Auto-tag selected" and gets a notification when done
4. Show the auto-tagged labels in the Next.js admin table with confidence indicators (green/yellow/red)

**Stack used:** NestJS, BullMQ, OpenAI gpt-4o-mini, Next.js admin

**Stretch goal:** Add a "batch cost preview" that estimates token cost before running the job. Show it in the admin UI: "Tagging 50 items will cost approximately $0.03. Proceed?"

### Exercise 3: Build the AI Fallback Pattern

**Context:** Your plant diagnosis feature currently calls GPT-4 Vision directly in the HTTP request handler. This is fragile. Refactor it.

**What to build:**
1. Move the AI call behind a service with a timeout (15s)
2. If the AI call fails or times out, return a fallback response: `{ diagnosis: null, fallback: true, message: "Our AI couldn't analyze this photo right now. Please describe the symptoms manually and we'll match it against our care database." }`
3. The manual description triggers a keyword search against your care database—no AI needed
4. Log the failure in `ai_runs` with `status = 'fallback_used'`

**Stack used:** NestJS, PostgreSQL full-text search (as fallback)

**Stretch goal:** Add a circuit breaker (using `opossum` npm package) that stops calling the AI if it fails 5 times in 60 seconds. Resets after 2 minutes.

### Exercise 4: Cost Tracking Dashboard

**Context:** You have `ai_runs` logging. Now make it useful.

**What to build:**
1. A Next.js admin page with a summary card: total calls, total cost (sum of `estimated_cost_cents`), avg latency, error rate
2. A bar chart showing cost by feature per day (use a simple charting library or build it raw)
3. A table of the 10 most expensive calls this week—what were they and why?
4. An alert threshold: if daily cost exceeds $X, show a warning banner

**Stack used:** Next.js, PostgreSQL aggregate queries, the existing `ai_runs` table

**Stretch goal:** Add a cost-per-user breakdown. If one user is responsible for 40% of AI costs, that's worth investigating.

---

## 9. Self-Test Questions

### Can You Explain These Without Notes?

1. **Explain the difference between sync and async AI processing to a junior developer.** Include when you'd choose each, what infrastructure each requires, and what happens when things go wrong.

2. **What is RAG, and when is it the wrong solution?** Be specific—name a scenario where someone might reach for RAG but shouldn't.

3. **How do you prevent prompt injection in a user-facing AI feature?** What's the actual attack vector, and what's the defense?

4. **A stakeholder says "Let's add an AI chatbot to the app." How do you respond?** Walk through the questions you'd ask to determine if this is a good idea or a hype-driven distraction.

5. **Explain to a non-technical product manager why AI output validation matters.** Use an example from the plant-care domain where unvalidated output would create a bad user experience.

6. **What are three ways to reduce AI costs without degrading user experience?**

7. **What columns should an `ai_runs` audit table have, and why?**

8. **Explain the difference between embedding search and keyword search.** When would you use a hybrid approach, and how would you implement it?

9. **A job interview asks: "Tell me about a time AI failed in production."** Even if you haven't had a spectacular failure, explain what you've built to *prevent* one—that's the same answer.

10. **Explain to a junior developer why you don't fine-tune models as a first approach.** What would need to be true before fine-tuning makes sense?

### "Explain It to a Junior Developer" Prompts

- "Explain vector search like I've never heard of embeddings."
- "What does 'temperature' mean in an AI call, and why would I set it to 0.1 vs. 0.8?"
- "Why can't we just send the whole document to the AI instead of chunking it?"
- "What is a hallucination, and how do we prevent the user from believing one?"

---

## 10. Connection Map

### How This Topic Connects to Other Study Guides

| Topic | How Practical AI Connects |
|---|---|
| **1-Full-Stack Product Engineer** | AI is the differentiator that separates a product engineer from a feature developer. This guide defines your AI story. |
| **2-JavaScript** | Promises, async/await, and error handling are the foundation of every AI call you make. Weak JS means weak AI integration. |
| **3-TypeScript** | Zod schemas, type-safe AI outputs, and strict null checks prevent AI hallucinations from corrupting your data layer. |
| **4-React / 5-Next.js** | Admin dashboards for AI run monitoring, confidence indicators in UI, fallback states, streaming UX. |
| **6-NestJS** | Where your AI services live. Modules, queues, logging, dependency injection—all the infrastructure AI depends on. |
| **7-PostgreSQL** | pgvector lives here. AI runs table lives here. Your embeddings and your audit trail. AI without a database is a demo. |
| **8-Supabase** | Supabase bundles PostgreSQL + pgvector + auth + realtime. For rapid products, it's the fastest path to AI-backed features. |
| **10-Flutter** | Where AI results become user-facing: diagnosis cards, confidence badges, correction flows, push notifications for async completions. |
| **11-Answers From Your Real Projects** | The AI features you've shipped are your strongest interview ammunition. This guide shows you how to talk about them. |
| **13-System Design** | AI adds a new dimension to system design: sync vs. async, queuing, circuit breakers, cost budgets, fallback paths. |

### What to Study Before This Topic

- **6-NestJS:** You need to understand modules, services, queues, and logging patterns before you can build AI services
- **7-PostgreSQL:** pgvector, full-text search, and the `ai_runs` table schema require PostgreSQL fluency
- **2-JavaScript + 3-TypeScript:** Every AI call is async. Weak promise handling will bite you.

### What This Topic Prepares You For

- **11-Answers From Your Real Projects:** You now have the vocabulary and mental models to describe your AI work precisely
- **13-System Design:** AI is increasingly a component in system design interviews—you're ready to discuss it as infrastructure, not magic
- **Interviews at AI-integration-focused companies:** You can speak the language without being an ML researcher

---

## Evaluation Self-Check

- [x] Core stack mentioned by name (Flutter, Next.js/React, Node/NestJS, PostgreSQL/Supabase)
- [x] Practical AI integration woven throughout—this entire guide is about AI, and Section 5 specifically covers stack-level integration
- [x] Code examples in TypeScript/NestJS (Python only where stated and justified)
- [x] Weak vs. strong interview answer examples (Section 2 + Section 7)
- [x] Tradeoff discussions throughout (sync vs. async, RAG vs. fine-tuning, AI vs. deterministic, model selection)
- [x] Connected to real project context (PlantUSA, plant-care app, AI diagnosis, admin dashboards)
- [x] Practical exercises (4 exercises, all implementable in current stack)
- [x] Self-test questions (10 questions + 4 "explain to a junior" prompts)
- [x] Connection map showing how this fits the larger study sequence
- [x] Brutally honest—calls out when AI is the wrong answer, when fine-tuning is premature, when "chatbot" is hype
- [x] Would I be more dangerous in an interview after studying this guide? Yes—the section on strong model answers alone would win offers over candidates who can't go beyond "use GPT-4."

---

**Remember:** In an AI interview, the candidate who talks about reliability, fallbacks, cost control, and measurement beats the candidate who talks about model benchmarks every single time. You are not competing with ML researchers. You are competing with engineers who've read blog posts. Out-ship them in the conversation by sounding like someone who has actually put AI into production and cleaned up the mess when it broke.