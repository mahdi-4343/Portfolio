function toggleMoblieMenu() {
  const menu = document.getElementById("menu");
  const toggle = document.querySelector(".mobile-toggle");
  if (!menu) return;

  const isOpen = menu.classList.toggle("active");
  if (toggle) {
    toggle.setAttribute("aria-expanded", String(isOpen));
  }
}

function initHeaderScroll() {
  const header =
    document.getElementById("site-header") || document.querySelector("header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 24);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function revealElement(el) {
  if (!el || el.classList.contains("visible")) return;
  el.classList.add("visible");
  animateProgressBars(el);
}

function initRevealAnimations() {
  const reveals = Array.from(document.querySelectorAll(".reveal"));
  if (!reveals.length) return;

  // Always show content that is already on screen, then observe the rest
  const showInView = () => {
    reveals.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const inView =
        rect.top < window.innerHeight * 0.92 && rect.bottom > 40;
      if (inView) revealElement(el);
    });
  };

  showInView();

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealElement(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );

    reveals.forEach((el) => {
      if (!el.classList.contains("visible")) observer.observe(el);
    });
  } else {
    // Fallback browsers: reveal everything
    reveals.forEach(revealElement);
  }

  // Safety net — never leave sections stuck invisible
  window.setTimeout(() => {
    reveals.forEach(revealElement);
  }, 2500);
}

function animateProgressBars(scope) {
  scope.querySelectorAll(".progress-fill[data-width]").forEach((bar) => {
    const width = bar.getAttribute("data-width");
    // Force a reflow so the width transition always plays
    bar.style.width = "0%";
    void bar.offsetWidth;
    requestAnimationFrame(() => {
      bar.style.width = `${width}%`;
    });
  });
}

function initFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        closeMobileMenu();
        return;
      }

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      closeMobileMenu();
    });
  });
}

function closeMobileMenu() {
  const menu = document.getElementById("menu");
  const toggle = document.querySelector(".mobile-toggle");
  if (menu?.classList.contains("active")) {
    menu.classList.remove("active");
  }
  if (toggle) toggle.setAttribute("aria-expanded", "false");
}

function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  const onScroll = () => {
    btn.classList.toggle("is-visible", window.scrollY > 480);
  };

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initActiveNav() {
  const sections = [
    document.getElementById("home"),
    document.getElementById("skills"),
    document.getElementById("ongoing-projects"),
    document.getElementById("Projects"),
  ].filter(Boolean);

  const links = document.querySelectorAll("[data-nav]");
  if (!sections.length || !links.length) return;

  const setActive = (id) => {
    links.forEach((link) => {
      const match = link.getAttribute("data-nav") === id;
      link.classList.toggle("is-active", match);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActive(visible.target.id);
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] }
  );

  sections.forEach((section) => observer.observe(section));
  setActive("home");
}

function toLocaleDigits(value, usePersian) {
  const str = String(value);
  if (!usePersian) return str;
  return str.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

function initStatCounters() {
  const stats = document.querySelectorAll("[data-count]");
  if (!stats.length) return;

  const usePersian = document.documentElement.lang === "fa";

  const animate = (el) => {
    if (el.dataset.counted === "true") return;
    el.dataset.counted = "true";

    const target = Number(el.getAttribute("data-count")) || 0;
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1100;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = toLocaleDigits(value, usePersian) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  stats.forEach((stat) => {
    const rect = stat.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      animate(stat);
    } else {
      observer.observe(stat);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".mobile-toggle");
  if (toggle) toggle.setAttribute("aria-expanded", "false");

  initHeaderScroll();
  initRevealAnimations();
  initFooterYear();
  initSmoothAnchors();
  initBackToTop();
  initActiveNav();
  initStatCounters();
});
