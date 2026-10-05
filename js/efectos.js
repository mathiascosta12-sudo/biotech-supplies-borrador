/* Biotech Supplies · efectos (versión B).
   Aparecer al hacer scroll, flechas que aparecen, encabezado, menú,
   portada y la taza mágica. Solo transform y opacity. */
(function () {
  'use strict';
  const BS = window.BS;
  const { $, $$ } = BS;

  /* ---------- Flechas y círculo (SVG en línea para poder dibujarlos) ---------- */
  const FLECHAS = {
    curva: ['0 0 160 120', 'M14 108 C10 60 52 20 140 14', 'M125.4 7.5 L140 14 L128.7 23.4'],
    corta: ['0 0 160 110', 'M10 72 C48 86 92 70 142 36', 'M126.1 37.7 L142 36 L137 49.9'],
    lazo: ['0 0 160 120', 'M12 100 C44 100 72 92 80 64 C88 32 52 28 52 50 C52 70 86 72 110 50 C126 36 138 28 148 14', 'M133.7 21.1 L148 14 L148.1 28.7'],
    s: ['0 0 120 120', 'M24 10 C14 52 86 44 98 100', 'M102.4 84.6 L98 100 L87 90.2'],
    giro: ['0 0 170 120', 'M122 12 C160 40 134 104 84 102 C52 100 32 86 24 68', 'M22.9 84 L24 68 L36.7 75.4'],
    abajo: ['0 0 150 120', 'M26 10 C84 6 132 30 124 100', 'M133.1 86.8 L124 100 L116.8 87.2'],
  };
  const CIRCULO = 'M126 9 C56 5 9 28 13 55 C17 84 88 95 152 91 C214 87 238 62 227 37 C219 17 170 5 96 11 C70 13 52 18 40 24';
  function armarFlechas(raiz) {
    $$('[data-flecha]', raiz).forEach((el) => {
      const f = FLECHAS[el.dataset.flecha]; if (!f) return;
      el.classList.add('flecha');
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML = '<svg viewBox="' + f[0] + '" focusable="false"><path class="cuerpo" pathLength="1" d="' + f[1] + '"/><path class="punta" pathLength="1" d="' + f[2] + '"/></svg>';
      el.removeAttribute('data-flecha');
      if (io) io.observe(el);
    });
    $$('[data-circulo]', raiz).forEach((el) => {
      el.classList.add('circulo');
      el.innerHTML = '<svg viewBox="0 0 240 100" preserveAspectRatio="none" focusable="false"><path pathLength="1" d="' + CIRCULO + '"/></svg>';
      el.removeAttribute('data-circulo');
      if (io) io.observe(el);
    });
  }

  /* ---------- Aparición al hacer scroll (una sola vez por elemento) ---------- */
  let io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((entradas) => {
      const visibles = entradas.filter((e) => e.isIntersecting);
      let k = 0;
      visibles.forEach((e) => {
        if (e.target.matches('.tarjeta, .cient')) e.target.style.setProperty('--i', Math.min(k++, 8));
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  }
  BS.observar = function (raiz) {
    const lista = $$('.reveal, .marcador, .flecha, .circulo', raiz || document);
    lista.forEach((el) => { if (io) io.observe(el); else el.classList.add('is-in'); });
  };
  BS.armarFlechas = armarFlechas;

  /* ---------- Encabezado: línea al scrollear + sección actual ---------- */
  const header = $('#header');
  let ticking = false;
  function alScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(alScroll); } }, { passive: true });
  alScroll();

  const links = $$('.nav a[data-sec]');
  if (links.length && 'IntersectionObserver' in window) {
    const ids = links.map((a) => a.dataset.sec);
    const visibles = new Set();
    const ioNav = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) visibles.add(e.target.id); else visibles.delete(e.target.id); });
      const actual = ids.find((id) => visibles.has(id));
      links.forEach((a) => { if (a.dataset.sec === actual) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ids.forEach((id) => { const s = document.getElementById(id); if (s) ioNav.observe(s); });
  }

  /* ---------- Menú del celular ---------- */
  const menu = $('#menu'), btnMenu = $('#btn-menu');
  function menuAbierto() { return BS.capas.estaAbierta(menu); }
  function abrirMenu() {
    if (menuAbierto()) return;
    btnMenu.setAttribute('aria-expanded', 'true');
    btnMenu.setAttribute('aria-label', 'Cerrar menú');
    btnMenu.innerHTML = BS.ico('ui-cerrar');
    BS.capas.abrir({ el: menu, cerrar: cerrarMenu, permitir: [header], foco: $('a', menu), volverA: btnMenu });
  }
  function cerrarMenu(sinFoco) {
    if (!menuAbierto()) return;
    btnMenu.setAttribute('aria-expanded', 'false');
    btnMenu.setAttribute('aria-label', 'Menú');
    btnMenu.innerHTML = BS.ico('ui-menu');
    BS.capas.cerrar(menu, { sinFoco: sinFoco === true });
  }
  BS.cerrarMenu = cerrarMenu;
  btnMenu.addEventListener('click', () => (menuAbierto() ? cerrarMenu() : abrirMenu()));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => cerrarMenu(true)));
  window.matchMedia('(min-width: 1100px)').addEventListener('change', (m) => { if (m.matches) cerrarMenu(true); });

  /* ---------- Cinta en movimiento: botón para pausarla y reanudarla ---------- */
  const cinta = $('.marquesina'), cintaBtn = $('#marquesina-pausa');
  if (cinta && cintaBtn) cintaBtn.addEventListener('click', () => {
    const pausada = cinta.classList.toggle('pausada');
    cintaBtn.setAttribute('aria-label', pausada ? 'Reanudar el movimiento de la cinta' : 'Pausar el movimiento de la cinta');
  });

  /* ---------- Volver arriba ---------- */
  const arriba = $('#volver-arriba');
  if (arriba) arriba.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: BS.reducido() ? 'auto' : 'smooth' }); const m = $('#header .header__marca'); if (m) m.focus({ preventScroll: true }); });

  /* ---------- Copiar @usuario ---------- */
  const cu = $('#copiar-usuario');
  if (cu) cu.addEventListener('click', async () => {
    const ok = await BS.copiar('@' + BS.USUARIO);
    const svg = cu.querySelector('svg use'), txt = cu.querySelector('span');
    if (ok) {
      svg.setAttribute('href', 'assets/iconos/sprite.svg#i-ui-check'); txt.textContent = 'Copiado';
      setTimeout(() => { svg.setAttribute('href', 'assets/iconos/sprite.svg#i-ui-copiar'); txt.textContent = 'Copiar'; }, 1600);
      BS.aviso({ tipo: 'chico', titulo: 'Usuario copiado ✓', duracion: 2400 });
    } else {
      BS.aviso({ tipo: 'error', titulo: 'No pudimos copiarlo solos', texto: 'Copiá el usuario de acá abajo.', mensaje: '@' + BS.USUARIO });
    }
  });

  /* ---------- Portada: el collage se mueve un poquito con el mouse ---------- */
  const collage = $('#collage');
  if (collage && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !BS.reducido()) {
    let raf = 0, tx = 0, ty = 0;
    const portada = $('#inicio');
    portada.addEventListener('pointermove', (e) => {
      const r = portada.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        collage.style.setProperty('--px', (tx * 10).toFixed(1));
        collage.style.setProperty('--py', (ty * 8).toFixed(1));
      });
    }, { passive: true });
    portada.addEventListener('pointerleave', () => { collage.style.setProperty('--px', 0); collage.style.setProperty('--py', 0); });
  }

  /* ---------- Taza mágica ---------- */
  function iniciarTaza() {
    const sec = $('#tazas-magicas'), pista = $('#tazas-pista'), esc = $('#escenario'), taza = $('#taza'), btn = $('#leche-btn');
    if (!sec || !esc || !taza || !btn) return;
    let leche = 1;           // 0 = café negro, 1 = taza llena de leche
    let modoScroll = false;
    let enPantalla = false;
    let cargada = false;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    function aplicar(valor, desdeBoton) {
      leche = valor;
      esc.style.setProperty('--leche', valor.toFixed(3));
      esc.style.setProperty('--chorro', valor > 0.02 && valor < 0.98 ? 1 : 0);
      const conLeche = modoScroll && !desdeBoton ? valor > 0.85 : valor > 0.5;
      esc.classList.toggle('es-leche', conLeche);
      btn.setAttribute('aria-pressed', conLeche ? 'true' : 'false');
    }
    function alturaHeader() { return header.offsetHeight; }
    function progreso() {
      const r = pista.getBoundingClientRect();
      const stage = esc.offsetHeight;
      const total = r.height - stage;
      const p = Math.min(1, Math.max(0, (alturaHeader() - r.top) / total));
      return p * p * (3 - 2 * p);   // smoothstep: arranca y frena suave
    }
    let tickT = false;
    function alScrollTaza() {
      if (!modoScroll || tickT || !enPantalla) return;
      tickT = true;
      requestAnimationFrame(() => { tickT = false; aplicar(progreso()); });
    }
    function activarModo() {
      modoScroll = !mq.matches;
      sec.classList.toggle('tazas--sticky', modoScroll);
      if (modoScroll) { aplicar(progreso()); } else { aplicar(leche > 0.5 ? 1 : 0, true); }
    }
    window.addEventListener('scroll', alScrollTaza, { passive: true });
    window.addEventListener('resize', alScrollTaza, { passive: true });
    mq.addEventListener('change', activarModo);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => {
        enPantalla = es[0].isIntersecting;
        const leG = $('#tm-leche');
        if (leG) leG.style.willChange = enPantalla ? 'transform' : '';
        if (enPantalla) alScrollTaza();
      }, { rootMargin: '10% 0px 10% 0px' }).observe(pista);
    } else { enPantalla = true; }

    btn.addEventListener('click', () => {
      if (modoScroll) {
        // en el modo scroll, el botón recorre el tramo: hasta el final (leche) o de vuelta al principio
        const r = pista.getBoundingClientRect();
        const y0 = r.top + window.scrollY - alturaHeader();
        const y1 = y0 + (pista.offsetHeight - esc.offsetHeight);
        const yaLleno = leche > 0.5;
        window.scrollTo({ top: yaLleno ? y0 - 2 : y1 + 2, behavior: 'smooth' });
      } else {
        aplicar(leche > 0.5 ? 0 : 1, true);
      }
    });

    fetch('assets/dibujos/taza-magica.svg').then((r) => r.text()).then((t) => {
      taza.innerHTML = t; cargada = true;
      activarModo();
    }).catch(() => {
      taza.innerHTML = '<img src="assets/dibujos/taza-magica.svg" alt="Taza de vidrio con dibujos científicos que aparecen al agregar leche al café">';
      activarModo();
    });
    activarModo();
  }
  iniciarTaza();

  /* ---------- Arranque ---------- */
  armarFlechas(document);
  BS.observar(document);
  window.__bsListo = true;
})();
