# PostgreSQL Interview Prep

## Why PostgreSQL Matters

For your target roles, PostgreSQL is not just “the database.”
It is part of how you prove backend credibility.

Senior-level interviews will expect you to reason about:

- schema design
- indexes
- joins
- transactions
- pagination
- query performance
- reliability under real product load

If your answer is only “I used Supabase/Postgres,” that is not enough.

## What You Must Know

### Data Modeling

Be able to explain:

- tables and relationships
- one-to-many and many-to-many
- normalization vs pragmatic denormalization
- audit tables
- soft deletes
- timestamp fields
- nullable vs required fields

You should be able to model:

- users
- organizations or teams
- products/resources
- workflow records
- events or logs

### Keys And Constraints

Know:

- primary keys
- foreign keys
- unique constraints
- check constraints
- default values

Good interviews often ask:

- how would you prevent duplicate records?
- where should you rely on DB constraints vs app logic?

### Indexing

You must understand:

- what indexes do
- cost of indexes on writes
- when to index foreign keys
- compound indexes
- unique indexes
- indexing for filtering/sorting

You should be able to explain:

- why a query is slow
- how an index helps
- when an index does not help

### Querying

Be ready for:

- joins
- aggregations
- grouping
- filtering
- ordering
- subqueries
- common table expressions

You do not need to be a query wizard.
You do need to sound like someone who has actually debugged real data access.

### Transactions

Know:

- why transactions matter
- atomicity
- rollback behavior
- multi-step write safety

Be able to explain examples like:

- creating an order and order items
- booking workflow
- payment status updates
- inventory decrement

### Pagination

Know:

- offset pagination
- cursor pagination
- tradeoffs between them

Senior-level expectation:

- explain why offset becomes expensive at scale
- explain when cursor pagination is a better product fit

### Performance Basics

Know:

- query shape matters
- avoid N+1 patterns
- select only necessary columns
- indexes help reads but cost writes
- count queries can be expensive
- joins are not bad by default

### Reliability And Operations

Be ready to discuss:

- migrations
- backup thinking
- monitoring slow queries
- connection management
- failure recovery basics

## Interview Topics You Should Expect

### Schema Design

Example prompts:

- Design the schema for a SaaS product.
- How would you model users, roles, organizations, and memberships?
- How would you model plant diagnoses, care plans, reminders, and AI runs?

### Query Performance

Prompts:

- A query became slow after data grew. What would you check?
- Why is this endpoint fast locally but slow in production?
- When would you add an index?

### Transactions

Prompts:

- When do you use a transaction?
- What can go wrong if you skip it?

### Practical Tradeoffs

Prompts:

- When would you denormalize?
- When would you use JSON columns?
- What logic belongs in SQL vs app code?

## What Good Answers Sound Like

### Example: “How do you decide on indexes?”

`I start from query patterns, not from guessing. I look at which columns are frequently used in filters, joins, and sorts. I index foreign keys and common lookup fields first, then add compound indexes for real query shapes when necessary. I also keep in mind that every index improves some reads but adds write cost, so I avoid indexing everything blindly.`

### Example: “When do you use transactions?”

`I use transactions when multiple writes must succeed or fail together. A common example is creating an order, its line items, and related payment or inventory changes. Without a transaction, partial writes can leave the system inconsistent if one step fails.`

### Example: “How do you debug a slow endpoint?”

`I first identify whether the problem is query count, query shape, missing indexes, or too much data being fetched. I check logs or query monitoring, review joins and filters, and look for N+1 patterns or expensive counts. I then optimize the access pattern before making infrastructure assumptions.`

## Practical Study Checklist

### Must Practice

- write joins confidently
- explain one-to-many and many-to-many relationships
- design a schema for one real product
- explain transactions with a real example
- explain offset vs cursor pagination
- explain 3 indexing examples

### Must Be Able To Design

- auth + role tables
- audit/event logging
- workflow state tables
- AI runs / processing logs
- notification tables

## Senior-Level Questions To Prepare

1. How would you model a multi-tenant SaaS database?
2. When do you denormalize a schema?
3. How do you choose indexes for a growing product?
4. How do you prevent duplicate or invalid data?
5. How do you structure migrations safely?
6. How do you avoid N+1 issues?
7. How do you paginate large datasets?
8. How do you model auditability for AI-assisted workflows?
9. When would you use JSONB?
10. How do you keep a database-backed system maintainable as requirements grow?

## Red Flags

- saying “the ORM handles it”
- not understanding foreign keys
- not knowing when transactions matter
- treating joins like a performance problem by default
- weak pagination reasoning
- no answer for indexing decisions

## Best Practice For Your Story

You do not need to sound like a DBA.
You do need to sound like a backend engineer who:

- models data intentionally
- understands query shape
- protects consistency
- reasons about scale pragmatically

That is enough to pass most product-engineer interviews.
