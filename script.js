function initTypewriter() {
  const textEl = document.getElementById('typewriter-text');
  if (!textEl) return;

  const lines = ['Welcome to my portfolio!', 'Enjoy your stay :D'];
  const speedMs = 42;
  let lineIndex = 0;
  let charIndex = 0;

  textEl.innerHTML =
    '<span class="typewriter-l"></span><br><span class="typewriter-l"></span>';
  const lineSpans = textEl.querySelectorAll('.typewriter-l');

  const typeNext = () => {
    if (lineIndex >= lines.length) return;

    const current = lines[lineIndex];
    if (charIndex < current.length) {
      lineSpans[lineIndex].textContent = current.slice(0, charIndex + 1);
      charIndex += 1;
      setTimeout(typeNext, speedMs);
      return;
    }

    lineIndex += 1;
    charIndex = 0;
    setTimeout(typeNext, speedMs * 4);
  };

  typeNext();
}

initTypewriter();

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
  const tabBar = document.querySelector('.terminal-tab-bar');
  const sections = ['hero', 'projects', 'animations', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!tabs.length || !sections.length) return;

  const setActiveTab = (sectionId) => {
    tabs.forEach((tab) => {
      tab.classList.toggle('active', tab.getAttribute('href') === `#${sectionId}`);
    });
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (!section) return;

    const barHeight = tabBar ? tabBar.offsetHeight : 0;
    const top =
      section.getBoundingClientRect().top + window.scrollY - barHeight - 8;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: 'smooth',
    });
    setActiveTab(id);
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', (event) => {
      const href = tab.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      event.preventDefault();
      const id = href.slice(1);
      scrollToSection(id);
      history.pushState(null, '', href);
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
