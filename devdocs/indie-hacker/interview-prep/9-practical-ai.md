# Practical AI Interview Prep

## Goal

Pass interviews where companies want product engineers who can integrate AI into real systems without hype, fragility, or runaway cost.

You are not trying to position as:

- ML researcher
- prompt-only AI specialist
- agent-hype tourist

You are positioning as:

- a product engineer who can add practical AI to working products

## What “Practical AI” Means

Good AI features:

- search that understands intent
- summaries
- classification and tagging
- extraction from documents or images
- recommendations
- support reply drafts
- workflow assistance

Bad AI features:

- generic chat with no product value
- “AI copilot” labels with no workflow integration
- expensive features nobody trusts
- multi-agent complexity with no business reason

## What You Must Know

### AI Product Judgment

Be able to explain:

- why the AI feature exists
- why a normal rule-based system was not enough
- how the output is used in the product
- how the user can verify or correct it
- how you prevent silent failure

### Core LLM Integration Skills

Know:

- prompt inputs and output shaping
- structured outputs
- retries and timeouts
- cost awareness
- fallback behavior
- logging and tracing

### Retrieval And RAG

You should understand:

- chunking
- embedding
- storing vectors
- retrieval
- reranking at a conceptual level
- grounding output in retrieved context

For your stack:

- OpenAI API
- pgvector
- PostgreSQL
- NestJS orchestration

### Safety And Reliability

Be able to discuss:

- hallucination risk
- human review points
- confidence thresholds
- validating output shape
- audit logging of AI runs
- avoiding AI-only critical decisions

### Product Measurement

You should be able to answer:

- how do you know the feature is useful?
- what metric improved?
- what failure rate is acceptable?
- how do you test quality over time?

## Practical AI Patterns You Should Be Ready To Discuss

### 1. Search

Use case:

- user searches products, plants, documents, or support content

Explain:

- why keyword-only search is limited
- how vector search improves relevance
- how hybrid search can be better

### 2. Summarization

Use case:

- summarize tickets, medical notes, reports, long descriptions

Explain:

- where summaries are shown
- what is lost in summarization
- when human review matters

### 3. Classification And Tagging

Use case:

- support tickets
- product categories
- document labeling
- issue triage

Explain:

- why this helps workflow speed
- how you evaluate usefulness

### 4. Extraction

Use case:

- receipts
- forms
- invoices
- plant diagnosis metadata

Explain:

- image/document input
- structured output
- validation before persistence

### 5. Workflow Assistance

Use case:

- follow-up suggestions
- support reply drafts
- next-step suggestions
- triage assistance

Explain:

- user stays in control
- AI suggests, not silently acts

## What Good AI Answers Sound Like

### Example: “How do you add AI responsibly?”

`I start with a narrow workflow where AI reduces friction or improves relevance. I avoid putting AI in control of critical decisions without verification. I structure inputs carefully, validate outputs, log every run, and make sure the user can review or correct the result. I care more about reliability and usefulness than about making the feature sound advanced.`

### Example: “When do you use RAG?”

`I use RAG when the model needs product-specific or document-specific context that should not be hardcoded into prompts. The point is not to make the system look sophisticated; it is to ground answers in relevant retrieved information and reduce hallucinated responses.`

### Example: “How do you measure AI quality?”

`I look at product-level usefulness, not just model output quality in isolation. That could mean better search success, reduced manual triage, faster support handling, or lower setup friction. I also log failures, review bad outputs, and check whether the feature is trusted by users.`

## Senior-Level Topics To Prepare

### Architecture

- where AI lives in the request flow
- sync vs async AI processing
- queue-backed AI jobs
- storing AI run logs
- retries and idempotency

### Cost Control

- choosing smaller vs larger models
- limiting unnecessary calls
- batching where possible
- caching non-sensitive repeated results
- restricting expensive operations to high-value moments

### Reliability

- structured output validation
- timeouts
- fallback UX
- manual review
- prompt versioning

### Security And Compliance Thinking

- avoid sending unnecessary user data
- keep auditability in mind
- limit sensitive-context exposure
- do not overpromise AI certainty

## Study Checklist

You should be able to explain:

- one AI search feature
- one AI summarization feature
- one AI extraction feature
- one RAG architecture at a practical level
- one cost-control strategy
- one logging / evaluation strategy

## Interview Questions You Should Expect

1. What AI feature would you add to this product?
2. How do you decide whether AI is actually needed?
3. How do you reduce hallucinations?
4. When do you use RAG?
5. How do you validate AI output?
6. How do you control cost?
7. How do you make AI useful without making the UX worse?
8. How do you log and debug AI failures?
9. How do you decide between sync and async AI processing?
10. How do you measure whether the feature worked?

## Best Practice For Your Story

When discussing AI, always connect it to:

- user problem
- workflow improvement
- system design
- reliability
- measurement

If you only talk about models, prompts, and agent terminology, you will sound shallow.
