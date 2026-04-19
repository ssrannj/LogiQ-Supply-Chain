# Sprint 4 Risk Assessment

## Risk Log

| Risk ID | Description | Impact | Probability | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| R4-01 | Algorithmic Complexity | High | Medium | Start with simple heuristics; profile performance early. |
| R4-02 | Notification Latency | Medium | Low | Use asynchronous processing (message queues/threading). |
| R4-03 | Replication Conflicts | High | Medium | Implement robust conflict resolution (Last-Write-Wins or Vector Clocks). |
| R4-04 | Integration Delays | Medium | High | Define clear API contracts between Frontend and Backend on Day 1. |
| R4-05 | UI Responsiveness | Low | Medium | Use lazy loading for Dashboards and optimize SVG/Canvas rendering. |

## Mitigation Status
- **R4-04 (Integration):** API draft scheduled for Day 1 EOD (PM to coordinate).
- **R4-03 (Replication):** Consistency logic being refined in parallel by backend team.
