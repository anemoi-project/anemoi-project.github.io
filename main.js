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

const signalGrid = document.querySelector('[data-signal-grid]');

if (signalGrid) {
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < 112; index += 1) {
    const cell = document.createElement('span');
    cell.className = 'signal-cell';

    if ((index * 7 + 11) % 19 < 3) {
      cell.classList.add('is-hot');
      cell.style.setProperty('--delay', `${-((index * 0.17) % 4).toFixed(2)}s`);
    } else if ((index * 5 + 3) % 23 < 3) {
      cell.classList.add('is-cool');
      cell.style.setProperty('--delay', `${-((index * 0.13) % 5).toFixed(2)}s`);
    }

    fragment.appendChild(cell);
  }

  signalGrid.appendChild(fragment);
}

const video = document.querySelector('[data-comparison-video]');
const videoFrame = video?.closest('.video-frame');
const videoToggle = document.querySelector('[data-video-toggle]');
const videoActionLabel = document.querySelector('[data-video-action-label]');
const fullscreenButton = document.querySelector('[data-fullscreen]');
const fullscreenLabel = document.querySelector('[data-fullscreen-label]');
const sceneLabel = document.querySelector('[data-scene-label]');
const sceneDescription = document.querySelector('[data-scene-description]');
const sceneFinding = document.querySelector('[data-scene-finding]');
const sceneButtons = [...document.querySelectorAll('[data-scene]')];
let userPausedVideo = reducedMotion.matches;

const sceneDescriptions = {
  product:
    'A black wireless-earbud charging case in a minimalist studio product shot. Compare reflections, earbud geometry, and shadow consistency across the six synchronized methods.',
  animation:
    'A stylized 3D animated short shown in six synchronized panels. Compare subject shape, small moving details, and temporal consistency.',
  nature:
    'A nature-documentary mountain scene shown in six synchronized panels. Compare animal detail, terrain texture, and motion continuity.',
  macro:
    'A macro view of a dragonfly perched on a stem. Compare wing structure, fine leg detail, body shape, and background stability.',
  eagle:
    'An eagle in flight across mountainous terrain. Compare silhouette integrity, wing motion, distant detail, and temporal stability.',
  tea:
    'A quiet tea ceremony shown in six synchronized panels. Compare hand motion, vessel geometry, steam, and fine object continuity.',
  city:
    'A city skyline time-lapse shown in six synchronized panels. Compare building geometry, changing light, and skyline consistency.',
  pottery:
    'Hands shape clay on a spinning pottery wheel. Compare finger continuity, the hand-to-clay boundary, and rotational motion.',
};

const sceneFindings = {
  product:
    '<strong>Observed:</strong> The project\'s difference-highlight review flags earbud geometry changes in Sol-Attn and SpargeAttn; no corresponding region is highlighted in the three EVG panels.',
  animation:
    '<strong>Observed:</strong> The review flags fine subject-detail changes in Sol-Attn and SpargeAttn; no corresponding region is highlighted in the EVG row.',
  nature:
    '<strong>Observed:</strong> The review flags differences around the small animal in Sol-Attn and SpargeAttn; no corresponding region is highlighted in the EVG row.',
  macro:
    '<strong>Observed:</strong> The review flags differences around the dragonfly head in Sol-Attn and SpargeAttn; no corresponding region is highlighted in the EVG row.',
  eagle:
    '<strong>Observed:</strong> The review flags differences around the distant flying subject in the comparison baselines; no corresponding region is highlighted in the EVG row.',
  tea:
    '<strong>Observed:</strong> The review flags hand-and-utensil detail changes in Sol-Attn and SpargeAttn; no corresponding region is highlighted in the EVG row.',
  city:
    '<strong>Observed:</strong> The review flags building-geometry changes in Sol-Attn and SpargeAttn; no corresponding region is highlighted in the EVG row.',
  pottery:
    '<strong>Observed:</strong> The review flags a hand-to-clay boundary difference in SpargeAttn; no corresponding region is highlighted in the EVG row.',
};

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

sceneButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (!video || button.classList.contains('is-active')) return;

    const source = video.querySelector('source');
    const nextSource = button.dataset.src;
    const nextPoster = button.dataset.poster;

    if (!source || !nextSource || !nextPoster) return;

    videoFrame?.classList.add('is-loading');
    videoFrame?.setAttribute('aria-busy', 'true');
    video.pause();
    video.poster = nextPoster;
    source.src = nextSource;
    video.load();

    const nextLabel = button.dataset.label || 'Video comparison';
    if (sceneLabel) sceneLabel.textContent = nextLabel;
    if (sceneDescription) {
      sceneDescription.textContent = sceneDescriptions[button.dataset.scene] || '';
    }
    if (sceneFinding) {
      sceneFinding.innerHTML = sceneFindings[button.dataset.scene] || '';
    }
    video.setAttribute('aria-label', `${nextLabel}, six-panel EVG comparison`);

    sceneButtons.forEach((sceneButton) => {
      const selected = sceneButton === button;
      sceneButton.classList.toggle('is-active', selected);
      sceneButton.setAttribute('aria-pressed', String(selected));
    });

    playVideo();
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
    'git clone https://github.com/evg-project/evg.git',
    'cd evg',
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
