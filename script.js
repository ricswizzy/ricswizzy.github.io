/**
 * Techie Bridge Website - Enhanced JavaScript
 * Mobile menu, smooth scrolling, form handling, FAQ accordion, scroll effects
 */

document.addEventListener('DOMContentLoaded', function() {

    // ============================================================================
    // 1. MOBILE MENU FUNCTIONALITY
    // ============================================================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks   = document.querySelector('.nav-links');
    const body       = document.body;

    function closeMobileMenu() {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('menu-open');
    }

    function openMobileMenu() {
        navLinks.classList.add('active');
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        body.classList.add('menu-open');
    }

    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        if (navLinks.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close menu when a nav link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close menu on resize to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });


    // ============================================================================
    // 2. SMOOTH SCROLLING
    // ============================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();

                if (window.innerWidth <= 768) {
                    closeMobileMenu();
                }

                const headerHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                history.pushState(null, null, targetId);
            }
        });
    });


    // ============================================================================
    // 3. CONSULTATION FORM — with visible success banner
    // ============================================================================
    const webinarForm      = document.getElementById('webinarForm');
    const formSuccessBanner = document.getElementById('formSuccessMessage');

    if (webinarForm) {
        webinarForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn   = this.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled  = true;

            const formData = new FormData(this);
            const data     = Object.fromEntries(formData.entries());

            // Client-side validation
            if (!data.name || !data.email || !data.currentLocation || !data.goal) {
                showInlineMessage('Please fill in all required fields.', 'error');
                resetButton(submitBtn, originalHTML);
                return;
            }

            try {
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // Hide the form and show the success banner
                    webinarForm.style.display = 'none';
                    if (formSuccessBanner) {
                        formSuccessBanner.style.display = 'block';
                        formSuccessBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    this.reset();
                } else {
                    throw new Error('Submission failed');
                }
            } catch (err) {
                console.error('Form error:', err);
                showInlineMessage('There was an error submitting your request. Please try again or email us directly at asktechiebridge@gmail.com', 'error');
            } finally {
                resetButton(submitBtn, originalHTML);
            }
        });

        function showInlineMessage(text, type) {
            const existing = document.querySelector('.form-inline-message');
            if (existing) existing.remove();

            const msg = document.createElement('div');
            msg.className = 'form-inline-message';
            msg.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${text}`;
            msg.style.cssText = `
                padding: 1rem 1.2rem;
                margin: 0.8rem 0;
                border-radius: 10px;
                background: ${type === 'success' ? '#064e3b' : '#450a0a'};
                color: ${type === 'success' ? '#a7f3d0' : '#fca5a5'};
                border: 1px solid ${type === 'success' ? '#10b981' : '#ef4444'};
                display: flex;
                align-items: flex-start;
                gap: 0.6rem;
                font-size: 0.95rem;
                line-height: 1.5;
            `;
            webinarForm.querySelector('button[type="submit"]').before(msg);

            if (type !== 'error') {
                setTimeout(() => {
                    msg.style.transition = 'opacity 0.4s';
                    msg.style.opacity = '0';
                    setTimeout(() => msg.remove(), 400);
                }, 6000);
            }
        }

        function resetButton(btn, html) {
            btn.innerHTML = html;
            btn.disabled  = false;
        }
    }


    // ============================================================================
    // 4. NAVIGATION SCROLL EFFECTS & ACTIVE LINK
    // ============================================================================
    const nav = document.querySelector('nav');

    function updateNavOnScroll() {
        nav.classList.toggle('scrolled', window.scrollY > 80);

        const sections = document.querySelectorAll('section');
        const links    = document.querySelectorAll('.nav-links a');
        const pos      = window.scrollY + 140;
        let current    = '';

        sections.forEach(section => {
            if (pos >= section.offsetTop && pos < section.offsetTop + section.clientHeight) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').substring(1) === current);
        });
    }

    let scrollTick = false;
    window.addEventListener('scroll', function() {
        if (!scrollTick) {
            requestAnimationFrame(function() {
                updateNavOnScroll();
                scrollTick = false;
            });
            scrollTick = true;
        }
    });


    // ============================================================================
    // 5. FAQ ACCORDION
    // ============================================================================
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', function() {
            const answer    = this.nextElementSibling;
            const isOpen    = this.getAttribute('aria-expanded') === 'true';
            const parentCol = this.closest('.faq-column');

            // Close all in this column
            if (parentCol) {
                parentCol.querySelectorAll('.faq-question').forEach(q => {
                    q.setAttribute('aria-expanded', 'false');
                    q.nextElementSibling.classList.remove('open');
                });
            }

            // Toggle clicked item
            if (!isOpen) {
                this.setAttribute('aria-expanded', 'true');
                answer.classList.add('open');
            }
        });
    });


    // ============================================================================
    // 6. INTERSECTION OBSERVER — CARD ANIMATIONS
    // ============================================================================
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity  = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll(
        '.service-card, .requirement-card, .pricing-card, .audience-card, .testimonial-card, .faq-item'
    ).forEach(card => {
        card.style.opacity   = '0';
        card.style.transform = 'translateY(24px)';
        card.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
        observer.observe(card);
    });


    // ============================================================================
    // 7. FORM INPUT ENHANCEMENTS
    // ============================================================================
    document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
        input.addEventListener('focus',  function() { this.parentElement.classList.add('focused'); });
        input.addEventListener('blur',   function() { if (!this.value) this.parentElement.classList.remove('focused'); });

        if (input.tagName === 'TEXTAREA') {
            input.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            });
        }
    });


    // ============================================================================
    // 8. SOCIAL MEDIA PLACEHOLDER LINKS
    // ============================================================================
    document.querySelectorAll('.social-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                alert('This social media link is coming soon. Please check back later!');
            }
        });
    });


    // ============================================================================
    // 9. INITIALISE
    // ============================================================================
    updateNavOnScroll();

    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

});
