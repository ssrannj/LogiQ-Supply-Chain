# Day 4 Morning Test Note - 2026-03-21

## Summary
The morning session focused on testing the newly pushed tracking and warranty features. Overall, the core tracking and warranty management flows for both admin and customers are working as expected. However, two bugs were identified during the testing.

## Activities
- [x] Pulled latest developer updates for warranty and tracking features.
- [x] Tested Order status and details view for customers.
- [x] Validated admin ability to update order statuses.
- [x] Tested invalid order ID searches and empty search scenarios.
- [x] Verified warranty claim submission and management.
- [x] Tested guest access for the warranty form.

## Observations
- **BUG-004:** Guests are able to see and access the entire warranty claim form. This should be restricted to logged-in users only.
- **BUG-005:** If a user searches with an empty ID or a non-existent ID in the tracking page, the system throws a generic 500 error instead of a user-friendly "Order not found" message.
- Tracking history is displaying all status updates correctly in chronological order.

## Next Steps
- Revisit BUG-002 (Email issue) in the afternoon session to see if it's fixed.
- Test tracking notification emails if they are implemented.
- Update tracking and warranty status in the test cases spreadsheet for the final morning report.
