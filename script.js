// Loader Management
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.classList.add("hidden");
      // Start reveal animations after loader
      setTimeout(initRevealAnimations, 300);
    }
  }, 2000);
});

// Reveal Animations
function initRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");

  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add delay based on element position for staggered effect
        setTimeout(() => {
          entry.target.classList.add("revealed");
        }, index * 100);

        // Unobserve after revealing
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

// Theme Management
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById("themeToggle");
    this.body = document.body;
    this.themeIcon = this.themeToggle?.querySelector("i");
    this.init();
  }

  init() {
    // Check saved theme or default to dark
    const currentTheme = localStorage.getItem("theme") || "dark";
    this.applyTheme(currentTheme);

    if (this.themeToggle) {
      this.themeToggle.addEventListener("click", () => {
        this.toggleTheme();
      });
    }
  }

  applyTheme(theme) {
    if (theme === "light") {
      this.body.classList.add("light-theme");
      if (this.themeIcon) {
        this.themeIcon.classList.remove("fa-sun");
        this.themeIcon.classList.add("fa-moon");
      }
    } else {
      this.body.classList.remove("light-theme");
      if (this.themeIcon) {
        this.themeIcon.classList.remove("fa-moon");
        this.themeIcon.classList.add("fa-sun");
      }
    }
  }

  toggleTheme() {
    const isLight = this.body.classList.contains("light-theme");

    if (isLight) {
      this.body.classList.remove("light-theme");
      this.themeIcon.classList.remove("fa-moon");
      this.themeIcon.classList.add("fa-sun");
      localStorage.setItem("theme", "dark");
    } else {
      this.body.classList.add("light-theme");
      this.themeIcon.classList.remove("fa-sun");
      this.themeIcon.classList.add("fa-moon");
      localStorage.setItem("theme", "light");
    }
  }
}

// Navigation Management
class NavigationManager {
  constructor() {
    this.hamburger = document.getElementById("hamburger");
    this.navMenu = document.getElementById("navMenu");
    this.navLinks = document.querySelectorAll(".nav-link");
    this.sections = document.querySelectorAll("section[id]");
    this.init();
  }

  init() {
    // Mobile menu toggle
    if (this.hamburger && this.navMenu) {
      this.hamburger.addEventListener("click", () => {
        this.toggleMobileMenu();
      });
    }

    // Smooth scrolling
    this.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href");
        const target = document.querySelector(targetId);

        if (target) {
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }

        this.closeMobileMenu();
      });
    });

    // Active link highlighting
    window.addEventListener("scroll", () => {
      this.updateActiveLink();
    });

    // Initial active link
    this.updateActiveLink();
  }

  toggleMobileMenu() {
    this.hamburger.classList.toggle("active");
    this.navMenu.classList.toggle("active");
  }

  closeMobileMenu() {
    this.hamburger.classList.remove("active");
    this.navMenu.classList.remove("active");
  }

  updateActiveLink() {
    const scrollPosition = window.scrollY + 100;

    this.sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        this.navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }
}

// Form Handler
class FormHandler {
  constructor() {
    this.contactForm = document.getElementById("contactForm");
    this.init();
  }

  init() {
    if (this.contactForm) {
      this.contactForm.addEventListener("submit", (e) => {
        this.handleSubmit(e);
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.contactForm);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    if (this.validateForm(data)) {
      this.showNotification(
        "Message sent successfully! This is a demo.",
        "success"
      );
      this.contactForm.reset();
    }
  }

  validateForm(data) {
    if (!data.name || !data.email || !data.subject || !data.message) {
      this.showNotification("Please fill in all fields", "error");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      this.showNotification("Please enter a valid email address", "error");
      return false;
    }

    return true;
  }

  showNotification(message, type) {
    // Remove existing notification
    const existing = document.querySelector(".notification");
    if (existing) existing.remove();

    // Create notification
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas ${
                          type === "success"
                            ? "fa-check-circle"
                            : "fa-exclamation-circle"
                        }"></i>
                        <span>${message}</span>
                    </div>
                    <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem;">&times;</button>
                `;

    const bgColor =
      type === "success"
        ? "var(--color-accent-green)"
        : "var(--color-accent-orange)";
    notification.style.cssText = `
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: ${bgColor};
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    max-width: 400px;
                    animation: slideInRight 0.3s ease-out;
                `;

    // Add animation styles
    if (!document.querySelector("#notification-styles")) {
      const style = document.createElement("style");
      style.id = "notification-styles";
      style.textContent = `
                        @keyframes slideInRight {
                            from { transform: translateX(100%); opacity: 0; }
                            to { transform: translateX(0); opacity: 1; }
                        }
                    `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Auto remove
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }
}

// Enhanced Interactions
class EnhancedInteractions {
  constructor() {
    this.init();
  }

  init() {
    // Add enhanced hover effects
    this.addSkillHoverEffects();
    this.addProjectCardEffects();

    // Add typing animation to hero subtitle
    setTimeout(() => {
      this.addTypingAnimation();
    }, 2500);
  }

  addSkillHoverEffects() {
    const skillItems = document.querySelectorAll(".skill-item");
    skillItems.forEach((item) => {
      item.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-4px) scale(1.02)";
      });

      item.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0) scale(1)";
      });
    });
  }

  addProjectCardEffects() {
    const projectCards = document.querySelectorAll(".project-card");
    projectCards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.style.borderColor = "var(--color-primary)";
      });

      card.addEventListener("mouseleave", function () {
        this.style.borderColor = "var(--color-primary-border)";
      });
    });
  }

  addTypingAnimation() {
    const heroSubtitle = document.querySelector(".hero-subtitle");
    if (heroSubtitle && !heroSubtitle.classList.contains("typing-done")) {
      const originalText = heroSubtitle.textContent;
      heroSubtitle.textContent = "";
      heroSubtitle.classList.add("typing-done");

      this.typeWriter(heroSubtitle, originalText, 80);
    }
  }

  typeWriter(element, text, speed) {
    let i = 0;
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ThemeManager();
  new NavigationManager();
  new FormHandler();
  new EnhancedInteractions();
});

// Performance optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Optimized scroll handler
window.addEventListener(
  "scroll",
  debounce(() => {
    // Any additional scroll-based functionality can be added here
  }, 10)
);
