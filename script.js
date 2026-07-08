/* ==========================================================================
   MILITARISMO & INFANTARIA NO BRASIL — LÓGICA DE INTERAÇÃO
   Vanilla JS — modular, sem dependências externas.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initTabs();
  initMap();
  initTimelineScanner();
  initChallengeGlitch();
  initLiveConsole();
  initFooterSync();
});

/* -------------------------------------------------------------------------
   RELÓGIO DO CABEÇALHO
------------------------------------------------------------------------- */
function initClock() {
  const clockEl = document.getElementById('headerClock');
  if (!clockEl) return;

  function tick() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hh}:${mm}:${ss}`;
  }
  tick();
  setInterval(tick, 1000);
}

function initFooterSync() {
  const yearEl = document.getElementById('footerYear');
  const syncEl = document.getElementById('footerSync');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (syncEl) {
    const update = () => {
      const now = new Date();
      syncEl.textContent = now.toTimeString().slice(0, 8);
    };
    update();
    setInterval(update, 1000);
  }
}

/* -------------------------------------------------------------------------
   NAVEGAÇÃO POR ABAS — com scanline vertical + flicker
   Protegido contra cliques rápidos/repetidos (debounce por estado de transição).
------------------------------------------------------------------------- */
function initTabs() {
  const tabsContainer = document.getElementById('tabsForcas');
  if (!tabsContainer) return;

  const buttons = Array.from(tabsContainer.querySelectorAll('.tab-btn'));
  const panels = Array.from(tabsContainer.querySelectorAll('.tab-panel'));
  const scanEl = document.getElementById('scanTransition');

  let isTransitioning = false;
  let pendingTarget = null;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      // já ativa: ignora
      if (btn.classList.contains('is-active')) return;

      // clique rápido durante transição: guarda o último alvo solicitado
      if (isTransitioning) {
        pendingTarget = target;
        return;
      }

      switchTab(target);
    });

    // navegação por teclado (setas) para acessibilidade
    btn.addEventListener('keydown', (e) => {
      const idx = buttons.indexOf(btn);
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        buttons[(idx + 1) % buttons.length].focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        buttons[(idx - 1 + buttons.length) % buttons.length].focus();
      }
    });
  });

  function switchTab(target) {
    isTransitioning = true;

    // dispara scanline
    if (scanEl) {
      scanEl.classList.remove('is-active');
      // force reflow para permitir reiniciar a animação
      void scanEl.offsetWidth;
      scanEl.classList.add('is-active');
    }

    // troca de conteúdo no ponto médio do scan, para simular "revelação" atrás do feixe
    window.setTimeout(() => {
      buttons.forEach((b) => {
        const active = b.getAttribute('data-tab') === target;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', String(active));
      });
      panels.forEach((p) => {
        p.classList.toggle('is-active', p.getAttribute('data-tab-panel') === target);
      });
    }, 260);

    window.setTimeout(() => {
      isTransitioning = false;
      if (pendingTarget && pendingTarget !== target) {
        const next = pendingTarget;
        pendingTarget = null;
        switchTab(next);
      } else {
        pendingTarget = null;
      }
    }, 620);
  }
}

/* -------------------------------------------------------------------------
   MAPA DE COMANDOS INTERATIVO — revelação holográfica no painel lateral
------------------------------------------------------------------------- */
function initMap() {
  const points = document.querySelectorAll('.cmd-point');
  const panel = document.getElementById('mapPanel');
  const panelStatus = document.getElementById('mapPanelStatus');
  const panelBody = document.getElementById('mapPanelBody');
  if (!points.length || !panel) return;

  const COMMANDS = {
    cmn: {
      nome: 'Comando Militar do Norte',
      sigla: 'CMN',
      sede: 'Belém (PA)',
      abrangencia: 'Defesa da Amazônia Oriental'
    },
    cma: {
      nome: 'Comando Militar da Amazônia',
      sigla: 'CMA',
      sede: 'Manaus (AM)',
      abrangencia: 'Presença na faixa de fronteira amazônica'
    },
    cmne: {
      nome: 'Comando Militar do Nordeste',
      sigla: 'CMNE',
      sede: 'Recife (PE)',
      abrangencia: 'Segurança regional e apoio a GLO'
    },
    cmp: {
      nome: 'Comando Militar do Planalto',
      sigla: 'CMP',
      sede: 'Brasília (DF)',
      abrangencia: 'Proteção da capital e entorno'
    },
    cml: {
      nome: 'Comando Militar do Leste',
      sigla: 'CML',
      sede: 'Rio de Janeiro (RJ)',
      abrangencia: 'Centro de poder e Forças de Emprego Estratégico'
    },
    cmse: {
      nome: 'Comando Militar do Sudeste',
      sigla: 'CMSE',
      sede: 'São Paulo (SP)',
      abrangencia: 'Maior efetivo e estrutura industrial'
    },
    cms: {
      nome: 'Comando Militar do Sul',
      sigla: 'CMS',
      sede: 'Porto Alegre (RS)',
      abrangencia: 'Defesa da fronteira sul e tradição blindada'
    },
    cmo: {
      nome: 'Comando Militar do Oeste',
      sigla: 'CMO',
      sede: 'Campo Grande (MS)',
      abrangencia: 'Pantanal e defesa da fronteira oeste'
    }
  };

  function revealCommand(key) {
    const data = COMMANDS[key];
    if (!data) return;

    points.forEach((p) => p.classList.toggle('is-active', p.getAttribute('data-cmd') === key));

    panel.classList.add('is-revealed');
    panelStatus.textContent = `DECODIFICADO :: ${data.sigla}`;

    panelBody.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'panel-reveal';
    wrap.innerHTML = `
      <h3 class="panel-cmd-name">${data.nome}</h3>
      <span class="panel-cmd-sigla">${data.sigla}</span>
      <div class="panel-cmd-row">
        <span class="panel-cmd-row-label">SEDE</span>
        <span class="panel-cmd-row-value">${data.sede}</span>
      </div>
      <div class="panel-cmd-row">
        <span class="panel-cmd-row-label">ABRANGÊNCIA</span>
        <span class="panel-cmd-row-value">${data.abrangencia}</span>
      </div>
    `;
    panelBody.appendChild(wrap);
  }

  points.forEach((point) => {
    const key = point.getAttribute('data-cmd');
    point.addEventListener('mouseenter', () => revealCommand(key));
    point.addEventListener('focus', () => revealCommand(key));
    point.addEventListener('click', () => revealCommand(key));
  });
}

/* -------------------------------------------------------------------------
   LINHA DO TEMPO "SCANNER" — feixe central acompanha o scroll,
   itens revelam-se da esquerda/direita conforme entram na área visível.
------------------------------------------------------------------------- */
function initTimelineScanner() {
  const timeline = document.getElementById('timeline');
  const scanner = document.getElementById('timelineScanner');
  const items = document.querySelectorAll('.timeline-item');
  if (!timeline || !scanner || !items.length) return;

  let ticking = false;

  function updateScanner() {
    const rect = timeline.getBoundingClientRect();
    const viewportCenter = window.innerHeight * 0.55;
    // posição do feixe relativa ao topo da timeline, limitada aos limites da seção
    let scanY = viewportCenter - rect.top;
    scanY = Math.max(0, Math.min(scanY, rect.height));
    scanner.style.top = `${scanY}px`;

    items.forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.top + itemRect.height / 2;
      if (itemCenter < viewportCenter + 40) {
        item.classList.add('is-visible');
      }
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateScanner);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
}

/* -------------------------------------------------------------------------
   MONITOR DE DESAFIOS — glitch periódico (a cada ~5s), escalonado por card
------------------------------------------------------------------------- */
function initChallengeGlitch() {
  const cards = document.querySelectorAll('.challenge-card[data-glitch]');
  if (!cards.length) return;

  cards.forEach((card, index) => {
    const stagger = index * 900;
    window.setTimeout(() => {
      triggerGlitch(card);
      setInterval(() => triggerGlitch(card), 5000);
    }, stagger);
  });

  function triggerGlitch(card) {
    card.classList.remove('is-glitching');
    void card.offsetWidth; // reinicia animação
    card.classList.add('is-glitching');
    window.setTimeout(() => card.classList.remove('is-glitching'), 400);
  }
}

/* -------------------------------------------------------------------------
   CONSOLE DE STATUS AO VIVO — transmissão simulada com efeito de digitação
------------------------------------------------------------------------- */
function initLiveConsole() {
  const body = document.getElementById('consoleBody');
  const toggleBtn = document.getElementById('consoleToggle');
  const consoleEl = document.getElementById('liveConsole');
  if (!body) return;

  const MESSAGES = [
    '> SISCOMIS: Link Verde...',
    '> Bda Inf Pqdt: Prontidão 48h...',
    '> Conexão com CIGS: Estável...',
    '> CAvEx: Rota tática confirmada...',
    '> C Op Esp: Canal seguro estabelecido...',
    '> COTER: Sincronizando comandos de área...',
    '> PPIF: Monitoramento de fronteira ativo...',
    '> Setor Amazônico: Telemetria recebida...',
    '> Status geral: Operacional.'
  ];

  const MAX_LINES = 5;
  let msgIndex = 0;

  function typeLine(text, onDone) {
    const lineEl = document.createElement('div');
    lineEl.className = 'console-line';
    const cursor = document.createElement('span');
    cursor.className = 'console-cursor';
    body.appendChild(lineEl);

    let charIndex = 0;
    function typeChar() {
      if (charIndex <= text.length) {
        lineEl.textContent = text.slice(0, charIndex);
        lineEl.appendChild(cursor);
        charIndex++;
        window.setTimeout(typeChar, 28);
      } else {
        cursor.remove();
        trimLines();
        if (onDone) window.setTimeout(onDone, 900);
      }
    }
    typeChar();
  }

  function trimLines() {
    while (body.children.length > MAX_LINES) {
      body.removeChild(body.firstChild);
    }
  }

  function loop() {
    const text = MESSAGES[msgIndex % MESSAGES.length];
    msgIndex++;
    typeLine(text, loop);
  }

  loop();

  if (toggleBtn && consoleEl) {
    toggleBtn.addEventListener('click', () => {
      const minimized = consoleEl.classList.toggle('is-minimized');
      toggleBtn.textContent = minimized ? '▢' : '_';
      toggleBtn.setAttribute('aria-label', minimized ? 'Expandir console' : 'Minimizar console');
    });
  }
}
