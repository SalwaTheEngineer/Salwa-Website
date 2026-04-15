const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const themeToggle = document.querySelector("#themeToggle");
const themeLabel = document.querySelector(".theme-label");
const themeIcon = document.querySelector(".theme-icon");
const year = document.querySelector("#year");
const revealElements = document.querySelectorAll(".reveal");
const introOverlay = document.querySelector("#introOverlay");
const introName = document.querySelector(".intro-name");
const themeStorageKey = "portfolio-theme";

const applyTheme = (theme) => {
  const isDark = theme === "dark";
  document.body.classList.toggle("theme-dark", isDark);

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isDark));
  }

  if (themeLabel) {
    themeLabel.textContent = isDark ? "Light" : "Dark";
  }

  if (themeIcon) {
    themeIcon.textContent = isDark ? "☀️" : "🌙";
  }
};

const savedTheme = window.localStorage.getItem(themeStorageKey);
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

if (year) {
  year.textContent = new Date().getFullYear();
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const willBeDark = !document.body.classList.contains("theme-dark");
    const nextTheme = willBeDark ? "dark" : "light";
    applyTheme(nextTheme);
    window.localStorage.setItem(themeStorageKey, nextTheme);
  });
}

if (introOverlay) {
  const playIntro = () => {
    introName?.classList.add("intro-visible");

    window.setTimeout(() => {
      introName?.classList.add("shrink-to-header");
    }, 1250);

    window.setTimeout(() => {
      introOverlay.classList.add("is-hidden");
      document.body.classList.remove("intro-active");
      document.body.classList.add("site-intro-complete");
    }, 3200);
  };

  if (document.readyState === "complete" || document.readyState === "interactive") {
    playIntro();
  } else {
    document.addEventListener("DOMContentLoaded", playIntro, { once: true });
  }
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

for (const navItem of navItems) {
  navItem.addEventListener("click", () => {
    if (navLinks?.classList.contains("open")) {
      navLinks.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    }
  });
}

if (revealElements.length > 0) {
  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
  });

  const observer = new IntersectionObserver(
    (entries, revealObserver) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      }
    },
    {
      threshold: 0.15,
    }
  );

  for (const element of revealElements) {
    observer.observe(element);
  }
}
