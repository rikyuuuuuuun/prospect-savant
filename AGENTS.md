# Prospect Savant Engineering Rules

## Code Review Rules

- Public snapshot changes must update `data.js`, `event-data.js`, `retention-data.js`, `school-age-data.js`, and `snapshot-manifest.json` together. Reject partial updates or mismatched manifest hashes.
- Preserve Prospect KPI rules: annual admission rate is admissions divided by actual trials; event score is eligible-event participation 70% plus repeat participation 30%; D team is ineligible before 2025-04-01; tournament-only practices remain excluded.
- Never publish personal information, venue/facility names, internal activity IDs, Google Workspace URLs, API keys, tokens, or secret binding values.
- Upcoming events must remain provisional and excluded from attendance, score, ranking, trend, and event-count aggregates.
- Keep deterministic checks in CI. A review approval does not replace snapshot validation or privacy checks.

