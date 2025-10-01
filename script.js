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
const initRevealAnimations = () => {
  const revealElements = document.querySelectorAll(".reveal");

  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("revealed");
        }, index * 100);

        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
};

// Theme Management
const ThemeManager = (() => {
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;
  const themeIcon = themeToggle?.querySelector("i");

  const applyTheme = (theme) => {
    if (theme === "light") {
      body.classList.add("light-theme");
      if (themeIcon) {
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
      }
    } else {
      body.classList.remove("light-theme");
      if (themeIcon) {
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
      }
    }
  };

  const toggleTheme = () => {
    const isLight = body.classList.contains("light-theme");

    if (isLight) {
      body.classList.remove("light-theme");
      themeIcon?.classList.remove("fa-moon");
      themeIcon?.classList.add("fa-sun");
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.add("light-theme");
      themeIcon?.classList.remove("fa-sun");
      themeIcon?.classList.add("fa-moon");
      localStorage.setItem("theme", "light");
    }
  };

  const init = () => {
    const currentTheme = localStorage.getItem("theme") || "dark";
    applyTheme(currentTheme);

    if (themeToggle) {
      themeToggle.addEventListener("click", toggleTheme);
    }
  };

  return { init };
})();

// Navigation Management
const NavigationManager = (() => {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  const toggleMobileMenu = () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  };

  const closeMobileMenu = () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  };

  const updateActiveLink = () => {
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  };

  const init = () => {
    if (hamburger && navMenu) {
      hamburger.addEventListener("click", toggleMobileMenu);
    }

    navLinks.forEach((link) => {
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

        closeMobileMenu();
      });
    });

    window.addEventListener("scroll", () => {
      updateActiveLink();
      closeMobileMenu();
    });

    updateActiveLink();
  };

  return { init };
})();

//Notification handler
const showNotification = (message, type) => {
  const existing = document.querySelector(".notification");
  if (existing) existing.remove();

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <i class="fas ${
          type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
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

  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
};

// Form Handler
const FormHandler = (() => {
  const contactForm = document.getElementById("contactForm");

  const validateForm = (data) => {
    if (!data.name || !data.email || !data.subject || !data.message) {
      showNotification("Please fill in all fields", "error");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showNotification("Please enter a valid email address", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    if (validateForm(data)) {
      showNotification("Message sent successfully!", "success");
      contactForm.reset();
    }
  };

  const init = () => {
    if (contactForm) {
      contactForm.addEventListener("submit", handleSubmit);
    }
  };

  return { init };
})();

// Enhanced Interactions
const EnhancedInteractions = (() => {
  const addSkillHoverEffects = () => {
    const skillItems = document.querySelectorAll(".skill-item");
    skillItems.forEach((item) => {
      item.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-4px) scale(1.02)";
      });
      item.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0) scale(1)";
      });
    });
  };

  const addProjectCardEffects = () => {
    const projectCards = document.querySelectorAll(".project-card");
    projectCards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.style.borderColor = "var(--color-primary)";
      });
      card.addEventListener("mouseleave", function () {
        this.style.borderColor = "var(--color-primary-border)";
      });
    });
  };

  const typeWriter = (element, text, speed) => {
    let i = 0;
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    };
    type();
  };

  const addTypingAnimation = () => {
    const heroSubtitle = document.querySelector(".hero-subtitle");
    if (heroSubtitle && !heroSubtitle.classList.contains("typing-done")) {
      const originalText = heroSubtitle.textContent;
      heroSubtitle.textContent = "";
      heroSubtitle.classList.add("typing-done");

      typeWriter(heroSubtitle, originalText, 80);
    }
  };

  const init = () => {
    addSkillHoverEffects();
    addProjectCardEffects();
    setTimeout(addTypingAnimation, 2500);
  };

  return { init };
})();

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  ThemeManager.init();
  NavigationManager.init();
  FormHandler.init();
  EnhancedInteractions.init();
});

// Performance optimization
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Optimized scroll handler
window.addEventListener(
  "scroll",
  debounce(() => {
    // Any additional scroll-based functionality can be added here
    if (window.scrollY > 100) {
      document.getElementById("scroll-down").style.display = "none";
    } else {
      document.getElementById("scroll-down").style.display = "block";
    }
  }, 10)
);

// Event listener on logo image
document.getElementById("logo-img").addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

//Live Demo handler
// const liveDemoBtn = document.getElementById('live-demo-btn');
const projectLinks = document.querySelectorAll(".project-link");

projectLinks.forEach((projectLink) => {
  // console.log(projectLink.getAttribute('href'));
  projectLink.addEventListener("click", (e) => {
    e.preventDefault();
    const href = projectLink.getAttribute("href");
    if (!href || href === "#" || href.trim() === "") {
      showNotification(
        "Currently demo is not available for this project!",
        "error"
      );
    } else {
      window.open(href, "_blank");
    }
  });
});
