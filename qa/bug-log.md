# QA Bug Log - Sprint 2

| Bug ID | Module | Summary | Steps to Reproduce | Expected | Actual | Severity | Status | Assigned To |
|:---:|---|---|---|---|---|:---:|:---:|:---:|
| BUG-001 | Checkout-Upload | No file extension validation | Upload an .exe or .zip as receipt | System blocks invalid formats | All extensions accepted | High | **Fixed** | Dev 2 |
| BUG-002 | Email-Flow | Hardcoded recipient email | Trigger any admin verification | Send to actual user | Hardcoded to customer@example.com | Medium | **Pending** | Dev 1 |
| BUG-003 | Checkout-Upload | Missing file size limit | Upload a very large file | Error message for size limit | No check, possible server crash | Medium | **Fixed** | Dev 2 |

### Status Summary
**Date:** 2026-03-20 (Night)
**Current State:** Developers have pushed their night work.
**Result:** 2 bugs fixed (BUG-001, BUG-003). BUG-002 is still pending for retest tomorrow.


---
*Please use the `qa/bug-template.md` for detailed reports if new bugs are discovered during testing.*
