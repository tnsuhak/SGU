export default async (_request: Request, context: any) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  let html = await response.text();

  const css = `
<style id="sgu-detail-shortcut-style">
.section-shortcuts{background:#fff;padding:0 24px 28px}.section-shortcuts .shortcut-inner{max-width:1180px;margin:0 auto;border-top:1px solid rgba(28,30,36,.14);padding-top:15px;display:flex;align-items:center;gap:10px 18px;flex-wrap:wrap}.section-shortcuts .shortcut-label{font-size:11px;font-weight:800;letter-spacing:.12em;color:#71747b;text-transform:uppercase}.section-shortcuts a{position:relative;color:#20226c;text-decoration:none;font-size:13px;font-weight:800;padding-right:15px}.section-shortcuts a:after{content:'→';position:absolute;right:0;top:0}.section-shortcuts a:hover{text-decoration:underline}@media(max-width:700px){.section-shortcuts{padding:0 18px 24px}.section-shortcuts .shortcut-inner{gap:8px 14px}.section-shortcuts .shortcut-label{width:100%}}
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

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.delete('content-encoding');
  return new Response(html, { status: response.status, headers });
};
