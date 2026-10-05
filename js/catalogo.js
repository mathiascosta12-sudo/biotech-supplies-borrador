/* Biotech Supplies · catálogo, filtros, ficha y científicos (versión B).
   Todo sale de productos.json: se edita ahí, sin tocar el diseño. */
(function () {
  'use strict';
  const BS = window.BS;
  const { $, $$, esc, ico, norm } = BS;

  /* ---------- Recortes de foto (diseno/sistema.md, sección 6): object-position (y) ---------- */
  const POS_Y = {
    'taza-biotech.jpg': 12, 'taza-quimica.jpg': 18, 'taza-organica.jpg': 12, 'taza-medicina.jpg': 12, 'taza-programacion.jpg': 12,
    'taza-fisica.jpg': 14, 'taza-matematica.jpg': 14, 'taza-cosmica.jpg': 48, 'taza-microbiologia.jpg': 14, 'taza-veterinaria.jpg': 12,
    'taza-jurasica.jpg': 10, 'taza-oceanica.jpg': 30, 'taza-mundialista.jpg': 30, 'tote.jpg': 70,
  };
  const archivo = (ruta) => String(ruta).split('/').pop();
  BS.posFoto = (ruta) => '50% ' + (POS_Y[archivo(ruta)] != null ? POS_Y[archivo(ruta)] : 50) + '%';
  const chica = (ruta) => String(ruta).replace(/^fotos\//, 'fotos/m/');

  /* ---------- Textos alternativos (textos.md, sección 16) ---------- */
  const ALT = {
    'taza-biotech.jpg': 'Mano sosteniendo la Taza Biotecnológica: vidrio transparente con dibujos de doble hélice de ADN, mitocondrias, bacteriófago, matraces, una bitácora y el logo BIO TECH, con hojas de monstera de fondo.',
    'taza-quimica.jpg': 'Mano sosteniendo la Taza Química: vidrio transparente cubierto de fórmulas y reacciones, un átomo y un esquema de plano inclinado, con el logo BIO TECH y hojas de monstera de fondo.',
    'taza-organica.jpg': 'Mano sosteniendo la Taza Moléculas Orgánicas: estructuras químicas dibujadas a mano, entre ellas la melatonina y el estrógeno, con el logo BIO TECH y una monstera de fondo.',
    'taza-medicina.jpg': 'Mano sosteniendo la Taza Medicina: vidrio transparente con un caduceo, estetoscopios, radiografías, cerebros, muelas, muletas y un botiquín, con el logo BIO TECH.',
    'taza-programacion.jpg': 'Mano sosteniendo la Taza Programación: vidrio transparente con laptops, nubes, la palabra «Python», «CSS», «Compiling», llaves de código y números binarios, con el logo BIO TECH.',
    'taza-fisica.jpg': 'Mano sosteniendo la Taza Física: átomos, diagramas de fuerzas, un plano inclinado, líneas de campo y fórmulas como E = mc², con el logo BIO TECH y hojas de monstera de fondo.',
    'taza-matematica.jpg': 'Mano sosteniendo la Taza Matemática: vidrio transparente cubierto de fórmulas, integrales, gráficos, una matriz y el número pi, con el logo BIO TECH y una monstera de fondo.',
    'taza-cosmica.jpg': 'Mano sosteniendo la Taza Cósmica: un cometa, un planeta con anillos, un telescopio, una galaxia, un satélite y constelaciones dibujados en el vidrio, con el logo BIO TECH.',
    'taza-microbiologia.jpg': 'Mano sosteniendo la Taza Mundo Bacteriano: bacterias de distintas formas dibujadas en línea sobre vidrio transparente, con el logo BIO TECH y hojas de monstera de fondo.',
    'taza-veterinaria.jpg': 'Mano sosteniendo la Taza Ciencias Veterinarias: una vaca, un conejo, perros, gatos, un hámster, huesos y una pecera dibujados en el vidrio, con el logo BIO TECH.',
    'taza-jurasica.jpg': 'Mano sosteniendo la Taza Jurásica: dinosaurios con sus nombres, como anquilosaurio, triceratops, tiranosaurio y mosasaurio, y un pterosaurio, entre helechos dibujados en el vidrio.',
    'taza-oceanica.jpg': 'Mano sosteniendo la Taza Oceánica: ballenas, tiburones, medusas, un pulpo, almejas y estrellas de mar dibujados en el vidrio, con el logo BIO TECH.',
    'taza-mundialista.jpg': 'Primer plano de la Taza Mundialista: dibujos de Uruguay en tinta oscura sobre vidrio, con el sol, la bandera, el escudo, «Uruguay nomá», «Los de afuera son de palo» y el año 1928, frente a una hoja de monstera.',
    'tazas-personalizadas.jpg': 'Gráfica «Personalizamos las tazas como tu quieras» con dos tablets que muestran diseños de ejemplo: una con dibujos de ropa y costura y otra con moléculas dibujadas a mano, y un lápiz digital.',
    'bitacoras.jpg': 'Cuatro bitácoras de laboratorio con espiral, de tapas ilustradas con laboratorios: Proteínas (celeste), Biología celular (lila y azul), Microbiología (azul, con placas de Petri) y Química (naranja, con bata blanca y tabla periódica). Cada una lleva su nombre escrito a mano y una flecha.',
    'canguros-foto.jpg': 'Primer plano de dos canguros sobre una superficie: uno oscuro con letras claras de «In my scientific era» en la manga y otro de tono marrón rosado con letras amarillo suave.',
    'canguros-colores.jpg': 'Dibujo de dos canguros oversize. A la izquierda, uno chocolate con tres íconos bordados en el pecho (microscopio, átomo y ADN), señalado como «Chocolate + dorado pistacho». A la derecha, uno negro visto de espaldas con «In my scientific era» y «Biotech Supplies» en gris, señalado como «Negro + gris perlado».',
    'tote.jpg': 'Tote bag negra colgada de una percha de madera sobre una pared clara, con la frase «In my scientific era» en letras blancas de burbuja.',
    'cartucheras.jpg': 'Cartucheras de tela cruda con cierre, dispuestas en diagonal. Cada lado muestra a cuatro científicos dibujados a color con su nombre: Marie Curie, Charles Darwin, Jane Goodall e Isaac Newton de un lado; Rosalind Franklin, Galileo Galilei, Sofia Kovalévskaya y Albert Einstein del otro.',
  };
  const altDe = (ruta, p) => ALT[archivo(ruta)] || ('Foto de ' + p.nombre);

  /* ---------- Colores de variante (sistema.md 3.2). Las demás: solo texto ---------- */
  const COLORES = {
    'Chocolate con letras dorado pistacho': ['--choco', '--pistacho'],
    'Negro con letras gris perlado': ['--negro', '--perla'],
    'Laboratorio de Proteínas': ['--bit-proteinas'],
    'Laboratorio de Biología Celular': ['--bit-celular'],
    'Laboratorio de Microbiología': ['--bit-micro'],
    'Laboratorio de Química (nuevo)': ['--bit-quimica'],
  };

  /* Línea de rol de cada científico (textos.md, sección 11) */
  const ROLES = {
    kovalevskaya: 'Matemática y escritora', franklin: 'Química y cristalógrafa', newton: 'Físico, matemático y astrónomo',
    goodall: 'Primatóloga', galileo: 'Astrónomo, físico e ingeniero',
  };
  const RESUMEN_TODO = 'Tazas, bitácoras, canguros y todo lo que le hace falta a un escritorio de ciencia.';

  let datos = null, productos = [], categorias = [];
  const estado = { cat: 'todos', q: '' };
  const tarjetas = new Map();   // id -> {el, p}
  let visibles = [];            // ids visibles en orden
  let primeraVez = true;
  let animando = 0;

  const iconoSinFoto = (p) => (['mousepad', 'llavero', 'pin', 'posavasos', 'stickers', 'escultura-adn'].includes(p.id) ? 'prod-' + p.id : 'cat-' + p.categoria);
  BS.iconoSinFoto = iconoSinFoto;
  const producto = (id) => productos.find((p) => p.id === id);
  const catNombre = (id) => { const c = categorias.find((x) => x.id === id); return c ? c.nombre : ''; };

  /* ==========================================================================
     Carga
     ========================================================================== */
  /* Revisa que el JSON tenga la forma esperada (alguien lo puede editar a mano) y deja los datos normalizados:
     textos como texto, listas como listas. Lo que no sirve se descarta; si no queda catálogo, tira un error. */
  const hayTexto = (v) => typeof v === 'string' && v.trim() !== '';
  const soloTextos = (v) => (Array.isArray(v) ? v.filter(hayTexto) : []);
  function validar(d) {
    if (!d || typeof d !== 'object' || Array.isArray(d)) throw new Error('productos.json no es un objeto');
    if (!Array.isArray(d.categorias) || !Array.isArray(d.productos)) throw new Error('productos.json: faltan «categorias» o «productos»');
    const cats = d.categorias.filter((c) => c && hayTexto(c.id) && hayTexto(c.nombre))
      .map((c) => Object.assign({}, c, { resumen: typeof c.resumen === 'string' ? c.resumen : '' }));
    const vistos = new Set();
    const prods = d.productos.filter((p) => p && hayTexto(p.id) && hayTexto(p.nombre) && hayTexto(p.categoria) && !vistos.has(p.id) && vistos.add(p.id))
      .map((p) => {
        const q = Object.assign({}, p, {
          resumen: typeof p.resumen === 'string' ? p.resumen : '',
          descripcion: typeof p.descripcion === 'string' ? p.descripcion : '',
          precio: typeof p.precio === 'number' && isFinite(p.precio) ? p.precio : null,
          fotos: soloTextos(p.fotos), etiquetas: soloTextos(p.etiquetas),
        });
        const vs = soloTextos(p.variantes);
        if (vs.length) q.variantes = vs; else delete q.variantes;
        return q;
      });
    if (!cats.length || !prods.length) throw new Error('productos.json: no quedó ningún producto o categoría válidos');
    const cient = (Array.isArray(d.cientificos) ? d.cientificos : []).filter((c) => c && hayTexto(c.id) && hayTexto(c.nombre) && hayTexto(c.foto))
      .map((c) => Object.assign({}, c, {
        pais: typeof c.pais === 'string' ? c.pais : '', nacimiento: c.nacimiento == null ? '' : String(c.nacimiento),
        bio: typeof c.bio === 'string' ? c.bio : '', cita: hayTexto(c.cita) ? c.cita : null,
      }));
    return Object.assign({}, d, { categorias: cats, productos: prods, cientificos: cient });
  }

  async function cargar() {
    try {
      const r = await fetch('productos.json', { cache: 'no-cache' });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      datos = validar(await r.json());
      productos = datos.productos; categorias = datos.categorias;
      BS.aplicarMarca(datos.marca);
      BS.datos = datos;
      BS.pedido.init(datos);
      armarChips();
      armarTarjetas();
      armarCientificos();
      armarEnviosPagos();
      aplicarFiltro(true);
      iniciarEventos();
      BS.pedido.refrescar();
      sync(true);
    } catch (e) {
      /* tanto un JSON que no carga como uno con estructura mala o un fallo al armar terminan en el aviso con salida */
      console.warn('No se pudo armar el catálogo:', e && e.message ? e.message : e);
      mostrarErrorCarga();
    }
  }
  /* Envíos y pagos: las listas salen de productos.json → envios_y_pagos. Los textos de ahí pueden traer notas
     internas entre paréntesis (por ejemplo «el listado de barrios está por confirmar»): se sacan antes de mostrar. */
  function armarEnviosPagos() {
    const ep = datos.envios_y_pagos; if (!ep || typeof ep !== 'object') return;
    const limpiar = (t) => t.replace(/\s*\([^)]*(?:confirmar|mapa)[^)]*\)/gi, '').replace(/\s+([.,;:])/g, '$1').replace(/(\d)\s%/g, '$1 %').trim();
    const lista = (v) => soloTextos(v).map(limpiar).filter(Boolean);
    let envios = lista(ep.envios); const pagos = lista(ep.pagos);
    let lead = null;
    if (envios.length > 1 && envios[0].length <= 60) { lead = envios[0]; envios = envios.slice(1); }
    const fila = (t, cinta) => {
      let h = BS.esc(t);
      h = h.replace(/\bgratis\b/i, (m) => '<span class="rodeada">' + m + '<span class="circulo" data-circulo aria-hidden="true"></span></span>');
      h = h.replace(/\d+(?:&nbsp;| | )?%(?: de recargo)?/, (m) => '<strong>' + m + '</strong>');
      return '<li><span>' + h + '</span>' + cinta + '</li>';
    };
    const cintaEnvio = (t) => (/gratis/i.test(t) ? ' <span class="cinta">Gratis</span>' : '');
    const cintaPago = (t) => (/preferentemente|preferid/i.test(t) ? ' <span class="cinta cinta--tinta">Preferida</span>' : '');
    const el = $('#envios-lista'), pl = $('#pagos-lista');
    if (el && envios.length) { el.innerHTML = envios.map((t) => fila(t, cintaEnvio(t))).join(''); BS.armarFlechas(el); }
    if (pl && pagos.length) pl.innerHTML = pagos.map((t) => fila(t, cintaPago(t))).join('');
    if (lead && $('#envios-lead')) $('#envios-lead').textContent = lead;
    // pasos de «Cómo comprar»
    if (pagos.length && $('#paso-pago')) $('#paso-pago').textContent = pagos.join(' ');
    const coord = envios.find((t) => /coordinar/i.test(t));
    if ($('#paso-envio') && (lead || coord)) $('#paso-envio').textContent = [lead, coord].filter(Boolean).join(' ');
  }
  function mostrarErrorCarga() {
    const g = $('#grilla');
    g.innerHTML = '';
    $('#aviso-catalogo').innerHTML = '<div class="aviso-cat" role="alert"><h3 class="t-h3">No pudimos cargar el catálogo</h3>' +
      '<p>Probá recargar la página. Si sigue sin andar, escribinos por Instagram y te pasamos todo por mensaje.</p>' +
      '<div class="vacio__botones"><button type="button" class="btn" onclick="location.reload()">Recargar</button>' +
      '<a class="btn btn--amarillo" href="' + esc(BS.IG) + '" target="_blank" rel="noopener">Escribir por Instagram</a></div></div>';
    $('#resumen-cat').textContent = ''; $('#cuenta').textContent = '';
    $('#vacio').hidden = true; $('#no-encontras').hidden = true;
  }

  /* ==========================================================================
     Filtros
     ========================================================================== */
  function armarChips() {
    const todos = [{ id: 'todos', nombre: 'Todo' }].concat(categorias);
    $('#chips').innerHTML = todos.map((c) =>
      '<button type="button" class="chip" data-cat="' + esc(c.id) + '" aria-pressed="' + (c.id === estado.cat) + '">' +
      '<span class="chip__c">' + ico('cat-' + c.id) + '</span><span>' + esc(c.nombre) + '</span></button>').join('');
    $$('#chips .chip').forEach((b) => b.addEventListener('click', () => { elegirCategoria(b.dataset.cat); }));
  }
  function elegirCategoria(id, opciones) {
    estado.cat = id;
    $$('#chips .chip').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === id)));
    const activo = $('#chips .chip[aria-pressed="true"]');
    if (activo && !(opciones && opciones.sinCentrar)) { try { activo.scrollIntoView({ inline: 'center', block: 'nearest', behavior: BS.reducido() ? 'auto' : 'smooth' }); } catch (e) { /* nada */ } }
    aplicarFiltro();
  }
  function coincide(p) {
    if (estado.cat !== 'todos' && p.categoria !== estado.cat) return false;
    const q = norm(estado.q).trim(); if (!q) return true;
    const pajar = norm([p.nombre, p.resumen, p.descripcion, (p.etiquetas || []).join(' '), (p.variantes || []).join(' '), catNombre(p.categoria)].join(' '));
    return q.split(/\s+/).every((t) => pajar.includes(t) || (t.length > 4 && pajar.includes(t.replace(/[aeiosn]$/, ''))));
  }
  function textoCuenta(n) {
    const prod = n === 1 ? '1 producto' : n + ' productos';
    const q = estado.q.trim();
    const cat = estado.cat !== 'todos' ? catNombre(estado.cat) : '';
    if (q && cat) return prod + ' para «' + q + '» en ' + cat;
    if (q) return prod + ' para «' + q + '»';
    if (cat) return prod + ' en ' + cat;
    return prod;
  }
  function fundir(el, texto) {
    if (el.textContent === texto) return;
    if (BS.reducido() || primeraVez) { el.textContent = texto; return; }
    el.classList.add('fundido');
    setTimeout(() => { el.textContent = texto; el.classList.remove('fundido'); }, 200);
  }
  const EASE_IN = 'cubic-bezier(0.55, 0, 1, 0.45)', EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)', EASE_INOUT = 'cubic-bezier(0.65, 0, 0.35, 1)';

  async function aplicarFiltro(inicial) {
    const idsOk = new Set(productos.filter(coincide).map((p) => p.id));
    visibles = productos.filter((p) => idsOk.has(p.id)).map((p) => p.id);
    const miToken = ++animando;
    // textos que cambian
    const resumen = estado.cat === 'todos' ? RESUMEN_TODO : ((categorias.find((c) => c.id === estado.cat) || {}).resumen || '');
    fundir($('#resumen-cat'), resumen);
    fundir($('#cuenta'), textoCuenta(visibles.length));
    $('#buscar-borrar').hidden = !estado.q;
    $('#vacio').hidden = visibles.length > 0;
    $('#no-encontras').hidden = !(visibles.length > 0 && visibles.length <= 6 && (estado.cat !== 'todos' || estado.q));
    $('#grilla').hidden = visibles.length === 0;

    const todas = Array.from(tarjetas.values());
    todas.forEach((t) => t.el.getAnimations().forEach((a) => a.cancel()));
    const enRegion = (() => { const r = $('#grilla').getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; })();
    const animar = !inicial && !primeraVez && enRegion && !BS.reducido();
    const quedan = todas.filter((t) => !t.el.hidden && idsOk.has(t.p.id));
    const salen = todas.filter((t) => !t.el.hidden && !idsOk.has(t.p.id));
    const entran = todas.filter((t) => t.el.hidden && idsOk.has(t.p.id));

    if (!animar) {
      salen.forEach((t) => { t.el.hidden = true; });
      entran.forEach((t) => { t.el.hidden = false; t.el.classList.add('is-in'); });
      primeraVez = false;
      return;
    }
    // 1. posiciones iniciales de las que se quedan
    const antes = new Map(quedan.map((t) => [t.p.id, t.el.getBoundingClientRect()]));
    // 2. las que salen
    const salidas = salen.map((t) => t.el.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.96)' }], { duration: 200, easing: EASE_IN, fill: 'forwards' }).finished.catch(() => {}));
    // si la pestaña está en segundo plano las animaciones no avanzan: no esperamos más de 350 ms
    await Promise.race([Promise.all(salidas), BS.espera(350)]);
    if (miToken !== animando) return;
    salen.forEach((t) => { t.el.getAnimations().forEach((a) => a.cancel()); t.el.hidden = true; });
    entran.forEach((t) => { t.el.hidden = false; t.el.classList.add('is-in'); });
    // 3. las que se quedan se deslizan a su lugar nuevo (FLIP)
    quedan.forEach((t) => {
      const a = antes.get(t.p.id), d = t.el.getBoundingClientRect();
      const dx = a.left - d.left, dy = a.top - d.top;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) t.el.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 420, easing: EASE_INOUT });
    });
    // 4. las que entran aparecen en cascada
    entran.forEach((t, i) => t.el.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: EASE_OUT, delay: Math.min(i, 10) * 40, fill: 'backwards' }));
  }

  /* ==========================================================================
     Tarjetas
     ========================================================================== */
  function tarjetaHTML(p, idx) {
    const num = String(idx + 1).padStart(2, '0');
    const tieneVar = p.variantes && p.variantes.length;
    const foto = p.fotos && p.fotos[0];
    const cinta = p.etiquetas && p.etiquetas[0] ? '<span class="cinta tarjeta__cinta">' + esc(p.etiquetas[0]) + '</span>' : '';
    // «confirmar»: producto de destacadas viejas. Se muestra igual que los demás; Lucía revisa la lista (productos.json → "confirmar").
    const fotoHTML = foto
      ? '<img src="' + esc(chica(foto)) + '" alt="" width="720" height="900" loading="lazy" decoding="async" style="object-position:' + BS.posFoto(foto) + '">'
      : '<div class="sin-foto__c">' + ico(iconoSinFoto(p)) + '</div><span class="sin-foto__txt t-micro">Foto en camino</span>';
    const mas = tieneVar
      ? '<button type="button" class="mas" data-mas aria-label="Elegir versión de ' + esc(p.nombre) + '">' + ico('ui-mas', 'ico--mas') + ico('ui-check', 'ico--check') + '<span class="mas__n"></span></button>'
      : '<button type="button" class="mas" data-mas aria-label="Agregar ' + esc(p.nombre) + ' a Mi pedido">' + ico('ui-mas', 'ico--mas') + ico('ui-check', 'ico--check') + '<span class="mas__n"></span></button>';
    return '<div class="tarjeta__sombra" aria-hidden="true"></div>' +
      '<div class="tarjeta__caja">' + cinta +
      '<div class="tarjeta__foto' + (foto ? '' : ' sin-foto') + '">' + fotoHTML + '<span class="tarjeta__num" aria-hidden="true">N.º ' + num + '</span>' + mas + '</div>' +
      '<div class="tarjeta__texto"><p class="t-micro tarjeta__cat">' + esc(catNombre(p.categoria)) + '</p>' +
      '<h3 class="t-h4 tarjeta__nombre"><a class="tarjeta__enlace" href="#' + esc(p.id) + '" aria-label="' + esc(p.nombre + '. ' + (p.resumen || '') + ' Ver ficha.') + '">' + esc(p.nombre) + '</a></h3>' +
      BS.precioHTML(p) +
      (tieneVar ? '<p class="t-micro tarjeta__var">' + p.variantes.length + ' versiones</p>' : '') + '</div></div>';
  }
  function armarTarjetas() {
    const g = $('#grilla');
    g.innerHTML = '';
    productos.forEach((p, i) => {
      const li = document.createElement('li');
      li.className = 'tarjeta reveal';
      li.dataset.id = p.id;
      li.innerHTML = tarjetaHTML(p, i);
      g.appendChild(li);
      tarjetas.set(p.id, { el: li, p: p });
    });
    BS.observar(g);
  }
  BS.actualizarTarjetas = function () {
    tarjetas.forEach((t) => {
      const btn = $('.mas', t.el); if (!btn) return;
      const n = BS.pedido.cantidadDe(t.p.id);
      btn.classList.toggle('en-pedido', n > 0);
      $('.mas__n', btn).textContent = n || '';
      const tieneVar = t.p.variantes && t.p.variantes.length;
      if (n > 0) btn.setAttribute('aria-label', 'En tu pedido (' + n + '). ' + (tieneVar ? 'Elegir otra versión de ' + t.p.nombre : 'Agregar otro'));
      else btn.setAttribute('aria-label', tieneVar ? 'Elegir versión de ' + t.p.nombre : 'Agregar ' + t.p.nombre + ' a Mi pedido');
    });
  };

  /* ==========================================================================
     Científicos
     ========================================================================== */
  function armarCientificos() {
    const lista = $('#cientificos-lista');
    lista.innerHTML = datos.cientificos.map((c) => {
      // la cita de Galileo es null (atribución dudosa): no se muestra cita ni hueco
      const cita = c.cita ? '<p class="cient__cita">«' + esc(c.cita) + '»</p>' : '';
      return '<li class="cient reveal"><figure class="cient__foto"><img src="' + esc(chica(c.foto)) + '" alt="Retrato en línea de ' + esc(c.nombre) + '" width="720" height="900" loading="lazy" decoding="async"></figure>' +
        '<div class="cient__panel">' + (ROLES[c.id] ? '<p class="t-micro cient__rol">' + esc(ROLES[c.id]) + '</p>' : '') +
        '<h3 class="t-h3 cient__nombre">' + esc(c.nombre) + '</h3>' +
        '<p class="t-micro cient__pais"><span class="sr-only">Nació en ' + esc(c.nacimiento) + '. </span>' + esc(c.pais) + ' · ' + esc(c.nacimiento) + '</p>' +
        cita + '<p class="cient__bio">' + esc(c.bio) + '</p></div></li>';
    }).join('');
    BS.observar(lista);
    const riel = $('#riel'), puntos = $('#puntos-cient');
    const n = datos.cientificos.length;
    if (!n) { const sec = $('#cientificos'); if (sec) sec.hidden = true; return; }
    const prev = $('#cient-prev'), next = $('#cient-next');
    puntos.innerHTML = Array.from({ length: n }, (_, i) => '<i' + (i === 0 ? ' class="on"' : '') + '></i>').join('');
    const pasoDe = () => {
      const primera = lista.firstElementChild; if (!primera) return 0;
      return primera.getBoundingClientRect().width + (parseFloat(getComputedStyle(lista).columnGap) || 16);
    };
    /* Botones anterior / siguiente (aria-disabled y no disabled, para que el foco no se pierda al llegar a un extremo) */
    function estadoBotones() {
      const max = riel.scrollWidth - riel.clientWidth;
      prev.setAttribute('aria-disabled', String(riel.scrollLeft <= 2));
      next.setAttribute('aria-disabled', String(riel.scrollLeft >= max - 2));
    }
    /* La región solo entra en el recorrido de Tab si de verdad se desplaza (debajo de 1240 px) */
    function ajustarRiel() {
      const desplaza = riel.scrollWidth > riel.clientWidth + 1;
      if (desplaza) riel.setAttribute('tabindex', '0'); else riel.removeAttribute('tabindex');
      estadoBotones();
    }
    const mover = (dir) => () => {
      const max = riel.scrollWidth - riel.clientWidth;
      if (dir < 0 ? riel.scrollLeft <= 2 : riel.scrollLeft >= max - 2) return;
      riel.scrollBy({ left: dir * pasoDe(), behavior: BS.reducido() ? 'auto' : 'smooth' });
    };
    prev.addEventListener('click', mover(-1)); next.addEventListener('click', mover(1));
    window.addEventListener('resize', ajustarRiel, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(ajustarRiel).observe(riel);
    ajustarRiel();
    let t = false;
    riel.addEventListener('scroll', () => {
      if (t) return; t = true;
      requestAnimationFrame(() => {
        t = false;
        const paso = pasoDe() || 1;
        const max = riel.scrollWidth - riel.clientWidth;
        let i = Math.round(riel.scrollLeft / paso);
        if (max > 0 && riel.scrollLeft >= max - 4) i = n - 1;
        $$('i', puntos).forEach((d, k) => d.classList.toggle('on', k === Math.min(i, n - 1)));
        estadoBotones();
      });
    }, { passive: true });
  }

  /* ==========================================================================
     Ficha de producto
     ========================================================================== */
  const capaFicha = $('#capa-ficha'), fichaEl = $('#ficha'), fichaCont = $('#ficha-contenido');
  let fichaId = null, fichaPush = false, sel = { v: null, q: 1 };
  let editando = null;          // {id, key, v, q}: la fila de Mi pedido que se está cambiando desde la ficha
  const LO_DECIDO = 'Lo decido por mensaje';

  function relacionados(p) {
    const mismos = productos.filter((x) => x.id !== p.id && x.categoria === p.categoria);
    const otros = productos.filter((x) => x.id !== p.id && x.categoria !== p.categoria);
    return mismos.concat(otros).slice(0, 3);
  }
  function listaNav() { return visibles.includes(fichaId) ? visibles : productos.map((p) => p.id); }

  function renderFicha(p) {
    sel = { v: null, q: 1 };
    const fotos = p.fotos || [];
    const tieneVar = p.variantes && p.variantes.length;
    let galeria;
    if (fotos.length) {
      galeria = '<div class="galeria__riel" tabindex="0" role="group" aria-roledescription="carrusel" aria-label="Fotos de ' + esc(p.nombre) + '">' +
        fotos.map((f, i) => '<figure class="galeria__slide" role="group" aria-label="Foto ' + (i + 1) + ' de ' + fotos.length + '"><img src="' + esc(f) + '" alt="' + esc(altDe(f, p)) + '" width="720" height="900" ' + (i ? 'loading="lazy" ' : '') + 'decoding="async" style="object-position:' + BS.posFoto(f) + '"></figure>').join('') + '</div>' +
        (fotos.length > 1 ? '<div class="galeria__thumbs">' + fotos.map((f, i) => '<button type="button" data-foto="' + i + '" aria-label="Ver foto ' + (i + 1) + ' de ' + fotos.length + '"' + (i === 0 ? ' aria-current="true"' : '') + '><img src="' + esc(chica(f)) + '" alt="" width="56" height="70"></button>').join('') + '</div>' +
          '<div class="galeria__puntos" aria-hidden="true">' + fotos.map((_, i) => '<i' + (i === 0 ? ' class="on"' : '') + '></i>').join('') + '</div>' : '');
    } else {
      galeria = '<div class="sin-foto"><div class="sin-foto__c">' + ico(iconoSinFoto(p)) + '</div><span class="sin-foto__txt t-micro">Foto en camino</span></div>';
    }
    const sello = (p.id === 'canguro' || p.id === 'tote') ? '<span class="sello" aria-hidden="true">In my scientific era</span>' : '';

    let variantes = '';
    if (tieneVar) {
      const pastilla = (v, idx) => {
        const col = COLORES[v];
        const dots = col ? '<span class="dots" aria-hidden="true">' + col.map((c) => '<i style="--c:var(' + c + ')"></i>').join('') + '</span>' : '';
        return '<button type="button" role="radio" aria-checked="false" tabindex="' + (idx === 0 ? '0' : '-1') + '" class="pastilla" data-v="' + esc(v) + '">' + dots + '<span>' + esc(v) + '</span>' + ico('ui-check') + '</button>';
      };
      variantes = '<div class="variantes" id="variantes"><div class="variantes__tit"><p class="t-micro" id="var-tit">Elegí tu versión</p>' +
        '<p class="nota t-mano" aria-hidden="true"><span class="nota__txt">Elegí la tuya</span><span class="flecha" data-flecha="corta"></span></p></div>' +
        '<div class="variantes__lista" role="radiogroup" aria-labelledby="var-tit" aria-required="true">' + p.variantes.map((v, i) => pastilla(v, i)).join('') + pastilla(LO_DECIDO, 1) + '</div>' +
        '<p class="error-var" id="error-var" role="alert" hidden>Elegí una versión para sumarlo a tu pedido.</p></div>';
    }
    let nota = '';
    if (p.id === 'taza-personalizada') nota = 'Contanos tu idea y diseñamos tu taza juntos.';
    else if (p.categoria === 'tazas') nota = 'Tazas de vidrio transparente. Con café negro los dibujos se esconden y, con leche, aparecen.';
    else if (p.id === 'canguro') nota = 'Con el canguro, la tote va de regalo 🎁';
    const notaConfirmar = p.confirmar ? '<p class="ficha__nota ficha__nota--confirmar">Consultanos la disponibilidad antes de pedirlo.</p>' : '';
    const cintas = (p.etiquetas || []).length ? '<div class="ficha__cintas">' + p.etiquetas.map((e, i) => '<span class="cinta' + (i % 2 ? ' cinta--tinta' : '') + '">' + esc(e) + '</span>').join('') + '</div>' : '';
    const rel = relacionados(p);
    const relHTML = '<nav class="relacionados" aria-label="También te puede gustar"><p class="t-micro">También te puede gustar</p><ul>' + rel.map((r) =>
      '<li><a class="rel" href="#' + esc(r.id) + '"><span class="rel__foto">' + (r.fotos && r.fotos[0] ? '<img src="' + esc(chica(r.fotos[0])) + '" alt="" width="144" height="180" loading="lazy" style="object-position:' + BS.posFoto(r.fotos[0]) + '">' : ico(iconoSinFoto(r))) + '</span><span>' + esc(r.nombre) + '</span></a></li>').join('') + '</ul></nav>';

    fichaCont.innerHTML =
      '<div class="ficha__scroll" id="ficha-scroll">' +
      '<div class="galeria">' + galeria + sello + '</div>' +
      '<div class="ficha__info">' + cintas +
      '<p class="t-micro ficha__cat">' + esc(catNombre(p.categoria)) + '</p>' +
      '<h2 class="t-h2 ficha__nombre" id="ficha-nombre">' + esc(p.nombre) + '</h2>' +
      (p.resumen ? '<p class="t-lead">' + esc(p.resumen) + '</p>' : '') +
      (p.descripcion ? '<p>' + esc(p.descripcion) + '</p>' : '') +
      variantes +
      '<div class="ficha__precio">' + BS.precioHTML(p) + (typeof p.precio === 'number' ? '' : '<small>Escribinos y te lo pasamos</small>') + '</div>' +
      '<div class="ficha__sec"><button type="button" class="btn" data-pedir-ig>' + ico('ui-instagram') + 'Pedir este por Instagram</button>' +
      '<button type="button" class="btn btn--enlace" data-copiar-enlace>' + ico('ui-enlace') + 'Copiar enlace</button></div>' +
      (nota ? '<p class="ficha__nota">' + esc(nota) + '</p>' : '') + notaConfirmar +
      relHTML +
      '<div class="ficha__nav"><button type="button" class="btn btn--enlace" data-nav="-1">' + ico('ui-izquierda') + 'Anterior</button><button type="button" class="btn btn--enlace" data-nav="1">Siguiente' + ico('ui-derecha') + '</button></div>' +
      '</div></div>' +
      '<div class="ficha__barra"><div class="cantidad" role="group" aria-label="Cantidad">' +
      '<button type="button" data-q="-1" aria-label="Quitar una unidad" disabled>' + ico('ui-menos') + '</button><output id="ficha-q" aria-live="polite">1</output>' +
      '<button type="button" data-q="1" aria-label="Sumar una unidad">' + ico('ui-mas') + '</button></div>' +
      '<button type="button" class="btn btn--amarillo btn--grande" id="ficha-agregar" data-agregar>Agregar a Mi pedido</button></div>';
    fichaEl.setAttribute('aria-labelledby', 'ficha-nombre');
    if (BS.armarFlechas) BS.armarFlechas(fichaCont);
    BS.observar(fichaCont);
    $$('#ficha-scroll .flecha', fichaCont).forEach((f) => f.classList.add('is-in'));
    const r = $('.galeria__riel', fichaCont);
    if (r) {
      let t = false;
      r.addEventListener('scroll', () => {
        if (t) return; t = true;
        requestAnimationFrame(() => {
          t = false;
          const i = Math.round(r.scrollLeft / r.clientWidth);
          $$('.galeria__puntos i', fichaCont).forEach((d, k) => d.classList.toggle('on', k === i));
          $$('.galeria__thumbs button', fichaCont).forEach((b, k) => { if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
        });
      }, { passive: true });
    }
    $('#ficha-scroll', fichaCont).scrollTop = 0;
    const info = $('.ficha__info', fichaCont); if (info) info.scrollTop = 0;
    // «Cambiar versión» desde Mi pedido: llega con la versión y la cantidad de esa fila ya elegidas
    if (editando && editando.id === p.id) {
      const pas = $$('.pastilla', fichaCont).find((b) => b.dataset.v === editando.v);
      if (pas) elegirVariante(pas);
      sel.q = Math.min(20, Math.max(1, editando.q || 1)); actualizarCantidad();
      const ag = $('#ficha-agregar'); if (ag) ag.textContent = 'Guardar cambios';
    }
  }

  function abrirFicha(id, opciones) {
    const p = producto(id); if (!p) return;
    opciones = opciones || {};
    const yaAbierta = BS.capas.estaAbierta(capaFicha);
    const cambia = yaAbierta && fichaId !== id;
    if (opciones.editar) editando = { id: id, key: opciones.editar.key, v: opciones.editar.v, q: opciones.editar.q };
    else if (fichaId !== id) editando = null;
    fichaId = id;
    renderFicha(p);
    if (cambia && !BS.reducido()) fichaCont.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: EASE_OUT });
    if (!yaAbierta) {
      if (BS.cerrarMenu) BS.cerrarMenu(true);
      if (opciones.desdeHash) { const cat = $('#catalogo'); if (cat) cat.scrollIntoView({ behavior: 'instant' }); }
      BS.capas.abrir({ el: capaFicha, cerrar: cerrarFicha, foco: $('#ficha-cerrar'), volverA: opciones.volverA || (document.activeElement && document.activeElement !== document.body ? document.activeElement : tarjetas.get(id) && $('.tarjeta__enlace', tarjetas.get(id).el)) });
    } else if (opciones.enfocarCerrar) { $('#ficha-cerrar').focus(); }
    // dirección
    if (!opciones.sinHash) {
      const hash = '#' + id;
      if (opciones.desdeHash) { fichaPush = !!opciones.desdeHistorial; }
      else if (yaAbierta) history.replaceState({ ficha: id }, '', hash);
      else { history.pushState({ ficha: id }, '', hash); fichaPush = true; }
    }
    if (opciones.desdePedido) {
      const v = $('#variantes .pastilla[aria-checked="true"]') || $('#variantes .pastilla'); if (v) setTimeout(() => v.focus(), 60);
    }
  }
  BS.abrirFicha = abrirFicha;

  function cerrarFichaUI() {
    if (!BS.capas.estaAbierta(capaFicha)) return;
    fichaId = null; editando = null;
    BS.capas.cerrar(capaFicha);
  }
  function cerrarFicha() {
    if (!BS.capas.estaAbierta(capaFicha)) return;
    if (fichaPush && history.state && history.state.ficha) {
      fichaPush = false;
      cerrarFichaUI();
      history.back();
    } else {
      cerrarFichaUI();
      if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    }
  }

  function elegirVariante(btn) {
    const lista = btn.closest('[role="radiogroup"]');
    $$('.pastilla', lista).forEach((b) => { const on = b === btn; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; });
    sel.v = btn.dataset.v;
    const e = $('#error-var'); if (e) e.hidden = true;
  }
  function actualizarCantidad() {
    $('#ficha-q').textContent = sel.q;
    $('[data-q="-1"]', fichaCont).disabled = sel.q <= 1;
    $('[data-q="1"]', fichaCont).disabled = sel.q >= 20;
  }
  function falloVariante() {
    const caja = $('#variantes'); if (!caja) return false;
    caja.classList.remove('tiembla'); void caja.offsetWidth; caja.classList.add('tiembla');
    const e = $('#error-var'); e.hidden = false;
    const ya = $('.pastilla[aria-checked="true"]', caja) || $('.pastilla', caja);
    // el grupo recibe el foco para que el aviso se lea
    const lista = $('[role="radiogroup"]', caja);
    $$('.pastilla', lista).forEach((b, i) => { b.tabIndex = i === 0 ? 0 : -1; });
    $('.pastilla', lista).focus();
    return true;
  }
  function alAgregar() {
    const p = producto(fichaId); if (!p) return;
    if (p.variantes && p.variantes.length && !sel.v) { falloVariante(); return; }
    if (editando && editando.id === p.id) {
      // viene de «Cambiar versión»: reemplaza esa fila de Mi pedido (no suma otro producto) y vuelve al pedido
      const key = editando.key;
      BS.pedido.reemplazar(key, p.id, sel.v, sel.q);
      cerrarFicha();
      BS.pedido.abrir({ volverA: $('#btn-pedido') });
      return;
    }
    const foto = $('.galeria__slide img', fichaCont) ? (function () {
      const r = $('.galeria__riel', fichaCont); const i = r ? Math.round(r.scrollLeft / r.clientWidth) : 0;
      return $$('.galeria__slide img', fichaCont)[i] || $('.galeria__slide img', fichaCont);
    })() : $('.galeria .sin-foto__c', fichaCont);
    BS.pedido.agregar(p.id, sel.v, sel.q, foto);
    const b = $('#ficha-agregar');
    b.textContent = 'Agregado ✓';
    setTimeout(() => { const bb = $('#ficha-agregar'); if (bb) bb.textContent = 'Agregar a Mi pedido'; }, 1600);
  }

  function iniciarFicha() {
    $('#ficha-cerrar').addEventListener('click', cerrarFicha);
    $('[data-cerrar="ficha"]').addEventListener('click', cerrarFicha);
    fichaEl.addEventListener('click', (e) => {
      const t = e.target.closest('button, a'); if (!t) return;
      if (t.matches('.pastilla')) { elegirVariante(t); return; }
      if (t.dataset.q) { sel.q = Math.min(20, Math.max(1, sel.q + Number(t.dataset.q))); actualizarCantidad(); return; }
      if (t.hasAttribute('data-agregar')) { alAgregar(); return; }
      if (t.hasAttribute('data-pedir-ig')) {
        const p = producto(fichaId); if (!p) return;
        if (p.variantes && p.variantes.length && !sel.v) { falloVariante(); return; }
        BS.pedido.enviar(BS.pedido.mensajeUno(p, sel.v, sel.q), true); return;
      }
      if (t.hasAttribute('data-copiar-enlace')) {
        BS.copiar(location.origin + location.pathname + '#' + fichaId).then((ok) => {
          if (ok) BS.aviso({ tipo: 'chico', titulo: 'Enlace copiado. Pasalo por historias 🫶🏼', duracion: 3000 });
          else BS.aviso({ tipo: 'error', titulo: 'No pudimos copiarlo solos', texto: 'Copiá el enlace de acá abajo.', mensaje: location.origin + location.pathname + '#' + fichaId });
        });
        return;
      }
      if (t.dataset.nav) {
        const l = listaNav(); const i = l.indexOf(fichaId);
        const sig = l[(i + Number(t.dataset.nav) + l.length) % l.length];
        abrirFicha(sig, { enfocarCerrar: false }); return;
      }
      if (t.dataset.foto != null) {
        const r = $('.galeria__riel', fichaCont); r.scrollTo({ left: Number(t.dataset.foto) * r.clientWidth, behavior: BS.reducido() ? 'auto' : 'smooth' }); return;
      }
      if (t.matches('a.rel')) { e.preventDefault(); abrirFicha(t.getAttribute('href').slice(1)); }
    });
    // flechas dentro del grupo de variantes (patrón radiogroup)
    fichaEl.addEventListener('keydown', (e) => {
      const r = e.target.closest && e.target.closest('.pastilla');
      if (r && ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault(); e.stopPropagation();
        const lista = $$('.pastilla', r.parentElement); let i = lista.indexOf(r);
        i = (i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + lista.length) % lista.length;
        lista[i].focus(); elegirVariante(lista[i]);
        return;
      }
      if (r && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); elegirVariante(r); }
    });
    document.addEventListener('keydown', (e) => {
      if (!BS.capas.estaAbierta(capaFicha) || e.defaultPrevented) return;
      if (BS.capas.abiertas() > 1 && !BS.capas.estaAbierta(capaFicha)) return;
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const el = e.target;
      if (el.closest && (el.closest('.galeria__riel') || el.closest('input, textarea, select') || el.closest('[role="radiogroup"]'))) return;
      if ($('#capa-pedido') && !$('#capa-pedido').hidden) return;
      const l = listaNav(); const i = l.indexOf(fichaId);
      abrirFicha(l[(i + (e.key === 'ArrowRight' ? 1 : -1) + l.length) % l.length]);
    });
  }

  /* ==========================================================================
     Enlace directo (#id) y navegación
     ========================================================================== */
  function mostrarAvisoNoExiste() {
    $('#aviso-catalogo').innerHTML = '<div class="aviso-cat" role="alert"><h3 class="t-h3">Ese producto no está en el catálogo</h3>' +
      '<p>Capaz el enlace cambió. Mirá todo lo que tenemos o escribinos por Instagram.</p>' +
      '<div class="vacio__botones"><button type="button" class="btn btn--amarillo" data-aviso-ok>Ver el catálogo</button>' +
      '<a class="btn" href="' + esc(BS.IG) + '" target="_blank" rel="noopener" data-consulta="general">Escribir por Instagram</a></div></div>';
    const c = $('#catalogo'); if (c) c.scrollIntoView({ behavior: 'instant' });
  }
  const safeGetById = (id) => { try { return document.getElementById(id); } catch (e) { return null; } };
  function sync(inicial) {
    const id = BS.decodificar(location.hash.slice(1));      // un «%» mal formado no rompe: se toma como un producto que no existe
    if (!id) {
      if (BS.capas.estaAbierta(capaFicha)) cerrarFichaUI();
      return;
    }
    const p = producto(id);
    if (p) {
      $('#aviso-catalogo').innerHTML = '';
      if (fichaId !== id || !BS.capas.estaAbierta(capaFicha)) abrirFicha(id, { desdeHash: true, desdeHistorial: !inicial, sinHash: false });
      return;
    }
    if (BS.capas.estaAbierta(capaFicha)) cerrarFichaUI();
    if (!safeGetById(id)) mostrarAvisoNoExiste();
  }

  BS.irAlCatalogo = function () {
    const c = $('#catalogo'); if (c) c.scrollIntoView({ behavior: BS.reducido() ? 'auto' : 'smooth' });
  };

  function iniciarEventos() {
    iniciarFicha();
    // buscador
    const campo = $('#buscar'); let t = 0;
    campo.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { estado.q = campo.value; aplicarFiltro(); }, 120); });
    $('#buscar-borrar').addEventListener('click', () => { campo.value = ''; estado.q = ''; aplicarFiltro(); campo.focus(); });
    campo.addEventListener('keydown', (e) => { if (e.key === 'Escape' && campo.value) { e.preventDefault(); campo.value = ''; estado.q = ''; aplicarFiltro(); } });
    $('#vacio-todo').addEventListener('click', () => { campo.value = ''; estado.q = ''; elegirCategoria('todos'); });
    // botón +
    $('#grilla').addEventListener('click', (e) => {
      const b = e.target.closest('[data-mas]'); if (!b) return;
      const li = b.closest('.tarjeta'); const p = producto(li.dataset.id); if (!p) return;
      e.preventDefault();
      if (p.variantes && p.variantes.length) { abrirFicha(p.id, { volverA: b, enfocarCerrar: false, desdePedido: false }); setTimeout(() => { const v = $('#variantes .pastilla'); if (v) v.focus(); }, 80); return; }
      BS.pedido.agregar(p.id, null, 1, $('.tarjeta__foto img', li) || $('.tarjeta__foto', li));
      b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
    });
    // enlaces #producto en toda la página abren la ficha sin salto
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]'); if (!a) return;
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      const id = BS.decodificar(a.getAttribute('href').slice(1));
      if (producto(id)) { e.preventDefault(); abrirFicha(id, { volverA: a }); }
    });
    // botones y enlaces que activan un filtro
    document.addEventListener('click', (e) => {
      const f = e.target.closest('[data-filtro]'); if (!f) return;
      e.preventDefault();
      $('#buscar').value = ''; estado.q = '';
      BS.irAlCatalogo();
      elegirCategoria(f.dataset.filtro, { sinCentrar: false });
    });
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-aviso-ok]')) { $('#aviso-catalogo').innerHTML = ''; history.replaceState(null, '', location.pathname + location.search); BS.irAlCatalogo(); }
    });
    window.addEventListener('popstate', () => sync(false));
    window.addEventListener('hashchange', () => sync(false));
  }

  cargar();
})();
