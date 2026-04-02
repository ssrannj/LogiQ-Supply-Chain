# QA Bug Log - Sprint 2

| Bug ID | Module | Summary | Steps to Reproduce | Expected | Actual | Severity | Status | Assigned To |
|:---:|---|---|---|---|---|:---:|:---:|:---:|
| BUG-001 | Checkout-Upload | No file extension validation | Upload an .exe or .zip as receipt | System blocks invalid formats | All extensions accepted | High | **Fixed** | Dev 2 |
| BUG-002 | Email-Flow | Hardcoded recipient email | Trigger any admin verification | Send to actual user | Hardcoded to customer@example.com | Medium | **Fixed** | Dev 1 |
| BUG-003 | Checkout-Upload | Missing file size limit | Upload a very large file | Error message for size limit | No check, possible server crash | Medium | **Fixed** | Dev 2 |
| BUG-004 | Warranty | Guest can access warranty form | Guest should be redirected to login | Form accessible to all | High | **Fixed** | Dev 1 |
| BUG-005 | Tracking | 500 Error on invalid/empty search | System should show 'Order not found' | Generic 500 error page | Low | **Fixed** | Dev 1 |

| BUG-006 | All Modules | Missing code in feature/qa-foundation-day1 branch | Pull and merge recent fixes | Modules present and functional | Code is missing from current branch after recovery | Critical | **Pending** | Devs |
| BUG-007 | Admin Verify | Delayed email delivery for verification | Trigger an admin verification and wait | Email arrives within 5 seconds | Verification email arrives 1-2 minutes later | Low | **New** | Dev 1 |

### Status Summary
**Date:** 2026-03-23 (Live Deployment Smoke Test)
**Current State:** Testing live deployed app.
**Result:** **Working** overall, with one minor issue. Core customer flows function perfectly. Admin verification module has a small email delivery delay but works successfully.

---
*Please use the `qa/bug-template.md` for detailed reports if new bugs are discovered during testing.*
