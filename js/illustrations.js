/** Unique SVG art per chapter — each page looks different. */
const Illustrations = {
  hero() {
    return this._wrap("home", "Welcome", "welcome", 0, `<rect width="800" height="320" fill="url(#sky-home)"/>
      <rect x="40" y="180" width="50" height="100" fill="#1a2030" rx="2"/>
      <rect x="170" y="120" width="70" height="160" fill="#222a45" rx="2"/>
      <path d="M400 30 L385 120 L415 120 L395 200 L430 90 L400 90 L420 30 Z" fill="#ffd166"/>
      <rect x="320" y="200" width="30" height="60" rx="8" fill="#06d6a0" opacity="0.5"/>
      <circle cx="480" cy="100" r="6" fill="#ef476f"/>
      <path d="M0 280 Q400 250 800 260" stroke="url(#glow)" stroke-width="4" fill="none" opacity="0.7"/>
      <text x="400" y="305" text-anchor="middle" fill="#8b95a8" font-size="13">Electricity · Plastic · AI</text>`, 800, 320);
  },

  forChapter(chapterId, title, part) {
    const num = this._chapterNum(chapterId);
    const idx = this._chapterIndex(chapterId, part);
    const body = this._sceneBody(chapterId, part, idx, num);
    const caption = this._caption(chapterId, title, part);
    return this._wrap(chapterId, title, part, num, body + caption, 700, 200);
  },

  _chapterNum(id) {
    const m = id.match(/(\d+)$/);
    if (m) return parseInt(m[1], 10);
    if (id === "preamble") return 0;
    if (id === "introduction") return 0;
    if (id === "about") return 0;
    return 0;
  },

  _chapterIndex(id, part) {
    const order = {
      cover: -1,
      preamble: 0,
      introduction: 1,
      "why-these-three": 2,
      about: 99,
    };
    if (order[id] !== undefined) return order[id];
    const m = id.match(/-(\d+)$/);
    return m ? parseInt(m[1], 10) : 0;
  },

  _partColor(part) {
    return { electricity: "#ffd166", plastic: "#06d6a0", ai: "#ef476f", welcome: "#7c5cff" }[part] || "#7c5cff";
  },

  _caption(chapterId, title, part) {
    const short = title.replace(/^Chapter \d+ — /, "").replace(/^About the Author.*/, "About");
    return `<text x="350" y="188" text-anchor="middle" fill="#8b95a8" font-size="11" font-family="system-ui">${this._esc(short)}</text>`;
  },

  _esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  },

  _wrap(chapterId, title, part, num, inner, w, h) {
    const color = this._partColor(part);
    const badge =
      chapterId === "home"
        ? ""
        : `<g class="chapter-badge">
        <rect x="12" y="12" width="118" height="36" rx="8" fill="#0c0e14" stroke="${color}" stroke-width="1.5" opacity="0.95"/>
        <text x="24" y="34" fill="${color}" font-size="11" font-weight="bold" font-family="system-ui">${this._badgeLabel(chapterId, part, num)}</text>
      </g>`;
    const bg = part === "electricity" ? "#0a1020" : part === "plastic" ? "#0a1410" : part === "ai" ? "#140a10" : "#141824";
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" data-chapter="${chapterId}" role="img" aria-label="${this._esc(title)}">
      <defs>
        <linearGradient id="sky-${chapterId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${bg}"/><stop offset="100%" stop-color="#0c0e14"/>
        </linearGradient>
        <linearGradient id="glow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#7c5cff"/><stop offset="50%" stop-color="#ffd166"/><stop offset="100%" stop-color="#06d6a0"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#sky-${chapterId})"/>
      ${badge}
      ${inner}
    </svg>`;
  },

  _badgeLabel(chapterId, part, num) {
    if (chapterId === "cover") return "Title";
    if (chapterId === "preamble") return "Preamble";
    if (chapterId === "introduction") return "Introduction";
    if (chapterId === "why-these-three") return "FAQ";
    if (chapterId === "about") return "About";
    const partLabel = { electricity: "Part I", plastic: "Part II", ai: "Part III" }[part] || "";
    return num ? `${partLabel} · Ch ${num}` : partLabel;
  },

  _sceneBody(chapterId, part, idx, num) {
    const c = this._partColor(part);
    const x = 80 + (idx * 37) % 500;
    const scenes = {
      welcome: () => {
        if (chapterId === "cover") {
          return `<text x="200" y="95" fill="#ffd166" font-size="28">⚡</text>
            <text x="320" y="95" fill="#06d6a0" font-size="28">🧴</text>
            <text x="440" y="95" fill="#ef476f" font-size="28">🧠</text>`;
        }
        if (chapterId === "preamble") {
          return `<circle cx="350" cy="95" r="45" fill="none" stroke="${c}" stroke-width="2" stroke-dasharray="8 4"/>
            <text x="350" y="100" text-anchor="middle" fill="${c}" font-size="14">?</text>
            <path d="M200 140 Q350 80 500 140" stroke="${c}" stroke-width="2" fill="none" opacity="0.5"/>`;
        }
        if (chapterId === "introduction") {
          return `<ellipse cx="350" cy="55" rx="90" ry="20" fill="#ffd166" opacity="0.35"/>
            <rect x="280" y="85" width="140" height="55" rx="6" fill="#2a3050"/>
            <circle cx="350" cy="112" r="22" fill="#3d4a6a"/>
            <text x="500" y="100" fill="#8b95a8" font-size="10">"Good morning"</text>`;
        }
        if (chapterId === "why-these-three") {
          return `<text x="200" y="95" fill="#ffd166" font-size="22">⚡</text>
            <text x="320" y="95" fill="#06d6a0" font-size="22">🧴</text>
            <text x="440" y="95" fill="#ef476f" font-size="22">🧠</text>
            <text x="350" y="130" text-anchor="middle" fill="#8b95a8" font-size="10">three layers · one pattern</text>`;
        }
        return `<rect x="280" y="85" width="140" height="55" rx="6" fill="#2a3050"/>`;
      },
      electricity: () => {
        const variants = [
          () => `${this._cityLights(c, idx)}<path d="M350 130 Q400 90 450 130" stroke="#7c5cff" stroke-width="2" fill="none" stroke-dasharray="6 4"/>`,
          () => `<path d="M350 25 L330 85 L370 85 L345 145 L390 55 L360 55 L375 25 Z" fill="${c}"/><circle cx="180" cy="120" r="35" fill="none" stroke="#7c5cff" stroke-width="2"/><text x="180" y="125" text-anchor="middle" fill="#7c5cff" font-size="12">e⁻</text>`,
          () => `<rect x="120" y="70" width="80" height="70" rx="4" fill="#1a2030" stroke="${c}"/><circle cx="280" cy="105" r="25" fill="none" stroke="${c}" stroke-width="2"/><path d="M305 105 L420 105" stroke="#7c5cff" stroke-width="3"/>`,
          () => `<rect x="80" y="90" width="40" height="50" fill="#1a2030" stroke="${c}"/><rect x="140" y="90" width="40" height="50" fill="#1a2030" stroke="${c}"/><rect x="200" y="90" width="40" height="50" fill="#1a2030" stroke="${c}"/><text x="350" y="100" fill="${c}" font-size="10">one power → many machines</text>`,
          () => this._gridNodes(idx, c),
          () => `<rect x="100" y="60" width="200" height="80" rx="4" fill="#1a2030" stroke="${c}"/><rect x="320" y="75" width="50" height="50" rx="4" fill="#222a45" stroke="${c}"/><rect x="390" y="75" width="50" height="50" rx="4" fill="#222a45" stroke="${c}"/>`,
          () => `<path d="M350 40 L340 100 L360 100 Z" fill="#ef476f" opacity="0.8"/><text x="350" y="130" text-anchor="middle" fill="#ef476f" font-size="10">⚠ danger</text>`,
          () => `<ellipse cx="350" cy="100" rx="60" ry="40" fill="none" stroke="${c}" stroke-width="2"/><text x="350" y="105" text-anchor="middle" fill="${c}" font-size="11">new fire</text>`,
        ];
        return (variants[(idx - 1) % variants.length] || variants[0])();
      },
      plastic: () => {
        const variants = [
          () => `<rect x="100" y="100" width="50" height="40" fill="#3d3020"/><rect x="170" y="100" width="30" height="40" fill="#5a4a30"/>`,
          () => `<ellipse cx="200" cy="120" rx="40" ry="25" fill="#2a2010"/><path d="M280 80 L320 140 L360 80" stroke="${c}" fill="none" stroke-width="2"/>`,
          () => `<circle cx="250" cy="100" r="30" fill="none" stroke="${c}" stroke-dasharray="4 2"/><rect x="320" y="70" width="35" height="70" rx="10" fill="${c}" opacity="0.6"/>`,
          () => `${Array.from({ length: 3 + (idx % 4) }, (_, i) => `<rect x="${120 + i * 55}" y="${85 + (i % 2) * 15}" width="40" height="55" rx="8" fill="${c}" opacity="${0.4 + i * 0.15}"/>`).join("")}`,
          () => `<rect x="300" y="75" width="25" height="80" rx="4" fill="${c}" opacity="0.5"/><text x="350" y="100" fill="${c}" font-size="10">🏥</text>`,
          () => `<rect x="80" y="90" width="450" height="8" fill="#1a3028"/><rect x="${x}" y="70" width="30" height="40" rx="4" fill="${c}" opacity="0.7"/>`,
          () => `<circle cx="350" cy="100" r="45" fill="none" stroke="${c}" stroke-width="2"/><text x="350" y="105" text-anchor="middle" fill="${c}" font-size="9">100+ years</text>`,
          () => `<rect x="150" y="80" width="120" height="60" rx="4" fill="#1a2030" stroke="${c}"/><rect x="400" y="90" width="80" height="40" rx="4" fill="#1a2030" stroke="${c}"/>`,
          () => `<circle cx="200" cy="100" r="20" fill="${c}" opacity="0.4"/><circle cx="350" cy="100" r="20" fill="${c}" opacity="0.6"/><circle cx="500" cy="100" r="20" fill="${c}" opacity="0.8"/>`,
          () => `<rect x="250" y="85" width="200" height="50" rx="6" fill="#1a3028" stroke="${c}"/><text x="350" y="115" text-anchor="middle" fill="${c}" font-size="10">plastic age</text>`,
        ];
        return (variants[(idx - 1) % variants.length] || variants[0])();
      },
      ai: () => {
        const nodes = Array.from({ length: 4 + (idx % 5) }, (_, i) => {
          const nx = 120 + i * 55 + (idx * 11) % 40;
          const ny = 70 + (i * 23 + idx * 7) % 60;
          return `<circle cx="${nx}" cy="${ny}" r="7" fill="#ef476f" opacity="0.85"/>`;
        }).join("");
        const lines =
          idx > 1
            ? `<line x1="150" y1="80" x2="250" y2="60" stroke="#ef476f" stroke-width="1" opacity="0.35"/>`
            : "";
        const extras = [
          () => `<rect x="300" y="120" width="70" height="30" rx="4" fill="#1a2030" stroke="#ef476f"/><text x="335" y="140" text-anchor="middle" fill="#ef476f" font-size="9">phone</text>`,
          () => `<text x="350" y="130" text-anchor="middle" fill="#ef476f" font-size="10">🔍 discovery</text>`,
          () => `<path d="M200 100 L350 60 L500 100" stroke="#ffd166" stroke-width="2" fill="none" opacity="0.5"/>`,
          () => `<text x="350" y="130" text-anchor="middle" fill="#ef476f" font-size="10">😨 first fear</text>`,
          () => `<rect x="200" y="75" width="300" height="50" rx="4" fill="#1a2030" stroke="#ef476f"/>`,
          () => `<text x="350" y="130" text-anchor="middle" fill="#06d6a0" font-size="10">think before you trust</text>`,
          () => `<rect x="120" y="90" width="60" height="40" fill="#1a2030"/><rect x="320" y="90" width="60" height="40" fill="#1a2030"/>`,
          () => `<rect x="100" y="70" width="80" height="90" fill="none" stroke="#ffd166" opacity="0.4"/><rect x="520" y="70" width="80" height="90" fill="none" stroke="#ef476f" opacity="0.4"/>`,
          () => `<text x="350" y="130" text-anchor="middle" fill="#ef476f" font-size="10">💼 jobs changing</text>`,
          () => `<rect x="180" y="75" width="60" height="70" fill="#ffd166" opacity="0.3"/><rect x="280" y="55" width="60" height="90" fill="#06d6a0" opacity="0.3"/><rect x="380" y="65" width="60" height="80" fill="#ef476f" opacity="0.3"/>`,
        ];
        return nodes + lines + (extras[(idx - 1) % extras.length] || (() => ""))();
      },
    };
    const fn = scenes[part] || scenes.welcome;
    return fn();
  },

  _cityLights(c, seed) {
    return Array.from({ length: 6 }, (_, i) => {
      const bx = 50 + i * 95 + (seed % 3) * 10;
      const h = 30 + (i * 7 + seed) % 40;
      return `<rect x="${bx}" y="${150 - h}" width="10" height="${h}" fill="${c}" opacity="0.7"/>`;
    }).join("");
  },

  _gridNodes(seed, c) {
    const pts = [[100, 90], [220, 70], [350, 100], [480, 75], [600, 95]];
    return pts
      .map(([x, y], i) => {
        const ox = pts[(i + seed) % pts.length][0];
        const oy = pts[(i + seed) % pts.length][1];
        return `<circle cx="${x}" cy="${y}" r="10" fill="#1a2030" stroke="${c}"/><line x1="${x}" y1="${y}" x2="${ox}" y2="${oy}" stroke="#7c5cff" stroke-width="1.2" opacity="0.45"/>`;
      })
      .join("");
  },

  compareRevolutions() {
    return `<svg viewBox="0 0 700 220" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#141824" width="700" height="220"/>
      ${[
        { x: 80, label: "Muscle", sub: "Electricity", color: "#ffd166", h: 120 },
        { x: 280, label: "Materials", sub: "Plastic", color: "#06d6a0", h: 100 },
        { x: 480, label: "Thinking", sub: "AI", color: "#ef476f", h: 140 },
      ]
        .map(
          (b) => `
        <rect x="${b.x}" y="${200 - b.h}" width="100" height="${b.h}" rx="6" fill="${b.color}" opacity="0.6"/>
        <text x="${b.x + 50}" y="${195 - b.h}" text-anchor="middle" fill="#e8ecf4" font-size="11" font-weight="bold">${b.sub}</text>
        <text x="${b.x + 50}" y="215" text-anchor="middle" fill="#8b95a8" font-size="10">Freed ${b.label}</text>`
        )
        .join("")}
    </svg>`;
  },

  riverDiagram() {
    return `<svg viewBox="0 0 500 160" xmlns="http://www.w3.org/2000/svg">
      <text x="80" y="30" fill="#ffd166" font-size="11">Power plant</text>
      <rect x="50" y="40" width="60" height="40" rx="4" fill="#1a2030" stroke="#ffd166"/>
      <path d="M110 60 H200" stroke="#7c5cff" stroke-width="3"/>
      <text x="250" y="30" fill="#7c5cff" font-size="11">Wires (the river)</text>
      <path d="M200 60 Q280 60 350 60" stroke="#7c5cff" stroke-width="3" fill="none"/>
      <rect x="370" y="40" width="50" height="40" rx="4" fill="#1a2030" stroke="#ffd166"/>
      <text x="395" y="100" text-anchor="middle" fill="#8b95a8" font-size="10">Your home</text>
    </svg>`;
  },
};
