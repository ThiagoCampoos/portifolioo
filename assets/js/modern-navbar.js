// Modern Navbar JavaScript
(function() {
    'use strict';

    // DOM Elements
    const header = document.querySelector('.modern-header');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileOverlay = document.querySelector('.modern-mobile-overlay');
    const mobileMenu = document.querySelector('.modern-mobile-menu');
    const mobileClose = document.querySelector('.mobile-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const desktopNavLinks = document.querySelectorAll('.nav-link');
    
    // State
    let isMenuOpen = false;
    let lastScrollY = window.scrollY;
    
    // Initialize
    function init() {
        setupScrollHandler();
        setupMobileMenu();
        setupActiveLinks();
        setupSmoothScroll();
    }
    
    // Scroll Handler
    function setupScrollHandler() {
        let ticking = false;
        
        function updateHeader() {
            const currentScrollY = window.scrollY;
            
            // Add/remove scrolled class
            if (currentScrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
    
    // Mobile Menu
    function setupMobileMenu() {
        if (!mobileToggle || !mobileOverlay || !mobileMenu) return;
        
        // Toggle menu
        mobileToggle.addEventListener('click', toggleMobileMenu);
        
        // Close menu
        if (mobileClose) {
            mobileClose.addEventListener('click', closeMobileMenu);
        }
        
        // Close on overlay click
        mobileOverlay.addEventListener('click', closeMobileMenu);
        
        // Close on mobile link click
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(closeMobileMenu, 300);
            });
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMobileMenu();
            }
        });
        
        // Prevent body scroll when menu is open
        function preventBodyScroll() {
            if (isMenuOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
        
        // Update prevent scroll on menu state change
        const observer = new MutationObserver(preventBodyScroll);
        observer.observe(mobileMenu, { attributes: true, attributeFilter: ['class'] });
    }
    
    function toggleMobileMenu() {
        if (isMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    function openMobileMenu() {
        isMenuOpen = true;
        mobileOverlay.classList.add('active');
        mobileMenu.classList.add('active');
        mobileToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate menu items
        mobileNavLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateX(30px)';
            
            setTimeout(() => {
                link.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                link.style.opacity = '1';
                link.style.transform = 'translateX(0)';
            }, 100 + (index * 50));
        });
    }
    
    function closeMobileMenu() {
        isMenuOpen = false;
        mobileOverlay.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset menu items animation
        mobileNavLinks.forEach(link => {
            link.style.transition = '';
            link.style.opacity = '';
            link.style.transform = '';
        });
    }
    
    // Active Links
    function setupActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        const allNavLinks = [...desktopNavLinks, ...mobileNavLinks];
        
        function updateActiveLink() {
            let current = '';
            const scrollY = window.scrollY;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            allNavLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }
        
        let ticking = false;
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateActiveLink);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', () => {
            requestTick();
            ticking = false;
        }, { passive: true });
        
        // Initial call
        updateActiveLink();
    }
    
    // Smooth Scroll
    function setupSmoothScroll() {
        const allNavLinks = [...desktopNavLinks, ...mobileNavLinks];
        
        allNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const headerHeight = header.offsetHeight;
                        const targetPosition = targetElement.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
    
    // Intersection Observer for animations
    function setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements that should animate
        const animateElements = document.querySelectorAll('.animate-on-scroll');
        animateElements.forEach(el => observer.observe(el));
    }
    
    // Resize handler
    function setupResizeHandler() {
        let resizeTimer;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Close mobile menu on desktop
                if (window.innerWidth > 992 && isMenuOpen) {
                    closeMobileMenu();
                }
            }, 250);
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Setup additional features
    setupAnimations();
    setupResizeHandler();
    
    // Expose functions globally if needed
    window.ModernNavbar = {
        openMobileMenu,
        closeMobileMenu,
        toggleMobileMenu
    };
    
})();