# Sprint 3 Functional Test Notes

## 1. Feature: Priority Score Calculation
- **Branch**: `feature/priority-score`
- **What Passed**:
  - API `GET /api/test/priority-score` returns correct score based on logic: `(10 - days) + (urgent ? 20 : 0) + age`.
  - Input `days=1, urgent=true, age=2` -> Score `31` (Verified).
  - Input `days=5, urgent=false, age=1` -> Score `6` (Verified).
  - Input `days=0, urgent=false, age=0` -> Score `10` (Verified).
  - Input `days=-1, urgent=false, age=0` -> Score `11` (Verified).
- **Issues Found**: None.

## 2. Feature: Catalog Search
- **Branch**: `feature/catalog-search`
- **What Passed**:
  - API `GET /api/products/search?keyword=chair` returns list of chairs (Ergonomic, Velvet, Wooden).
  - Frontend search input correctly triggers API call.
  - Search results display correctly in the product grid.
  - Empty search results (keyword: 'nonexistent') display a user-friendly "No products found" message.
- **Issues Found**: None.

---
**Date**: 2026-04-04
**Status**: All functional tests for Day 1 passed.
