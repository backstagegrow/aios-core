# Operational Guardrails

## Anti-Error Rules
- Block if conversion event is TestEvent.
- Block if UTM contract is missing.
- Block if no CRM source mapping exists.
- Block if consent checkbox is absent in lead form.
- Block if commercial SLA is undefined.

## Escalation Rules
- If CPL degrades >30% in 48h, trigger rollback protocol.
- If lead quality drops for 2 consecutive days, tighten qualification.
- If show rate < 50%, pause scale and review handoff process.
