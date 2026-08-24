const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
document.documentElement.classList.add('is-ready');

const header = document.querySelector('[data-header]');
const navToggle = document.querySelector('[data-nav-toggle]');
const navMenu = document.querySelector('[data-nav-menu]');
const navLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')];

const closeNavigation = (returnFocus = false) => {
  if (!navToggle || !navMenu) return;
  navToggle.setAttribute('aria-expanded', 'false');
  navMenu.classList.remove('is-open');
  document.body.classList.remove('nav-open');
  if (returnFocus) navToggle.focus();
};

navToggle?.addEventListener('click', () => {
  const willOpen = navToggle.getAttribute('aria-expanded') !== 'true';
  navToggle.setAttribute('aria-expanded', String(willOpen));
  navMenu?.classList.toggle('is-open', willOpen);
  document.body.classList.toggle('nav-open', willOpen);
  if (willOpen) navMenu?.querySelector('a')?.focus();
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const menuWasOpen = navToggle?.getAttribute('aria-expanded') === 'true';
    closeNavigation(menuWasOpen);
  });
});

document.addEventListener('keydown', (event) => {
  const menuOpen = navToggle?.getAttribute('aria-expanded') === 'true';

  if (event.key === 'Escape' && menuOpen) {
    event.preventDefault();
    closeNavigation(true);
    return;
  }

  if (event.key !== 'Tab' || !menuOpen || !navMenu || !navToggle) return;

  const focusable = [navToggle, ...navMenu.querySelectorAll('a[href]')];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

const desktopNavigation = window.matchMedia('(min-width: 961px)');
const resetNavigationAtDesktop = (event) => {
  if (event.matches) closeNavigation();
};

if (desktopNavigation.addEventListener) {
  desktopNavigation.addEventListener('change', resetNavigationAtDesktop);
} else {
  desktopNavigation.addListener(resetNavigationAtDesktop);
}

const updateHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 18);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealItems = [...document.querySelectorAll('.reveal')];

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const sections = [...document.querySelectorAll('main section[id]')];

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      navLinks.forEach((link) => {
        const isActive = link.hash === `#${visible.target.id}`;
        link.classList.toggle('is-active', isActive);
        if (isActive) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    },
    { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.2, 0.5] },
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

const video = document.querySelector('[data-comparison-video]');
const videoFrame = video?.closest('.video-frame');
const videoToggle = document.querySelector('[data-video-toggle]');
const videoActionLabel = document.querySelector('[data-video-action-label]');
const fullscreenButton = document.querySelector('[data-fullscreen]');
const fullscreenLabel = document.querySelector('[data-fullscreen-label]');
const sceneLabel = document.querySelector('[data-scene-label]');
const sceneDescription = document.querySelector('[data-scene-description]');
const sceneGrid = document.querySelector('[data-scene-grid]');
const sceneSearch = document.querySelector('[data-scene-search]');
const sceneResults = document.querySelector('[data-scene-results]');
const sceneEmpty = document.querySelector('[data-scene-empty]');
const sceneFilterButtons = [...document.querySelectorAll('[data-scene-filter]')];
const videoStage = document.querySelector('[data-video-stage]');
const videoDownload = document.querySelector('[data-video-download]');
let userPausedVideo = reducedMotion.matches;

const reviewedSceneIds = new Set(['01', '03', '05', '09', '15', '18', '30', '37']);

const sceneDescriptions = {
  '01': 'A black wireless-earbud charging case in a minimalist studio product shot. Compare reflections, earbud geometry, and shadow consistency across the six synchronized panels.',
  '02': 'A paper-collage explainer sequence. Compare cut-paper edges, layered shapes, and motion continuity across the six synchronized panels.',
  '03': 'A stylized 3D animated short. Compare subject shape, small moving details, and temporal consistency across the six synchronized panels.',
  '04': 'A music-video sequence with stylized typography. Compare lettering, layout, and motion across the six synchronized panels.',
  '05': 'A nature-documentary sequence. Compare animal detail, terrain texture, and motion continuity across the six synchronized panels.',
  '06': 'An underwater coral-reef sequence. Compare coral structure, aquatic motion, and fine background detail across the six synchronized panels.',
  '07': 'A night street-photography sequence. Compare signs, reflections, moving subjects, and low-light detail across the six synchronized panels.',
  '08': 'A clay stop-motion sequence. Compare sculpted forms, surface texture, and frame-to-frame shape consistency across the six synchronized panels.',
  '09': 'A macro view of an insect on a stem. Compare wing structure, fine leg detail, body shape, and background stability across the six synchronized panels.',
  '10': 'A deer in an autumn forest. Compare the animal silhouette, foliage texture, and movement across the six synchronized panels.',
  '11': 'A live performance sequence. Compare performers, stage lighting, and fast motion across the six synchronized panels.',
  '12': 'A blacksmith workshop sequence. Compare hands, tools, sparks, and object geometry across the six synchronized panels.',
  '13': 'An aurora campsite sequence. Compare tent geometry, sky gradients, and moving light across the six synchronized panels.',
  '14': 'A dog on a beach. Compare the animal silhouette, water motion, and shoreline detail across the six synchronized panels.',
  '15': 'An eagle in flight across mountainous terrain. Compare silhouette integrity, wing motion, distant detail, and temporal stability across the six synchronized panels.',
  '16': 'A cyberpunk alley sequence. Compare signage, architecture, reflections, and moving light across the six synchronized panels.',
  '17': 'A first-person subway sequence. Compare carriage geometry, forward motion, and peripheral detail across the six synchronized panels.',
  '18': 'A quiet tea ceremony. Compare hand motion, vessel geometry, steam, and fine object continuity across the six synchronized panels.',
  '19': 'A sprint shown in slow motion. Compare body pose, limb continuity, and background motion across the six synchronized panels.',
  '20': 'Terraced fields at dawn. Compare layered terrain, workers, atmospheric light, and subtle motion across the six synchronized panels.',
  '21': 'A paper-craft stop-motion explainer. Compare folded forms, cut edges, and frame-to-frame continuity across the six synchronized panels.',
  '22': 'Hand-drawn glowing elements combined with live action. Compare composited edges, light, and subject motion across the six synchronized panels.',
  '23': 'A polished brand-film sequence. Compare product geometry, typography, lighting, and transitions across the six synchronized panels.',
  '24': 'A two-player cooperative game intro. Compare both characters, interface-like details, and synchronized motion across the six panels.',
  '25': 'An aerial glacier sequence. Compare ice structure, terrain boundaries, camera motion, and fine surface detail across the six synchronized panels.',
  '26': 'A macro food sequence. Compare ingredients, fine textures, highlights, and close-up motion across the six synchronized panels.',
  '27': 'A 2D animation sequence. Compare line work, filled shapes, and frame-to-frame character consistency across the six synchronized panels.',
  '28': 'A watercolor-style sequence. Compare painted edges, color washes, subject shape, and motion across the six synchronized panels.',
  '29': 'A vintage-film sequence. Compare subject continuity, grain-like texture, color, and camera movement across the six synchronized panels.',
  '30': 'A city skyline time-lapse. Compare building geometry, changing light, and skyline consistency across the six synchronized panels.',
  '31': 'A desert caravan sequence. Compare figures, animals, dunes, and long-range motion across the six synchronized panels.',
  '32': 'An industrial robot-arm sequence. Compare rigid geometry, articulated motion, and surrounding machinery across the six synchronized panels.',
  '33': 'A laboratory reaction sequence. Compare glassware, liquid boundaries, changing color, and fine motion across the six synchronized panels.',
  '34': 'A morning bakery sequence. Compare hands, baked goods, tools, and warm interior detail across the six synchronized panels.',
  '35': 'A rain-covered car window. Compare droplets, reflections, exterior motion, and temporal stability across the six synchronized panels.',
  '36': 'A lighthouse during a storm. Compare tower geometry, waves, clouds, and changing light across the six synchronized panels.',
  '37': 'Hands shape clay on a spinning pottery wheel. Compare finger continuity, the hand-to-clay boundary, and rotational motion across the six synchronized panels.',
  '38': 'A calligraphy-and-ink sequence. Compare brush shape, ink flow, paper texture, and stroke formation across the six synchronized panels.',
  '39': 'A house cat in sunlight. Compare fur detail, body shape, shadows, and subtle movement across the six synchronized panels.',
  '40': 'A herd of horses in motion. Compare individual silhouettes, overlapping bodies, terrain, and group movement across the six synchronized panels.',
  '41': 'An abstract fluid sequence. Compare flowing boundaries, color mixing, highlights, and temporal coherence across the six synchronized panels.',
  '42': 'A medieval market sequence. Compare people, stalls, architecture, and crowd motion across the six synchronized panels.',
  '43': 'A rocket-launch sequence. Compare rocket geometry, exhaust, smoke, and rapid motion across the six synchronized panels.',
  '44': 'A volcanic-lava sequence. Compare molten boundaries, surface texture, glow, and fluid motion across the six synchronized panels.',
  '45': 'An ancient-library sequence. Compare books, shelving, architecture, warm light, and camera movement across the six synchronized panels.',
  '46': 'A skate-park sequence. Compare the rider, board, ramps, and fast articulated motion across the six synchronized panels.',
  '47': 'A winter cabin at night. Compare cabin geometry, snow, warm window light, and atmospheric motion across the six synchronized panels.',
  '48': 'A brutalist-architecture sequence. Compare strong building geometry, concrete texture, perspective, and camera motion across the six synchronized panels.',
  '49': 'A Victorian-era drama sequence. Compare faces, costumes, interior detail, and character motion across the six synchronized panels.',
  '50': 'A glassblowing sequence. Compare hands, tools, molten glass geometry, reflections, and continuous motion across the six synchronized panels.',
};

const sceneFindings = {
  '01': 'The annotated review flags earbud-geometry changes in Sol-Attn and SpargeAttn; no corresponding region is highlighted in the three project panels.',
  '03': 'The annotated review flags fine subject-detail changes in Sol-Attn and SpargeAttn; no corresponding region is highlighted in the three project panels.',
  '05': 'The annotated review flags differences around the small animal in Sol-Attn and SpargeAttn; no corresponding region is highlighted in the three project panels.',
  '09': 'The annotated review flags differences around the insect head in Sol-Attn and SpargeAttn; no corresponding region is highlighted in the three project panels.',
  '15': 'The annotated review flags differences around the distant flying subject in the comparison baselines; no corresponding region is highlighted in the three project panels.',
  '18': 'The annotated review flags hand-and-utensil detail changes in Sol-Attn and SpargeAttn; no corresponding region is highlighted in the three project panels.',
  '30': 'The annotated review flags building-geometry changes in Sol-Attn and SpargeAttn; no corresponding region is highlighted in the three project panels.',
  '37': 'The annotated review flags a hand-to-clay boundary difference in SpargeAttn; no corresponding region is highlighted in the three project panels.',
};

const scenes = [
  ['01', 'Minimalist product'],
  ['02', 'Paper collage explainer'],
  ['03', '3D animated short'],
  ['04', 'Music video typography'],
  ['05', 'Nature documentary'],
  ['06', 'Underwater coral reef'],
  ['07', 'Night street photography'],
  ['08', 'Clay stop-motion'],
  ['09', 'Macro insect'],
  ['10', 'Deer in autumn forest'],
  ['11', 'Live performance'],
  ['12', 'Blacksmith workshop'],
  ['13', 'Aurora campsite'],
  ['14', 'Dog on the beach'],
  ['15', 'Eagle in flight'],
  ['16', 'Cyberpunk alley'],
  ['17', 'Subway first-person view'],
  ['18', 'Tea ceremony'],
  ['19', 'Sprint in slow motion'],
  ['20', 'Terraced fields at dawn'],
  ['21', 'Paper-craft explainer'],
  ['22', 'Hand-drawn glow + live action'],
  ['23', 'Brand film'],
  ['24', 'Co-op game intro'],
  ['25', 'Aerial glacier'],
  ['26', 'Food macro'],
  ['27', '2D animation'],
  ['28', 'Watercolor'],
  ['29', 'Vintage film'],
  ['30', 'City time-lapse'],
  ['31', 'Desert caravan'],
  ['32', 'Industrial robot arm'],
  ['33', 'Laboratory reaction'],
  ['34', 'Morning bakery'],
  ['35', 'Rainy car window'],
  ['36', 'Storm lighthouse'],
  ['37', 'Pottery wheel'],
  ['38', 'Calligraphy ink'],
  ['39', 'Cat in sunlight'],
  ['40', 'Horse herd'],
  ['41', 'Abstract fluid'],
  ['42', 'Medieval market'],
  ['43', 'Rocket launch'],
  ['44', 'Volcanic lava'],
  ['45', 'Ancient library'],
  ['46', 'Skate park'],
  ['47', 'Winter cabin'],
  ['48', 'Brutalist architecture'],
  ['49', 'Victorian drama'],
  ['50', 'Glassblowing'],
].map(([id, title]) => ({
  id,
  title,
  reviewed: reviewedSceneIds.has(id),
  description: sceneDescriptions[id],
  finding: sceneFindings[id] || '',
  src: `assets/media/scene-${id}.mp4`,
  poster: `assets/media/scene-${id}-poster.jpg`,
}));

if (sceneGrid) {
  const fragment = document.createDocumentFragment();

  scenes.forEach((scene) => {
    const button = document.createElement('button');
    button.className = `scene-card${scene.id === '01' ? ' is-active' : ''}`;
    button.type = 'button';
    button.dataset.scene = scene.id;
    button.dataset.label = scene.title;
    button.dataset.src = scene.src;
    button.dataset.poster = scene.poster;
    button.dataset.reviewed = String(scene.reviewed);
    button.setAttribute('aria-pressed', String(scene.id === '01'));
    button.setAttribute('aria-label', `Scene ${scene.id}: ${scene.title}`);
    button.tabIndex = scene.id === '01' ? 0 : -1;

    const media = document.createElement('span');
    media.className = 'scene-card-media';
    const image = document.createElement('img');
    image.src = scene.poster;
    image.alt = '';
    image.width = 336;
    image.height = 128;
    image.loading = scene.id === '01' ? 'eager' : 'lazy';
    image.decoding = 'async';
    media.appendChild(image);

    if (scene.reviewed) {
      const badge = document.createElement('span');
      badge.className = 'scene-card-badge';
      badge.textContent = 'Highlight';
      media.appendChild(badge);
    }

    const copy = document.createElement('span');
    copy.className = 'scene-card-copy';
    const number = document.createElement('b');
    number.textContent = scene.id;
    const title = document.createElement('strong');
    title.textContent = scene.title;
    copy.append(number, title);
    button.append(media, copy);
    fragment.appendChild(button);
  });

  sceneGrid.appendChild(fragment);
}

const sceneButtons = [...document.querySelectorAll('[data-scene]')];
let activeSceneFilter = 'all';

const updateSceneTabStops = () => {
  const visibleButtons = sceneButtons.filter((button) => !button.hidden);
  const focusTarget = visibleButtons.find((button) => button.classList.contains('is-active')) || visibleButtons[0];
  sceneButtons.forEach((button) => {
    button.tabIndex = button === focusTarget ? 0 : -1;
  });
};

const filterScenes = () => {
  const query = sceneSearch?.value.trim().toLocaleLowerCase() || '';
  let visibleCount = 0;

  sceneButtons.forEach((button) => {
    const matchesFilter = activeSceneFilter === 'all' || button.dataset.reviewed === 'true';
    const searchableText = `${button.dataset.scene} ${button.dataset.label}`.toLocaleLowerCase();
    const isVisible = matchesFilter && searchableText.includes(query);
    button.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  if (sceneResults) {
    const scope = activeSceneFilter === 'reviewed' ? 'highlighted scenes' : 'scenes';
    sceneResults.textContent = `Showing ${visibleCount} ${scope}`;
  }
  if (sceneEmpty) sceneEmpty.hidden = visibleCount !== 0;
  updateSceneTabStops();
};

sceneSearch?.addEventListener('input', filterScenes);
sceneFilterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeSceneFilter = button.dataset.sceneFilter || 'all';
    sceneFilterButtons.forEach((filterButton) => {
      const selected = filterButton === button;
      filterButton.classList.toggle('is-active', selected);
      filterButton.setAttribute('aria-pressed', String(selected));
    });
    filterScenes();
  });
});

const syncVideoButton = () => {
  if (!video || !videoToggle || !videoActionLabel) return;
  const isPaused = video.paused;
  videoToggle.classList.toggle('is-paused', isPaused);
  videoToggle.setAttribute('aria-label', isPaused ? 'Play comparison video' : 'Pause comparison video');
  videoActionLabel.textContent = isPaused ? 'Play' : 'Pause';
};

const playVideo = async () => {
  if (!video || reducedMotion.matches || userPausedVideo) return;
  try {
    await video.play();
  } catch {
    syncVideoButton();
  }
};

if (video) {
  videoFrame?.setAttribute('aria-busy', 'false');
  if (reducedMotion.matches) video.pause();

  video.addEventListener('play', syncVideoButton);
  video.addEventListener('pause', syncVideoButton);
  const clearVideoLoading = () => {
    videoFrame?.classList.remove('is-loading');
    videoFrame?.setAttribute('aria-busy', 'false');
  };
  video.addEventListener('loadedmetadata', clearVideoLoading);
  video.addEventListener('loadeddata', clearVideoLoading);
  video.addEventListener('canplay', clearVideoLoading);
  video.addEventListener('error', clearVideoLoading);
  syncVideoButton();
}

videoToggle?.addEventListener('click', async () => {
  if (!video) return;

  if (video.paused) {
    userPausedVideo = false;
    try {
      await video.play();
    } catch {
      userPausedVideo = true;
    }
  } else {
    userPausedVideo = true;
    video.pause();
  }

  syncVideoButton();
});

const selectScene = (button, moveToPlayer = true, focusPlayer = false) => {
  if (!video || !button) return;

  const source = video.querySelector('source');
  const nextSource = button.dataset.src;
  const nextPoster = button.dataset.poster;
  const nextId = button.dataset.scene || '';
  const nextLabel = button.dataset.label || 'Video comparison';
  const scene = scenes.find((item) => item.id === nextId);

  if (!source || !nextSource || !nextPoster) return;

  if (source.getAttribute('src') !== nextSource) {
    videoFrame?.classList.add('is-loading');
    videoFrame?.setAttribute('aria-busy', 'true');
    video.pause();
    video.poster = nextPoster;
    source.src = nextSource;
    if (videoDownload) videoDownload.href = nextSource;
    video.load();
    playVideo();
  }

  if (sceneLabel) sceneLabel.textContent = nextLabel;
  if (sceneDescription) {
    sceneDescription.textContent = [scene?.description, scene?.finding].filter(Boolean).join(' ');
  }
  video.setAttribute('aria-label', `Scene ${nextId}: ${nextLabel}, six-panel visual generation comparison`);

  sceneButtons.forEach((sceneButton) => {
    const selected = sceneButton === button;
    sceneButton.classList.toggle('is-active', selected);
    sceneButton.setAttribute('aria-pressed', String(selected));
  });
  updateSceneTabStops();

  if (moveToPlayer && videoStage) {
    videoStage.scrollIntoView({
      behavior: reducedMotion.matches ? 'auto' : 'smooth',
      block: 'start',
    });
    if (focusPlayer) videoToggle?.focus({ preventScroll: true });
  }
};

sceneButtons.forEach((button) => {
  button.addEventListener('click', (event) => selectScene(button, true, event.detail === 0));
  button.addEventListener('keydown', (event) => {
    const visibleButtons = sceneButtons.filter((sceneButton) => !sceneButton.hidden);
    const currentIndex = visibleButtons.indexOf(button);
    if (visibleButtons.length === 0 || currentIndex < 0) return;
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % visibleButtons.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + visibleButtons.length) % visibleButtons.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = visibleButtons.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    sceneButtons.forEach((sceneButton) => {
      sceneButton.tabIndex = -1;
    });
    visibleButtons[nextIndex].tabIndex = 0;
    visibleButtons[nextIndex].focus();
  });
});

document.querySelectorAll('[data-scene-jump]').forEach((button) => {
  button.addEventListener('click', (event) => {
    const target = sceneButtons.find((sceneButton) => sceneButton.dataset.scene === button.dataset.sceneJump);
    selectScene(target, true, event.detail === 0);
  });
});

const fullscreenSupported = Boolean(
  videoFrame?.requestFullscreen ||
    videoFrame?.webkitRequestFullscreen ||
    video?.webkitEnterFullscreen,
);

if (fullscreenButton && !fullscreenSupported) fullscreenButton.hidden = true;

const syncFullscreenButton = () => {
  if (!fullscreenButton || !fullscreenLabel) return;
  const isFullscreen = Boolean(
    document.fullscreenElement ||
      document.webkitFullscreenElement ||
      video?.webkitDisplayingFullscreen,
  );
  fullscreenLabel.textContent = isFullscreen ? 'Collapse' : 'Expand';
  fullscreenButton.setAttribute(
    'aria-label',
    isFullscreen ? 'Exit fullscreen comparison' : 'Open fullscreen comparison',
  );
};

fullscreenButton?.addEventListener('click', async () => {
  if (!video || !videoFrame) return;

  try {
    if (document.fullscreenElement && document.exitFullscreen) {
      await document.exitFullscreen();
    } else if (document.webkitFullscreenElement && document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (video.webkitDisplayingFullscreen && video.webkitExitFullscreen) {
      video.webkitExitFullscreen();
    } else if (videoFrame.requestFullscreen) {
      await videoFrame.requestFullscreen();
    } else if (videoFrame.webkitRequestFullscreen) {
      videoFrame.webkitRequestFullscreen();
    } else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    }
  } catch {
    if (fullscreenLabel) {
      fullscreenLabel.textContent = 'Unavailable';
      window.setTimeout(() => {
        fullscreenLabel.textContent = 'Expand';
      }, 1800);
    }
  }
});

document.addEventListener('fullscreenchange', syncFullscreenButton);
document.addEventListener('webkitfullscreenchange', syncFullscreenButton);
video?.addEventListener('webkitbeginfullscreen', syncFullscreenButton);
video?.addEventListener('webkitendfullscreen', syncFullscreenButton);

if (video && 'IntersectionObserver' in window) {
  const videoObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return;
      if (entry.isIntersecting) {
        playVideo();
      } else if (!video.paused) {
        video.pause();
      }
    },
    { threshold: 0.18 },
  );

  videoObserver.observe(video);
}

document.addEventListener('visibilitychange', () => {
  if (!video) return;
  if (document.hidden) video.pause();
  else playVideo();
});

const copyButton = document.querySelector('[data-copy-code]');
const copyLabel = document.querySelector('[data-copy-label]');
const quickstart = document.querySelector('[data-quickstart]');

const copyText = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  const previousFocus = document.activeElement;
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  previousFocus?.focus();
  if (!copied) throw new Error('Copy command failed');
};

copyButton?.addEventListener('click', async () => {
  if (!quickstart || !copyLabel) return;

  const commands = [
    'git clone https://github.com/anemoi-project/anemoi.git',
    'cd anemoi',
    'scripts/setup_conda_env.sh',
    'conda activate evg',
    'scripts/run_minimax_h3.sh',
  ].join('\n');

  try {
    await copyText(commands);
    copyLabel.textContent = 'Copied';
    window.setTimeout(() => {
      copyLabel.textContent = 'Copy';
    }, 1800);
  } catch {
    copyLabel.textContent = 'Copy failed';
    window.setTimeout(() => {
      copyLabel.textContent = 'Copy';
    }, 1800);
  }
});

const handleMotionPreference = (event) => {
  if (!video) return;

  if (event.matches) {
    userPausedVideo = true;
    video.pause();
  }
};

if (reducedMotion.addEventListener) {
  reducedMotion.addEventListener('change', handleMotionPreference);
} else {
  reducedMotion.addListener(handleMotionPreference);
}
