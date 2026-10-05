/* Biotech Supplies · utilidades compartidas (versión B).
   Todo cuelga de window.BS. Sin librerías. */
(function () {
  'use strict';
  const BS = (window.BS = window.BS || {});

  /* Valores de reserva: al cargar productos.json, aplicarMarca() los reemplaza con los de «marca». */
  BS.IG = 'https://ig.me/m/biotech_supplies';
  BS.PERFIL = 'https://www.instagram.com/biotech_supplies/';
  BS.USUARIO = 'biotech_supplies';
  BS.NOMBRE = 'Biotech Supplies';
  BS.$ = (s, r) => (r || document).querySelector(s);
  BS.$$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  BS.reducido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  BS.tactil = () => window.matchMedia('(pointer: coarse)').matches;
  BS.norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  BS.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  BS.ico = (nombre, cls) => '<svg class="ico' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="assets/iconos/sprite.svg#i-' + nombre + '"/></svg>';
  BS.espera = (ms) => new Promise((r) => setTimeout(r, ms));
  /* decodeURIComponent que no revienta con un «%» suelto (por ejemplo un enlace terminado en #%) */
  BS.decodificar = function (s) { try { return decodeURIComponent(s); } catch (e) { return String(s); } };

  /* Datos de la marca (productos.json → marca): destino del chat, perfil y usuario de Instagram, nombre. */
  BS.aplicarMarca = function (m) {
    if (!m || typeof m !== 'object') return;
    const txt = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null);
    const url = (v) => { const t = txt(v); return t && /^https:\/\//i.test(t) ? t : null; };
    BS.IG = url(m.mensaje_url) || BS.IG;
    BS.PERFIL = url(m.instagram_url) || BS.PERFIL;
    BS.USUARIO = txt(m.instagram) || BS.USUARIO;
    BS.NOMBRE = txt(m.nombre) || BS.NOMBRE;
    BS.$$('a[data-consulta]').forEach((a) => { a.href = BS.IG; });
    BS.$$('a[data-ig-perfil]').forEach((a) => { a.href = BS.PERFIL; });
    BS.$$('[data-ig-usuario]').forEach((el) => { el.textContent = '@' + BS.USUARIO; });
    const cu = BS.$('#copiar-usuario'); if (cu) cu.setAttribute('aria-label', 'Copiar @' + BS.USUARIO);
  };

  /* localStorage siempre dentro de try/catch: si no se puede, la web anda igual. */
  BS.guardar = function (clave, valor) {
    try { window.localStorage.setItem(clave, JSON.stringify(valor)); return true; } catch (e) { return false; }
  };
  BS.leer = function (clave) {
    try { const v = window.localStorage.getItem(clave); return v == null ? null : JSON.parse(v); } catch (e) { return null; }
  };

  /* Precio: hoy todos son null. Si un día hay número, formato en pesos uruguayos. */
  BS.precioHTML = function (p) {
    if (typeof p.precio === 'number') {
      return '<span class="precio precio--num">$ ' + p.precio.toLocaleString('es-UY') + '</span>';
    }
    return '<span class="precio">' + BS.ico('ui-mensaje') + 'Consultá el precio</span>';
  };

  /* Copiar al portapapeles (con plan B). Devuelve una promesa de true/false. */
  BS.copiar = async function (texto) {
    try {
      if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(texto); return true; }
    } catch (e) { /* sigue con el plan B */ }
    try {
      const ta = document.createElement('textarea');
      ta.value = texto; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;font-size:16px';
      document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, texto.length);
      const ok = document.execCommand('copy');
      ta.remove();
      return !!ok;
    } catch (e) { return false; }
  };

  /* ------------------------------------------------------------------
     Avisos (toast). Uno a la vez. Se pausan con el mouse o el foco.
     ------------------------------------------------------------------ */
  let avisoActual = null;
  BS.avisoCerrar = function (inmediato) {
    const a = avisoActual; if (!a) return;
    avisoActual = null; clearTimeout(a.t);
    if (inmediato || BS.reducido()) { a.el.remove(); return; }
    a.el.classList.add('sale');
    setTimeout(() => a.el.remove(), 230);
  };
  /* opciones: tipo ('ok' | 'chico' | 'error'), titulo, texto, enlace {texto, href}, duracion, mensaje (error), accionAbrir */
  BS.aviso = function (o) {
    const cont = BS.$('#avisos'); if (!cont) return;
    BS.avisoCerrar(true);
    const previo = document.activeElement;
    const el = document.createElement('div');
    el.className = 'aviso' + (o.tipo === 'chico' ? ' aviso--chico' : '') + (o.tipo === 'error' ? ' aviso--error' : '');
    const icono = o.tipo === 'error' ? '!' : BS.ico('ui-check');
    let cuerpo = '<strong>' + BS.esc(o.titulo) + '</strong>';
    if (o.texto) cuerpo += '<span>' + BS.esc(o.texto) + '</span>';
    if (o.enlace) cuerpo += '<span>' + BS.esc(o.enlace.pre || '') + ' <a href="' + BS.esc(o.enlace.href) + '" target="_blank" rel="noopener">' + BS.esc(o.enlace.texto) + '<span class="sr-only"> (se abre en otra pestaña)</span></a></span>';
    if (o.accion) cuerpo += '<button type="button" class="aviso__accion" data-accion>' + BS.esc(o.accion.texto) + '</button>';
    if (o.tipo === 'error') {
      cuerpo += '<textarea readonly rows="3" aria-label="Mensaje para copiar">' + BS.esc(o.mensaje || '') + '</textarea>' +
        '<div class="aviso__acciones"><button type="button" class="btn btn--chico" data-sel>Seleccionar el mensaje</button>' +
        '<a class="btn btn--chico btn--amarillo" href="' + BS.IG + '" target="_blank" rel="noopener">Abrir Instagram</a></div>';
    }
    el.innerHTML = '<span class="aviso__ico" aria-hidden="true">' + icono + '</span><div class="aviso__txt">' + cuerpo + '</div>' +
      '<button type="button" class="aviso__cerrar" aria-label="Cerrar aviso">' + BS.ico('ui-cerrar') + '</button>';
    cont.appendChild(el);
    const estado = { el, t: 0 };
    avisoActual = estado;
    el.querySelector('.aviso__cerrar').addEventListener('click', () => {
      const dentro = el.contains(document.activeElement);
      BS.avisoCerrar();
      /* si el foco estaba en el aviso, vuelve a donde estaba antes (no se pierde en BODY) */
      if (dentro && previo && previo !== document.body && document.contains(previo) && previo.focus) { try { previo.focus({ preventScroll: true }); } catch (e) { /* nada */ } }
    });
    const acc = el.querySelector('[data-accion]');
    if (acc) acc.addEventListener('click', () => { BS.avisoCerrar(true); o.accion.fn(); });
    const sel = el.querySelector('[data-sel]');
    if (sel) {
      sel.addEventListener('click', () => { const ta = el.querySelector('textarea'); ta.focus(); ta.select(); });
      setTimeout(() => { const ta = el.querySelector('textarea'); if (ta) { ta.focus(); ta.select(); } }, 60);
    }
    if (o.tipo !== 'error') {
      const dur = o.duracion || (o.tipo === 'chico' ? 2600 : 4200);
      let restante = dur, inicio = 0;
      const arrancar = () => { inicio = Date.now(); estado.t = setTimeout(() => { if (avisoActual === estado) BS.avisoCerrar(); }, restante); };
      const pausar = () => { clearTimeout(estado.t); restante -= Date.now() - inicio; if (restante < 800) restante = 800; };
      el.addEventListener('mouseenter', pausar); el.addEventListener('mouseleave', arrancar);
      el.addEventListener('focusin', pausar); el.addEventListener('focusout', arrancar);
      arrancar();
    }
  };

  /* ------------------------------------------------------------------
     Capas (ficha, Mi pedido, menú): pila, inert, scroll bloqueado,
     foco atrapado, Esc y foco que vuelve al disparador.
     ------------------------------------------------------------------ */
  const pila = [];
  function fondos() { return ['saltar', 'header', 'main', 'pie', 'capa-ficha', 'capa-pedido', 'menu'].map((id) => document.getElementById(id)).filter(Boolean); }
  function actualizarInert() {
    const tope = pila[pila.length - 1];
    fondos().forEach((el) => {
      let inerte = false;
      if (tope) inerte = el !== tope.el && !(tope.permitir || []).includes(el);
      if (inerte) el.setAttribute('inert', ''); else el.removeAttribute('inert');
    });
    document.documentElement.classList.toggle('bloqueado', pila.length > 0);
  }
  function enfocables(raiz) {
    return BS.$$('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])', raiz)
      .filter((el) => !el.closest('[inert]') && !el.closest('[hidden]') && el.offsetParent !== null || el === document.activeElement);
  }
  document.addEventListener('keydown', (e) => {
    const tope = pila[pila.length - 1]; if (!tope) return;
    if (e.key === 'Escape') {
      if (e.defaultPrevented) return;
      e.preventDefault(); tope.cerrar(); return;
    }
    if (e.key === 'Tab') {
      /* Zonas del ciclo de Tab: la capa activa, lo que permite, y los avisos (están afuera de las capas,
         pero tienen botones y enlaces que hay que poder alcanzar). Ordenadas como en el DOM, para que
         la lista coincida con el orden real de Tab. */
      const zonas = [tope.el].concat(tope.permitir || []);
      const av = document.getElementById('avisos');
      if (av && av.querySelector('.aviso')) zonas.push(av);
      zonas.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      let lista = [];
      zonas.forEach((z) => { lista = lista.concat(enfocables(z)); });
      if (!lista.length) { e.preventDefault(); return; }
      const primero = lista[0], ultimo = lista[lista.length - 1];
      const activo = document.activeElement;
      if (e.shiftKey && (activo === primero || !lista.includes(activo))) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && (activo === ultimo || !lista.includes(activo))) { e.preventDefault(); primero.focus(); }
    }
  });

  BS.capas = {
    abiertas: () => pila.length,
    estaAbierta: (el) => pila.some((c) => c.el === el),
    /* o: {el, cerrar: fn, foco: elemento, permitir: [elementos], volverA: elemento} */
    abrir(o) {
      if (pila.some((c) => c.el === o.el)) return;
      o.previo = o.volverA || document.activeElement;
      pila.push(o);
      o.el.hidden = false;
      void o.el.offsetWidth;
      o.el.classList.add('is-open');
      actualizarInert();
      requestAnimationFrame(() => { const f = o.foco; if (f && f.focus) f.focus({ preventScroll: true }); });
    },
    cerrar(el, opciones) {
      const i = pila.findIndex((c) => c.el === el); if (i < 0) return;
      const o = pila.splice(i, 1)[0];
      el.classList.remove('is-open');
      actualizarInert();
      const demora = BS.reducido() ? 0 : 340;
      setTimeout(() => { if (!pila.some((c) => c.el === el)) el.hidden = true; }, demora);
      const volver = !(opciones && opciones.sinFoco);
      if (volver && o.previo && document.contains(o.previo) && o.previo.focus) {
        try { o.previo.focus({ preventScroll: true }); } catch (e) { /* nada */ }
      }
    },
  };
})();
