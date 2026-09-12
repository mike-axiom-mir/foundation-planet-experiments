import { verifySampleReceiptMigration } from './migration.mjs';

const escapeHtml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const prettyJson = value => escapeHtml(JSON.stringify(value, null, 2));

function coordinateName(change) {
  if (change.id !== undefined) return String(change.id);
  return `Coordinate ${Number(change.index) + 1}`;
}

function coordinateLine(value) {
  return `${value.lat}°, ${value.lon}°`;
}

function renderChange(change) {
  const name = escapeHtml(coordinateName(change));
  const from = escapeHtml(coordinateLine(change.from));
  const to = escapeHtml(coordinateLine(change.to));
  return `
    <article class="change-card" data-coordinate-change="${change.index}">
      <div class="change-index">${String(Number(change.index) + 1).padStart(2, '0')}</div>
      <div class="change-body">
        <h3>${name}</h3>
        <p class="change-note">Coordinate identity normalized by the 1.1.0 sampler contract.</p>
        <div class="coordinate-flow" aria-label="Coordinate identity changed from ${from} to ${to}">
          <div><span>LEGACY IDENTITY</span><strong>${from}</strong></div>
          <div class="arrow" aria-hidden="true">→</div>
          <div><span>CANONICAL IDENTITY</span><strong>${to}</strong></div>
        </div>
      </div>
    </article>`;
}

export function renderSampleReceiptMigrationReview(migration, expectedDigest) {
  const verification = verifySampleReceiptMigration(migration, expectedDigest);
  const sourceReceipt = migration.source.receipt;
  const targetReceipt = migration.target.receipt;
  const changes = migration.coordinateChanges;
  const sourceVersion = migration.source.capabilityVersion;
  const targetVersion = migration.target.capabilityVersion;
  const coordinateCount = sourceReceipt.request.coordinates.length;
  const profile = sourceReceipt.request.profile;
  const unchangedCount = coordinateCount - changes.length;
  const changeMarkup = changes.length > 0
    ? changes.map(renderChange).join('')
    : `<div class="empty-state"><strong>No coordinate identity changes required.</strong><span>The verified target is still a new 1.1.0 receipt; the 1.0.0 source remains retained evidence.</span></div>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<title>Foundation Planet · Receipt Migration Review</title>
<style>
  :root {
    color-scheme: dark;
    --bg: #03080d;
    --panel: rgba(10, 23, 31, 0.9);
    --panel-strong: rgba(14, 32, 42, 0.96);
    --line: rgba(151, 218, 230, 0.22);
    --line-strong: rgba(151, 218, 230, 0.48);
    --text: #edf7f7;
    --muted: #9db4ba;
    --ice: #a8f1ea;
    --amber: #f1d29a;
    --shadow: 0 24px 70px rgba(0, 0, 0, 0.34);
  }
  * { box-sizing: border-box; }
  html { background: var(--bg); }
  body {
    margin: 0;
    min-width: 280px;
    color: var(--text);
    background:
      radial-gradient(circle at 72% 8%, rgba(49, 129, 151, 0.19), transparent 32rem),
      radial-gradient(circle at 8% 62%, rgba(111, 75, 138, 0.11), transparent 28rem),
      linear-gradient(180deg, #061016 0%, var(--bg) 46%, #020609 100%);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    line-height: 1.5;
  }
  body::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    opacity: 0.18;
    background-image:
      linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.022) 1px, transparent 1px);
    background-size: 36px 36px;
    mask-image: linear-gradient(to bottom, black, transparent 72%);
  }
  button, summary { font: inherit; }
  button { min-height: 44px; }
  button:focus-visible, summary:focus-visible {
    outline: 3px solid var(--ice);
    outline-offset: 3px;
  }
  .shell { width: min(1180px, calc(100% - 40px)); margin: 0 auto; padding: 42px 0 72px; position: relative; }
  .masthead { display: grid; gap: 12px; margin-bottom: 24px; }
  .eyebrow { color: var(--ice); font-size: 12px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; }
  h1 { margin: 0; max-width: 840px; font-size: clamp(34px, 6vw, 74px); line-height: .96; letter-spacing: -.045em; }
  .lede { margin: 0; max-width: 760px; color: var(--muted); font-size: clamp(16px, 2vw, 20px); }
  .truth-strip { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
  .truth-strip span {
    min-height: 30px;
    display: inline-flex;
    align-items: center;
    padding: 5px 10px;
    border: 1px solid var(--line);
    background: rgba(4, 14, 19, 0.72);
    color: #c9d9dd;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: .08em;
  }
  .hero {
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-columns: minmax(0, 1.45fr) minmax(250px, .55fr);
    gap: 28px;
    padding: clamp(22px, 4vw, 42px);
    border: 1px solid var(--line-strong);
    border-radius: 28px;
    background: linear-gradient(145deg, rgba(13, 31, 41, .97), rgba(6, 16, 22, .92));
    box-shadow: var(--shadow);
  }
  .hero::after {
    content: "";
    position: absolute;
    width: 340px;
    height: 340px;
    right: -105px;
    top: -115px;
    border-radius: 50%;
    background:
      radial-gradient(circle at 32% 28%, rgba(185, 243, 237, .54), transparent 8%),
      radial-gradient(circle at 43% 43%, rgba(54, 135, 154, .82), rgba(18, 62, 76, .92) 46%, rgba(3, 13, 18, .98) 72%);
    box-shadow: inset -28px -24px 48px rgba(0,0,0,.55), 0 0 80px rgba(77, 181, 194, .13);
    opacity: .78;
  }
  .hero-main, .hero-side { position: relative; z-index: 1; }
  .state-label { display: inline-flex; gap: 8px; align-items: center; color: var(--ice); font-weight: 900; letter-spacing: .11em; font-size: 12px; }
  .state-label::before { content: ""; width: 9px; height: 9px; border-radius: 50%; background: currentColor; box-shadow: 0 0 18px currentColor; }
  .version-flow { display: flex; align-items: baseline; flex-wrap: wrap; gap: 12px; margin: 18px 0 8px; }
  .version-flow strong { font-size: clamp(32px, 5vw, 58px); letter-spacing: -.04em; }
  .version-flow span { color: var(--muted); font-weight: 800; }
  .hero-copy { margin: 0; max-width: 670px; color: #c8d8dc; font-size: 16px; }
  .hero-side { align-self: end; display: grid; gap: 10px; }
  .stat { padding: 13px 15px; border: 1px solid var(--line); border-radius: 16px; background: rgba(2, 10, 14, .6); }
  .stat span { display: block; color: var(--muted); font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
  .stat strong { display: block; margin-top: 3px; font-size: 20px; }
  .section { margin-top: 22px; padding: clamp(20px, 3vw, 32px); border: 1px solid var(--line); border-radius: 24px; background: var(--panel); box-shadow: var(--shadow); }
  .section-head { display: flex; gap: 16px; align-items: end; justify-content: space-between; margin-bottom: 18px; }
  .section h2 { margin: 0; font-size: clamp(22px, 3vw, 34px); letter-spacing: -.025em; }
  .section-kicker { color: var(--muted); font-size: 13px; }
  .change-list { display: grid; gap: 12px; }
  .change-card { display: grid; grid-template-columns: 52px minmax(0, 1fr); gap: 16px; padding: 17px; border: 1px solid var(--line); border-radius: 18px; background: linear-gradient(135deg, rgba(12,31,39,.92), rgba(6,17,23,.86)); }
  .change-index { width: 44px; height: 44px; display: grid; place-items: center; border: 1px solid var(--line-strong); border-radius: 13px; color: var(--ice); font: 800 12px/1 ui-monospace, SFMono-Regular, Menlo, monospace; }
  .change-card h3 { margin: 0; font-size: 17px; overflow-wrap: anywhere; }
  .change-note { margin: 2px 0 12px; color: var(--muted); font-size: 13px; }
  .coordinate-flow { display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; }
  .coordinate-flow > div:not(.arrow) { min-width: 0; padding: 11px 13px; border-radius: 13px; background: rgba(2, 10, 14, .66); }
  .coordinate-flow span { display: block; color: var(--muted); font-size: 10px; font-weight: 900; letter-spacing: .09em; }
  .coordinate-flow strong { display: block; margin-top: 4px; font: 760 15px/1.35 ui-monospace, SFMono-Regular, Menlo, monospace; overflow-wrap: anywhere; }
  .arrow { color: var(--ice); font-size: 23px; }
  .empty-state { display: grid; gap: 4px; padding: 20px; border: 1px dashed var(--line-strong); border-radius: 16px; }
  .empty-state span { color: var(--muted); }
  .identity-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
  .identity-card { min-width: 0; padding: 15px; border: 1px solid var(--line); border-radius: 16px; background: rgba(3, 12, 17, .66); }
  .identity-card span { display: block; color: var(--muted); font-size: 10px; font-weight: 900; letter-spacing: .09em; text-transform: uppercase; }
  code.digest { display: block; margin: 8px 0 12px; color: #d7eeee; font: 650 12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; overflow-wrap: anywhere; }
  .copy-button { width: 100%; border: 1px solid var(--line-strong); border-radius: 12px; background: rgba(24, 62, 72, .52); color: var(--text); cursor: pointer; font-weight: 800; }
  .copy-button:hover { background: rgba(35, 78, 90, .66); }
  #copy-status { min-height: 24px; margin-top: 11px; color: var(--ice); font-size: 13px; }
  .boundary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .boundary { padding: 15px; border-radius: 15px; border: 1px solid var(--line); background: rgba(3, 12, 17, .58); }
  .boundary strong { display: block; color: var(--amber); font-size: 13px; letter-spacing: .04em; }
  .boundary span { display: block; margin-top: 4px; color: var(--muted); font-size: 13px; }
  details { margin-top: 10px; border: 1px solid var(--line); border-radius: 16px; background: rgba(2, 9, 13, .62); overflow: clip; }
  summary { min-height: 48px; display: flex; align-items: center; padding: 12px 16px; cursor: pointer; font-weight: 800; color: #dcebed; }
  details[open] summary { border-bottom: 1px solid var(--line); }
  pre { margin: 0; padding: 16px; max-height: 480px; overflow: auto; white-space: pre-wrap; overflow-wrap: anywhere; color: #b9cbd0; font: 12px/1.55 ui-monospace, SFMono-Regular, Menlo, monospace; }
  .footnote { margin: 15px 0 0; color: var(--muted); font-size: 13px; }
  @media (max-width: 720px) {
    .shell { width: min(100% - 24px, 1180px); padding-top: 24px; }
    .hero { grid-template-columns: 1fr; border-radius: 22px; }
    .hero::after { width: 230px; height: 230px; right: -100px; top: -88px; opacity: .52; }
    .hero-side { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .stat { padding: 10px; }
    .stat strong { font-size: 16px; }
    .identity-grid, .boundary-grid { grid-template-columns: 1fr; }
    .coordinate-flow { grid-template-columns: 1fr; gap: 7px; }
    .arrow { transform: rotate(90deg); justify-self: start; margin-left: 10px; line-height: 1; }
    .section-head { align-items: start; flex-direction: column; gap: 2px; }
  }
  @media (max-width: 430px) {
    h1 { font-size: 38px; }
    .hero-side { grid-template-columns: 1fr; }
    .change-card { grid-template-columns: 44px minmax(0, 1fr); gap: 11px; padding: 13px; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; animation: none !important; }
  }
  @media (prefers-contrast: more) {
    :root { --line: rgba(220, 249, 250, .5); --line-strong: rgba(235, 255, 255, .86); --muted: #c8d7da; }
  }
  @media (forced-colors: active) {
    .hero, .section, .change-card, .identity-card, .boundary, details, .stat { border: 1px solid CanvasText; background: Canvas; }
    .state-label::before { background: CanvasText; box-shadow: none; }
  }
</style>
</head>
<body>
<div class="shell">
  <header class="masthead">
    <div class="eyebrow">Foundation Planet · local evidence desk</div>
    <h1>Receipt migration, made inspectable.</h1>
    <p class="lede">The old receipt stays historical evidence. The target is a new deterministic receipt under canonical coordinate identity.</p>
    <div class="truth-strip" aria-label="Authority boundaries">
      <span>LOCAL / OFFLINE</span>
      <span>DISPLAY ≠ MIGRATION AUTHORITY</span>
      <span>SOURCE RETAINED</span>
      <span>STATE NOT APPLIED</span>
      <span>NOT CANON</span>
    </div>
  </header>

  <main>
    <section class="hero" aria-labelledby="lineage-title">
      <div class="hero-main">
        <div class="state-label">DETERMINISTIC LINEAGE PASS</div>
        <div class="version-flow" id="lineage-title"><strong>${escapeHtml(sourceVersion)}</strong><span>→</span><strong>${escapeHtml(targetVersion)}</strong></div>
        <p class="hero-copy">This capsule replayed successfully against the migration contract. It does not prove authorship or external identity. Compare the migration digest with a separately retained value when substitution matters.</p>
      </div>
      <div class="hero-side">
        <div class="stat"><span>Profile</span><strong>${escapeHtml(profile)}</strong></div>
        <div class="stat"><span>Locations</span><strong>${coordinateCount}</strong></div>
        <div class="stat"><span>Identity changes</span><strong>${changes.length}</strong></div>
      </div>
    </section>

    <section class="section" aria-labelledby="changes-title">
      <div class="section-head">
        <div><div class="section-kicker">WHAT CHANGED</div><h2 id="changes-title">Coordinate identity</h2></div>
        <div class="section-kicker">${changes.length} changed · ${unchangedCount} unchanged</div>
      </div>
      <div class="change-list">${changeMarkup}</div>
    </section>

    <section class="section" aria-labelledby="identity-title">
      <div class="section-head"><div><div class="section-kicker">WHAT TO RETAIN</div><h2 id="identity-title">Exact evidence identities</h2></div></div>
      <div class="identity-grid">
        <div class="identity-card">
          <span>Migration capsule</span>
          <code class="digest" id="migration-digest">${escapeHtml(verification.migrationDigest)}</code>
          <button class="copy-button" type="button" data-copy="${escapeHtml(verification.migrationDigest)}" data-copy-label="migration digest">Copy migration digest</button>
        </div>
        <div class="identity-card">
          <span>Retained source receipt</span>
          <code class="digest">${escapeHtml(verification.sourceReceiptDigest)}</code>
          <button class="copy-button" type="button" data-copy="${escapeHtml(verification.sourceReceiptDigest)}" data-copy-label="source receipt digest">Copy source digest</button>
        </div>
        <div class="identity-card">
          <span>Derived target receipt</span>
          <code class="digest">${escapeHtml(verification.targetReceiptDigest)}</code>
          <button class="copy-button" type="button" data-copy="${escapeHtml(verification.targetReceiptDigest)}" data-copy-label="target receipt digest">Copy target digest</button>
        </div>
      </div>
      <div id="copy-status" role="status" aria-live="polite"></div>
    </section>

    <section class="section" aria-labelledby="boundary-title">
      <div class="section-head"><div><div class="section-kicker">TRUTH CEILING</div><h2 id="boundary-title">What this review does not do</h2></div></div>
      <div class="boundary-grid">
        <div class="boundary"><strong>NO SOURCE REPLACEMENT</strong><span>The complete 1.0.0 receipt remains inside the capsule as historical evidence.</span></div>
        <div class="boundary"><strong>NO STATE APPLICATION</strong><span>The target receipt is derived evidence. This surface cannot write Planet or game state.</span></div>
        <div class="boundary"><strong>NO APPROVAL / CANON</strong><span>Replay and SHA-256 establish deterministic content agreement, not authorship, scientific truth, release approval, or CANON.</span></div>
      </div>
      <p class="footnote">Exact migration schema: ${escapeHtml(migration.schema)} · verification: ${escapeHtml(verification.schema)}</p>
    </section>

    <section class="section" aria-labelledby="raw-title">
      <div class="section-head"><div><div class="section-kicker">RAW EVIDENCE</div><h2 id="raw-title">Inspect without losing the summary</h2></div></div>
      <details><summary>Retained source receipt · ${escapeHtml(sourceVersion)}</summary><pre>${prettyJson(sourceReceipt)}</pre></details>
      <details><summary>Derived target receipt · ${escapeHtml(targetVersion)}</summary><pre>${prettyJson(targetReceipt)}</pre></details>
      <details><summary>Complete migration capsule</summary><pre>${prettyJson(migration)}</pre></details>
    </section>
  </main>
</div>
<script>
  const status = document.getElementById('copy-status');
  async function copyExact(button) {
    const value = button.getAttribute('data-copy') || '';
    const label = button.getAttribute('data-copy-label') || 'value';
    try {
      await navigator.clipboard.writeText(value);
      status.textContent = 'Copied exact ' + label + '.';
      return;
    } catch (_) {
      const range = document.createRange();
      const digest = button.parentElement.querySelector('.digest');
      if (digest) {
        range.selectNodeContents(digest);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
      status.textContent = 'Clipboard unavailable · exact ' + label + ' selected for manual copy.';
    }
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-copy]');
    if (button) copyExact(button);
  });
</script>
</body>
</html>`;
}
