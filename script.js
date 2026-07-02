document.addEventListener('DOMContentLoaded', () => {
  initMap();
  initTabs();
  initTimeline();
  initGlitch();
  initConsole();
});

/* ========== MAPA INTERATIVO ========== */
function initMap() {
  const regions = document.querySelectorAll('.map-region, .map-dot');
  const tooltip = document.getElementById('map-tooltip');
  const tooltipContent = document.getElementById('tooltip-content');
  const listItems = document.querySelectorAll('.list-item');

  const dataBase = {
    CMN: { nome: 'Comando Militar do Norte', sigla: 'CMN', sede: 'Belém (PA)', abrang: 'Defesa da Amazônia Oriental' },
    CMA: { nome: 'Comando Militar da Amazônia', sigla: 'CMA', sede: 'Manaus (AM)', abrang: 'Faixa de fronteira amazônica' },
    CMNE: { nome: 'Comando Militar do Nordeste', sigla: 'CMNE', sede: 'Recife (PE)', abrang: 'Segurança regional e apoio a GLO' },
    CMP: { nome: 'Comando Militar do Planalto', sigla: 'CMP', sede: 'Brasília (DF)', abrang: 'Proteção da capital e entorno' },
    CML: { nome: 'Comando Militar do Leste', sigla: 'CML', sede: 'Rio de Janeiro (RJ)', abrang: 'Centro de poder e F Emp Estrtg' },
    CMSE: { nome: 'Comando Militar do Sudeste', sigla: 'CMSE', sede: 'São Paulo (SP)', abrang: 'Maior efetivo e estrutura industrial' },
    CMS: { nome: 'Comando Militar do Sul', sigla: 'CMS', sede: 'Porto Alegre (RS)', abrang: 'Fronteira sul e tradição blindada' },
    CMO: { nome: 'Comando Militar do Oeste', sigla: 'CMO', sede: 'Campo Grande (MS)', abrang: 'Pantanal e defesa da fronteira oeste' }
  };

  function showTooltip(comando, e) {
    const data = dataBase[comando];
    if (!data) return;
    tooltipContent.innerHTML = `<p><strong>${data.sigla}</strong> · ${data.nome}</p><p>Sede: ${data.sede}</p><p>${data.abrang}</p>`;
    tooltip.classList.add('active');
    positionTooltip(e);
  }

  function positionTooltip(e) {
    let x = e.clientX + 20;
    let y = e.clientY - 60;
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
  }

  function hideTooltip() {
    tooltip.classList.remove('active');
  }

  regions.forEach(el => {
    el.addEventListener('mouseenter', (e) => {
      const comando = el.getAttribute('data-comando');
      showTooltip(comando, e);
    });
    el.addEventListener('mousemove', (e) => positionTooltip(e));
    el.addEventListener('mouseleave', hideTooltip);
  });

  listItems.forEach(item => {
    item.addEventListener('mouseenter', (e) => {
      const comando = item.getAttribute('data-comando');
      showTooltip(comando, e);
    });
    item.addEventListener('mousemove', (e) => positionTooltip(e));
    item.addEventListener('mouseleave', hideTooltip);
  });
}

/* ========== ABAS COM TRANSIÇÃO ========== */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  const indicator = document.getElementById('tab-indicator');
  let activeTab = document.querySelector('.tab-btn.active');

  function updateIndicator(btn) {
    indicator.style.left = btn.offsetLeft + 'px';
    indicator.style.width = btn.offsetWidth + 'px';
  }

  if (activeTab) updateIndicator(activeTab);

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateIndicator(btn);
      const target = btn.getAttribute('data-tab');
      panels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === target) panel.classList.add('active');
      });
    });
  });

  window.addEventListener('resize', () => {
    const currentActive = document.querySelector('.tab-btn.active');
    if (currentActive) updateIndicator(currentActive);
  });
}

/* ========== LINHA DO TEMPO SCANNER ========== */
function initTimeline() {
  const items = document.querySelectorAll('.timeline-item[data-animate]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.25 });

  items.forEach(item => observer.observe(item));
}

/* ========== GLITCH AUTOMÁTICO ========== */
function initGlitch() {
  const cards = document.querySelectorAll('.glitch-card[data-glitch]');
  setInterval(() => {
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    randomCard.classList.add('glitch-active');
    setTimeout(() => randomCard.classList.remove('glitch-active'), 300);
  }, 5000);
}

/* ========== CONSOLE AO VIVO ========== */
function initConsole() {
  const body = document.getElementById('console-body');
  const messages = [
    '> SISCOMIS: Link Verde...',
    '> Bda Inf Pqdt: Prontidão 48h',
    '> Conexão com CIGS: Estável',
    '> CAvEx: Aeronaves prontas',
    '> C Op Esp: Canal seguro ativo',
    '> PPIF: Varredura na fronteira',
    '> COTER: Todas as F.E. em status operacional'
  ];
  let index = 0;
  let charIndex = 0;
  let currentMsg = '';

  function type() {
    if (charIndex < messages[index].length) {
      currentMsg += messages[index].charAt(charIndex);
      body.textContent = currentMsg;
      charIndex++;
      setTimeout(type, 40);
    } else {
      setTimeout(erase, 1800);
    }
  }

  function erase() {
    if (currentMsg.length > 0) {
      currentMsg = currentMsg.slice(0, -1);
      body.textContent = currentMsg;
      setTimeout(erase, 15);
    } else {
      index = (index + 1) % messages.length;
      charIndex = 0;
      setTimeout(type, 200);
    }
  }

  type();
}
