export default async (_request: Request, context: any) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  let html = await response.text();

  const css = `
<style id="sgu-detail-shortcut-style">
.section-shortcuts{background:#fff;padding:0 24px 28px}.section-shortcuts .shortcut-inner{max-width:1180px;margin:0 auto;border-top:1px solid rgba(28,30,36,.14);padding-top:15px;display:flex;align-items:center;gap:10px 18px;flex-wrap:wrap}.section-shortcuts .shortcut-label{font-size:11px;font-weight:800;letter-spacing:.12em;color:#71747b;text-transform:uppercase}.section-shortcuts a{position:relative;color:#20226c;text-decoration:none;font-size:13px;font-weight:800;padding-right:15px}.section-shortcuts a:after{content:'→';position:absolute;right:0;top:0}.section-shortcuts a:hover{text-decoration:underline}
.sgu-news-home{background:#f6f7fa;padding:72px 24px;border-top:1px solid #e6e8ee;border-bottom:1px solid #e6e8ee}.sgu-news-inner{max-width:1180px;margin:0 auto}.sgu-news-head{display:flex;align-items:end;justify-content:space-between;gap:24px;margin-bottom:28px}.sgu-news-head .eyebrow-news{display:block;font-size:11px;font-weight:900;letter-spacing:.16em;color:#20226c;margin-bottom:8px}.sgu-news-head h2{margin:0;color:#171b55;font-size:clamp(27px,3vw,38px);line-height:1.25}.sgu-news-head p{margin:8px 0 0;color:#646874;font-size:14px}.sgu-news-head>a{white-space:nowrap;color:#20226c;text-decoration:none;font-size:13px;font-weight:800}.sgu-news-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.sgu-news-card{background:#fff;border:1px solid #dde1e9;border-top:4px solid #20226c;padding:23px;min-height:230px;display:flex;flex-direction:column}.sgu-news-date{font-size:11px;color:#7b7e86;margin-bottom:7px}.sgu-news-cat{font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#20226c;margin-bottom:10px}.sgu-news-card h3{font-size:18px;line-height:1.45;color:#171b55;margin:0 0 11px}.sgu-news-card p{font-size:13px;line-height:1.75;color:#5b5f68;margin:0 0 18px}.sgu-news-card>a{margin-top:auto;color:#20226c;text-decoration:none;font-size:12px;font-weight:800}.sgu-news-card>a:hover{text-decoration:underline}
.sgu-consult-btns{display:flex!important;gap:12px!important;flex-wrap:wrap!important;justify-content:center!important}.sgu-consult-btns a{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:12px 22px;border-radius:999px;text-decoration:none!important;font-size:15px;font-weight:800;transition:.2s ease}.sgu-consult-btns .kakao{background:#fee500!important;color:#191919!important;border:1px solid #fee500!important}.sgu-consult-btns .phone{background:#fff!important;color:#20226c!important;border:1px solid rgba(255,255,255,.9)!important}.sgu-consult-btns a:hover{transform:translateY(-1px);filter:brightness(.98)}
.sgu-detail-consult{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end}.sgu-detail-consult .button{white-space:nowrap}.sgu-detail-consult .kakao-detail{background:#fee500!important;border-color:#fee500!important;color:#191919!important}.sgu-detail-consult .phone-detail{background:#fff!important;color:#20226c!important}
@media(max-width:760px){.sgu-news-grid{grid-template-columns:1fr}.sgu-news-head{display:block}.sgu-news-head>a{display:inline-block;margin-top:15px}}
@media(max-width:700px){.section-shortcuts{padding:0 18px 24px}.section-shortcuts .shortcut-inner{gap:8px 14px}.section-shortcuts .shortcut-label{width:100%}.sgu-news-home{padding:52px 18px}.sgu-consult-btns{display:grid!important;grid-template-columns:1fr!important;width:100%!important}.sgu-consult-btns a{width:100%!important}.sgu-detail-consult{width:100%;justify-content:stretch}.sgu-detail-consult .button{flex:1 1 100%;justify-content:center}}
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

  const newsSection = `
<section class="sgu-news-home" id="news"><div class="sgu-news-inner"><div class="sgu-news-head"><div><span class="eyebrow-news">SGU NEWS</span><h2>SGU 의대 최신 소식</h2><p>SGU 공식 뉴스 중 예비 의대생에게 의미 있는 소식을 선별해 전합니다.</p></div><a href="/news.html">전체 뉴스 보기 →</a></div><div class="sgu-news-grid" id="sguNewsHomeGrid"><article class="sgu-news-card"><div class="sgu-news-date">2026.08.21</div><div class="sgu-news-cat">Research · School of Medicine</div><h3>SGU, 그레나다 겸상적혈구질환 응급 대응 개선 프로젝트 추진</h3><p>SGU 교수진과 학생들이 현지 보건 당국·환자단체와 함께 Sickle Cell Care Card 개발을 추진하고 있습니다.</p><a href="/news/sickle-cell-care-grenada-2026.html">자세히 보기 →</a></article><article class="sgu-news-card"><div class="sgu-news-date">2026.06.12</div><div class="sgu-news-cat">Student Life · School of Medicine</div><h3>SGU 의대 신입생, 그레나다 캠퍼스 White Coat Ceremony 진행</h3><p>새 의대생들이 White Coat Ceremony를 통해 의학 교육의 공식적인 첫 단계를 시작했습니다.</p><a href="/news/white-coat-grenada-2026.html">자세히 보기 →</a></article><article class="sgu-news-card"><div class="sgu-news-date">2026.03.24</div><div class="sgu-news-cat">Residency · School of Medicine</div><h3>SGU 2026 Match Day, 804명 이상 미국 레지던시 배치</h3><p>804명 이상의 SGU 학생과 졸업생이 미국 1년차 레지던시 포지션을 확보했습니다.</p><a href="/news/match-day-2026.html">자세히 보기 →</a></article><article class="sgu-news-card"><div class="sgu-news-date">2026.03.13</div><div class="sgu-news-cat">Canada · Residency</div><h3>SGU 2026 CaRMS, 캐나다 레지던시 매칭 16명으로 전년 대비 2배</h3><p>2026 CaRMS에서 16명의 SGU 학생과 졸업생이 캐나다 레지던시를 확보했습니다.</p><a href="/news/carms-canada-2026.html">자세히 보기 →</a></article></div></div></section>
<script id="sgu-news-loader">fetch('/news-data.json').then(r=>r.json()).then(data=>{const box=document.getElementById('sguNewsHomeGrid');if(!box||!Array.isArray(data.items))return;box.innerHTML='';data.items.slice(0,4).forEach(n=>{const a=document.createElement('article');a.className='sgu-news-card';a.innerHTML='<div class="sgu-news-date"></div><div class="sgu-news-cat"></div><h3></h3><p></p><a></a>';a.querySelector('.sgu-news-date').textContent=(n.date||'').replaceAll('-','.');a.querySelector('.sgu-news-cat').textContent=n.category||'';a.querySelector('h3').textContent=n.title||'';a.querySelector('p').textContent=n.summary||'';const link=a.querySelector('a');link.href=n.path;link.textContent='자세히 보기 →';box.appendChild(a);});}).catch(()=>{});</script>
`;

  const quickCompareAnchor = '<!-- ===================== QUICK COMPARE ===================== -->';
  const chooseAnchor = '<!-- ===================== 선택 가이드 ===================== -->';
  const faqAnchor = '<!-- ===================== FAQ ===================== -->';

  if (!html.includes('/md-program.html')) html = html.replace(quickCompareAnchor, pathwayLinks + quickCompareAnchor);
  if (!html.includes('/northumbria-newcastle.html')) html = html.replace(chooseAnchor, campusLinks + chooseAnchor);
  if (!html.includes('/usmle-residency.html')) html = html.replace(faqAnchor, outcomeLinks + faqAnchor);
  if (!html.includes('id="sgu-news-loader"') && html.includes(faqAnchor)) html = html.replace(faqAnchor, newsSection + faqAnchor);

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
