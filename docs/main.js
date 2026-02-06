// Theme Toggle – smooth visible transition (expanding circle from button)
const themeToggle = document.getElementById("themeToggle");
const html = document.documentElement;

const THEME_COLORS = { dark: "#0a0a0a", light: "#f5f2ed" };

// Load saved theme
const savedTheme = localStorage.getItem("theme") || "dark";
html.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  /* Önce temayı anında değiştir – ekrandaki her şey hemen yeni temada görünsün */
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);

  const rect = themeToggle.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  /* Overlay eski tema renginde; büyük daire ekranı kaplıyor, küçülünce alttaki (yeni tema) içerik görünür */
  const overlay = document.createElement("div");
  overlay.className = "theme-overlay theme-overlay--reveal";
  overlay.style.background = THEME_COLORS[currentTheme];
  overlay.style.left = x + "px";
  overlay.style.top = y + "px";
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => overlay.classList.remove("theme-overlay--reveal"));
  });

  overlay.addEventListener("transitionend", () => {
    overlay.remove();
  }, { once: true });
});

function updateThemeIcon() {
  /* İkon görünürlüğü html[data-theme] ile CSS’te yönetiliyor */
}

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const navMenu = document.querySelector(".nav-menu");

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    mobileMenuToggle.classList.toggle("active");
  });
}

// Form Submission
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // TODO: Implement form submission service (Formspree, EmailJS, etc.)
    console.log("Form submitted:", data);

    // Show success message (dil: i18n)
    const lang = typeof getLang === "function" ? getLang() : "tr";
    const msg = typeof I18N !== "undefined" && I18N[lang] && I18N[lang].contact_successMessage
      ? I18N[lang].contact_successMessage
      : "Mesajınız alındı! En kısa sürede size dönüş yapacağız.";
    alert(msg);
    contactForm.reset();
  });
}

// Nav: sekmeye tıklanınca sadece o bölüme kaydır (mesaj yok)
function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelectorAll(".nav-menu .nav-link[data-section], a.cta-button, a.nav-logo").forEach((el) => {
  el.addEventListener("click", function (e) {
    const href = this.getAttribute("href") || "";
    if (href.startsWith("#")) {
      e.preventDefault();
      const section = this.getAttribute("data-section") || href.replace("#", "");
      if (section) scrollToSection(section);
      document.querySelector(".nav-menu")?.classList.remove("active");
    }
  });
});

// Sayfa yüklendiğinde hash varsa o bölüme kaydır
window.addEventListener("load", () => {
  const hash = (window.location.hash || "").replace("#", "");
  if (["home", "about", "portfolio", "contact"].includes(hash)) scrollToSection(hash);
});
window.addEventListener("hashchange", () => {
  const hash = (window.location.hash || "").replace("#", "");
  if (["home", "about", "portfolio", "contact"].includes(hash)) scrollToSection(hash);
});

// Scroll Animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll(".priority-item, .about-text").forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(el);
});

// Priority items: tıklamada ripple/animasyon yok (sadece hover animasyonu)

// Portföy kartları: tıklanınca site linki yoksa uyarı (ileride href ile yönlendirilebilir)
document.querySelectorAll(".portfolio-item").forEach((item) => {
  item.addEventListener("click", function (e) {
    const url = this.getAttribute("href");
    if (!url || url === "#") {
      e.preventDefault();
      alert("Bu proje için site linki henüz eklenmedi. Yakında eklenecektir.");
    }
  });
});

// İletişim: GitHub, LinkedIn, Twitter – ikon ve isim tıklanınca aynı linke gider; link yoksa uyarı
document.querySelectorAll(".info-item").forEach((item) => {
  const textLink = item.querySelector(".info-content .info-link[data-social]");
  const iconLink = item.querySelector(".info-link-icon[data-social]");
  if (textLink && iconLink) iconLink.setAttribute("href", textLink.getAttribute("href") || "#");
});
document.querySelectorAll(".info-link[data-social]").forEach((link) => {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (!href || href === "#") {
      e.preventDefault();
      alert("Bu hesabın linki henüz eklenmedi. Yakında eklenecektir.");
    }
  });
});

