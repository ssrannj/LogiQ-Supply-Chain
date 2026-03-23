# QA Bug Log - Sprint 2

| Bug ID | Module | Summary | Steps to Reproduce | Expected | Actual | Severity | Status | Assigned To |
|:---:|---|---|---|---|---|:---:|:---:|:---:|
| BUG-001 | Checkout-Upload | No file extension validation | Upload an .exe or .zip as receipt | System blocks invalid formats | All extensions accepted | High | **Fixed** | Dev 2 |
| BUG-002 | Email-Flow | Hardcoded recipient email | Trigger any admin verification | Send to actual user | Hardcoded to customer@example.com | Medium | **Fixed** | Dev 1 |
| BUG-003 | Checkout-Upload | Missing file size limit | Upload a very large file | Error message for size limit | No check, possible server crash | Medium | **Fixed** | Dev 2 |
| BUG-004 | Warranty | Guest can access warranty form | Guest should be redirected to login | Form accessible to all | High | **Fixed** | Dev 1 |
| BUG-005 | Tracking | 500 Error on invalid/empty search | System should show 'Order not found' | Generic 500 error page | Low | **Fixed** | Dev 1 |

| BUG-006 | All Modules | Missing code in feature/qa-foundation-day1 branch | Pull and merge recent fixes | Modules present and functional | Code is missing from current branch after recovery | Critical | **Pending** | Devs |

### Status Summary
**Date:** 2026-03-23 (Demo Path Testing)
**Current State:** Tracking demo path for tonight's deployment.
**Result:** **Critical Issue** found. Only Auth module is present in the `feature/qa-foundation-day1` branch. Catalog, Wishlist, Checkout, Tracking, and Warranty modules are missing despite being marked as fixed in the recovery note. This is likely a branch sync issue.

---
*Please use the `qa/bug-template.md` for detailed reports if new bugs are discovered during testing.*
