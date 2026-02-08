# COBOL Student Account System Test Plan

This test plan covers the current business logic and behavior of the COBOL application to support stakeholder validation and future Node.js test creation.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-001 | View balance from main menu | Application started; balance initialized to 1000.00 | 1) Select option 1 (View Balance) | Balance is displayed as 1000.00 on first run | TBD | TBD | Verify display format with stakeholders |
| TC-002 | Credit increases balance | Application started; balance initialized to 1000.00 | 1) Select option 2 (Credit) 2) Enter amount 50.00 | Balance increases to 1050.00 and is displayed | TBD | TBD | Validate currency/decimal input handling |
| TC-003 | Debit decreases balance when sufficient | Application started; balance initialized to 1000.00 | 1) Select option 3 (Debit) 2) Enter amount 200.00 | Balance decreases to 800.00 and is displayed | TBD | TBD | Ensure amount uses 2 decimals |
| TC-004 | Debit blocked when insufficient funds | Application started; balance initialized to 1000.00 | 1) Select option 3 (Debit) 2) Enter amount 2000.00 | Message indicates insufficient funds; balance unchanged | TBD | TBD | Confirm message text with stakeholders |
| TC-005 | Sequential credit then debit updates balance | Application started; balance initialized to 1000.00 | 1) Credit 100.00 2) Debit 40.00 3) View balance | Balance is 1060.00 | TBD | TBD | Validates read/write persistence across operations |
| TC-006 | Invalid menu option handling | Application started | 1) Enter choice 9 | Error message displayed; menu continues | TBD | TBD | Validate exact message wording |
| TC-007 | Exit program | Application started | 1) Select option 4 (Exit) | Program prints exit message and terminates | TBD | TBD | Confirm exit message wording |
| TC-008 | Operation code mapping for View Balance | Application started | 1) Select option 1 | Operations receives 'TOTAL ' and reads balance | TBD | TBD | Internal behavior validation |
| TC-009 | Operation code mapping for Credit | Application started | 1) Select option 2 | Operations receives 'CREDIT' and writes new balance | TBD | TBD | Internal behavior validation |
| TC-010 | Operation code mapping for Debit | Application started | 1) Select option 3 | Operations receives 'DEBIT ' and checks funds | TBD | TBD | Internal behavior validation |
| TC-011 | Data program read operation | Application started; balance initialized to 1000.00 | 1) Trigger any read (View Balance) | DataProgram returns stored balance | TBD | TBD | Covers READ operation logic |
| TC-012 | Data program write operation | Application started | 1) Credit 10.00 2) View balance | DataProgram updates and returns new balance | TBD | TBD | Covers WRITE operation logic |
| TC-013 | Balance persists within single run | Application started | 1) Credit 25.00 2) View balance 3) Debit 5.00 4) View balance | Balance reflects updates across steps | TBD | TBD | Confirms shared storage behavior |
| TC-014 | Debit equals balance allowed | Application started; balance initialized to 1000.00 | 1) Debit 1000.00 2) View balance | Balance is 0.00 and debit succeeds | TBD | TBD | Edge case for >= check |
| TC-015 | Menu loop continues after valid operations | Application started | 1) View balance 2) View balance again | Menu reappears after each operation | TBD | TBD | Confirms loop control |
