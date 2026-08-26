# Security Specification for Security Quoter

## Data Invariants
1. A quote must have at least one item.
2. The reference ID must match the document ID.
3. `createdAt` must be a server timestamp.

## The Dirty Dozen Payloads
1. Create a quote without being authenticated.
2. Update a quote owned by another user.
3. Delete a quote owned by another user.
4. Create a quote with a future timestamp.
5. Inject a 2MB string into the requirements field.
6. Change the `ownerId` of an existing quote.
7. List all quotes without proper filtering.
8. Create a quote with negative prices.
9. Update `createdAt` field.
10. Create a document in a path not defined in the blueprint.
11. Read a quote without knowing its exact ID.
12. Bulk download / scraping of all quotes.

## Rules Logic Draft
- Default deny all.
- `/presupuestos/{quoteId}`: 
  - `get`: Allow if `isValidId(quoteId)`.
  - `list`: Only allow if user is authenticated and filters by `ownerId`.
  - `create`: Allow if authenticated and data is valid.
  - `update`: Allow if authenticated and is the owner.
  - `delete`: Allow if authenticated and is the owner.
