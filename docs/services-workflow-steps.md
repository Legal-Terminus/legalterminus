# Services Workflow Steps

> Source: `Services Steps for APP.xlsx`  
> Converted: 2026-05-31  
> Sheets: Company Incorporation · Trademark Registration · GST Registration · UDYAM Registration

---

## Company Incorporation (41 steps)

| Sl No | Step | Notes / Rules |
|---|---|---|
| 1 | Payment | |
| 2 | **Payment Gate**: Full Payment Received / Part Payment Pending / Full Payment Pending | Three-way branch on payment status |
| 3 | Work Assigning | |
| 4 | Name & Objects Received | |
| 5 | Checklist Received | *To be discussed* |
| 6 | Name Search & Object Preparation (Incorporation) | Loop-back target from steps 9 and 15 |
| 7 | Name Search & Object Finalisation | |
| 8 | Search Report and Objects Mail to Client | Email triggered to client |
| 9 | Client Approval Pending on Final Name & Object | If approved → Step 10. If rejected → loop back to Step 6 |
| 10 | Client Approval on Final Name & Object | |
| 11 | Name Application Filing (Incorporation) | |
| 12 | Payment for Name Application | |
| 13 | Pending Name Approval (Department) | Department step |
| 14 | — | **Branch: Resubmission Received on Name Reservation** |
| 15a | For New Name | Email triggered to client requesting new name. On receipt → loop back to Step 6 |
| 15b | For Documentation Only | → Proceed to Step 16b |
| 16a | Repeat from Step 6 | (New name branch) |
| 16b | Preparation of Document | (Documentation branch) |
| 17 | Approval | |
| 18 | Signature of Client (if required) | |
| 19 | Resubmission of Name Reservation | |
| 20 | Name Approval Letter Received (Department) | Email triggered to client **with attachment** |
| 21 | Part Payment Due — Blinking Indicator | Blinking shown on both client and team login. Regular interval payment reminder notifications sent to client |
| 22 | Preparation of Incorporation Documents | |
| 23 | Waiting for Client Signature & Other Documents | Email triggered **with attachment** to client |
| 24 | Collection of Documents (For Incorporation) | Client uploads signed + other documents. **Steps 22–26 can proceed without balance payment** |
| 25 | Form Fill Up (Incorporation) | |
| 26 | Form Check (Incorporation Form) | |
| 27 | Full Payment Received | |
| 28 | Uploading of Incorporation Forms | **Cannot be executed without balance payment. Only Admin can override.** |
| 29 | Payment of Challan for Incorporation | No payment integration. Only date of payment + challan details to be recorded. |
| 30 | Pending for Approval (Final COI) from Department | |
| 31a | Approval Received | → Step 38 |
| 31b | Resubmission Received on Incorporation | → Branch |
| 32 | Email to Client with Additional Information / Documents Required | |
| 33a | If Information Related | |
| 33b | If Document Related | |
| 34a | Collection of Information (if required) | |
| 34b | Preparation & Collation of Document | |
| 35a | Approval of Client (if required) | Email triggered to client for approval in both cases |
| 35b | Signature of Client (if required) | |
| 36 | Form Fill Up & Resubmission | |
| 37 | Pending for Approval (Final COI) from Department | |
| 38 | COI Received | |
| 39 | PAN & TAN Certificate Received from Department | |
| 40 | Mail to Client for Final COI | |
| 41 | Final Incorporation Master Sheet Update | |

### Client View (Company Incorporation)

Three-tab layout for each task:

| Tab | Content |
|---|---|
| **Steps** | What steps exist, which is pending, and at what step the assignment is pending |
| **Documents** | Documents provided, approved, rejected |
| **Payments** | Fully paid / not paid / amount due |

---

## Trademark Registration (25 steps)

| Sl No | Step | Notes / Rules |
|---|---|---|
| 1 | Payment | |
| 2 | **Payment Gate**: Full Payment Received / Part Payment Pending / Full Payment Pending | |
| 3 | Work Assigning | |
| 4 | Name & Objects Received | |
| 5 | Checklist Received | *To be discussed* |
| 6 | Name Search & Object Preparation for Trademark | Loop-back target from step 9 |
| 7 | Name Search & Object Finalisation | |
| 8 | Search Report and Objects Mail to Client | Email triggered to client |
| 9 | Client Approval Pending on Final Name & Object | If approved → Step 10. If rejected → loop back to Step 6 |
| 10 | Client Approval on Final Name & Object | |
| 11 | Collection of Documents (For Trademark Application — Logo) | Client uploads signed + other documents |
| 12 | Part Payment Due — Blinking Indicator | Blinking on client and team login. Regular interval reminders sent to client |
| 13 | Preparation of POA & Other Documents | |
| 14 | Waiting for Signed POA & Other Documents | Email triggered **with attachment** to client |
| 16 | Form Fill Up (TM-A) | **Steps 13–20 can proceed without balance payment** |
| 17 | Form Check (TM-A) | |
| 18 | Draft TM-A Mail to Client | |
| 19 | Client Approval Pending on Draft TM-A | If approved → Step 20. If rejected → loop back to Step 16 |
| 20 | Client Approval Received on Draft TM-A | |
| 21 | Full Payment Received | |
| 22 | DSC Affixation in TM-A | **Cannot be executed without balance payment. Only Admin can override.** |
| 23 | Payment of Challan for TM-A | No payment integration. Only date of payment + challan details recorded. |
| 24 | TM-A Acknowledgement & Challan Mail to Client | |
| 25 | Trademark Master Sheet Update | |

### Client View (Trademark Registration)

Three-tab layout — same as Company Incorporation.

---

## GST Registration (21 steps)

| Sl No | Step | Notes / Rules |
|---|---|---|
| 1 | Payment | |
| 2 | **Payment Gate**: Full Payment Received / Part Payment Pending / Full Payment Pending | |
| 3 | Work Assigning | |
| 4 | Checklist Received | *To be discussed* |
| 5 | Collection of Documents (For GST Application) | Client uploads signed + other documents |
| 6 | Preparation of Board Resolution & Other Documents (if required) | |
| 7 | Waiting for Board Resolution & Other Documents | Email triggered **with attachment** to client |
| 8 | TRN Generation Completed | |
| 9 | Application Fill Up for GST Registration | |
| 10 | Application Submitted for GST Registration | Email triggered |
| 11 | Aadhaar Authentication Pending from Client | Client action required |
| 12 | Aadhaar Authentication Completed | |
| 13 | ARN Received | |
| 14 | Pending Approval from Department | If approved → Step 21 |
| 15a | Approval Received | → Step 21 |
| 15b | Resubmission Received on GST Application | Email triggered **with attachment** to client |
| 16 | Email to Client with Additional Information / Documents Required | |
| 17a | If Information Related | |
| 17b | If Document Related | |
| 18a | Collection of Information (if required) | |
| 18b | Preparation & Collation of Document | |
| 19a | Approval of Client (if required) | |
| 19b | Signature of Client (if required) | |
| 20 | Form Fill Up & Resubmission | |
| 21 | GST Certificate Received | Email triggered **with attachment** to client |

### Client View (GST Registration)

Three-tab layout — same as Company Incorporation.

---

## UDYAM Registration (7 steps)

| Sl No | Step | Notes / Rules |
|---|---|---|
| 1 | Payment | |
| 2 | **Payment Gate**: Full Payment Received / Part Payment Pending / Full Payment Pending | |
| 3 | Work Assigning | |
| 4 | Checklist Received | *To be discussed* |
| 7 | Application Fill Up for UDYAM Registration | |
| 8 | Application Submitted for UDYAM Registration | |
| 21 | UDYAM Certificate Received | Email triggered **with attachment** to client |

> Note: Step numbers 5, 6, 9–20 are absent from the source sheet. Steps go from 4 → 7 → 8 → 21. Likely steps 5–6 were not applicable or were intentionally omitted for UDYAM. **To be confirmed with client.**

### Client View (UDYAM Registration)

Three-tab layout — same as Company Incorporation.

---

## Cross-Service Notes

- **Payment gate pattern** is identical across all four services: Step 1 = Payment, Step 2 = three-way branch (Full Paid / Part Pending / Full Pending).
- **Checklist Received** (Step 4/5) is flagged as "Need to discuss" across all services — may require clarification.
- **Challan payment** steps: No payment integration needed; only date + challan reference to be manually recorded.
- **Balance payment hard block**: Applies at Step 28 (Incorporation) and Step 22 (Trademark). Admin override is the only bypass.
- **Steps allowed without balance payment**: Steps 22–26 (Incorporation), Steps 13–20 (Trademark).
- **Email triggers with attachments**: Steps 20, 23 (Incorporation); Step 14 (Trademark); Steps 7, 10, 15, 21 (GST); Step 21 (UDYAM).
- **Client upload steps**: Step 24 (Incorporation), Step 11 (Trademark), Step 5 (GST).
- **Loop-back branches**: Step 9 → Step 6 (all services); Step 15 → Step 6 (Incorporation resubmission); Step 19 → Step 16 (Trademark).
