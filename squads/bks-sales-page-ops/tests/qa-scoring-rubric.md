# Sales Page QA Scoring Rubric

## Scoring Model
- Each dimension: 0-10
- Approval thresholds:
  - Overall >= 8.5
  - No critical findings
  - Security/Privacy >= 9
  - Mobile UX >= 8.5

## Dimensions
1. Message-market fit
2. Persuasion clarity
3. UX architecture
4. Visual quality/signature
5. Frontend engineering quality
6. Backend reliability
7. Tracking integrity
8. Security/Privacy
9. Motion/interaction quality
10. Financial viability instrumentation

## Hard Fail Conditions
- Generic/template-like visual with low intentionality
- Missing consent/privacy links when collecting data
- Wrong conversion event (`TestEvent`) as primary objective
- Sensitive data exposure in source/logs
- No measurable path to cost per meeting and cost per sale
