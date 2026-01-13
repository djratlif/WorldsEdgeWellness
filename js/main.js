/**
 * Worlds Edge Wellness - Main JavaScript
 * Interactive functionality for Megan McCraw's therapist website
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeFAQ();
    initializeScrollEffects();
    initializeFormHandling();
    initializeAccessibility();
    
    console.log('Worlds Edge Wellness website initialized');
    
    // Update copyright year dynamically
    updateCopyrightYear();
});

/**
 * Update copyright year to current year
 */
function updateCopyrightYear() {
    const currentYear = new Date().getFullYear();
    const copyrightElements = document.querySelectorAll('.copyright-year');
    
    copyrightElements.forEach(element => {
        element.textContent = currentYear;
    });
}

/**
 * Navigation Functionality
 */
function initializeNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    
    // Mobile menu toggle
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    closeMenu();
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
                menuToggle.focus();
            }
        });
    }
    
    function openMenu() {
        navMenu.classList.add('active');
        menuToggle.classList.add('active');
        body.classList.add('menu-open');
        menuToggle.setAttribute('aria-expanded', 'true');
        
        // Focus first menu item
        const firstLink = navMenu.querySelector('.nav-link');
        if (firstLink) {
            firstLink.focus();
        }
    }
    
    function closeMenu() {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        body.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
    
    // Active page highlighting
    highlightActivePage();
    
    // Smooth scrolling for anchor links
    initializeSmoothScrolling();
}

/**
 * Highlight active page in navigation
 */
function highlightActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

/**
 * Smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update focus for accessibility
                targetElement.focus();
            }
        });
    });
}

/**
 * FAQ Accordion Functionality
 */
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            // Set initial ARIA attributes
            const questionId = 'faq-question-' + Math.random().toString(36).substr(2, 9);
            const answerId = 'faq-answer-' + Math.random().toString(36).substr(2, 9);
            
            question.setAttribute('id', questionId);
            question.setAttribute('aria-expanded', 'false');
            question.setAttribute('aria-controls', answerId);
            question.setAttribute('role', 'button');
            question.setAttribute('tabindex', '0');
            
            answer.setAttribute('id', answerId);
            answer.setAttribute('aria-labelledby', questionId);
            answer.setAttribute('role', 'region');
            
            // Click event
            question.addEventListener('click', function() {
                toggleFAQItem(item);
            });
            
            // Keyboard event
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFAQItem(item);
                }
            });
        }
    });
}

/**
 * Toggle FAQ item open/closed
 */
function toggleFAQItem(item) {
    const question = item.querySelector('.faq-question');
    const isActive = item.classList.contains('active');
    
    // Close all other FAQ items (optional - remove if you want multiple open)
    const allFaqItems = document.querySelectorAll('.faq-item');
    allFaqItems.forEach(otherItem => {
        if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherQuestion = otherItem.querySelector('.faq-question');
            if (otherQuestion) {
                otherQuestion.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // Toggle current item
    if (isActive) {
        item.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');
    } else {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
    }
}

/**
 * Scroll Effects
 */
function initializeScrollEffects() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for styling
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Fade in animation on scroll
    initializeScrollAnimations();
}

/**
 * Scroll-triggered animations
 */
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.card, .content-section');
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Form Handling
 */
function initializeFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

/**
 * Handle form submission
 */
function handleFormSubmission(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Validate form
    if (!validateForm(form)) {
        return;
    }
    
    // Show loading state with spinner
    if (submitButton) {
        submitButton.disabled = true;
        const originalText = submitButton.textContent;
        submitButton.innerHTML = '<span class="loading-spinner"></span> Sending...';
        submitButton.setAttribute('data-original-text', originalText);
    }
    
    // Prepare email data
    const emailData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone') || 'Not provided',
        message: formData.get('message'),
        to_email: 'worldsedgewellness@gmail.com'
    };
    
    // Send email using EmailJS (you'll need to set up EmailJS service)
    sendEmail(emailData)
        .then(() => {
            showFormSuccess(form);
            announceToScreenReader('Your message has been sent successfully!');
        })
        .catch((error) => {
            console.error('Email sending failed:', error);
            showFormError(form, 'Sorry, there was an error sending your message. Please try again or contact us directly.');
        })
        .finally(() => {
            if (submitButton) {
                submitButton.disabled = false;
                const originalText = submitButton.getAttribute('data-original-text') || 'Send Message';
                submitButton.textContent = originalText;
                submitButton.removeAttribute('data-original-text');
            }
        });
}

/**
 * Send email using EmailJS or fallback method
 */
function sendEmail(emailData) {
    return new Promise((resolve, reject) => {
        // Check if EmailJS is available
        if (typeof emailjs !== 'undefined') {
            // EmailJS implementation (requires EmailJS library to be loaded)
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
                from_name: emailData.name,
                from_email: emailData.email,
                phone: emailData.phone,
                message: emailData.message,
                to_email: emailData.to_email
            })
            .then(() => resolve())
            .catch((error) => reject(error));
        } else {
            // Fallback: Create mailto link as backup
            const subject = encodeURIComponent('New Contact Form Submission from ' + emailData.name);
            const body = encodeURIComponent(
                `Name: ${emailData.name}\n` +
                `Email: ${emailData.email}\n` +
                `Phone: ${emailData.phone}\n\n` +
                `Message:\n${emailData.message}`
            );
            
            const mailtoLink = `mailto:${emailData.to_email}?subject=${subject}&body=${body}`;
            
            // Open mailto link
            window.location.href = mailtoLink;
            
            // Simulate success after a short delay
            setTimeout(() => resolve(), 1000);
        }
    });
}

/**
 * Validate entire form
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Validate individual field
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';
    
    // Required field check
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }
    
    // Email validation
    else if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    
    // Phone validation (improved)
    else if (fieldType === 'tel' && value) {
        const cleanPhone = value.replace(/[\s\-\(\)\+\.]/g, '');
        if (cleanPhone.length < 10 || cleanPhone.length > 15 || !/^\d+$/.test(cleanPhone)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number (10-15 digits).';
        }
    }
    
    // Message length validation
    else if (field.tagName.toLowerCase() === 'textarea' && value) {
        if (value.length < 10) {
            isValid = false;
            errorMessage = 'Please provide a more detailed message (at least 10 characters).';
        } else if (value.length > 2000) {
            isValid = false;
            errorMessage = 'Message is too long (maximum 2000 characters).';
        }
    }
    
    // Name validation
    else if (field.name === 'name' && value) {
        if (value.length < 2) {
            isValid = false;
            errorMessage = 'Please enter your full name (at least 2 characters).';
        } else if (!/^[a-zA-Z\s\-\'\.]+$/.test(value)) {
            isValid = false;
            errorMessage = 'Name can only contain letters, spaces, hyphens, and apostrophes.';
        }
    }
    
    // Show/hide error
    if (isValid) {
        clearFieldError(field);
    } else {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

/**
 * Show field error
 */
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');
    
    field.parentNode.appendChild(errorElement);
}

/**
 * Clear field error
 */
function clearFieldError(field) {
    field.classList.remove('error');
    field.setAttribute('aria-invalid', 'false');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

/**
 * Show form success message
 */
function showFormSuccess(form) {
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
        <h3>Thank you for your message!</h3>
        <p>Your message has been sent to worldsedgewellness@gmail.com. I'll get back to you as soon as possible, typically within 1-2 business days.</p>
    `;
    successMessage.setAttribute('role', 'alert');
    
    form.style.display = 'none';
    form.parentNode.insertBefore(successMessage, form);
    
    // Reset form
    form.reset();
    
    // Remove success message after 10 seconds
    setTimeout(() => {
        successMessage.remove();
        form.style.display = 'block';
    }, 10000);
}

/**
 * Show form error message
 */
function showFormError(form, message) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'form-error';
    errorMessage.innerHTML = `
        <h3>Message Not Sent</h3>
        <p>${message}</p>
        <p>You can also reach me directly at <a href="mailto:worldsedgewellness@gmail.com">worldsedgewellness@gmail.com</a> or <a href="tel:+1-828-490-1573">(828) 490-1573</a>.</p>
    `;
    errorMessage.setAttribute('role', 'alert');
    
    form.parentNode.insertBefore(errorMessage, form);
    
    // Remove error message after 10 seconds
    setTimeout(() => {
        errorMessage.remove();
    }, 10000);
}

/**
 * Accessibility Enhancements
 */
function initializeAccessibility() {
    // Skip to content link
    addSkipToContentLink();
    
    // Keyboard navigation improvements
    improveKeyboardNavigation();
    
    // Focus management
    manageFocus();
    
    // ARIA live regions
    setupLiveRegions();
}

/**
 * Add skip to content link
 */
function addSkipToContentLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Improve keyboard navigation
 */
function improveKeyboardNavigation() {
    // Add keyboard support for interactive elements
    const interactiveElements = document.querySelectorAll('.card, .btn');
    
    interactiveElements.forEach(element => {
        if (!element.hasAttribute('tabindex') && !element.matches('a, button, input, textarea, select')) {
            element.setAttribute('tabindex', '0');
        }
    });
    
    // Trap focus in mobile menu when open
    trapFocusInMobileMenu();
}

/**
 * Trap focus in mobile menu
 */
function trapFocusInMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (navMenu && menuToggle) {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && navMenu.classList.contains('active')) {
                const focusableElements = navMenu.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
}

/**
 * Focus management
 */
function manageFocus() {
    // Ensure focus is visible
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

/**
 * Setup ARIA live regions
 */
function setupLiveRegions() {
    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    
    document.body.appendChild(liveRegion);
}

/**
 * Announce message to screen readers
 */
function announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
        liveRegion.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

/**
 * Utility Functions
 */

/**
 * Debounce function for performance
 */
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

/**
 * Throttle function for scroll events
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNavigation,
        initializeFAQ,
        validateField,
        announceToScreenReader
    };
}