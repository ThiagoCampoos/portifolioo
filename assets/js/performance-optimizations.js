// Performance Optimizations JavaScript

// Optimize scroll performance with throttling
function throttle(func, wait) {
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

// Lazy load images when they come into viewport
function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Optimize animations for better performance
function optimizeAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Disable or reduce animations
        document.documentElement.style.setProperty('--animation-duration', '0.01s');
        return;
    }
    
    // Use requestAnimationFrame for smooth animations
    const animatedElements = document.querySelectorAll('[data-animation]');
    
    animatedElements.forEach(element => {
        element.style.willChange = 'transform, opacity';
        element.style.transform = 'translateZ(0)'; // Force hardware acceleration
    });
}

// Optimize scroll events
function optimizeScrollEvents() {
    const throttledScroll = throttle(() => {
        // Your scroll logic here
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Update header on scroll
        const header = document.querySelector('.primary-header');
        if (header) {
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }, 16); // ~60fps
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
}

// Preload critical resources
function preloadCriticalResources() {
    const criticalImages = [
        'assets/img/hero-bg.jpg',
        'assets/SGCAM_20250205_103739778.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Optimize font loading
function optimizeFontLoading() {
    // Use font-display: swap for better performance
    const style = document.createElement('style');
    style.textContent = `
        @font-face {
            font-display: swap;
        }
    `;
    document.head.appendChild(style);
}

// Initialize optimizations when DOM is ready
function initPerformanceOptimizations() {
    // Run optimizations
    lazyLoadImages();
    optimizeAnimations();
    optimizeScrollEvents();
    preloadCriticalResources();
    optimizeFontLoading();
    
    // Optimize third-party scripts loading
    setTimeout(() => {
        // Load non-critical scripts after initial page load
        const nonCriticalScripts = [
            'assets/js/vendor/wow.min.js',
            'assets/js/vendor/scroll-smoother.js'
        ];
        
        nonCriticalScripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            document.body.appendChild(script);
        });
    }, 1000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerformanceOptimizations);
} else {
    initPerformanceOptimizations();
}

// Service Worker for caching (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}