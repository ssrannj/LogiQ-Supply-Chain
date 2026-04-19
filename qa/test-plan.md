# Sprint 4 QA Test Plan - LogiQ Supply Chain

## 1. Introduction
This test plan outlines the QA strategy for Sprint 4 of the LogiQ Supply Chain system. Focus is on core operational features including damage reporting, asset tracking, and financial reconciliation.

## 2. Scope
The following features are within the scope of Sprint 4 testing:
- **Damage Ticket Management**: Creation and tracking of damage reports.
- **Image Upload**: Attachment of visual evidence to tickets and logs.
- **Bonus Calculation**: Automated calculation of driver and staff bonuses based on performance metrics.
- **QR Generation**: Generation of QR codes for shipment and asset tracking.
- **Cash Collection**: Recording and verification of cash payments at delivery points.

## 3. Test Objectives
- Verify that damage tickets can be created with all required fields.
- Ensure image uploads are handled correctly and associated with the right records.
- Validate the accuracy of bonus calculation logic.
- Confirm QR codes are generated correctly and are scannable.
- Ensure cash collection entries are recorded accurately and update the ledger.

## 4. Test Environment
- **Environment**: Staging / QA Environment
- **Browser**: Chrome (Latest), Edge (Latest)
- **Database**: MySQL (as per project schema)

## 5. Test Strategy
- **Functional Testing**: Testing individual features against requirements.
- **Negative Testing**: Testing with invalid inputs (e.g., oversized images, negative bonus values).
- **Usability Testing**: Ensuring the UI for QR generation and cash collection is intuitive.

## 6. Resources
- QA Lead / Tester
- Github Repository access
- Test Data (Sample shipment IDs, employee IDs)

## 7. Approval
- Project Manager
- Lead Developer
