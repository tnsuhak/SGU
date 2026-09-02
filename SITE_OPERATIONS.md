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
- news.html: SGU School of Medicine news archive for Korean students
- news/*.html: indexable localized news detail pages with official-source links

## Source / claim rules
- Use SGU and relevant regulator / partner primary sources for factual claims.
- Never mix outcome statistics with different populations or time windows. Always preserve cohort, denominator and date range where material.
- Do not embed or link third-party study-abroad agency YouTube videos. Their content may be used only as internal research reference where legally and editorially appropriate.
- Student anecdotes and hearsay (for example attrition-rate claims) must not be presented as official statistics.
- Waterloo 2026 intake is closed. For September 2027, international-student eligibility must remain 'official announcement pending' until an official admissions notice is published.
- Waterloo Preclinical Track tuition currently used on this site: US$23,392 per term, based on the provided 2026 Waterloo material; re-check against the intake-specific official notice before future publication updates.

## Homepage shortcut implementation
- Preserve the original large index.html unchanged.
- Homepage detail-page shortcuts and the homepage SGU NEWS section are injected by the Netlify Edge Function in netlify/edge-functions/homepage-shortcuts.ts, configured in netlify.toml.
- Keep shortcut treatment thin and institutional (text links under relevant sections), not large SEO cards.
- Homepage news cards load their current ordering/content from news-data.json, with server-rendered fallback cards retained for crawlability and resilience.

## Asset URL portability
- Preserve the original large homepage HTML rather than bulk-rewriting embedded/saved-page markup.
- netlify/edge-functions/asset-url-normalizer.ts normalizes relative asset references against the current request URL on all HTML responses.
- Normalize image/media/script `src`, poster and common lazy-load attributes, `srcset`, inline CSS `url(...)`, stylesheet/icon/preload/manifest links, and Open Graph/Twitter preview images.
- Leave ordinary anchor/navigation `href` values unchanged so internal navigation and conversion links keep their intended behavior.
- Do not rewrite already absolute URLs, protocol-relative URLs, data/blob/mailto/tel/javascript URLs, or fragment references.
- Use request-derived hostnames instead of hard-coding Production so Deploy Preview validates its own assets and Production automatically uses the Production host after merge.

## News automation
- Primary discovery source: https://www.sgu.edu/news-and-events/ and SGU School of Medicine official pages.
- Prioritize: admissions/program changes, Waterloo/Northumbria developments, tuition/scholarships, student education, clinical training, research opportunities, accreditation/recognition, USMLE/residency/match outcomes, and other items useful to prospective Korean students.
- Deprioritize routine ceremonies, generic promotion, unrelated veterinary/arts/graduate-school news, and low-value event notices unless they materially help recruitment or student decision-making.
- Default news image policy is text-first / no image.
- Localize and summarize independently in Korean; do not copy or simply translate the source article.
- Every published news page must preserve the exact SGU official source link and source title.
- Update news-data.json, news.html behavior/content as needed, the new news detail page, and sitemap.xml together.
- Homepage displays the latest four selected items in a 2-column by 2-row grid on desktop; mobile collapses to one column.
- Preview-first: automated discovery/publishing work must create or update a Preview PR and must not merge to Production without user approval.

## Deployment
- Preview-first. Continue refinements on the existing feature branch / PR until final approval, then merge main once and verify Production.
