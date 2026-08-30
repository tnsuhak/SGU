export default async (_request: Request, context: any) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  let html = await response.text();

  const css = `
<style id="sgu-detail-shortcut-style">
.section-shortcuts{background:#fff;padding:0 24px 28px}.section-shortcuts .shortcut-inner{max-width:1180px;margin:0 auto;border-top:1px solid rgba(28,30,36,.14);padding-top:15px;display:flex;align-items:center;gap:10px 18px;flex-wrap:wrap}.section-shortcuts .shortcut-label{font-size:11px;font-weight:800;letter-spacing:.12em;color:#71747b;text-transform:uppercase}.section-shortcuts a{position:relative;color:#20226c;text-decoration:none;font-size:13px;font-weight:800;padding-right:15px}.section-shortcuts a:after{content:'→';position:absolute;right:0;top:0}.section-shortcuts a:hover{text-decoration:underline}
.sgu-consult-btns{display:flex!important;gap:12px!important;flex-wrap:wrap!important;justify-content:center!important}.sgu-consult-btns a{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:12px 22px;border-radius:999px;text-decoration:none!important;font-size:15px;font-weight:800;transition:.2s ease}.sgu-consult-btns .kakao{background:#fee500!important;color:#191919!important;border:1px solid #fee500!important}.sgu-consult-btns .phone{background:#fff!important;color:#20226c!important;border:1px solid rgba(255,255,255,.9)!important}.sgu-consult-btns a:hover{transform:translateY(-1px);filter:brightness(.98)}
.sgu-detail-consult{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end}.sgu-detail-consult .button{white-space:nowrap}.sgu-detail-consult .kakao-detail{background:#fee500!important;border-color:#fee500!important;color:#191919!important}.sgu-detail-consult .phone-detail{background:#fff!important;color:#20226c!important}
@media(max-width:700px){.section-shortcuts{padding:0 18px 24px}.section-shortcuts .shortcut-inner{gap:8px 14px}.section-shortcuts .shortcut-label{width:100%}.sgu-consult-btns{display:grid!important;grid-template-columns:1fr!important;width:100%!important}.sgu-consult-btns a{width:100%!important}.sgu-detail-consult{width:100%;justify-content:stretch}.sgu-detail-consult .button{flex:1 1 100%;justify-content:center}}
</style>`;

  if (!html.includes('sgu-detail-shortcut-style')) {
    html = html.replace('</head>', `${css}</head>`);
  }

  const pathwayLinks = `
<div class="section-shortcuts"><div class="shortcut-inner"><span class="shortcut-label">RELATED</span><a href="/md-program.html">4·5·6·7년 MD 과정</a><a href="/admissions.html">입학조건</a></div></div>
`;
  const campusLinks = `
<div class="section-shortcuts"><div class="shortcut-inner"><span class="shortcut-label">CAMPUS GUIDE</span><a href="/northumbria-newcastle.html">Northumbria · Newcastle</a><a href="/waterloo.html">University of Waterloo</a><a href="/tuition-scholarships.html">학비 · 장학금</a></div></div>
`;
  const outcomeLinks = `
<div class="section-shortcuts"><div class="shortcut-inner"><span class="shortcut-label">OUTCOMES</span><a href="/usmle-residency.html">USMLE · 미국 레지던시 자세히 보기</a></div></div>
`;

  const quickCompareAnchor = '<!-- ===================== QUICK COMPARE ===================== -->';
  const chooseAnchor = '<!-- ===================== 선택 가이드 ===================== -->';
  const faqAnchor = '<!-- ===================== FAQ ===================== -->';

  if (!html.includes('/md-program.html')) html = html.replace(quickCompareAnchor, pathwayLinks + quickCompareAnchor);
  if (!html.includes('/northumbria-newcastle.html')) html = html.replace(chooseAnchor, campusLinks + chooseAnchor);
  if (!html.includes('/usmle-residency.html')) html = html.replace(faqAnchor, outcomeLinks + faqAnchor);

  // Remove the non-functional inquiry form entirely from the homepage.
  html = html.replace(/<!-- ===================== INQUIRY FORM ===================== -->[\s\S]*?<section id=["']inquiry-form["'][\s\S]*?<\/section>/i, '');

  // Any old links that pointed to the removed form now go to the consultation CTA.
  html = html.replaceAll('href="#inquiry-form"', 'href="#inquiry"');
  html = html.replaceAll("href='#inquiry-form'", "href='#inquiry'");

  // Homepage consultation actions.
  const consultButtons = `<div class="cta-btns sgu-consult-btns"><a class="kakao" href="https://open.kakao.com/o/slehLvKi" target="_blank" rel="noopener">카카오톡 상담</a><a class="phone" href="tel:01051500105">전화 상담 · 010-5150-0105</a></div>`;
  html = html.replace(/<div class=["']cta-btns["']>[\s\S]*?<\/div>/i, consultButtons);

  // Detail-page consultation actions.
  const detailConsult = `<div class="sgu-detail-consult"><a class="button kakao-detail" href="https://open.kakao.com/o/slehLvKi" target="_blank" rel="noopener">카카오톡 상담</a><a class="button phone-detail" href="tel:01051500105">전화 상담 · 010-5150-0105</a></div>`;
  html = html.replaceAll('<a class="button" href="/#inquiry">입학문의</a>', detailConsult);

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.delete('content-encoding');
  return new Response(html, { status: response.status, headers });
};
