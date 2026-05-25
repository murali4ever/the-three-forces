/** The Three Forces — interactive web book */
(function () {
  const QUIZZES = {
    'electricity-1': [
      { q: 'What did the woman compare electricity to?', opts: ['A mountain', 'An invisible river', 'A horse'], a: 1 },
      { q: 'In old times, where was power usually created?', opts: ['Far away in space', 'Right where you used it (fire, steam)', 'Inside pockets'], a: 1 },
    ],
    'electricity-2': [
      { q: 'What are electrons?', opts: ['Tiny particles that can move and carry energy', 'A type of cloud', 'Wooden wheels'], a: 0 },
      { q: 'What did people first think lightning was?', opts: ['Deadly wrath from the sky', 'A pet animal', 'Paint'], a: 0 },
    ],
    'plastic-4': [
      { q: 'Plastic is made from…', opts: ['Moon rocks', 'Oil turned into new matter', 'Only sand'], a: 1 },
    ],
    'ai-3': [
      { q: 'The book calls AI the new…', opts: ['Chocolate', 'Electricity (for minds)', 'Bicycle'], a: 1 },
    ],
    'ai-10': [
      { q: 'The three revolutions freed humans from limits of…', opts: ['Muscle, materials, and routine thinking', 'Sleep, food, and water', 'Gravity only'], a: 0 },
    ],
  };

  const PART_LABELS = {
    welcome: 'Welcome',
    electricity: 'Part I — Electricity',
    plastic: 'Part II — Plastic',
    ai: 'Part III — Artificial Intelligence',
  };

  const PART_CHAPTER_COUNTS = { electricity: 8, plastic: 10, ai: 10 };
  const BOOK_DATA_VERSION = '3';

  let book = null;
  let chapterOrder = ['home'];

  async function init() {
    const res = await fetch(`data/book.json?v=${BOOK_DATA_VERSION}`);
    book = await res.json();
    syncBookMetadata();
    injectSupplemental();
    chapterOrder = ['home', ...book.chapters.map((c) => c.id)];
    buildNav();
    window.addEventListener('hashchange', render);
    document.getElementById('sidebarToggle')?.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });
    if (!document.querySelector('.reading-progress')) {
      const bar = document.createElement('div');
      bar.className = 'reading-progress';
      bar.innerHTML = '<div class="reading-progress-bar"></div>';
      document.body.prepend(bar);
    }
    window.addEventListener('scroll', updateProgress);
    render();
  }

  function syncBookMetadata() {
    const welcome = book.nav?.find((g) => g.label === 'Welcome');
    if (!welcome) return;
    welcome.items.forEach((item) => {
      if (item.id === 'cover') item.title = book.title;
      if (item.id === 'home') item.title = 'Overview';
    });
    const cover = book.chapters.find((c) => c.id === 'cover');
    if (cover) {
      cover.title = book.title;
    }
  }

  function navItemTitle(item) {
    if (item.id === 'cover') return book.title;
    if (item.id === 'home') return 'Overview';
    return item.title.replace(/^Chapter \d+ — /, '');
  }

  function injectSupplemental() {
    const meta = Supplemental.faqChapter;
    const welcomeNav = book.nav.find((g) => g.label === 'Welcome');
    if (welcomeNav && !welcomeNav.items.some((i) => i.id === meta.id)) {
      welcomeNav.items.push({
        id: meta.id,
        title: meta.title,
        emoji: meta.emoji,
      });
    }
    if (!book.chapters.some((c) => c.id === meta.id)) {
      const introIdx = book.chapters.findIndex((c) => c.id === 'introduction');
      const insertAt = introIdx >= 0 ? introIdx + 1 : book.chapters.length;
      book.chapters.splice(insertAt, 0, {
        id: meta.id,
        title: meta.title,
        part: meta.part,
        emoji: meta.emoji,
        sections: [{ type: 'story', paragraphs: [] }],
        supplemental: true,
      });
    }
  }

  function renderEditorialNote() {
    const n = Supplemental.preambleNote;
    return `
      <aside class="editorial-note" aria-label="${escapeHtml(n.title)}">
        <h2>${escapeHtml(n.title)}</h2>
        ${n.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
        <a href="#why-these-three" class="editorial-link">Read: Why these three? →</a>
      </aside>`;
  }

  function renderWhyThreeKid() {
    const w = Supplemental.whyTheseThree;
    return `
      <aside class="kid-corner" aria-label="${escapeHtml(w.kidTitle)}">
        <span class="kid-corner-icon">🧒</span>
        <div>
          <h4>${escapeHtml(w.kidTitle)}</h4>
          <p>${escapeHtml(w.kidText)}</p>
        </div>
      </aside>`;
  }

  function renderWhyThreeBox(includeLink) {
    const w = Supplemental.whyTheseThree;
    const layers = w.layers
      .map(
        (l) => `
        <div class="why-layer-card">
          <span class="layer-emoji">${l.emoji}</span>
          <strong>${escapeHtml(l.label)} · ${escapeHtml(l.name)}</strong>
          <span>${escapeHtml(l.line)}</span>
        </div>`
      )
      .join('');
    const rules = Supplemental.selectionRule.rules
      .map((r) => `<li>${escapeHtml(r)}</li>`)
      .join('');
    return `
      <section class="why-three-box" aria-label="${escapeHtml(w.title)}">
        <h2>${escapeHtml(w.title)}</h2>
        <p>${escapeHtml(w.adultIntro)}</p>
        <div class="why-three-layers">${layers}</div>
        <h3 style="font-size:0.85rem;margin:1rem 0 0.5rem;color:var(--text-muted)">${escapeHtml(Supplemental.selectionRule.title)}</h3>
        <ul class="selection-rule">${rules}</ul>
        <p>${escapeHtml(w.notClaiming)}</p>
        <p class="why-three-closing">${escapeHtml(w.closingLine)}</p>
        ${includeLink ? '<a href="#why-these-three" class="editorial-link">Full FAQ: other inventions & common questions →</a>' : ''}
      </section>`;
  }

  function renderWhyTheseThreePage() {
    const rows = Supplemental.otherInventions
      .map(
        (row) =>
          `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.response)}</td></tr>`
      )
      .join('');
    const faq = Supplemental.faq
      .map(
        (item) => `
        <div class="faq-item">
          <h3>${escapeHtml(item.q)}</h3>
          <p>${escapeHtml(item.a)}</p>
        </div>`
      )
      .join('');
    const meta = Supplemental.faqChapter;
    return `
      <article class="page page-enter" data-chapter-id="${meta.id}">
        <header class="chapter-header">
          <p class="chapter-part welcome">${PART_LABELS.welcome}</p>
          <h1><span class="chapter-emoji">${meta.emoji}</span> ${escapeHtml(meta.title)}</h1>
        </header>
        <div class="chapter-hero-art" data-art="${meta.id}">${Illustrations.forChapter(meta.id, meta.title, meta.part)}</div>
        ${renderWhyThreeKid()}
        ${renderWhyThreeBox(false)}
        <section class="why-three-box">
          <h2>What about other important inventions?</h2>
          <table class="other-inventions-table">
            <thead><tr><th>Invention</th><th>How this book thinks about it</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </section>
        <section class="quiz-box" style="border-color:rgba(255,255,255,0.1)">
          <h3>❓ Frequently asked questions</h3>
          <div class="faq-list">${faq}</div>
        </section>
        ${chapterNavFooter(meta.id)}
      </article>`;
  }

  function chapterSupplementalHtml(chapterId) {
    if (chapterId === 'preamble') {
      return renderEditorialNote() + renderWhyThreeKid();
    }
    if (chapterId === 'introduction') {
      return renderWhyThreeBox(true);
    }
    if (chapterId === 'why-these-three') {
      return null;
    }
    return '';
  }

  function buildNav() {
    const nav = document.getElementById('chapterNav');
    nav.innerHTML = book.nav
      .map(
        (group) => `
      <div class="nav-group-label">${group.label}</div>
      ${group.items
        .map(
          (item) => `
        <a href="#${item.id}" class="nav-link" data-nav="${item.id}">
          <span class="nav-emoji">${item.emoji}</span>
          <span>${escapeHtml(navItemTitle(item))}</span>
        </a>`
        )
        .join('')}`
      )
      .join('');
    nav.querySelectorAll('.nav-link').forEach((a) => {
      a.addEventListener('click', () => document.getElementById('sidebar').classList.remove('open'));
    });
  }

  function currentId() {
    const hash = location.hash.slice(1) || 'home';
    return hash === '' ? 'home' : hash;
  }

  function getChapter(id) {
    return book.chapters.find((c) => c.id === id);
  }

  function chapterPosition(id) {
    const ch = getChapter(id);
    if (!ch) return null;
    const partChapters = book.chapters.filter((c) => c.part === ch.part);
    const idx = partChapters.findIndex((c) => c.id === id);
    const total = PART_CHAPTER_COUNTS[ch.part];
    if (total && idx >= 0) {
      return { part: PART_LABELS[ch.part], index: idx + 1, total, title: ch.title };
    }
    return { part: PART_LABELS[ch.part] || 'Welcome', index: 0, total: 0, title: ch.title };
  }

  function updateProgress() {
    const bar = document.querySelector('.reading-progress-bar');
    if (!bar) return;
    const el = document.documentElement;
    const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
    bar.style.width = `${Math.min(100, isNaN(pct) ? 0 : pct)}%`;
  }

  function formatParagraph(p) {
    if (p.startsWith('"') || p.startsWith('\u201c') || p.startsWith('\u2018'))
      return `<p class="dialogue">${escapeHtml(p)}</p>`;
    if (p.length < 35 && !p.includes(',')) return `<p class="emphasis">${escapeHtml(p)}</p>`;
    return `<p>${escapeHtml(p)}</p>`;
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function kidCorner(chapterId) {
    const tip = ChapterMeta.tip(chapterId);
    if (!tip) return '';
    return `
      <aside class="kid-corner" aria-label="Kid's Corner">
        <span class="kid-corner-icon">🧒</span>
        <div>
          <h4>Kid's Corner</h4>
          <p>${escapeHtml(tip)}</p>
        </div>
      </aside>`;
  }

  function chapterLocator(id) {
    const pos = chapterPosition(id);
    if (!pos) return '';
    const progress =
      pos.total > 0
        ? `<span class="locator-progress">Chapter ${pos.index} of ${pos.total}</span>`
        : '';
    return `
      <div class="chapter-locator" aria-label="You are here">
        <span class="locator-part">${escapeHtml(pos.part)}</span>
        ${progress}
        <span class="locator-title">${escapeHtml(pos.title.replace(/^Chapter \d+ — /, ''))}</span>
      </div>`;
  }

  function renderQuiz(id) {
    const quiz = QUIZZES[id];
    if (!quiz) return '';
    return `
      <div class="quiz-box">
        <h3>🎯 Quick Quiz</h3>
        ${quiz
          .map(
            (q, qi) => `
          <div class="quiz-question" data-q="${qi}">
            <p>${qi + 1}. ${escapeHtml(q.q)}</p>
            <div class="quiz-options">
              ${q.opts.map((o, oi) => `<button type="button" class="quiz-option" data-correct="${oi === q.a}">${escapeHtml(o)}</button>`).join('')}
            </div>
          </div>`
          )
          .join('')}
      </div>`;
  }

  function chapterNavFooter(id) {
    const idx = chapterOrder.indexOf(id);
    const prev = idx > 0 ? chapterOrder[idx - 1] : null;
    const next = idx < chapterOrder.length - 1 ? chapterOrder[idx + 1] : null;
    const label = (cid) => {
      if (cid === 'home') return { title: 'Overview', emoji: '🏠' };
      if (cid === 'cover') return { title: book.title, emoji: '📕' };
      const ch = getChapter(cid);
      return ch ? { title: ch.title, emoji: ch.emoji } : { title: cid, emoji: '📖' };
    };
    return `
      <nav class="chapter-nav-footer">
        ${prev ? `<a href="#${prev}" class="prev"><span class="label">← Previous</span><span class="title">${label(prev).emoji} ${escapeHtml(label(prev).title)}</span></a>` : '<span></span>'}
        ${next ? `<a href="#${next}" class="next"><span class="label">Next →</span><span class="title">${escapeHtml(label(next).title)} ${label(next).emoji}</span></a>` : ''}
      </nav>`;
  }

  function renderHome() {
    return `
      <article class="hero page page-enter">
        <span class="hero-badge">📚 ${escapeHtml(book.tagline || 'Interactive Edition')} · Ages 10+</span>
        <h1>${escapeHtml(book.title)}</h1>
        <p class="hero-sub">${escapeHtml(book.subtitle)}</p>
        <p class="home-intro-note">${escapeHtml(Supplemental.homeBlurb)}</p>
        <div class="hero-illustration">${Illustrations.hero()}</div>
        <a href="#cover" class="btn-primary">Open the book →</a>
        <a href="#why-these-three" class="editorial-link" style="display:block;margin-top:1rem">Why only electricity, plastic, and AI? →</a>
        <div class="hero-parts">
          <a href="#electricity-1" class="part-card electricity">
            <div class="big-emoji">⚡</div>
            <h3>Part I — Electricity</h3>
            <p>The invisible river that powers cities, phones, and factories.</p>
          </a>
          <a href="#plastic-1" class="part-card plastic">
            <div class="big-emoji">🧴</div>
            <h3>Part II — Plastic</h3>
            <p>When oil became matter humans could shape into almost anything.</p>
          </a>
          <a href="#ai-1" class="part-card ai">
            <div class="big-emoji">🧠</div>
            <h3>Part III — AI</h3>
            <p>Machines that learn — a new revolution for the mind.</p>
          </a>
        </div>
        ${chapterNavFooter('home')}
      </article>`;
  }

  function renderCover() {
    const ch = getChapter('cover');
    return `
      <article class="page page-enter cover-page" data-chapter-id="cover">
        <header class="chapter-header cover-header">
          <p class="chapter-part welcome">${PART_LABELS.welcome}</p>
          <h1>${escapeHtml(book.title)}</h1>
          <p class="hero-sub">${escapeHtml(book.subtitle)}</p>
          <p class="cover-tagline">${escapeHtml(book.tagline || '')}</p>
          <p class="cover-author">By ${escapeHtml(book.author)}</p>
        </header>
        <div class="chapter-hero-art" data-art="cover">${Illustrations.forChapter('cover', book.title, 'welcome')}</div>
        <p class="home-intro-note">${escapeHtml(Supplemental.homeBlurb)}</p>
        <a href="#preamble" class="btn-primary">Begin the story →</a>
        ${chapterNavFooter('cover')}
      </article>`;
  }

  function renderChapter(ch) {
    if (ch.id === 'why-these-three') {
      return renderWhyTheseThreePage();
    }
    if (ch.id === 'cover') {
      return renderCover();
    }

    const sectionsHtml = ch.sections
      .map((sec) => {
        const paras = sec.paragraphs.map(formatParagraph).join('');
        return `<section class="story-block">${paras}</section>`;
      })
      .join('');

    const diagram = ChapterMeta.diagram(ch.id);
    const diagramHtml = diagram
      ? `<div class="diagram-card"><h3>${escapeHtml(diagram.title)}</h3>${diagram.render()}</div>`
      : '';

    return `
      <article class="page page-enter" data-chapter-id="${ch.id}">
        ${chapterLocator(ch.id)}
        <header class="chapter-header">
          <p class="chapter-part ${ch.part}">${PART_LABELS[ch.part] || ch.part}</p>
          <h1><span class="chapter-emoji">${ch.emoji}</span> ${escapeHtml(ch.title)}</h1>
        </header>
        <div class="chapter-hero-art" data-art="${ch.id}">${Illustrations.forChapter(ch.id, ch.title, ch.part)}</div>
        ${kidCorner(ch.id)}
        ${sectionsHtml}
        ${chapterSupplementalHtml(ch.id) || ''}
        ${diagramHtml}
        ${renderQuiz(ch.id)}
        ${chapterNavFooter(ch.id)}
      </article>`;
  }

  function setActiveNav(id) {
    document.querySelectorAll('.nav-link').forEach((a) => {
      a.classList.toggle('active', a.dataset.nav === id);
    });
  }

  function bindQuizzes(root) {
    root.querySelectorAll('.quiz-option').forEach((btn) => {
      btn.addEventListener('click', () => {
        const parent = btn.closest('.quiz-question');
        parent.querySelectorAll('.quiz-option').forEach((b) => {
          b.disabled = true;
          if (b.dataset.correct === 'true') b.classList.add('correct');
          else if (b === btn) b.classList.add('wrong');
        });
      });
    });
  }

  function render() {
    const id = currentId();
    const main = document.getElementById('mainContent');
    setActiveNav(id);
    document.title =
      id === 'home'
        ? book.title
        : `${getChapter(id)?.title || id} | ${book.title}`;

    if (id === 'home') {
      main.innerHTML = renderHome();
    } else if (id === 'why-these-three') {
      main.innerHTML = renderWhyTheseThreePage();
    } else if (id === 'cover') {
      main.innerHTML = renderCover();
    } else {
      const ch = getChapter(id);
      if (!ch) {
        main.innerHTML = `<p class="page">Chapter not found. <a href="#home">Go home</a></p>`;
        return;
      }
      main.innerHTML = renderChapter(ch);
    }

    bindQuizzes(main);
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    updateProgress();

    requestAnimationFrame(() => {
      main.querySelector('.page')?.classList.add('page-visible');
    });

    if (typeof Analytics !== 'undefined') {
      Analytics.trackPage(id);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
