# SGU Site Operations

## Positioning
- Preserve the current homepage's SGU institutional / official-school-site atmosphere.
- Do not rebuild the homepage as a generic TNS study-abroad landing page.
- Keep TNS conversion elements secondary to SGU program information.

## Internal SEO architecture
- admissions.html: admissions / entry requirements
- md-program.html: 4-, 5-, 6-, 7-year MD program and tracks
- tuition-scholarships.html: tuition and scholarships
- northumbria-newcastle.html: SGU / Northumbria Newcastle pathway
- waterloo.html: SGU + University of Waterloo track
- usmle-residency.html: USMLE and residency outcomes
- us-doctor-pathway.html: US doctor pathway; keep subordinate to the outcomes page and do not promote heavily on the homepage

## Source / claim rules
- Use SGU and relevant regulator / partner primary sources for factual claims.
- Never mix outcome statistics with different populations or time windows. Always preserve cohort, denominator and date range where material.
- Do not embed or link third-party study-abroad agency YouTube videos. Their content may be used only as internal research reference where legally and editorially appropriate.
- Student anecdotes and hearsay (for example attrition-rate claims) must not be presented as official statistics.
- Waterloo 2026 intake is closed. For September 2027, international-student eligibility must remain 'official announcement pending' until an official admissions notice is published.
- Waterloo Preclinical Track tuition currently used on this site: US$23,392 per term, based on the provided 2026 Waterloo material; re-check against the intake-specific official notice before future publication updates.

## Homepage shortcut implementation
- Preserve the original large index.html unchanged.
- Homepage detail-page shortcuts are injected by the Netlify Edge Function in netlify/edge-functions/homepage-shortcuts.ts, configured in netlify.toml.
- Keep shortcut treatment thin and institutional (text links under relevant sections), not large SEO cards.

## Deployment
- Preview-first. Continue refinements on the existing feature branch / PR until final approval, then merge main once and verify Production.
