/* Biotech Supplies · Mi pedido y mensajes para Instagram (versión B).
   El pedido se guarda en localStorage (siempre con try/catch); si no se puede,
   sigue funcionando en memoria. Los textos salen de diseno/textos.md. */
(function () {
  'use strict';
  const BS = window.BS;
  const { $, $$, esc, ico } = BS;

  const CLAVE = 'biotech-supplies.pedido.v1';
  const LO_DECIDO = 'Lo decido por mensaje';
  const CIERRE = '¿Me pasás el precio y cómo coordinamos el pago y la entrega? ¡Gracias! 🫶🏼\nTe cuento mi barrio o departamento acá abajo 👇';

  /* Frase para el mensaje («la Taza Química», «una Bitácora de laboratorio»…). Sale del nombre que está en
     productos.json: si se cambia el nombre allá, el mensaje lo sigue. Solo se decide el artículo (género y
     número) con una regla simple. Si algún producto necesita otra frase, se le puede agregar el campo
     opcional "frase_pedido" en productos.json. */
  function fraseDe(p) {
    if (typeof p.frase_pedido === 'string' && p.frase_pedido.trim()) return p.frase_pedido.trim();
    const n = String(p.nombre || '').trim(); if (!n) return null;
    if (p.categoria === 'tazas') return 'la ' + n;                        // un modelo concreto: «la Taza Química»
    const w = n.split(/\s+/)[0].toLowerCase();
    const plural = /s$/.test(w);
    const fem = /as?$/.test(w) || /\bbag\b/i.test(n);                     // «Tote bag» → una (la bolsa)
    return (plural ? (fem ? 'unas' : 'unos') : (fem ? 'una' : 'un')) + ' ' + n;
  }

  let datos = null;
  let items = [];            // {id, v, q}
  let guardaOk = true;
  let nuevaKey = null;       // fila a resaltar en el próximo render
  let confirmando = false;

  const clave = (it) => it.id + '||' + (it.v || '');
  const producto = (id) => datos && datos.productos.find((p) => p.id === id);
  const total = () => items.reduce((s, it) => s + it.q, 0);
  const plural = (n) => n + (n === 1 ? ' producto' : ' productos');

  /* ---------- Mensajes ---------- */
  function linea(p, v) {
    // «Quiero pedir …» para un solo producto, sin cantidad
    const f = fraseDe(p);
    if (!f) return 'Quiero pedir: ' + p.nombre + (v && v !== LO_DECIDO ? ', versión «' + v + '»' : '');
    if (v === LO_DECIDO) return 'Quiero pedir ' + f + '. Todavía no elegí versión: ¿me cuentan cuáles hay? 🧪';
    if (v) return 'Quiero pedir ' + f + ', versión «' + v + '» 🧪';
    return 'Quiero pedir ' + f + ' 🧪';
  }
  function mensajeUno(p, v, q) {
    if (p.id === 'taza-personalizada' && q === 1) return mensajePersonalizada();
    if (q > 1) return mensajeLista([{ id: p.id, v: v || null, q: q }]);
    return '¡Hola! 👋🏼 ' + linea(p, v) + '\n' + CIERRE;
  }
  function mensajePersonalizada() { return '¡Hola! 👋🏼 Quiero personalizar una taza ☕🧬\nMi idea es: '; }
  function mensajeConsulta() { return '¡Hola! 👋🏼 Los encontré en la web y quería hacerles una consulta 🧪'; }
  function mensajeLista(lista) {
    const filas = lista.map((it, i) => {
      const p = producto(it.id); if (!p) return null;
      let txt = (i + 1) + '. ' + (p.id === 'taza-personalizada' ? 'Taza personalizada' : p.nombre) + ' × ' + it.q;
      if (p.id === 'taza-personalizada') txt += ' — mi idea la cuento por acá';
      else if (it.v) txt += ' — ' + (it.v === LO_DECIDO ? 'versión a definir' : it.v);
      return txt;
    }).filter(Boolean);
    const hayCang = lista.some((it) => it.id === 'canguro'), hayTote = lista.some((it) => it.id === 'tote');
    let m = '¡Hola! 👋🏼 Quiero hacer este pedido de ' + BS.NOMBRE + ':\n\n' + filas.join('\n') + '\n\n';
    if (hayCang && !hayTote) m += 'Entiendo que con el canguro la tote va de regalo 🎁\n';
    return m + CIERRE;
  }
  function mensajePedido() { return mensajeLista(items); }

  /* ---------- Copiar y abrir Instagram ---------- */
  async function enviar(texto, abrir) {
    const ok = await BS.copiar(texto);
    if (!ok) { BS.aviso({ tipo: 'error', titulo: 'No pudimos copiarlo solos', texto: 'Copiá el mensaje de acá abajo y pegalo en el chat de Instagram.', mensaje: texto }); return false; }
    if (abrir) {
      try { window.open(BS.IG, '_blank', 'noopener'); } catch (e) { /* el enlace de abajo lo cubre */ }
      BS.aviso({
        titulo: '¡Mensaje copiado!',
        texto: BS.tactil() ? 'Se abre Instagram. Dejá apretado el campo de texto, tocá «Pegar» y mandalo.' : 'Se abre Instagram en otra pestaña. Pegá el mensaje con Ctrl + V y mandalo.',
        enlace: { pre: '¿No se abrió?', texto: 'Abrir el chat de Biotech Supplies', href: BS.IG },
        duracion: 6000,
      });
    } else {
      BS.aviso({ titulo: '¡Mensaje copiado!', texto: 'Pegalo en el chat de Instagram', duracion: 4200 });
    }
    return true;
  }

  /* ---------- Persistencia ---------- */
  function guardar() { guardaOk = BS.guardar(CLAVE, items); }
  function cargar() {
    const g = BS.leer(CLAVE);
    if (!Array.isArray(g)) return [];
    return g.filter((it) => it && producto(it.id) && Number.isFinite(it.q) && it.q > 0)
      .map((it) => {
        const p = producto(it.id);
        let v = it.v || null;
        if (v && v !== LO_DECIDO && !(p.variantes || []).includes(v)) v = (p.variantes && p.variantes.length) ? LO_DECIDO : null;
        return { id: it.id, v: v, q: Math.min(20, Math.max(1, Math.round(it.q))) };
      });
  }

  /* ---------- Operaciones ---------- */
  function volar(origen) {
    if (BS.reducido() || !origen) return;
    const r = origen.getBoundingClientRect(); if (!r.width) return;
    const btn = $('#btn-pedido'); const d = btn.getBoundingClientRect();
    const img = origen.tagName === 'IMG' ? origen : origen.querySelector('img');
    const clon = document.createElement('div');
    clon.setAttribute('aria-hidden', 'true');
    clon.style.cssText = 'position:fixed;left:0;top:0;width:56px;height:70px;border:1.5px solid #14110E;border-radius:8px;z-index:130;pointer-events:none;background:#14110E center/cover no-repeat;';
    if (img) { clon.style.backgroundImage = 'url("' + (img.currentSrc || img.src) + '")'; clon.style.backgroundPosition = getComputedStyle(img).objectPosition; }
    const x0 = r.left + r.width / 2 - 28, y0 = r.top + r.height / 2 - 35;
    const x1 = d.left + d.width / 2 - 28, y1 = d.top + d.height / 2 - 35;
    document.body.appendChild(clon);
    const a = clon.animate([
      { transform: 'translate(' + x0 + 'px,' + y0 + 'px) scale(1)', opacity: 1 },
      { transform: 'translate(' + (x0 + x1) / 2 + 'px,' + ((y0 + y1) / 2 - 90) + 'px) scale(.8)', opacity: 1, offset: 0.5 },
      { transform: 'translate(' + x1 + 'px,' + y1 + 'px) scale(.25)', opacity: 0.2 },
    ], { duration: 700, easing: 'cubic-bezier(.5,0,.2,1)' });
    a.onfinish = () => clon.remove(); a.oncancel = () => clon.remove();
  }
  function rebotarBoton() {
    const c = $('#contador'), b = $('#btn-pedido');
    c.classList.remove('pop'); b.classList.remove('rebota'); void c.offsetWidth;
    c.classList.add('pop'); b.classList.add('rebota');
    setTimeout(() => { c.classList.remove('pop'); b.classList.remove('rebota'); }, 420);
  }
  function agregar(id, v, q, origen) {
    const p = producto(id); if (!p) return false;
    q = Math.min(20, Math.max(1, q || 1));
    const nuevo = { id: id, v: v || null, q: q };
    const ya = items.find((it) => clave(it) === clave(nuevo));
    if (ya) ya.q = Math.min(20, ya.q + q); else items.push(nuevo);
    nuevaKey = clave(nuevo);
    guardar(); refrescar();
    volar(origen);
    if (!BS.reducido()) rebotarBoton(); else { /* sin movimiento: solo se actualiza el contador */ }
    const nombre = p.nombre + (v && v !== LO_DECIDO ? ' (' + v + ')' : '');
    BS.aviso({
      tipo: 'chico',
      titulo: ya ? 'Ya lo tenés en Mi pedido: sumamos otra unidad.' : 'Agregado a Mi pedido: ' + nombre + ' ✓',
      accion: { texto: 'Ver pedido', fn: () => abrir() },
      duracion: 3200,
    });
    return true;
  }
  function quitar(key) {
    const it = items.find((x) => clave(x) === key); if (!it) return;
    const p = producto(it.id);
    const pos = items.indexOf(it);
    items = items.filter((x) => clave(x) !== key);
    guardar(); refrescar();
    /* el botón que tenía el foco desapareció: el foco pasa a la fila siguiente (o la anterior), o a un control estable */
    if (BS.capas.estaAbierta($('#capa-pedido'))) {
      const quitares = $$('#pedido-cuerpo .p-fila__quitar');
      const destino = quitares[Math.min(pos, quitares.length - 1)] || $('#pedido-cuerpo [data-ir]') || $('#pedido-cerrar');
      if (destino) destino.focus({ preventScroll: true });
    }
    BS.aviso({ tipo: 'chico', titulo: 'Quitado de Mi pedido: ' + (p ? p.nombre : ''), duracion: 2200 });
  }
  function cambiar(key, delta) {
    const it = items.find((x) => clave(x) === key); if (!it) return;
    it.q = Math.min(20, Math.max(1, it.q + delta));
    guardar(); refrescar(key);
  }
  /* Reemplaza una fila (la que se editaba con «Cambiar versión») por la versión y la cantidad nuevas. */
  function reemplazar(keyVieja, id, v, q) {
    const p = producto(id); if (!p) return false;
    const i = items.findIndex((x) => clave(x) === keyVieja);
    if (i < 0) return agregar(id, v, q, null);           // la fila ya no estaba: se agrega como nueva
    q = Math.min(20, Math.max(1, q || 1));
    const nuevo = { id: id, v: v || null, q: q };
    const k = clave(nuevo);
    items.splice(i, 1);
    const ya = items.find((x) => clave(x) === k);
    if (ya) ya.q = Math.min(20, ya.q + q); else items.splice(i, 0, nuevo);
    nuevaKey = k;
    guardar(); refrescar();
    BS.aviso({ tipo: 'chico', titulo: ya ? 'Esa versión ya estaba en tu pedido: juntamos las cantidades ✓' : 'Listo, actualizamos tu pedido ✓', duracion: 2800 });
    return true;
  }
  function vaciar() {
    items = []; confirmando = false; guardar(); refrescar();
    BS.aviso({ tipo: 'chico', titulo: 'Mi pedido quedó vacío', duracion: 2200 });
  }
  function cantidadDe(id) { return items.filter((it) => it.id === id).reduce((s, it) => s + it.q, 0); }

  /* ---------- Contador del encabezado ---------- */
  function actualizarContador() {
    const n = total();
    const c = $('#contador'), b = $('#btn-pedido');
    c.textContent = n; c.classList.toggle('hay', n > 0);
    b.setAttribute('aria-label', 'Abrir Mi pedido, ' + (n === 0 ? 'vacío' : plural(n)));
  }

  /* ---------- Panel ---------- */
  function miniatura(p) {
    if (p.fotos && p.fotos[0]) {
      const src = p.fotos[0].replace('fotos/', 'fotos/m/');
      const pos = (BS.posFoto && BS.posFoto(p.fotos[0])) || '50% 50%';
      return '<img src="' + esc(src) + '" alt="" width="64" height="80" style="object-position:' + pos + '">';
    }
    const icono = BS.iconoSinFoto ? BS.iconoSinFoto(p) : 'cat-accesorios';
    return '<span>' + ico(icono) + '</span>';
  }
  function renderCuerpo() {
    const cuerpo = $('#pedido-cuerpo');
    if (!items.length) {
      cuerpo.innerHTML = '<div class="pedido-vacio"><img src="assets/dibujos/garabato-matraz.svg" alt="" width="120" height="120">' +
        '<h3 class="t-h3">Todavía no agregaste nada</h3>' +
        '<p>Elegí algo del catálogo y sumalo acá. Después lo mandamos todo junto en un solo mensaje.</p>' +
        '<div class="fila-nota"><p class="nota t-mano" aria-hidden="true">Todavía no agregaste nada</p><span class="flecha" data-flecha="curva" aria-hidden="true"></span></div>' +
        '<button type="button" class="btn btn--enlace" data-ir="catalogo">Ir al catálogo</button></div>';
      if (BS.armarFlechas) BS.armarFlechas(cuerpo);
      return;
    }
    const filas = items.map((it) => {
      const p = producto(it.id); if (!p) return '';
      const k = clave(it);
      const esNueva = k === nuevaKey;
      const varTxt = it.v ? ('Versión: ' + (it.v === LO_DECIDO ? 'a definir por mensaje' : it.v)) : '';
      return '<li class="p-fila' + (esNueva ? ' nueva' : '') + '" data-key="' + esc(k) + '">' +
        '<div class="p-fila__foto">' + miniatura(p) + '</div>' +
        '<div><div class="p-fila__nombre">' + esc(p.nombre) + '</div>' +
        (varTxt ? '<div class="p-fila__var">' + esc(varTxt) + '</div>' : '') +
        (p.variantes ? '<button type="button" class="p-fila__link" data-cambiar-v="' + esc(k) + '">Cambiar versión</button>' : '') + '</div>' +
        '<button type="button" class="p-fila__quitar" data-quitar="' + esc(k) + '" aria-label="Quitar ' + esc(p.nombre) + ' de Mi pedido">' + ico('ui-papelera') + '</button>' +
        '<div class="p-fila__cant cantidad cantidad--s" role="group" aria-label="Cantidad de ' + esc(p.nombre) + '">' +
        '<button type="button" data-menos="' + esc(k) + '" aria-label="Quitar una unidad de ' + esc(p.nombre) + '"' + (it.q <= 1 ? ' disabled' : '') + '>' + ico('ui-menos') + '</button>' +
        '<output aria-live="polite">' + it.q + '</output>' +
        '<button type="button" data-mas="' + esc(k) + '" aria-label="Sumar una unidad de ' + esc(p.nombre) + '"' + (it.q >= 20 ? ' disabled' : '') + '>' + ico('ui-mas') + '</button></div></li>';
    }).join('');
    const hayCang = items.some((i) => i.id === 'canguro'), hayTote = items.some((i) => i.id === 'tote');
    cuerpo.innerHTML = '<ul class="pedido-lista" aria-label="Lista de productos">' + filas + '</ul>' +
      (hayCang && !hayTote ? '<p class="pedido-aviso">Con el canguro, la tote va de regalo 🎁</p>' : '') +
      '<p class="pedido-total">El precio total lo vemos por mensaje.</p>' +
      '<div class="vista"><span class="nota t-mano" aria-hidden="true">Así va a salir tu mensaje</span><span class="sr-only">Así va a salir tu mensaje</span>' +
      '<div class="vista__caja" tabindex="0" role="region" aria-label="Vista previa del mensaje">' + esc(mensajePedido()) + '</div></div>';
    nuevaKey = null;
  }
  function renderPie() {
    const pie = $('#pedido-pie');
    const vacio = !items.length;
    if (confirmando && !vacio) {
      pie.innerHTML = '<div class="pedido__confirma" role="alertdialog" aria-label="Confirmar"><strong>¿Vaciar todo Mi pedido?</strong>' +
        '<button type="button" class="btn btn--peligro" data-vaciar-si>Sí, vaciar</button><button type="button" class="btn" data-vaciar-no>Cancelar</button></div>';
      const b = pie.querySelector('[data-vaciar-no]'); if (b) b.focus();
      return;
    }
    pie.innerHTML =
      '<button type="button" class="btn btn--amarillo btn--grande" data-copiar-abrir' + (vacio ? ' disabled aria-disabled="true"' : '') + '>' + ico('ui-copiar') + 'Copiar mensaje y abrir Instagram' + ico('ui-flecha-ne') + '</button>' +
      '<div class="pedido__pie-fila"><button type="button" class="btn" style="flex:1" data-copiar' + (vacio ? ' disabled aria-disabled="true"' : '') + '>Solo copiar el mensaje</button>' +
      '<button type="button" class="btn btn--enlace btn--peligro" data-vaciar' + (vacio ? ' disabled aria-disabled="true"' : '') + '>Vaciar pedido</button></div>' +
      '<p class="nota-chica">Instagram no deja precargar el mensaje: lo copiamos y lo pegás en el chat.' +
      (guardaOk ? ' Tu pedido queda guardado en este navegador; nadie más lo ve.' : ' Tu pedido no se puede guardar en este navegador, así que no cierres la pestaña.') + '</p>';
  }
  /* Cambia solo la cantidad de una fila, sin reconstruir sus botones: así el foco del teclado no se pierde. */
  function actualizarFila(key) {
    const fila = $$('#pedido-cuerpo .p-fila').find((li) => li.dataset.key === key);
    const it = items.find((x) => clave(x) === key);
    if (!fila || !it) return false;
    const activo = document.activeElement;
    const sal = $('output', fila); if (sal) sal.textContent = it.q;
    const menos = fila.querySelector('[data-menos]'), mas = fila.querySelector('[data-mas]');
    if (menos) menos.disabled = it.q <= 1;
    if (mas) mas.disabled = it.q >= 20;
    // si el botón enfocado quedó deshabilitado (llegó a 1 o a 20), el foco pasa al botón contrario
    if (activo && activo.disabled && fila.contains(activo)) { const otro = activo === menos ? mas : menos; if (otro && !otro.disabled) otro.focus({ preventScroll: true }); }
    const caja = $('#pedido-cuerpo .vista__caja'); if (caja) caja.textContent = mensajePedido();
    return true;
  }
  function refrescar(enSitio) {
    actualizarContador();
    $('#pedido-sub').textContent = plural(total());
    if (!$('#capa-pedido').hidden || BS.capas.estaAbierta($('#capa-pedido'))) { if (!(enSitio && actualizarFila(enSitio))) { renderCuerpo(); renderPie(); } }
    if (BS.actualizarTarjetas) BS.actualizarTarjetas();
    if (BS.actualizarFicha) BS.actualizarFicha();
  }

  function abrir(opciones) {
    if (BS.cerrarMenu) BS.cerrarMenu(true);
    const capa = $('#capa-pedido');
    if (BS.capas.estaAbierta(capa)) return;
    confirmando = false;
    renderCuerpo(); renderPie(); $('#pedido-sub').textContent = plural(total());
    BS.capas.abrir({ el: capa, cerrar: cerrar, foco: $('#pedido-cerrar'), volverA: (opciones && opciones.volverA) || document.activeElement });
  }
  function cerrar() { BS.capas.cerrar($('#capa-pedido')); }

  /* ---------- Eventos ---------- */
  function iniciarEventos() {
    $('#btn-pedido').addEventListener('click', abrir);
    $('#pedido-cerrar').addEventListener('click', cerrar);
    $('[data-cerrar="pedido"]').addEventListener('click', cerrar);

    $('#pedido-cuerpo').addEventListener('click', (e) => {
      const t = e.target.closest('button'); if (!t) return;
      if (t.dataset.ir === 'catalogo') { cerrar(); if (BS.irAlCatalogo) BS.irAlCatalogo(); return; }
      if (t.dataset.quitar) {
        const fila = t.closest('.p-fila'); const k = t.dataset.quitar;
        if (fila && !BS.reducido()) { fila.classList.add('sale'); setTimeout(() => quitar(k), 200); } else quitar(k);
        return;
      }
      if (t.dataset.menos) { cambiar(t.dataset.menos, -1); return; }
      if (t.dataset.mas) { cambiar(t.dataset.mas, +1); return; }
      if (t.dataset.cambiarV) {
        const it = items.find((x) => clave(x) === t.dataset.cambiarV); if (!it) return;
        /* abre la ficha con la versión y la cantidad actuales; al confirmar, esa fila se reemplaza */
        cerrar(); if (BS.abrirFicha) BS.abrirFicha(it.id, { desdePedido: true, volverA: $('#btn-pedido'), editar: { key: t.dataset.cambiarV, v: it.v, q: it.q } });
      }
    });
    $('#pedido-pie').addEventListener('click', (e) => {
      const t = e.target.closest('button'); if (!t || t.disabled) return;
      if (t.hasAttribute('data-copiar-abrir')) enviar(mensajePedido(), true);
      else if (t.hasAttribute('data-copiar')) enviar(mensajePedido(), false);
      else if (t.hasAttribute('data-vaciar')) { confirmando = true; renderPie(); }
      else if (t.hasAttribute('data-vaciar-no')) { confirmando = false; renderPie(); const v = $('[data-vaciar]', $('#pedido-pie')); if (v) v.focus(); }
      else if (t.hasAttribute('data-vaciar-si')) { vaciar(); const c = $('#pedido-cerrar'); if (c) c.focus(); }
    });

    /* Todo enlace con data-consulta copia un mensaje general y abre Instagram */
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-consulta]'); if (!a) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      enviar(mensajeConsulta(), true);
    });
    const per = $('#btn-personalizada');
    if (per) per.addEventListener('click', () => enviar(mensajePersonalizada(), true));
  }

  BS.pedido = {
    init(d) {
      datos = d; items = cargar(); guardar(); actualizarContador();
    },
    agregar, quitar, reemplazar, abrir, cerrar, cantidadDe, enviar, refrescar,
    mensajeUno, mensajePersonalizada, mensajeConsulta,
    LO_DECIDO,
  };
  iniciarEventos();
})();
