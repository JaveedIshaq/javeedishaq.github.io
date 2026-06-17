# Week 3: Diagnosis Uploads And Data Modeling

## Objective

Build the domain model that makes the product real instead of generic.

## Main Outcome

By the end of this week, you should have:

- diagnosis image upload flow
- plant and diagnosis metadata storage
- async analysis pipeline placeholder
- audit logging started
- stronger PostgreSQL confidence

## Build Tasks

- Implement diagnosis image upload endpoint
- Store image metadata
- Add diagnosis status fields:
  - uploaded
  - processing
  - analyzed
  - failed
- Create diagnosis result schema
- Add audit logging for:
  - image upload
  - diagnosis request
  - care-plan generation
- Add pagination and filtering for plants and diagnoses
- Add basic storage abstraction so the file-storage choice is not hard-coded everywhere

## Study Focus

- PostgreSQL essentials:
  - primary keys
  - foreign keys
  - indexes
  - pagination tradeoffs
  - transactions
  - soft delete tradeoffs
- Node file upload basics
- storage abstraction design

## SaaS Architecture Focus

- file storage choices
- diagnosis lifecycle
- user-owned plant records
- auditability for AI-assisted health suggestions

## Interview Prep Focus

Prepare answers for:

- How did you model plants, diagnoses, and care plans?
- What indexes would you add first?
- How would you handle failed analysis or re-processing?
- Why is audit logging important in an AI-assisted diagnosis product?

## End-Of-Week Deliverables

- diagnosis upload API
- storage and metadata model
- audit log table and usage
- paginated plant/diagnosis list endpoint
- written schema explanation

## Red Flags

- ignoring indexing entirely
- no status model for diagnoses
- dumping AI logic into the upload controller
