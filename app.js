(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const curtain = document.querySelector('.page-curtain');
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#main-nav');
  const cache = new Map();
  let navigating = false;
  let observer;
  let copyTimer;
  let navigationQueue = null;
  let gameCleanup = () => {};
  let gameGeneration = 0;
  const routePath = (url) => url.pathname.replace(/\/$/, '/index.html');
  let renderedPath = routePath(new URL(location.href));

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  history.replaceState({ ...history.state, portfolio: true, scroll: scrollY }, '', location.href);

  function announce(text) {
    document.querySelector('.announcement').textContent = text;
  }

  function setMenu(open) {
    menuToggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  }
  menuToggle.addEventListener('click', () =>
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'),
  );
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (menu.classList.contains('is-open')) {
        setMenu(false);
        menuToggle.focus();
      }
    }
    if (event.key === 'Tab' && menu.classList.contains('is-open')) {
      const links = [menuToggle, ...menu.querySelectorAll('a')];
      if (event.shiftKey && document.activeElement === links[0]) {
        event.preventDefault();
        links.at(-1).focus();
      } else if (!event.shiftKey && document.activeElement === links.at(-1)) {
        event.preventDefault();
        menuToggle.focus();
      }
    }
  });

  function observeContent() {
    observer?.disconnect();
    const nodes = document.querySelectorAll('[data-reveal]');
    if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.08 },
    );
    for (const node of nodes) {
      node.classList.add('is-observed');
      observer.observe(node);
    }
  }

  function initializeMinigame() {
    gameCleanup();
    const generation = ++gameGeneration;
    const root = document.querySelector('[data-heist]');
    if (!root) {
      gameCleanup = () => {};
      return;
    }
    let dispose = () => {},
      loader;
    gameCleanup = () => {
      loader?.disconnect();
      dispose();
    };
    const load = async () => {
      loader?.disconnect();
      try {
        const { mountGame } = await import('./game/mount.js');
        if (generation === gameGeneration && root.isConnected) dispose = mountGame(root);
      } catch {
        if (root.isConnected)
          root.querySelector('[data-prompt]').textContent =
            'Nie udało się wczytać gry. Odśwież stronę i spróbuj ponownie.';
      }
    };
    if (!('IntersectionObserver' in window)) load();
    else {
      loader = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) load();
        },
        { rootMargin: '350px' },
      );
      loader.observe(root);
    }
  }

  function initializeGarden() {
    const water = document.querySelector('#water-flower');
    if (!water) return;
    let stage = 0;
    let wateringTimer;
    const messages = [
      'Nasionko czeka na wodę.',
      'Jest kiełek. Podlej jeszcze raz.',
      'Wyrosły liście. Jeszcze trochę wody.',
      'Pąk jest gotowy. Podlej ostatni raz.',
      'Kwiat zakwitł. Możesz zacząć od nowa.',
    ];
    water.addEventListener('click', () => {
      stage = (stage + 1) % 5;
      document.querySelector('.garden-plant').dataset.stage = stage;
      document.querySelector('#growth-progress').value = stage;
      document.querySelector('#growth-progress').textContent = messages[stage];
      document.querySelector('#plant-status').textContent = messages[stage];
      water.querySelector('span').textContent =
        stage === 4 ? 'Zacznij od nowa' : stage === 0 ? 'Podlej nasionko' : 'Podlej roślinę';
      const scene = document.querySelector('.garden-scene');
      clearTimeout(wateringTimer);
      scene.classList.remove('watering');
      requestAnimationFrame(() => scene.classList.add('watering'));
      wateringTimer = setTimeout(() => scene.classList.remove('watering'), 650);
    });
  }

  // kolko w szkicu kodu skacze po liniach po kliknieciu w ogrodku
  function initializeCodeSketch() {
    const sketch = document.querySelector('[data-code-sketch]');
    const water = document.querySelector('#water-flower');
    if (!sketch || !water) return;
    const marker = sketch.querySelector('[data-marker]');
    const steps = [...sketch.querySelectorAll('[data-run]')].sort(
      (a, b) => a.dataset.run - b.dataset.run,
    );
    if (!steps.length) return;
    let timers = [];
    function circle(line) {
      const box = line.getBBox();
      marker.style.cx = `${box.x + box.width / 2}px`;
      marker.style.cy = `${box.y + box.height / 2}px`;
      marker.style.rx = `${box.width / 2 + 9}px`;
    }
    circle(steps[0]);
    water.addEventListener('click', () => {
      timers.forEach(clearTimeout);
      const delay = reducedMotion.matches ? 0 : 200;
      sketch.classList.add('is-running');
      timers = steps.map((line, i) => setTimeout(() => circle(line), i * delay));
      timers.push(
        setTimeout(() => {
          circle(steps[0]);
          sketch.classList.remove('is-running');
        }, steps.length * delay + 600),
      );
    });
  }

  async function copyEmail(button) {
    const text = button.querySelector('span:last-child');
    let copied = false;
    try {
      await navigator.clipboard.writeText(button.dataset.email);
      copied = true;
    } catch {
      const field = document.createElement('textarea');
      field.value = button.dataset.email;
      field.setAttribute('readonly', '');
      field.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.append(field);
      field.select();
      try {
        copied = document.execCommand('copy');
      } catch {
        copied = false;
      }
      field.remove();
    }
    text.textContent = copied ? 'Skopiowano ✓' : 'Zaznacz adres powyżej';
    announce(
      copied
        ? 'Adres e-mail został skopiowany.'
        : 'Nie udało się skopiować. Możesz zaznaczyć i skopiować adres powyżej.',
    );
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      if (button.isConnected) text.textContent = 'Kopiuj adres';
    }, 3500);
    button.focus({ preventScroll: true });
  }
  document.addEventListener('click', (event) => {
    const copy = event.target.closest('.copy-email');
    if (copy) copyEmail(copy);
  });

  function localPage(link) {
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self'))
      return null;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return null;
    if (routePath(url) === routePath(new URL(location.href)) && url.search === location.search)
      return null;
    if (!url.pathname.endsWith('.html') && !url.pathname.endsWith('/')) return null;
    return url;
  }

  async function fetchPage(url) {
    const key = url.origin + url.pathname + url.search;
    if (cache.has(key)) return cache.get(key);
    const promise = fetch(key, { signal: AbortSignal.timeout(10000) }).then(async (response) => {
      if (!response.ok || !response.headers.get('content-type')?.includes('text/html'))
        throw new Error('Page unavailable');
      const parsed = new DOMParser().parseFromString(await response.text(), 'text/html');
      if (!parsed.querySelector('main') || !parsed.body.dataset.page)
        throw new Error('Not a portfolio page');
      return parsed;
    });
    cache.set(key, promise);
    try {
      return await promise;
    } catch (error) {
      cache.delete(key);
      throw error;
    }
  }

  function motionComplete(element, fallback) {
    if (reducedMotion.matches) return Promise.resolve();
    return new Promise((resolve) => {
      const done = (event) => {
        if (event && event.target !== element) return;
        element.removeEventListener('animationend', done);
        clearTimeout(timer);
        resolve();
      };
      const timer = setTimeout(() => done(), fallback);
      element.addEventListener('animationend', done);
    });
  }

  async function navigate(url, { pop = false, scroll = 0, title = '' } = {}) {
    if (navigating) {
      if (pop) navigationQueue = { url, options: { pop, scroll, title } };
      return;
    }
    navigating = true;
    setMenu(false);
    document.querySelector('main').setAttribute('aria-busy', 'true');
    if (!pop)
      history.replaceState(
        { ...history.state, portfolio: true, scroll: scrollY },
        '',
        location.href,
      );
    const content = fetchPage(url);
    content.catch(() => {});
    const scribble = curtain.querySelector('.scribble');
    const destination = [...menu.querySelectorAll('a')].find(
      (item) => routePath(new URL(item.href)) === routePath(url),
    );
    curtain.querySelector('.curtain-title').textContent =
      title || destination?.textContent || 'Strona główna';
    curtain.classList.remove('leaving');
    if (!reducedMotion.matches) curtain.classList.add('covering');
    try {
      const [page] = await Promise.all([content, motionComplete(scribble, 900)]);
      const main = page.querySelector('main').cloneNode(true);
      gameCleanup();
      gameGeneration++;
      document.querySelector('main').replaceWith(main);
      document.querySelector('.next-page')?.remove();
      const next = page.querySelector('.next-page');
      if (next) main.after(next.cloneNode(true));
      document.body.dataset.page = page.body.dataset.page;
      renderedPath = routePath(url);
      document.title = page.title;
      document.querySelector('meta[name="description"]').content = page.querySelector(
        'meta[name="description"]',
      ).content;
      const activePath = url.pathname.endsWith('/') ? `${url.pathname}index.html` : url.pathname;
      document.querySelectorAll('.main-nav a').forEach((link) => {
        if (new URL(link.href).pathname === activePath) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
      if (!pop && !navigationQueue) history.pushState({ portfolio: true, scroll: 0 }, '', url.href);
      const anchor = url.hash
        ? document.getElementById(decodeURIComponent(url.hash.slice(1)))
        : null;
      window.scrollTo({
        top: anchor ? anchor.getBoundingClientRect().top + scrollY - 25 : scroll,
        behavior: 'instant',
      });
      main.focus({ preventScroll: true });
      initializeGarden();
      initializeCodeSketch();
      initializeMinigame();
      observeContent();
      announce(`Strona: ${page.title}`);
      if (!reducedMotion.matches) {
        curtain.classList.replace('covering', 'leaving');
        await motionComplete(scribble, 900);
      }
    } catch {
      location.assign(url.href);
      return;
    } finally {
      curtain.classList.remove('covering', 'leaving');
      document.querySelector('main').removeAttribute('aria-busy');
      navigating = false;
      if (navigationQueue) {
        const queued = navigationQueue;
        navigationQueue = null;
        navigate(queued.url, queued.options);
      }
    }
  }

  document.addEventListener('click', (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const link = event.target.closest('a');
    const url = localPage(link);
    if (!url || location.protocol === 'file:') return;
    event.preventDefault();
    const destination = [...menu.querySelectorAll('a')].find(
      (item) => routePath(new URL(item.href)) === routePath(url),
    );
    navigate(url, { title: destination?.textContent || 'Strona główna' });
  });
  window.addEventListener('popstate', (event) => {
    const url = new URL(location.href);
    if (!navigating && routePath(url) === renderedPath) {
      const anchor = url.hash
        ? document.getElementById(decodeURIComponent(url.hash.slice(1)))
        : null;
      window.scrollTo({
        top: anchor ? anchor.getBoundingClientRect().top + scrollY - 25 : event.state?.scroll || 0,
        behavior: 'instant',
      });
      return;
    }
    navigate(url, { pop: true, scroll: event.state?.scroll || 0 });
  });
  let scrollTimer;
  window.addEventListener(
    'scroll',
    () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        if (!navigating)
          history.replaceState(
            { ...history.state, portfolio: true, scroll: scrollY },
            '',
            location.href,
          );
      }, 150);
    },
    { passive: true },
  );
  window.addEventListener('pageshow', () => {
    curtain.classList.remove('covering', 'leaving');
    navigating = false;
  });
  document.addEventListener(
    'pointerover',
    (event) => {
      const url = localPage(event.target.closest('a'));
      if (url && navigator.connection?.saveData !== true) fetchPage(url).catch(() => {});
    },
    { passive: true },
  );
  // magnes na przyciskach (tylko mysz)
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  document.addEventListener(
    'pointermove',
    (event) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      const btn = event.target.closest('[data-magnetic]');
      if (!btn) return;
      const box = btn.getBoundingClientRect();
      const x = (event.clientX - box.left - box.width / 2) * 0.2;
      const y = (event.clientY - box.top - box.height / 2) * 0.3;
      btn.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    },
    { passive: true },
  );
  document.addEventListener(
    'pointerout',
    (event) => {
      const btn = event.target.closest('[data-magnetic]');
      if (btn && !btn.contains(event.relatedTarget)) btn.style.translate = '';
    },
    { passive: true },
  );
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      document.querySelectorAll('.is-observed').forEach((node) => node.classList.add('is-visible'));
    }
  });
  initializeGarden();
  initializeCodeSketch();
  initializeMinigame();
  observeContent();
})();
