# QA PR Log - Day 1

## Pull Request Details
- **Title:** [Sprint 2][Day 1] QA foundation, auth, catalog, wishlist, upload and admin test assets
- **Source Branch:** `feature/qa-foundation-day1`
- **Target Branch:** `develop`
- **Status:** Draft / Pending Manual Creation (Auth required)

## Summary
This Pull Request consolidates all QA test assets developed during Day 1 of Sprint 2. It establishes the foundation for automated and manual testing of core modules including Authentication, Product Catalog, Wishlist, Checkout Upload, and Admin Verification.

## Test Artifacts Added
- `qa/test-cases-auth.csv`: Authentication logic and security validation.
- `qa/test-cases-routing.csv`: Navigation and URL protection.
- `qa/test-cases-shell-smoke.csv`: Core app shell stability.
- `qa/test-cases-wishlist.csv`: Wishlist CRUD operations and guest behavior.
- `qa/test-cases-checkout-upload.csv`: File upload restrictions and error states.
- `qa/test-cases-admin-verification.csv`: Admin dashboard and order status flow.
- `qa/test-plan-sprint2.md`: Sprint-level testing strategy.

## Validation Areas Covered
- **Authentication**: High-severity login/registration scenarios.
- **Navigation**: Verification of all primary routes and guest redirects.
- **Wishlist**: Persistence across sessions and duplicate prevention.
- **Uploads**: Validation of file types (PDF/Image) and size limits.
- **Admin**: 'Pending Verification' order list and status transition logic.

## Bug Log Readiness
- `qa/day1-bug-log.md` is active with structural headers for Day 1 findings.
- `qa/bug-template.md` is available for standardized defect reporting.

## Pending Execution Dependencies
- Availability of Backend File-Service API for upload testing.
- Admin role configuration for dashboard verification.

---
*Created on: 2026-03-20*
