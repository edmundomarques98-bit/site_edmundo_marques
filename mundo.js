'use strict';
// Mundo: mascote acompanhante do site. Corre até cada seção, aponta o olhar para o
// conteúdo, comenta e acompanha o preenchimento do briefing. Puramente decorativo:
// sem JavaScript o site continua completo, e a pessoa pode esconder o mascote.
(function () {
  const SPRITE = 'assets/mundo-sprites.webp';
  const COLS = 8, ROWS = 11;
  // Linhas da folha de sprites (192 × 208 por quadro).
  const STATES = {
    idle: { row: 0, frames: 6, fps: 6, loop: true },
    runRight: { row: 1, frames: 8, fps: 12, loop: true },
    runLeft: { row: 2, frames: 8, fps: 12, loop: true },
    wave: { row: 3, frames: 4, fps: 6, loop: false, repeat: 2 },
    jump: { row: 4, frames: 5, fps: 10, loop: false },
    failed: { row: 5, frames: 8, fps: 9, loop: false },
    waiting: { row: 6, frames: 6, fps: 5, loop: true },
    working: { row: 7, frames: 6, fps: 8, loop: true },
    review: { row: 8, frames: 6, fps: 6, loop: true }
  };
  const SPEED = 340; // px por segundo correndo
  const STORAGE_KEY = 'mundo-escondido';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Paradas pelo site: a seção que ativa, o conteúdo que ele aponta e o que ele diz.
  // Falas no estilo AIDA: chama a atenção pela dor, mostra o benefício e convida à ação.
  const GUIDES = [
    { section: '#identidade', target: '#identidade', say: [
      'Sua marca parece menor do que o trabalho que você entrega?',
      'Uma identidade profissional faz o cliente confiar em você antes mesmo da primeira conversa.',
      'Clique em "Quero transformar minha marca" e vamos começar.'
    ] },
    { section: '#sites', target: '#sites', say: [
      'Seu Instagram não está levando os clientes até você?',
      'Um site organiza seus serviços e leva quem te segue direto para o seu WhatsApp.',
      'Clique em "Quero meu espaço digital". O link certo muda o jogo.'
    ] },
    { section: '#case-nutrimax', target: '.case-gallery', say: [
      'A Nutrimax se perdia no meio de tantas marcas parecidas.',
      'Com o redesign, virou uma marca forte, premium e fácil de reconhecer.',
      'Veja as pranchas. A próxima transformação pode ser a sua.'
    ] },
    { section: '.web-show', target: '#preview', say: [
      'Ter só o perfil é depender do algoritmo para ser encontrado.',
      'Esses sites reais apresentam o profissional e abrem caminho para a conversa.',
      'Troque as abas e imagine o seu negócio aqui.'
    ] },
    { section: '#processo', target: '.process-grid', say: [
      'Medo de investir e o resultado não ter a sua cara?',
      'Aqui tudo começa ouvindo você, e cada etapa é alinhada antes de seguir.',
      'Você acompanha o projeto do começo ao fim, sem surpresas.'
    ] },
    { section: '.about', target: '.about h2', say: [
      'Cansado de ser só mais um cliente numa fila de agência?',
      'Com o Edmundo, você fala direto com quem cria a sua marca.'
    ] },
    { section: '.faq', target: '.faq-list', say: [
      'Ainda com alguma dúvida? Normal antes de investir.',
      'Aqui estão as respostas mais pedidas. Se faltar alguma, é só perguntar.'
    ] },
    { section: '#contato', target: '#contato .button', mood: 'jump', say: [
      'Cada dia com uma marca fraca é um cliente indo para o concorrente.',
      'Conte sua ideia em poucos minutos e fale direto com o Edmundo no WhatsApp.',
      'Clique em "Começar meu projeto". Eu te acompanho!'
    ] }
  ];
  const CLICK_LINES = [
    'Oi! Eu sou o Mundo, o mascote do Edmundo.',
    'Pode explorar, eu vou junto.',
    'Uma marca forte começa com uma boa história.',
    'Psiu: o botão "Vamos conversar" lá em cima abre o briefing.'
  ];
  const FIELD_LINES = {
    service: 'Escolha o que você quer criar.',
    'client-name': 'Como posso te chamar?',
    business: 'Se ainda não tem nome, tudo bem.',
    idea: 'Capricha! Quanto mais detalhes, melhor.'
  };

  let root, sprite, bubble, callButton;
  let state = 'idle', frame = 0, playsLeft = 0, lastTick = 0, onDone = null, frozen = null;
  let x = 0, moving = false, arriveTimer = 0, talkTimer = 0, idleTimer = 0, lookTimer = 0;
  let activeGuide = null, guideTimer = 0, busyUntil = 0;
  const visible = new Map();
  const seen = new Set();
  let inDialog = false, dialogEl = null;

  function width() { return root.offsetWidth; }
  function home() { return window.innerWidth - width() - 16; }
  function clampX(value) { return Math.max(8, Math.min(window.innerWidth - width() - 8, value)); }

  function showFrame(row, col) {
    sprite.style.backgroundPosition = `${col * 100 / (COLS - 1)}% ${row * 100 / (ROWS - 1)}%`;
  }

  function play(name, done) {
    const def = STATES[name];
    state = name; frame = 0; frozen = null; onDone = done || null;
    playsLeft = def.repeat || 1;
    showFrame(def.row, 0);
    if (reducedMotion && !def.loop) { const cb = onDone; onDone = null; setTimeout(() => { if (cb) cb(); else play('idle'); }, 900); }
  }

  // Olhar em 16 direções: 0° para cima, 90° para a direita (sentido horário).
  function lookAt(px, py) {
    const r = sprite.getBoundingClientRect();
    const angle = (Math.atan2(px - (r.left + r.width / 2), -(py - (r.top + r.height * 0.3))) * 180 / Math.PI + 360) % 360;
    const index = Math.round(angle / 22.5) % 16;
    frozen = { row: 9 + Math.floor(index / 8), col: index % 8 };
    showFrame(frozen.row, frozen.col);
  }
  function lookAtElement(el) {
    if (!el) return;
    const r = el.getBoundingClientRect();
    lookAt(r.left + r.width / 2, r.top + Math.min(r.height / 2, 200));
  }

  function tick(now) {
    requestAnimationFrame(tick);
    if (frozen || reducedMotion || !root.classList.contains('is-ready')) return;
    const def = STATES[state];
    if (now - lastTick < 1000 / def.fps) return;
    lastTick = now;
    frame += 1;
    if (frame >= def.frames) {
      if (def.loop) frame = 0;
      else if (--playsLeft > 0) frame = 0;
      else { const cb = onDone; onDone = null; frame = def.frames - 1; if (cb) cb(); else play('idle'); return; }
    }
    showFrame(def.row, frame);
  }

  // Uma fala ou uma sequência de falas; uma nova fala interrompe a anterior.
  function say(text, ms) {
    clearTimeout(talkTimer);
    const lines = Array.isArray(text) ? text : [text];
    const next = index => {
      bubble.textContent = lines[index];
      // No formulário o balão abre para fora da janela, sem cobrir os campos.
      root.classList.toggle('bubble-right', !inDialog && x + width() / 2 < window.innerWidth / 2);
      root.classList.add('is-talking');
      const duration = ms || Math.max(3600, 1800 + lines[index].length * 45);
      talkTimer = setTimeout(() => {
        if (index + 1 < lines.length) next(index + 1);
        else root.classList.remove('is-talking');
      }, duration);
    };
    next(0);
  }

  function setX(value, duration) {
    x = value;
    root.style.transitionDuration = duration ? `${duration}ms` : '0ms';
    root.style.setProperty('--mundo-x', `${Math.round(value)}px`);
  }

  // Corre até a posição e chama `arrive` ao chegar.
  function runTo(target, arrive) {
    target = clampX(target);
    clearTimeout(arriveTimer);
    const distance = Math.abs(target - x);
    if (reducedMotion || distance < 12) { setX(target, 0); moving = false; if (arrive) arrive(); return; }
    const duration = Math.min(2200, distance / SPEED * 1000);
    moving = true;
    play(target > x ? 'runRight' : 'runLeft');
    setX(target, duration);
    arriveTimer = setTimeout(() => { moving = false; play('idle'); if (arrive) arrive(); }, duration);
  }

  function resetIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (moving || inDialog || state !== 'idle') return;
      play('waiting');
      say('Tô por aqui se precisar de mim.', 3800);
      setTimeout(() => { if (state === 'waiting') play('idle'); }, 4200);
    }, 30000);
  }

  // Escolhe onde parar: ao lado do conteúdo, sem sair da tela.
  function spotFor(el) {
    const r = el.getBoundingClientRect();
    const w = width();
    if (window.innerWidth < 700) return home();
    if (r.left - w - 12 >= 8) return r.left - w - 12;
    if (r.right + 12 + w <= window.innerWidth - 8) return r.right + 12;
    return r.left + 24;
  }

  function speechTime(lines) { return lines.reduce((total, line) => total + Math.max(3600, 1800 + line.length * 45), 0); }

  function guide(item) {
    const target = document.querySelector(item.target) || document.querySelector(item.section);
    if (!target) return;
    activeGuide = item;
    runTo(spotFor(target), () => {
      play(item.mood === 'jump' ? 'jump' : 'wave', () => { play('idle'); lookAtElement(target); clearTimeout(lookTimer); lookTimer = setTimeout(() => { frozen = null; }, 2600); });
      say(item.say);
      busyUntil = performance.now() + speechTime(item.say);
      clearTimeout(guideTimer);
      guideTimer = setTimeout(pickNext, speechTime(item.say) + 400);
    });
  }

  // Próxima parada: a seção ainda não comentada mais visível. Se a seção atual
  // continua na tela, ele termina de falar antes; se a pessoa rolou, ele vai junto.
  function pickNext() {
    clearTimeout(guideTimer);
    if (inDialog || root.hidden) return;
    let best = null, ratio = 0;
    GUIDES.forEach(item => { const v = visible.get(item.el) || 0; if (!seen.has(item) && v > ratio) { ratio = v; best = item; } });
    if (!best) return;
    const currentVisible = activeGuide && (visible.get(activeGuide.el) || 0) > 0;
    const wait = currentVisible ? Math.max(700, busyUntil - performance.now()) : 700;
    // Espera a rolagem assentar antes de correr até lá.
    guideTimer = setTimeout(() => {
      if (inDialog || root.hidden || seen.has(best) || !(visible.get(best.el) > 0)) return pickNext();
      seen.add(best); guide(best);
    }, wait);
  }

  function watchSections() {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => visible.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0));
      pickNext();
    }, { threshold: [0, 0.25, 0.5] });
    GUIDES.forEach(item => { item.el = document.querySelector(item.section); if (item.el) observer.observe(item.el); });
  }

  // Formulário de briefing: o Mundo entra na janela e reage a cada passo.
  function placeInDialog() {
    if (!inDialog) return;
    const r = dialogEl.getBoundingClientRect();
    const w = 118;
    const roomy = r.left >= w + 130;
    root.classList.toggle('in-corner', !roomy);
    if (roomy) {
      root.style.position = 'fixed';
      root.style.bottom = `${Math.max(10, window.innerHeight - r.bottom)}px`;
      setX(r.left - w - 10, 0);
    } else { root.style.position = ''; root.style.bottom = ''; }
  }
  function enterDialog(dialog) {
    inDialog = true; dialogEl = dialog;
    clearTimeout(arriveTimer); moving = false;
    dialog.appendChild(root);
    placeInDialog();
    play('wave');
    say('Ótimo passo! Em poucos minutos sua ideia vira conversa.', 4200);
  }
  function leaveDialog() {
    if (!inDialog) return;
    inDialog = false;
    root.classList.remove('in-corner', 'is-talking');
    root.style.position = ''; root.style.bottom = '';
    document.body.appendChild(root);
    setX(home(), 0);
    play('idle');
    pickNext();
  }
  function watchBrief() {
    const dialog = document.getElementById('brief-dialog');
    if (!dialog) return;
    new MutationObserver(() => { if (dialog.open && !inDialog && !root.hidden) enterDialog(dialog); }).observe(dialog, { attributes: true, attributeFilter: ['open'] });
    dialog.addEventListener('close', leaveDialog);
    window.addEventListener('resize', placeInDialog);
    const form = document.getElementById('brief-form');
    let typingTimer = 0;
    if (form) {
      form.addEventListener('focusin', e => {
        const line = FIELD_LINES[e.target.id];
        if (!line || !inDialog || state === 'failed') return;
        play('idle'); lookAtElement(e.target); say(line, 3600);
      });
      form.addEventListener('input', () => {
        if (!inDialog || state === 'failed') return;
        if (state !== 'working') play('working');
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => { if (state === 'working') play('review'); setTimeout(() => { if (state === 'review') play('idle'); }, 2400); }, 900);
      });
      form.addEventListener('invalid', () => { if (inDialog && state !== 'failed') { play('failed'); say('Opa, faltou preencher um campo.', 3200); } }, true);
    }
    const result = document.getElementById('brief-result');
    if (result) new MutationObserver(() => {
      if (!result.hidden && inDialog) { play('jump', () => play('wave')); say('Mensagem pronta! Agora é só enviar no WhatsApp.', 5200); }
    }).observe(result, { attributes: true, attributeFilter: ['hidden'] });
  }

  function hide() {
    root.hidden = true; callButton.hidden = false;
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) { /* armazenamento indisponível */ }
  }
  function show() {
    root.hidden = false; callButton.hidden = true;
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* armazenamento indisponível */ }
    setX(window.innerWidth + 20, 0);
    requestAnimationFrame(() => runTo(home(), () => { play('wave'); say('Voltei! Pode contar comigo.'); }));
  }

  function build() {
    root = document.createElement('div');
    root.className = 'mundo';
    root.setAttribute('role', 'complementary');
    root.setAttribute('aria-label', 'Mundo, mascote do site');
    root.innerHTML = '<p class="mundo-bubble" aria-hidden="true"></p><button type="button" class="mundo-sprite" aria-label="Brincar com o Mundo"></button><button type="button" class="mundo-hide" aria-label="Esconder o Mundo">×</button>';
    sprite = root.querySelector('.mundo-sprite');
    bubble = root.querySelector('.mundo-bubble');
    callButton = document.createElement('button');
    callButton.type = 'button';
    callButton.className = 'mundo-call';
    callButton.hidden = true;
    callButton.innerHTML = '<span aria-hidden="true"></span>Chamar o Mundo';
    document.body.append(root, callButton);

    let line = 0;
    sprite.addEventListener('click', () => {
      if (moving) return;
      play('jump');
      say(inDialog ? 'Tô torcendo pelo seu projeto!' : CLICK_LINES[line++ % CLICK_LINES.length], 3800);
      resetIdle();
    });
    sprite.addEventListener('mouseenter', () => { if (!moving && state === 'idle' && !inDialog) play('wave'); });
    root.querySelector('.mundo-hide').addEventListener('click', hide);
    callButton.addEventListener('click', show);

    // Segue o cursor com o olhar quando está parado.
    if (finePointer) {
      let pending = false;
      document.addEventListener('mousemove', e => {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
          pending = false;
          resetIdle();
          if (moving || root.hidden || (state !== 'idle' && !frozen) || e.target.closest('.mundo')) return;
          lookAt(e.clientX, e.clientY);
          clearTimeout(lookTimer);
          lookTimer = setTimeout(() => { frozen = null; }, 1600);
        });
      }, { passive: true });
    }
    window.addEventListener('scroll', resetIdle, { passive: true });
    window.addEventListener('resize', () => { if (!inDialog && !moving) setX(clampX(x), 0); });
  }

  function start() {
    let hidden = false;
    try { hidden = localStorage.getItem(STORAGE_KEY) === '1'; } catch (e) { /* armazenamento indisponível */ }
    build();
    requestAnimationFrame(tick);
    const img = new Image();
    img.onload = () => {
      root.classList.add('is-ready');
      play('idle');
      watchSections();
      watchBrief();
      resetIdle();
      if (hidden) { root.hidden = true; callButton.hidden = false; return; }
      setX(window.innerWidth + 20, 0);
      requestAnimationFrame(() => requestAnimationFrame(() => runTo(home(), () => {
        play('wave');
        say(['Oi! Eu sou o Mundo. Vou te acompanhar por aqui.', 'Sua marca merece ser lembrada, não só vista. Vem comigo!']);
      })));
    };
    img.src = SPRITE;
  }

  if (document.documentElement.classList.contains('intro-active')) {
    document.addEventListener('brandintroend', start, { once: true });
  } else { start(); }
})();
