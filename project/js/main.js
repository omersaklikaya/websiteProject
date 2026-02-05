// Theme Toggle
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector(".theme-icon");
const html = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem("theme") || "dark";
html.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
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

    // Show success message
    alert("Mesajınız alındı! En kısa sürede size dönüş yapacağız.");
    contactForm.reset();
  });
}

// Nav: sekmeye tıklanınca sadece o bölüme kaydır (mesaj yok)
function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelectorAll(".nav-menu .nav-link[data-section], a.cta-button").forEach((el) => {
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

// Priority Items Click Interaction
document.querySelectorAll(".priority-item").forEach((item) => {
  item.addEventListener("click", function () {
    // Add click animation feedback
    this.style.transform = "scale(0.95)";
    setTimeout(() => {
      this.style.transform = "";
    }, 150);

    // Optional: Add ripple effect
    const ripple = document.createElement("span");
    ripple.style.position = "absolute";
    ripple.style.borderRadius = "50%";
    ripple.style.background = "rgba(0, 217, 255, 0.3)";
    ripple.style.width = "20px";
    ripple.style.height = "20px";
    ripple.style.animation = "ripple 0.6s ease-out";
    ripple.style.pointerEvents = "none";
    
    const rect = this.getBoundingClientRect();
    ripple.style.left = (event.clientX - rect.left - 10) + "px";
    ripple.style.top = (event.clientY - rect.top - 10) + "px";
    
    this.style.position = "relative";
    this.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});
