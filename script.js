function initTypewriter() {
  const textEl = document.getElementById('typewriter-text');
  if (!textEl) return;

  const text = ' Welcome to my portfolio! Enjoy your stay :D';
  const speedMs = 42;
  let index = 0;

  const typeNext = () => {
    if (index < text.length) {
      textEl.textContent = text.slice(0, index + 1);
      index += 1;
      setTimeout(typeNext, speedMs);
    }
  };

  typeNext();
}

initTypewriter();

function initSidebarToggle() {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebar-toggle');
  if (!sidebar || !toggle) return;

  const applyState = (collapsed) => {
    sidebar.classList.toggle('collapsed', collapsed);
    document.body.classList.toggle('sidebar-collapsed', collapsed);
    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.setAttribute(
      'aria-label',
      collapsed ? 'Expand navigation' : 'Collapse navigation'
    );
    toggle.textContent = collapsed ? '›' : '‹';
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  };

  const storedPreference = localStorage.getItem('sidebar-collapsed');
  const savedCollapsed =
    storedPreference !== null
      ? storedPreference === 'true'
      : window.innerWidth <= 720;
  applyState(savedCollapsed);

  toggle.addEventListener('click', () => {
    applyState(!sidebar.classList.contains('collapsed'));
  });
}

initSidebarToggle();

function initLineNumbers() {
  const gutter = document.getElementById('line-gutter');
  const content = document.querySelector('.terminal-content');
  if (!gutter || !content) return;

  const lineHeight = 28;

  const render = () => {
    const contact = document.getElementById('contact');
    let endPx = content.scrollHeight;

    if (contact) {
      const contentTop = content.getBoundingClientRect().top;
      const contactBottom = contact.getBoundingClientRect().bottom;
      endPx = contactBottom - contentTop + lineHeight * 0.5;
      endPx = Math.min(endPx, content.scrollHeight);
    }

    const lineCount = Math.max(Math.ceil(endPx / lineHeight), 1);

    gutter.innerHTML = Array.from({ length: lineCount }, (_, index) => {
      const line = index + 1;
      return `<span class="line-number">${line}</span>`;
    }).join('');

    gutter.style.minHeight = `${endPx}px`;
  };

  render();
  window.addEventListener('resize', render);

  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(render);
    observer.observe(content);
  }
}

initLineNumbers();

function initTerminalTabs() {
  const tabs = document.querySelectorAll('.terminal-tab');
  const sections = ['hero', 'about', 'projects', 'animations', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!tabs.length || !sections.length) return;

  const setActiveTab = (sectionId) => {
    tabs.forEach((tab) => {
      tab.classList.toggle('active', tab.getAttribute('href') === `#${sectionId}`);
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const id = tab.getAttribute('href')?.slice(1);
      if (id) setActiveTab(id);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible[0]) {
        setActiveTab(visible[0].target.id);
      }
    },
    {
      rootMargin: '-35% 0px -45% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    }
  );

  sections.forEach((section) => observer.observe(section));
}

initTerminalTabs();

const CONTACT_EMAIL = 'Salwashuman78@gmail.com';
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

if (form && statusEl) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const honey = form.querySelector('[name="_honey"]');
    if (honey && honey.value) {
      return;
    }

    const submitBtn = form.querySelector('.contact-submit');
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    submitBtn.disabled = true;
    statusEl.textContent = 'sending...';
    statusEl.className = 'form-status sending';

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Portfolio message from ${name}`,
          _template: 'table',
        }),
      });

      if (!response.ok) {
        throw new Error('Form submit failed');
      }

      statusEl.textContent = 'message sent — thanks!';
      statusEl.className = 'form-status success';
      form.reset();
    } catch {
      statusEl.textContent =
        'could not send. try again or email me directly.';
      statusEl.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
    }
  });
}
