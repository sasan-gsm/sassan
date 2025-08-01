// Portfolio Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initThemeToggle();
    initNavigation();
    initTypedText();
    initAnimatedCounters();
    initSkillBars();
    initProjectFilters();
    initScrollAnimations();
    initContactForm();
    initSmoothScrolling();
});

// Theme Toggle Functionality - Fixed
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
    applyTheme(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-color-scheme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        applyTheme(newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
    });
    
    function applyTheme(theme) {
        html.setAttribute('data-color-scheme', theme);
        updateThemeIcon(theme);
        
        // Add a small animation effect to indicate the change
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'light') {
            icon.className = 'fas fa-moon';
        } else {
            icon.className = 'fas fa-sun';
        }
    }
}

// Navigation Functionality
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Highlight active nav link on scroll
    window.addEventListener('scroll', highlightActiveNavLink);
    
    function highlightActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }
}

// Typed Text Effect
function initTypedText() {
    const typedElement = document.getElementById('typed-text');
    if (!typedElement) return;
    
    const phrases = [
        'Professional Developer',
        'Creative Problem Solver', 
        'Technology Enthusiast',
        'Innovation Driver'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    
    function typeText() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isPaused) {
            isPaused = false;
            setTimeout(typeText, 1000);
            return;
        }
        
        if (isDeleting) {
            typedElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            isPaused = true;
            isDeleting = true;
            typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }
        
        setTimeout(typeText, typeSpeed);
    }
    
    typeText();
}

// Animated Counters
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;
    
    function animateCounters() {
        if (animated) return;
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
        
        animated = true;
    }
    
    // Trigger animation when about section is in view
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(aboutSection);
    }
}

// Skill Bar Animations
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    let skillsAnimated = false;
    
    function animateSkillBars() {
        if (skillsAnimated) return;
        
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width + '%';
            }, 200);
        });
        
        skillsAnimated = true;
    }
    
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(skillsSection);
    }
}

// Project Filter Functionality
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects with animation
            projectItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.style.display = 'block';
                    // Trigger reflow for animation
                    item.offsetHeight;
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    item.classList.add('hidden');
                    setTimeout(() => {
                        if (item.classList.contains('hidden')) {
                            item.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.card, .timeline-item, .skill-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm(this)) {
                showNotification('Please fill in all required fields correctly.', 'error');
                return;
            }
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                // Reset form
                contactForm.reset();
                
                // Show success message
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link, .hero-buttons a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    const iconMap = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${iconMap[type] || iconMap.info}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--color-surface);
        color: var(--color-text);
        padding: 16px 20px;
        border-radius: var(--radius-base);
        box-shadow: var(--shadow-lg);
        border-left: 4px solid var(--color-${type === 'success' ? 'success' : type === 'error' ? 'error' : 'primary'});
        z-index: 1000;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s ease;
        max-width: 350px;
        min-width: 300px;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Auto remove after delay
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(400px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Form Validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        // Remove previous error styling
        input.classList.remove('error');
        
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            // Email validation
            if (input.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    input.classList.add('error');
                    isValid = false;
                }
            }
        }
    });
    
    return isValid;
}

// Navbar Background on Scroll
let ticking = false;

function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(var(--color-surface-rgb, 255, 255, 255), 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.borderBottom = '1px solid var(--color-border)';
    } else {
        navbar.style.background = 'rgba(var(--color-background-rgb, 255, 255, 255), 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.borderBottom = '1px solid var(--color-border)';
    }
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
});

// Performance optimization: Debounce resize events
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

// Keyboard Navigation Support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        // Close notifications
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => notification.remove());
    }
});

// Add resize handler for responsive adjustments
window.addEventListener('resize', debounce(() => {
    // Close mobile menu on resize
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (window.innerWidth > 768 && hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}, 250));

// Add loading animation to external links
document.addEventListener('click', function(e) {
    const link = e.target.closest('a[target="_blank"]');
    if (link && !link.classList.contains('social-link')) {
        const originalText = link.innerHTML;
        link.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening...';
        setTimeout(() => {
            link.innerHTML = originalText;
        }, 1000);
    }
});

// Initialize dynamic copyright year
function updateCopyrightYear() {
    const copyrightElements = document.querySelectorAll('.footer-content p');
    const currentYear = new Date().getFullYear();
    copyrightElements.forEach(element => {
        if (element.textContent.includes('2024')) {
            element.textContent = element.textContent.replace('2024', currentYear);
        }
    });
}

// Call on load
window.addEventListener('load', updateCopyrightYear);

// Add custom styles for notifications and form validation
const customStyles = document.createElement('style');
customStyles.textContent = `
    .form-control.error {
        border-color: var(--color-error) !important;
        box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.1) !important;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
        position: relative;
    }
    
    .notification-close {
        position: absolute;
        top: -8px;
        right: -12px;
        background: none;
        border: none;
        color: var(--color-text-secondary);
        cursor: pointer;
        padding: 4px;
        border-radius: 50%;
        transition: var(--transition-smooth);
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
    }
    
    .notification-close:hover {
        background: var(--color-secondary);
        color: var(--color-text);
    }
    
    .spinner {
        width: 20px;
        height: 20px;
        border: 2px solid var(--color-border);
        border-top: 2px solid var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Smooth transitions for theme switching */
    * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
    }
    
    /* Ensure theme toggle button is always visible */
    .theme-toggle {
        box-shadow: var(--shadow-lg) !important;
        border: 2px solid var(--color-border) !important;
    }
`;

document.head.appendChild(customStyles);

// Console welcome message
console.log(`
🎉 Portfolio Website Loaded Successfully!
🚀 Features included:
   ✅ Responsive Design
   ✅ Dark/Light Theme Toggle  
   ✅ Smooth Animations
   ✅ Project Filtering
   ✅ Contact Form Validation
   ✅ Mobile Navigation
   ✅ Keyboard Navigation
   ✅ Performance Optimized

💡 To customize this template:
   1. Replace placeholder content in HTML
   2. Update personal information
   3. Add your own images  
   4. Customize colors in CSS variables
   5. Connect contact form to your backend

🎨 Theme Toggle: Use the moon/sun button (top right)
📱 Mobile Menu: Hamburger menu appears on smaller screens
⌨️  Keyboard: Press ESC to close menus/notifications

Happy coding! ✨
`);