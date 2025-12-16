#script.js



/**
 * Techie Bridge Website - Enhanced JavaScript
 * Mobile menu, smooth scrolling, form handling, and scroll effects
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================================================
    // 1. MOBILE MENU FUNCTIONALITY
    // ============================================================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    // Toggle mobile menu when hamburger button is clicked
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent triggering document click listener
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
        body.classList.toggle('menu-open');
    });
    
    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    });
    
    // Close mobile menu when clicking outside on mobile screens
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            const isClickInsideMenu = navLinks.contains(e.target);
            const isClickOnToggle = menuToggle.contains(e.target);
            
            if (!isClickInsideMenu && !isClickOnToggle && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                body.classList.remove('menu-open');
            }
        }
    });
    
    // Close menu on escape key press
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
    
    // ============================================================================
    // 2. SMOOTH SCROLLING FOR NAVIGATION LINKS
    // ============================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (targetId === '#' || targetId === '') return;
            
            const target = document.querySelector(targetId);
            
            if (target) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                    body.classList.remove('menu-open');
                }
                
                // Calculate scroll position accounting for fixed header
                const headerHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                // Smooth scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without page jump
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // ============================================================================
    // 3. WEBINAR FORM SUBMISSION WITH FEEDBACK
    // ============================================================================
    const webinarForm = document.getElementById('webinarForm');
    
    if (webinarForm) {
        webinarForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Collect form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Validate required fields
            if (!data.schoolName || !data.contactPerson || !data.email) {
                showMessage('Please fill in all required fields', 'error');
                resetButton(submitBtn, originalText);
                return;
            }
            
            try {
                // Submit to Formspree
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success
                    showMessage('Thank you! Your webinar request has been submitted. We\'ll contact you within 24 hours.', 'success');
                    
                    // Reset form
                    this.reset();
                    
                    // Scroll to top of form
                    this.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showMessage('There was an error submitting your request. Please try again or contact us directly.', 'error');
            } finally {
                resetButton(submitBtn, originalText);
            }
        });
        
        // Helper function to show messages
        function showMessage(text, type) {
            // Remove any existing messages
            const existingMessage = document.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            // Create message element
            const messageEl = document.createElement('div');
            messageEl.className = `form-message form-message-${type}`;
            messageEl.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${text}</span>
            `;
            
            // Style the message
            messageEl.style.cssText = `
                padding: 1rem;
                margin: 1rem 0;
                border-radius: 10px;
                background: ${type === 'success' ? '#d1fae5' : '#fee2e2'};
                color: ${type === 'success' ? '#065f46' : '#991b1b'};
                border: 1px solid ${type === 'success' ? '#a7f3d0' : '#fecaca'};
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: 500;
            `;
            
            // Insert before form button
            const submitBtn = webinarForm.querySelector('button[type="submit"]');
            webinarForm.insertBefore(messageEl, submitBtn);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.style.opacity = '0';
                    messageEl.style.transition = 'opacity 0.3s';
                    setTimeout(() => messageEl.remove(), 300);
                }
            }, 5000);
        }
        
        // Helper function to reset button state
        function resetButton(button, originalContent) {
            button.innerHTML = originalContent;
            button.disabled = false;
        }
    }
    
    // ============================================================================
    // 4. NAVIGATION SCROLL EFFECTS
    // ============================================================================
    const nav = document.querySelector('nav');
    
    function updateNavOnScroll() {
        // Add/remove scrolled class based on scroll position
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Update active navigation link based on scroll position
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        const scrollPosition = window.scrollY + 150;
        
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        // Update active class on nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1);
            
            if (href === currentSectionId) {
                link.classList.add('active');
            }
        });
    }
    
    // Throttle scroll events for better performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                updateNavOnScroll();
                scrollTimeout = null;
            }, 100);
        }
    });
    
    // ============================================================================
    // 5. ADDITIONAL ENHANCEMENTS
    // ============================================================================
    
    // Add loading animation to cards on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe service cards for animation
    document.querySelectorAll('.service-card, .requirement-card, .pricing-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Initialize on load
    updateNavOnScroll();
    
    // ============================================================================
    // 6. SOCIAL MEDIA LINK ENHANCEMENTS
    // ============================================================================
    document.querySelectorAll('.social-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                alert('This social media link is not yet set up. Please check back soon!');
            }
        });
    });
    
    // ============================================================================
    // 7. FORM INPUT ENHANCEMENTS
    // ============================================================================
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        // Add focus effect
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Auto-resize textarea
        if (input.tagName === 'TEXTAREA') {
            input.addEventListener