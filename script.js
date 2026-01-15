// script.js
(() => {
  const header = document.querySelector(".header");
  const burger = document.querySelector(".burger");
  const mobileMenu = document.getElementById("mobileMenu");
  const mLinks = mobileMenu?.querySelectorAll("a") || [];
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = ["home", "services", "projects", "reviews", "contact"]
    .map(id => document.getElementById(id))
    .filter(Boolean);

  // Year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Header style on scroll
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 6);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  const setMenu = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    if (open) {
      mobileMenu.hidden = false;
      requestAnimationFrame(() => mobileMenu.classList.add("open"));
      document.body.style.overflow = "hidden";
      burger.classList.add("is-open");
      // animate burger
      const spans = burger.querySelectorAll("span");
      if (spans.length === 3) {
        spans[0].style.transform = "translateY(6px) rotate(45deg)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "translateY(-6px) rotate(-45deg)";
      }
    } else {
      mobileMenu.classList.remove("open");
      document.body.style.overflow = "";
      burger.classList.remove("is-open");
      const spans = burger.querySelectorAll("span");
      if (spans.length === 3) {
        spans[0].style.transform = "";
        spans[1].style.opacity = "";
        spans[2].style.transform = "";
      }
      // wait a tick for CSS paint then hide
      setTimeout(() => (mobileMenu.hidden = true), 140);
    }
  };

  burger?.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") === "true";
    setMenu(!open);
  });

  // Close mobile menu on link click
  mLinks.forEach(a => {
    a.addEventListener("click", () => setMenu(false));
  });

  // Click outside to close (mobile)
  document.addEventListener("click", (e) => {
    const open = burger?.getAttribute("aria-expanded") === "true";
    if (!open) return;
    const isInside =
      burger.contains(e.target) ||
      mobileMenu.contains(e.target);
    if (!isInside) setMenu(false);
  });

  // Reveal on scroll
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => io.observe(el));

  // Active nav link based on section in view
  const setActive = (id) => {
    navLinks.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`));
  };

  const sectionIO = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible?.target?.id) setActive(visible.target.id);
  }, { rootMargin: "-30% 0px -55% 0px", threshold: [0.12, 0.25, 0.5] });

  sections.forEach(sec => sectionIO.observe(sec));

  // Smooth focus ring fix for keyboard users
  let usingKeyboard = false;
  window.addEventListener("keydown", (e) => {
    if (e.key === "Tab") usingKeyboard = true;
  }, { passive: true });
  window.addEventListener("mousedown", () => { usingKeyboard = false; }, { passive: true });

  document.addEventListener("focusin", (e) => {
    if (!usingKeyboard) return;
    const el = e.target;
    if (el && el.matches && el.matches("a,button,input,textarea")) {
      el.style.outline = "none";
      el.style.boxShadow = "0 0 0 6px rgba(43,121,255,.14)";
      setTimeout(() => { el.style.boxShadow = ""; }, 600);
    }
  });

  // Micro-parallax for hero image
  const heroImg = document.querySelector(".hero-img");
  if (heroImg && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
    let raf = 0;
    window.addEventListener("mousemove", (e) => {
      if (window.innerWidth < 980) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        heroImg.style.transform = `scale(1.03) translate(${x * 6}px, ${y * 4}px)`;
      });
    }, { passive: true });

    window.addEventListener("mouseleave", () => {
      heroImg.style.transform = "scale(1.02)";
    });
  }
})();
