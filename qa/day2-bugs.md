# QA Bug Report - Day 2

## Summary
No functional bugs were identified in the application logic during Day 2 testing; however, significant environmental issues were encountered that hindered full automated test execution.

## Critical Issues (Environmental)
| ID | Title | Severity | Status | Description |
|---|---|---|---|---|
| ENV-01 | Cypress Execution Blocked | High | Open | Running `npx cypress run` results in an "Access is denied" error or no output in the current automated shell environment. |
| ENV-02 | Service Connectivity | High | Open | Frontend (5000) and Backend (8081) were not reachable during automated checks. |

## Recommendations
1. Verify the development environment permissions for Cypress.
2. Manually start services before automated test runs.
