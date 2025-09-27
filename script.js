// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 15, 35, 0.98)';
        } else {
            navbar.style.background = 'rgba(15, 15, 35, 0.95)';
        }
    }
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 80;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -20px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.project-mini, .skill-group, .contact-item');
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
});

// Add CSS for animations and mobile menu
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }

    .nav-link.active {
        color: #65a6fb !important;
        position: relative;
    }

    .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 2px;
        background: #65a6fb;
    }

    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }

    .hamburger.active .bar:nth-child(1) {
        transform: translateY(6px) rotate(45deg);
    }

    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-6px) rotate(-45deg);
    }

    .skill-tags span:hover {
        transform: scale(1.1) !important;
    }

    .project-mini:hover .project-icon i {
        transform: scale(1.2);
        color: #9333ea;
    }
`;
document.head.appendChild(style);

// Contact form handling
const contactForm = document.querySelector('.contact-form-mini');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const inputs = this.querySelectorAll('input, textarea');
        let isValid = true;

        // Simple validation
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#ef4444';
                setTimeout(() => {
                    input.style.borderColor = 'rgba(101, 166, 251, 0.3)';
                }, 2000);
            }
        });

        // Email validation
        const emailInput = this.querySelector('input[type="email"]');
        if (emailInput) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                isValid = false;
                emailInput.style.borderColor = '#ef4444';
                setTimeout(() => {
                    emailInput.style.borderColor = 'rgba(101, 166, 251, 0.3)';
                }, 2000);
            }
        }

        if (isValid) {
            showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.reset();
        } else {
            showMessage('Please fill in all required fields correctly.', 'error');
        }
    });
}

// Show message function
function showMessage(message, type) {
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;

    messageDiv.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 12px 18px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        font-size: 0.9rem;
        max-width: 300px;
        ${type === 'success' ? 
            'background: linear-gradient(135deg, #10b981, #059669);' : 
            'background: linear-gradient(135deg, #ef4444, #dc2626);'
        }
    `;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => messageDiv.remove(), 300);
    }, 4000);
}

// Enhanced hover effects for project cards
document.querySelectorAll('.project-mini').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Click to copy contact information
document.querySelectorAll('.contact-item').forEach(item => {
    const spanElement = item.querySelector('span');
    if (spanElement) {
        const text = spanElement.textContent;
        if (text.includes('@') || text.includes('+')) {
            item.style.cursor = 'pointer';
            item.title = `Click to copy ${text}`;

            item.addEventListener('click', () => {
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(text).then(() => {
                        showMessage(`${text} copied to clipboard!`, 'success');
                    });
                }
            });
        }
    }
});

// Typing animation for code block
document.addEventListener('DOMContentLoaded', () => {
    const codeLines = document.querySelectorAll('.code-line');
    codeLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.animation = `typeIn 0.5s ease forwards ${index * 0.2}s`;
    });
});

// Add keyframe for typing animation
const typeAnimation = document.createElement('style');
typeAnimation.textContent = `
    @keyframes typeIn {
        from {
            opacity: 0;
            transform: translateX(-10px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(typeAnimation);

// Stats counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const stat = entry.target;
            const span = stat.querySelector('span');
            if (span) {
                const finalValue = span.textContent;
                if (finalValue.includes('+')) {
                    const number = parseInt(finalValue.replace('+', ''));
                    animateCounter(span, number, '+');
                } else if (finalValue.includes('/')) {
                    // For 24/7, just animate in
                    span.style.animation = 'countIn 1s ease';
                }
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

// Counter animation function
function animateCounter(element, target, suffix = '') {
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 50);
}

// Add counter animation CSS
const counterStyle = document.createElement('style');
counterStyle.textContent = `
    @keyframes countIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(counterStyle);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Quick fade-in for main sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(10px)';
        section.style.transition = `all 0.6s ease ${index * 0.1}s`;

        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });

    // Stagger animation for skill tags
    setTimeout(() => {
        document.querySelectorAll('.skill-tags span').forEach((tag, index) => {
            tag.style.animationDelay = `${index * 0.05}s`;
            tag.style.animation = 'skillTagIn 0.4s ease forwards';
        });
    }, 500);
});

// Skill tag animation
const skillTagStyle = document.createElement('style');
skillTagStyle.textContent = `
    @keyframes skillTagIn {
        from {
            opacity: 0;
            transform: scale(0.8) rotate(-5deg);
        }
        to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
        }
    }
`;
document.head.appendChild(skillTagStyle);

// Smooth page load
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.3s ease';
});

// Initially hide body to prevent flash
document.body.style.opacity = '0';