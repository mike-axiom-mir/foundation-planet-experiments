const COMMANDS = Object.freeze({
  orbit: {
    label: 'Orbital view',
    target: () => document.querySelector('.mode-button[data-mode="orbit"]'),
  },
  surface: {
    label: 'Surface view',
    target: () => document.querySelector('.mode-button[data-mode="surface"]'),
  },
  life: {
    label: 'Life layer',
    target: () => document.getElementById('lifeMaster'),
  },
  land: {
    label: 'Find viable land',
    target: () => document.getElementById('randomLand'),
  },
  water: {
    label: 'Follow water',
    target: () => document.getElementById('freshwater'),
  },
  ocean: {
    label: 'Survey ocean',
    target: () => document.getElementById('marineSurvey'),
  },
  reset: {
    label: 'Reset view',
    target: () => document.getElementById('resetView'),
  },
});

const KEY_COMMANDS = new Map([
  ['Digit1', 'orbit'],
  ['Digit2', 'surface'],
  ['KeyL', 'life'],
  ['KeyG', 'land'],
  ['KeyW', 'water'],
  ['KeyM', 'ocean'],
  ['KeyR', 'reset'],
]);

const GAMEPAD_COMMANDS = new Map([
  [15, 'surface'], // D-pad right
  [14, 'orbit'],   // D-pad left
  [3, 'life'],     // Y / Triangle
  [0, 'land'],     // A / Cross
  [2, 'water'],    // X / Square
  [5, 'ocean'],    // Right bumper
  [1, 'reset'],    // B / Circle
]);

const LOCATION_COMMANDS = new Set(['land', 'water', 'ocean']);
const GAMEPAD_POLL_MS = 120;
const LOCATION_SETTLE_MS = 1800;

function editableTarget(target) {
  return Boolean(target?.closest?.('input, textarea, select, [contenteditable="true"]'));
}

function currentState() {
  const activeMode = document.querySelector('.mode-button.active')?.dataset?.mode
    || document.body.dataset.mode
    || 'orbit';
  const lifePressed = document.getElementById('lifeMaster')?.getAttribute('aria-pressed');
  return {
    mode: activeMode === 'surface' ? 'surface' : 'orbit',
    life: lifePressed === 'false' ? 'off' : 'on',
    coordinate: document.getElementById('coordinate')?.textContent?.trim() || '—',
    biome: document.getElementById('biome')?.textContent?.trim() || '—',
  };
}

function createExperienceSurface() {
  const mission = document.querySelector('.mission');
  const actions = mission?.querySelector('.mission-actions');
  if (!mission || !actions || document.getElementById('surveyExperience')) return null;

  const surface = document.createElement('div');
  surface.id = 'surveyExperience';
  surface.className = 'survey-experience';
  surface.dataset.input = 'pointer';
  surface.innerHTML = `
    <div class="survey-experience__state" aria-label="Current survey interaction state">
      <span id="surveyInputChip">POINTER</span>
      <span id="surveyViewChip">ORBITAL</span>
      <span id="surveyLifeChip">LIFE ON</span>
    </div>
    <strong class="survey-experience__message" id="surveyExperienceMessage" role="status" aria-live="polite" aria-atomic="true">Survey controls ready</strong>
    <div class="survey-experience__keys" aria-hidden="true">
      <span><kbd>1</kbd>/<kbd>2</kbd> view</span>
      <span><kbd>L</kbd> life</span>
      <span><kbd>G</kbd> land</span>
      <span><kbd>W</kbd> water</span>
      <span><kbd>M</kbd> ocean</span>
      <span><kbd>R</kbd> reset</span>
    </div>
    <small class="survey-experience__pad" aria-hidden="true">Pad: ←/→ view · Y life · A land · X water · RB ocean · B reset</small>
  `;
  mission.insertBefore(surface, actions);
  return surface;
}

function installExperienceControls() {
  const surface = createExperienceSurface();
  if (!surface) return;

  const inputChip = document.getElementById('surveyInputChip');
  const viewChip = document.getElementById('surveyViewChip');
  const lifeChip = document.getElementById('surveyLifeChip');
  const message = document.getElementById('surveyExperienceMessage');
  let inputSource = 'pointer';
  let reportToken = 0;

  const setInputSource = source => {
    inputSource = source;
    surface.dataset.input = source;
    inputChip.textContent = source.toUpperCase();
  };

  const syncStateChips = () => {
    const state = currentState();
    viewChip.textContent = state.mode.toUpperCase();
    lifeChip.textContent = `LIFE ${state.life.toUpperCase()}`;
  };

  const flashControl = target => {
    target?.classList?.remove('experience-command-flash');
    // Force a fresh animation when the same command is repeated.
    void target?.offsetWidth;
    target?.classList?.add('experience-command-flash');
    window.setTimeout(() => target?.classList?.remove('experience-command-flash'), 620);
  };

  const renderMessage = text => {
    message.textContent = text;
    surface.classList.remove('has-new-feedback');
    void surface.offsetWidth;
    surface.classList.add('has-new-feedback');
    window.setTimeout(() => surface.classList.remove('has-new-feedback'), 700);
  };

  const describeResult = (command, state) => {
    if (command === 'orbit' || command === 'surface') return `VIEW → ${state.mode.toUpperCase()}`;
    if (command === 'life') return `LIFE → ${state.life.toUpperCase()}`;
    if (command === 'reset') return `VIEW RESET · ${state.mode.toUpperCase()}`;
    const prefix = command === 'land' ? 'LAND SEARCH' : command === 'water' ? 'WATER FOLLOW' : 'OCEAN SURVEY';
    return `${prefix} → ${state.biome} · ${state.coordinate}`;
  };

  const settleCommand = (command, before) => {
    const token = ++reportToken;
    const startedAt = performance.now();

    const inspect = () => {
      if (token !== reportToken) return;
      const state = currentState();
      syncStateChips();
      const locationChanged = state.coordinate !== before.coordinate || state.biome !== before.biome;
      if (LOCATION_COMMANDS.has(command) && !locationChanged && performance.now() - startedAt < LOCATION_SETTLE_MS) {
        window.setTimeout(inspect, 90);
        return;
      }
      renderMessage(describeResult(command, state));
    };

    window.setTimeout(inspect, 0);
  };

  const runCommand = command => {
    const entry = COMMANDS[command];
    const target = entry?.target?.();
    if (!target || target.disabled) return false;
    target.click();
    return true;
  };

  Object.entries(COMMANDS).forEach(([command, entry]) => {
    const target = entry.target();
    if (!target) return;
    const shortcut = [...KEY_COMMANDS].find(([, mapped]) => mapped === command)?.[0];
    if (shortcut) {
      const readable = shortcut.startsWith('Digit') ? shortcut.slice(-1) : shortcut.replace('Key', '');
      target.setAttribute('aria-keyshortcuts', readable);
    }
    target.addEventListener('pointerdown', () => setInputSource('pointer'), { passive: true });
    target.addEventListener('click', () => {
      const before = currentState();
      flashControl(target);
      // Existing Planet listeners own the command. Read the resulting realization after they run.
      window.setTimeout(() => settleCommand(command, before), 0);
    });
  });

  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || editableTarget(event.target)) return;
    const command = KEY_COMMANDS.get(event.code);
    if (!command) return;
    event.preventDefault();
    setInputSource('keyboard');
    runCommand(command);
  });

  const stateObserver = new MutationObserver(syncStateChips);
  document.querySelectorAll('.mode-button, #lifeMaster').forEach(target => stateObserver.observe(target, {
    attributes: true,
    attributeFilter: ['class', 'aria-pressed'],
  }));

  let previousButtons = [];
  const pollGamepad = () => {
    let pads = [];
    try { pads = navigator.getGamepads?.() || []; } catch { return; }
    const pad = [...pads].find(candidate => candidate?.connected);
    if (!pad) {
      previousButtons = [];
      return;
    }
    const pressed = pad.buttons.map(button => Boolean(button?.pressed));
    for (const [index, command] of GAMEPAD_COMMANDS) {
      if (pressed[index] && !previousButtons[index]) {
        setInputSource('gamepad');
        runCommand(command);
        break;
      }
    }
    previousButtons = pressed;
  };

  window.setInterval(pollGamepad, GAMEPAD_POLL_MS);
  syncStateChips();
  document.body.dataset.experienceControls = 'survey-command-v1';
}

if (document.readyState === 'complete') installExperienceControls();
else window.addEventListener('load', installExperienceControls, { once: true });
