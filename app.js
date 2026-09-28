'use strict';
const $ = (selector, parent = document) => parent.querySelector(selector);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion && 'IntersectionObserver' in window) {
  document.body.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.06 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
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
  site: {description:'Uma apresentação completa do seu negócio, com serviços, diferenciais e um caminho simples para o contato.', html:'<div class="demo-site"><img src="assets/logo.png" alt="Edmundo Marques"><h4>Sua história merece<br><span>um lugar no mundo.</span></h4><p>Um espaço para conhecer sua marca, explorar seus serviços e dar o próximo passo.</p><div class="demo-features"><span>SOBRE A MARCA</span><span>SERVIÇOS</span><span>CONTATO</span></div><button class="demo-link primary" data-preview-service="Site">Quero um site profissional</button><div class="demo-note" role="status">Prévia de estrutura para seu negócio.</div></div>'},
  landing: {description:'Uma página focada em uma oferta: apresentar o serviço, responder dúvidas e incentivar o pedido de orçamento.', html:'<div class="demo-site"><img src="assets/logo.png" alt="Edmundo Marques"><h4>Uma boa oferta.<br><span>Toda a atenção.</span></h4><p>Uma mensagem clara, os detalhes que importam e um próximo passo bem definido.</p><button class="demo-link primary" data-preview-service="Site">Quero minha landing page</button><div class="demo-features"><span>MENSAGEM CLARA</span><span>FOCO NO CONTATO</span></div><div class="demo-note" role="status">Prévia de uma página de campanha.</div></div>'}
};
function setDemo(key) {
  const data = demoData[key];
  $('#preview').innerHTML = data.html;
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
setDemo('bio');
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
