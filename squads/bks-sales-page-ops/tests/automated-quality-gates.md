# Automated Quality Gates (Runbook)

## Mandatory Checks
1. HTML semantics and accessibility baseline
2. CSS responsiveness and contrast checks
3. JS form flow and error handling checks
4. Backend endpoint validation checks
5. Tracking contract checks (UTM + event names)
6. Security checks (no secrets, consent required)

## Suggested Commands
- lint html/css/js
- run frontend smoke tests
- run backend endpoint tests
- verify event payload mapping to CRM

## Release Rule
- Do not release if any critical check fails.
