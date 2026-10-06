'use strict';
const $ = (selector, parent = document) => parent.querySelector(selector);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Textos entram em sequência quando chegam à área de leitura.
// Sem JavaScript ou com movimento reduzido, continuam visíveis normalmente.
if (!reducedMotion && 'IntersectionObserver' in window) {
  const groups = new Map();
  const textElements = document.querySelectorAll(
    '.hero-copy > .eyebrow, .hero-copy > h1, .hero-copy > p, ' +
    '.section-heading > .eyebrow, .section-heading > h2, .section-heading > p, ' +
    '.service-card .eyebrow, .service-card h3, .service-card p, .service-card li, ' +
    '.show-copy > h3, .show-copy > p, .process-grid article > span, ' +
    '.process-grid h3, .process-grid p, .about > .eyebrow, .about > h2, ' +
    '.about-copy > p, .together p, .final-cta .eyebrow, .final-cta h2, .final-cta p'
  );
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('text-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  textElements.forEach(el => {
    const group = el.closest('.hero-copy, .section-heading, .service-card, .show-copy, .process-grid article, .about, .together, .final-cta');
    const position = groups.get(group) || 0;
    groups.set(group, position + 1);
    el.style.setProperty('--text-delay', `${Math.min(position, 3) * 75}ms`);
    el.classList.add('scroll-text');
    observer.observe(el);
  });
  document.body.classList.add('text-motion-ready');
}
$('#year').textContent = new Date().getFullYear();
const menu = $('.menu-toggle');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  $('#navigation').classList.toggle('open', open);
});
const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menu'); $('#navigation').classList.remove('open'); };
$('#navigation').addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
const demoData = {
  bio: {description:'Seus serviços, canais e conteúdos organizados em uma página com a cara da sua marca.', html:'<div class="demo-bio"><img src="assets/logo.png" alt="Edmundo Marques"><p>Design, estratégia e um mundo de ideias.</p><button class="demo-link primary" data-preview-service="Identidade visual">Conheça a identidade visual</button><button class="demo-link" data-preview-service="Site">Encontre o site para você</button><button class="demo-link" data-preview-service="Identidade visual + site">Vamos criar juntos</button><div class="demo-note" role="status">Experimente os botões da prévia.</div></div>'},
  site: {title:'DEIVID SOUZA PERSONAL', caption:'PROJETO REAL · DEIVID SOUZA PERSONAL', description:'Deivid Souza Personal: um projeto real para apresentar o profissional, seus serviços e os caminhos de contato.', html:'<a class="project-preview" href="https://edmundomarques98-bit.github.io/deivid-souza-personal-v2/" target="_blank" rel="noopener noreferrer"><img src="assets/projeto-deivid.jpg" width="1440" height="1000" alt="Prévia real do site Deivid Souza Personal" loading="lazy"><span>Visitar site do Deivid ↗</span></a>'},
  landing: {title:'STUDIO ALEX PACHECO', caption:'PROJETO REAL · STUDIO ALEX PACHECO', description:'Studio Alex Pacheco: uma página que apresenta o Studio, sua proposta de treino e os caminhos para conhecer o trabalho e entrar em contato.', html:'<a class="project-preview" href="https://edmundomarques98-bit.github.io/STUDIOALEXPACHECO/" target="_blank" rel="noopener noreferrer"><img src="assets/projeto-studio.jpg" width="1440" height="1000" alt="Prévia real da landing page do Studio Alex Pacheco" loading="lazy"><span>Conhecer o projeto do Studio ↗</span></a>'}
};
function setDemo(key) {
  const data = demoData[key];
  $('#preview').innerHTML = data.html;
  $('#preview').classList.toggle('has-project', key !== 'bio');
  $('#preview-title').textContent = data.title || 'SEU PRÓXIMO ESPAÇO DIGITAL';
  $('.preview-caption').textContent = data.caption || 'PRÉVIA ILUSTRATIVA · LINK NA BIO';
  $('#preview').setAttribute('aria-labelledby', 'tab-' + key);
  $('#demo-description').textContent = data.description;
  document.querySelectorAll('[data-demo]').forEach(tab => { const selected = tab.dataset.demo === key; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; });
}
document.querySelectorAll('[data-demo]').forEach((tab, index, tabs) => {
  tab.addEventListener('click', () => setDemo(tab.dataset.demo));
  tab.addEventListener('keydown', e => {
    let next;
    if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (e.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { e.preventDefault(); tabs[next].focus(); setDemo(tabs[next].dataset.demo); }
  });
});
setDemo('site');
const brief = $('#brief-dialog');
let previousFocus;
function openDialog(dialog) { previousFocus = document.activeElement; dialog.showModal(); document.body.classList.add('modal-open'); }
function openBrief(service) {
  $('#service').value = service; $('#brief-form-view').hidden = false; $('#brief-result').hidden = true;
  $('#copy-status').textContent = ''; closeMenu(); openDialog(brief);
}
document.querySelectorAll('[data-brief]').forEach(button => button.addEventListener('click', () => openBrief(button.dataset.brief)));
$('#preview').addEventListener('click', e => { const button = e.target.closest('[data-preview-service]'); if (button) openBrief(button.dataset.previewService); });
document.querySelectorAll('dialog').forEach(dialog => {
  $('.close-dialog', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r=dialog.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); if (previousFocus) previousFocus.focus(); });
});
$('#privacy-button').addEventListener('click', () => openDialog($('#privacy-dialog')));
$('#brief-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#client-name').value.trim(), idea = $('#idea').value.trim();
  if (!name || !idea) { (!name ? $('#client-name') : $('#idea')).focus(); return; }
  const business = $('#business').value.trim();
  const message = `Olá, Edmundo! Meu nome é ${name}.\n\nTenho interesse em: ${$('#service').value}.${business ? `\nMeu negócio: ${business}.` : ''}\n\nMinha ideia:\n${idea}\n\nPodemos conversar sobre o projeto?`;
  $('#brief-message').value = message;
  const phone = String(window.SITE_CONFIG?.whatsapp || '').replace(/\D/g, '');
  const hasPhone = /^55\d{10,11}$/.test(phone);
  $('#whatsapp-link').hidden = !hasPhone;
  if (hasPhone) $('#whatsapp-link').href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  $('#result-description').textContent = hasPhone ? 'Abra o WhatsApp, confira a mensagem e envie quando estiver pronto.' : 'Copie o resumo e envie ao Edmundo pelo seu canal de contato. A mensagem ainda não foi enviada.';
  $('#brief-form-view').hidden = true; $('#brief-result').hidden = false;
  $('#copy-status').textContent = ''; brief.scrollTop = 0; $('#copy-message').focus();
});
$('#copy-message').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText($('#brief-message').value); $('#copy-status').textContent = 'Mensagem copiada. Agora é só compartilhar com o Edmundo.'; }
  catch { $('#brief-message').focus(); $('#brief-message').select(); $('#copy-status').textContent = 'Selecione e copie a mensagem acima.'; }
});
$('#edit-message').addEventListener('click', () => { $('#brief-form-view').hidden = false; $('#brief-result').hidden = true; $('#service').focus(); });

// Apresentação do case Nutrimax: seleção manual e leitura ampliada.
const caseSlides = [
  ['Evolução da identidade visual', 'Evolução da identidade visual Nutrimax: comparação entre a marca anterior e o novo símbolo de atleta integrado a um escudo.'],
  ['O ponto de partida', 'Diagnóstico da identidade anterior da Nutrimax e os objetivos de diferenciação e posicionamento.'],
  ['Objetivo do redesign', 'Objetivos do redesign Nutrimax: reconhecimento, performance, percepção premium e comunidade.'],
  ['Variações da nova marca', 'Variações da nova marca Nutrimax em fundos preto, azul e verde-limão, com símbolo, tipografia e paleta.'],
  ['Resultado', 'Resultado do redesign Nutrimax: nova marca alinhada ao universo de performance e comunidade.']
];
let currentCaseSlide = 0;
const caseDialog = $('#case-dialog');
function setCaseSlide(index) {
  currentCaseSlide = (index + caseSlides.length) % caseSlides.length;
  const [title, alt] = caseSlides[currentCaseSlide];
  const src = `assets/nutrimax-case-${currentCaseSlide + 1}.webp`;
  ['#case-image', '#case-dialog-image'].forEach(selector => { $(selector).src = src; $(selector).alt = alt; });
  $('#case-expand').href = src;
  $('#case-caption').textContent = title;
  $('#case-dialog-title').textContent = 'Nutrimax — ' + title;
  $('#case-dialog-count').textContent = `${currentCaseSlide + 1} de ${caseSlides.length}`;
  document.querySelectorAll('[data-case-slide]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.caseSlide) === currentCaseSlide)));
}
document.querySelectorAll('[data-case-slide]').forEach(button => button.addEventListener('click', () => setCaseSlide(Number(button.dataset.caseSlide))));
$('#case-expand').addEventListener('click', event => { event.preventDefault(); setCaseSlide(currentCaseSlide); openDialog(caseDialog); });
function stepCase(direction) { setCaseSlide(currentCaseSlide + direction); caseDialog.scrollTop = 0; }
$('#case-previous').addEventListener('click', () => stepCase(-1));
$('#case-next').addEventListener('click', () => stepCase(1));
caseDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); stepCase(event.key === 'ArrowLeft' ? -1 : 1); }
});
