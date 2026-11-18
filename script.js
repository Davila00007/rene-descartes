/* =========================================================
   René Descartes · Matemáticos de la historia con IA
   JavaScript (vanilla, sin librerías)
   Contenido:
     1. Barra de progreso, cabecera y botón "subir"
     2. Menú responsive y enlace activo
     3. Aparición de elementos al hacer scroll
     4. Video y podcast (aviso si falta el archivo)
     5. Línea de tiempo interactiva   → edita el arreglo TIMELINE
     6. Plano cartesiano interactivo
     7. Quiz                          → edita el arreglo QUIZ
     8. Pestañas de los tres sueños
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. Progreso, cabecera y botón subir ---------- */
  const progressBar = document.getElementById("progressBar");
  const header = document.getElementById("siteHeader");
  const toTop = document.getElementById("toTop");

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progressBar.style.width = pct + "%";
    header.classList.toggle("is-scrolled", window.scrollY > 10);
    toTop.hidden = window.scrollY < 700;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- 2. Menú responsive y enlace activo ---------- */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = navMenu.querySelectorAll("a");

  navToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  // Cierra el menú en celular al elegir una sección
  navLinks.forEach(link => link.addEventListener("click", () => {
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }));

  // Resalta en el menú la sección que se está viendo
  const sections = [...navLinks].map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(s => sectionObserver.observe(s));

  /* ---------- 3. Aparición progresiva al hacer scroll ---------- */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  /* ---------- 4. Video y podcast ---------- */
  // Si el archivo todavía no existe, se muestra un aviso en lugar de un reproductor vacío.
  function watchMedia(mediaId, noticeId, onPlay, onStop) {
    const media = document.getElementById(mediaId);
    const notice = document.getElementById(noticeId);
    if (!media) return;
    const source = media.querySelector("source");
    const showMissing = () => { notice.hidden = false; };
    if (source) source.addEventListener("error", showMissing);
    media.addEventListener("error", showMissing);
    media.addEventListener("loadeddata", () => { notice.hidden = true; });
    // El error pudo ocurrir antes de que cargara este script: se revisa el estado
    const check = () => { if (media.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) showMissing(); };
    check(); setTimeout(check, 1500);
    if (onPlay) media.addEventListener("play", onPlay);
    if (onStop) { media.addEventListener("pause", onStop); media.addEventListener("ended", onStop); }
  }
  watchMedia("descartesVideo", "videoMissing");
  const cover = document.querySelector(".podcast__cover");
  watchMedia("podcastAudio", "audioMissing",
    () => cover.classList.add("is-playing"),
    () => cover.classList.remove("is-playing"));

  /* ---------- 5. Línea de tiempo ---------- */
  // Para agregar o cambiar un acontecimiento, edita este arreglo.
  // cat: "vida" | "obra" | "matematicas"
  const TIMELINE = [
    { year: "1596", cat: "vida", title: "Nacimiento en La Haye",
      text: "René Descartes nace el 31 de marzo en La Haye, Turena (Francia). El pueblo hoy se llama Descartes. Su madre muere poco más de un año después y lo cría su abuela." },
    { year: "1607", cat: "vida", title: "Colegio jesuita de La Flèche",
      text: "Hacia 1606–1607 entra al colegio de La Flèche, donde estudia lenguas clásicas, lógica, filosofía y matemáticas hasta 1614–1615. Las matemáticas le atraen por su certeza." },
    { year: "1616", cat: "vida", title: "Título en derecho",
      text: "Obtiene su título en derecho en la Universidad de Poitiers. Su familia esperaba que fuera abogado, pero decide viajar y conocer el mundo." },
    { year: "1618", cat: "matematicas", title: "Encuentro con Isaac Beeckman",
      text: "Como voluntario en el ejército de Mauricio de Nassau, en Breda, conoce al científico Isaac Beeckman. Juntos trabajan en problemas de física y matemáticas. Para él escribe el Compendium Musicae, sobre teoría de la música." },
    { year: "1619", cat: "vida", title: "Los tres sueños",
      text: "En la noche del 10 al 11 de noviembre, mientras sirve en el ejército bávaro, tiene tres sueños que interpreta como un llamado a buscar un nuevo método para todo el conocimiento." },
    { year: "1628", cat: "obra", title: "Se instala en los Países Bajos",
      text: "Tras vivir en París, se muda a la República Neerlandesa, donde trabajará unos veinte años con tranquilidad. Por esta época trabaja en las Reglas para la dirección del espíritu, una obra inconclusa que se publicó en 1701." },
    { year: "1633", cat: "obra", title: "Renuncia a publicar El mundo",
      text: "Tenía lista su obra de física El mundo, pero al conocer la condena de Galileo por la Iglesia decide no publicarla. Se editó en 1664, después de su muerte." },
    { year: "1637", cat: "matematicas", title: "Discurso del método y La Géométrie",
      text: "Publica en francés, sin su nombre, el Discurso del método, con tres ensayos: La Dióptrica, Los Meteoros y La Geometría. En esta última nace la geometría analítica. Aquí aparece también «Pienso, luego existo»." },
    { year: "1641", cat: "obra", title: "Meditaciones metafísicas",
      text: "Publica en latín las Meditaciones sobre la filosofía primera, con objeciones de otros pensadores y sus respuestas. Es su obra filosófica más famosa." },
    { year: "1643", cat: "vida", title: "Cartas con Isabel de Bohemia",
      text: "Comienza una larga correspondencia con la princesa Isabel de Bohemia, que le plantea preguntas profundas sobre la relación entre la mente y el cuerpo." },
    { year: "1644", cat: "obra", title: "Principios de la filosofía",
      text: "Publica los Principios de la filosofía, donde presenta su metafísica y su física de forma ordenada, como un libro de texto." },
    { year: "1649", cat: "obra", title: "Las pasiones del alma y viaje a Suecia",
      text: "Publica Las pasiones del alma, sobre las emociones. Ese año acepta la invitación de la reina Cristina de Suecia y viaja a Estocolmo." },
    { year: "1650", cat: "vida", title: "Muerte en Estocolmo",
      text: "Muere el 11 de febrero en Estocolmo, a los 53 años, según el diagnóstico de la época, de una neumonía." }
  ];
  const CAT_LABEL = { vida: "Vida", obra: "Obra", matematicas: "Matemáticas" };

  const track = document.getElementById("timelineTrack");
  const panel = document.getElementById("timelinePanel");
  const counter = document.getElementById("tlCounter");
  const prevBtn = document.getElementById("tlPrev");
  const nextBtn = document.getElementById("tlNext");
  let tlIndex = 0;

  TIMELINE.forEach((ev, i) => {
    const btn = document.createElement("button");
    btn.className = "tl-dot";
    btn.type = "button";
    btn.textContent = ev.year;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-label", ev.year + ": " + ev.title);
    btn.addEventListener("click", () => showEvent(i));
    track.appendChild(btn);
  });

  function showEvent(i) {
    tlIndex = i;
    const ev = TIMELINE[i];
    track.querySelectorAll(".tl-dot").forEach((b, j) => {
      b.classList.toggle("is-active", j === i);
      b.setAttribute("aria-selected", String(j === i));
      b.tabIndex = j === i ? 0 : -1;
    });
    panel.innerHTML = `
      <div class="tl-year">${ev.year}</div>
      <div>
        <span class="tl-cat tl-cat--${ev.cat}">${CAT_LABEL[ev.cat]}</span>
        <h3>${ev.title}</h3>
        <p>${ev.text}</p>
      </div>`;
    panel.classList.remove("is-changing");
    void panel.offsetWidth; // reinicia la animación
    panel.classList.add("is-changing");
    counter.textContent = `${i + 1} / ${TIMELINE.length}`;
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === TIMELINE.length - 1;
    // Desplaza horizontalmente la línea sin mover la página
    const active = track.children[i];
    track.scrollTo({ left: active.offsetLeft - track.clientWidth / 2 + active.clientWidth / 2, behavior: "smooth" });
  }
  prevBtn.addEventListener("click", () => tlIndex > 0 && showEvent(tlIndex - 1));
  nextBtn.addEventListener("click", () => tlIndex < TIMELINE.length - 1 && showEvent(tlIndex + 1));
  track.addEventListener("keydown", e => {
    if (e.key === "ArrowRight" && tlIndex < TIMELINE.length - 1) { showEvent(tlIndex + 1); track.children[tlIndex].focus(); }
    if (e.key === "ArrowLeft" && tlIndex > 0) { showEvent(tlIndex - 1); track.children[tlIndex].focus(); }
  });
  showEvent(0);

  /* ---------- 6. Plano cartesiano interactivo ---------- */
  const canvas = document.getElementById("planeCanvas");
  const readout = document.getElementById("planeReadout");
  const ctx = canvas.getContext("2d");
  const RANGE = 7;                       // el plano va de -7 a 7
  const SIZE = canvas.width;
  const unit = SIZE / (2 * RANGE);
  const toPx = (x, y) => [SIZE / 2 + x * unit, SIZE / 2 - y * unit];
  const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  function drawPlane(point) {
    ctx.clearRect(0, 0, SIZE, SIZE);
    // cuadrícula
    ctx.strokeStyle = "rgba(168,134,58,.25)"; ctx.lineWidth = 1;
    for (let k = -RANGE; k <= RANGE; k++) {
      const [px] = toPx(k, 0), [, py] = toPx(0, k);
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(SIZE, py); ctx.stroke();
    }
    // ejes
    ctx.strokeStyle = css("--ink"); ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(0, SIZE / 2); ctx.lineTo(SIZE, SIZE / 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(SIZE / 2, 0); ctx.lineTo(SIZE / 2, SIZE); ctx.stroke();
    ctx.fillStyle = css("--ink"); ctx.font = "italic 16px Georgia";
    ctx.fillText("x", SIZE - 16, SIZE / 2 - 8); ctx.fillText("y", SIZE / 2 + 8, 16);
    ctx.font = "11px Georgia";
    for (let k = -6; k <= 6; k += 2) if (k) {
      const [px] = toPx(k, 0); ctx.fillText(k, px - 4, SIZE / 2 + 14);
      const [, py] = toPx(0, k); ctx.fillText(k, SIZE / 2 + 5, py + 4);
    }
    // circunferencia x² + y² = 25
    ctx.strokeStyle = css("--blue"); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(SIZE / 2, SIZE / 2, 5 * unit, 0, Math.PI * 2); ctx.stroke();
    // recta y = x + 1
    ctx.strokeStyle = css("--crimson");
    const a = toPx(-RANGE, -RANGE + 1), b = toPx(RANGE, RANGE + 1);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    // puntos de corte
    [[3, 4], [-4, -3]].forEach(([x, y]) => {
      const [px, py] = toPx(x, y);
      ctx.fillStyle = css("--gold"); ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = css("--ink"); ctx.lineWidth = 1.2; ctx.stroke();
    });
    // punto del usuario
    if (point) {
      const [px, py] = toPx(point.x, point.y);
      ctx.setLineDash([4, 4]); ctx.strokeStyle = css("--green"); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, SIZE / 2); ctx.moveTo(px, py); ctx.lineTo(SIZE / 2, py); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = css("--green"); ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
    }
  }

  function fmt(n) { return (Math.round(n * 10) / 10).toString().replace("-", "−"); }

  function readPoint(evt) {
    const r = canvas.getBoundingClientRect();
    let x = ((evt.clientX - r.left) / r.width) * 2 * RANGE - RANGE;
    let y = RANGE - ((evt.clientY - r.top) / r.height) * 2 * RANGE;
    // "Imán": si estás cerca de un número entero, se ajusta a él
    if (Math.abs(x - Math.round(x)) < 0.18) x = Math.round(x);
    if (Math.abs(y - Math.round(y)) < 0.18) y = Math.round(y);
    const onCircle = Math.abs(x * x + y * y - 25) < 0.6;
    const onLine = Math.abs(y - (x + 1)) < 0.15;
    let msg = `Punto (${fmt(x)}, ${fmt(y)})`;
    if (onCircle && onLine) msg += " — ¡está en las dos figuras! Es un punto de corte.";
    else if (onCircle) msg += ` — está en la circunferencia: ${fmt(x)}² + ${fmt(y)}² ≈ 25`;
    else if (onLine) msg += ` — está en la recta: ${fmt(y)} = ${fmt(x)} + 1`;
    else msg += ` — x² + y² = ${fmt(x * x + y * y)}`;
    readout.textContent = msg;
    drawPlane({ x, y });
  }
  canvas.addEventListener("pointermove", readPoint);
  canvas.addEventListener("pointerdown", readPoint);
  drawPlane();

  /* ---------- 7. Quiz ---------- */
  // Para cambiar preguntas: edita este arreglo. "answer" es el índice (0 a 3) de la opción correcta.
  const QUIZ = [
    { q: "¿En qué lugar nació René Descartes?",
      options: ["París, Francia", "La Haye, Turena (hoy llamada Descartes)", "Ámsterdam, Países Bajos", "Estocolmo, Suecia"],
      answer: 1, why: "Nació en 1596 en La Haye, en Turena. En su honor, el pueblo hoy se llama Descartes." },
    { q: "¿En qué colegio estudió Descartes de joven?",
      options: ["La Sorbona de París", "El colegio jesuita de La Flèche", "La Universidad de Oxford", "La Academia de Platón"],
      answer: 1, why: "Estudió en el colegio jesuita de La Flèche, uno de los más prestigiosos de Francia." },
    { q: "¿A quién conoció en Breda en 1618, que lo animó a estudiar física y matemáticas?",
      options: ["Galileo Galilei", "Isaac Newton", "Isaac Beeckman", "Pierre de Fermat"],
      answer: 2, why: "Isaac Beeckman le propuso problemas de física y matemáticas. Newton aún no había nacido." },
    { q: "¿En qué obra apareció La Géométrie en 1637?",
      options: ["Como apéndice del Discurso del método", "Dentro de las Meditaciones metafísicas", "En los Principios de la filosofía", "En Las pasiones del alma"],
      answer: 0, why: "La Géométrie fue uno de los tres ensayos publicados junto al Discurso del método." },
    { q: "¿Cuál es la idea central de la geometría analítica?",
      options: ["Medir ángulos solo con transportador", "Traducir problemas geométricos a ecuaciones algebraicas", "Calcular áreas usando únicamente triángulos", "Reemplazar los números por figuras"],
      answer: 1, why: "Descartes convirtió figuras en ecuaciones: resolver la ecuación resuelve el problema geométrico." },
    { q: "¿Qué letras usó Descartes para las cantidades desconocidas, como hacemos hoy?",
      options: ["a, b, c", "p, q, r", "α, β, γ", "x, y, z"],
      answer: 3, why: "Usó x, y, z para las incógnitas y a, b, c para las cantidades conocidas." },
    { q: "¿Qué matemático desarrolló ideas de geometría analítica de forma independiente, en la misma época?",
      options: ["Pierre de Fermat", "Euclides", "Pitágoras", "Leonhard Euler"],
      answer: 0, why: "Fermat llegó a ideas muy similares por su cuenta. Euclides y Pitágoras vivieron en la Antigüedad y Euler, después." },
    { q: "Según la regla de los signos, ¿cuántas raíces positivas puede tener como máximo x³ − 3x² − x + 3?",
      options: ["0", "1", "2", "3"],
      answer: 2, why: "Los signos son + − − +: hay 2 cambios de signo. Y en efecto sus raíces positivas son 1 y 3." },
    { q: "¿En qué puntos se cortan x² + y² = 25 y y = x + 1?",
      options: ["(5, 0) y (0, 5)", "(3, 4) y (−4, −3)", "(1, 2) y (2, 3)", "(4, 3) y (−3, −4)"],
      answer: 1, why: "Al sustituir queda x² + x − 12 = 0, entonces x = 3 o x = −4, y los puntos son (3, 4) y (−4, −3)." },
    { q: "¿Dónde murió Descartes en 1650?",
      options: ["En Roma, visitando al papa", "En París, en su casa", "En Estocolmo, invitado por la reina Cristina", "En Breda, durante una batalla"],
      answer: 2, why: "Viajó a Suecia en 1649 por invitación de la reina Cristina y murió en Estocolmo el 11 de febrero de 1650." }
  ];

  const qEls = {
    start: document.getElementById("quizStart"), game: document.getElementById("quizGame"), end: document.getElementById("quizEnd"),
    startBtn: document.getElementById("quizStartBtn"), counter: document.getElementById("quizCounter"), score: document.getElementById("quizScore"),
    bar: document.getElementById("quizBar"), question: document.getElementById("quizQuestion"), options: document.getElementById("quizOptions"),
    feedback: document.getElementById("quizFeedback"), next: document.getElementById("quizNext"),
    finalScore: document.getElementById("quizFinalScore"), finalTitle: document.getElementById("quizFinalTitle"),
    finalText: document.getElementById("quizFinalText"), restart: document.getElementById("quizRestart")
  };
  let qIndex = 0, qScore = 0;

  function startQuiz() {
    qIndex = 0; qScore = 0;
    qEls.start.hidden = true; qEls.end.hidden = true; qEls.game.hidden = false;
    renderQuestion();
  }

  function renderQuestion() {
    const item = QUIZ[qIndex];
    qEls.counter.textContent = `Pregunta ${qIndex + 1} de ${QUIZ.length}`;
    qEls.score.textContent = `Puntos: ${qScore}`;
    qEls.bar.style.width = (qIndex / QUIZ.length) * 100 + "%";
    qEls.question.textContent = item.q;
    qEls.feedback.textContent = ""; qEls.feedback.className = "quiz__feedback";
    qEls.next.hidden = true;
    qEls.options.innerHTML = "";
    item.options.forEach((text, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz__option";
      btn.innerHTML = `<b>${"ABCD"[i]}</b><span></span>`;
      btn.querySelector("span").textContent = text;
      btn.addEventListener("click", () => answer(i));
      qEls.options.appendChild(btn);
    });
    qEls.game.classList.remove("quiz__game"); void qEls.game.offsetWidth; qEls.game.classList.add("quiz__game");
  }

  function answer(choice) {
    const item = QUIZ[qIndex];
    const buttons = qEls.options.querySelectorAll(".quiz__option");
    buttons.forEach(b => b.disabled = true);
    buttons[item.answer].classList.add("is-correct");
    if (choice === item.answer) {
      qScore++;
      qEls.feedback.textContent = "✓ ¡Correcto! " + item.why;
      qEls.feedback.classList.add("is-good");
    } else {
      buttons[choice].classList.add("is-wrong");
      qEls.feedback.textContent = "✗ No es correcto. " + item.why;
      qEls.feedback.classList.add("is-bad");
    }
    qEls.score.textContent = `Puntos: ${qScore}`;
    qEls.next.textContent = qIndex === QUIZ.length - 1 ? "Ver resultado →" : "Siguiente pregunta →";
    qEls.next.hidden = false;
    qEls.next.focus({ preventScroll: true });
  }

  function nextQuestion() {
    qIndex++;
    if (qIndex < QUIZ.length) renderQuestion();
    else showResult();
  }

  function showResult() {
    qEls.game.hidden = true; qEls.end.hidden = false;
    qEls.bar.style.width = "100%";
    qEls.finalScore.textContent = `${qScore}/${QUIZ.length}`;
    let title, text;
    if (qScore === QUIZ.length) { title = "¡Digno del propio Descartes!"; text = "Respuestas perfectas. Dominas su vida y su geometría."; }
    else if (qScore >= 7) { title = "Mente cartesiana"; text = "Muy buen resultado. Repasa los detalles que fallaste y lo tendrás todo."; }
    else if (qScore >= 4) { title = "Aprendiz de La Flèche"; text = "Vas por buen camino. Vuelve a la sección de aportes y a la línea de tiempo."; }
    else { title = "Es momento de dudar… y volver a leer"; text = "Como diría Descartes, dudar es el primer paso. Recorre la página y vuelve a intentarlo."; }
    qEls.finalTitle.textContent = title;
    qEls.finalText.textContent = text;
  }

  qEls.startBtn.addEventListener("click", startQuiz);
  qEls.next.addEventListener("click", nextQuestion);
  qEls.restart.addEventListener("click", startQuiz);

  /* ---------- 8. Pestañas de los tres sueños ---------- */
  const dreamTabs = document.querySelectorAll(".dreams__tab");
  function openDream(tab) {
    dreamTabs.forEach(t => {
      const active = t === tab;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", String(active));
      t.tabIndex = active ? 0 : -1;
      const panelEl = document.getElementById(t.dataset.dream);
      panelEl.hidden = !active;
      panelEl.classList.toggle("is-active", active);
    });
  }
  dreamTabs.forEach((tab, i) => {
    tab.addEventListener("click", () => openDream(tab));
    tab.addEventListener("keydown", e => {
      let j = null;
      if (e.key === "ArrowRight") j = (i + 1) % dreamTabs.length;
      if (e.key === "ArrowLeft") j = (i - 1 + dreamTabs.length) % dreamTabs.length;
      if (j !== null) { openDream(dreamTabs[j]); dreamTabs[j].focus(); }
    });
  });
});


/* =========================================================
   INTRO · Video de bienvenida (video/descartes-promo.mp4)
   - Botón "¿Y si nada fuera como parece?" → reproduce el video
   - Al terminar o al omitir → se muestra la página
   - Botón "Repetir video" en el inicio → vuelve a mostrarlo
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const start = document.getElementById("introStart");
  const play = document.getElementById("introPlay");
  const video = document.getElementById("introVideo");
  const skip = document.getElementById("introSkip");
  const skipStart = document.getElementById("introSkipStart");
  const replay = document.getElementById("replayIntro");
  if (!intro || !video) return;

  function playVideo() {
    start.hidden = true;
    video.hidden = false;
    skip.hidden = false;
    video.currentTime = 0;
    video.play().catch(closeIntro); // si el video no carga, entra a la página
  }

  function closeIntro() {
    video.pause();
    intro.classList.add("is-hidden");
    document.body.classList.remove("intro-active");
    // Después del fundido, deja la intro lista para "Repetir video"
    setTimeout(() => {
      video.hidden = true;
      skip.hidden = true;
      start.hidden = false;
    }, 800);
  }

  function openIntro() {
    window.scrollTo({ top: 0 });
    document.body.classList.add("intro-active");
    intro.classList.remove("is-hidden");
    playVideo();
  }

  play.addEventListener("click", playVideo);
  skip.addEventListener("click", closeIntro);
  skipStart.addEventListener("click", closeIntro);
  video.addEventListener("ended", closeIntro);
  video.addEventListener("error", closeIntro, true);
  if (replay) replay.addEventListener("click", openIntro);

  // La tecla Esc también omite la intro
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !intro.classList.contains("is-hidden")) closeIntro();
  });

  play.focus({ preventScroll: true });
});
