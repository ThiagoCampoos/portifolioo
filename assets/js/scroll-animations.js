document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (!animatedElements.length) {
        console.warn('No elements found with class .animate-on-scroll. Scroll animations will not be active.');
        return;
    }

    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Unobserve after animation to save resources
                // observer.unobserve(entry.target);
            } else {
                // Optional: Remove class if you want animation to repeat when scrolling up and down
                // entry.target.classList.remove('is-visible');
            }
        });
    };

    const intersectionObserver = new IntersectionObserver(observerCallback, observerOptions);

    animatedElements.forEach((element, index) => {
        // For staggered animations
        if (element.parentElement.classList.contains('stagger-children')) {
            element.style.setProperty('--stagger-index', index);
        }
        intersectionObserver.observe(element);
    });

    // Fallback for browsers that don't support IntersectionObserver (less performant)
    // You might want to include a polyfill for IntersectionObserver for broader compatibility
    if (typeof IntersectionObserver === 'undefined') {
        console.warn('IntersectionObserver not supported. Using fallback scroll event listener (less performant).');
        const checkVisibility = () => {
            animatedElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.9 && rect.bottom >= 0) { // Adjust threshold as needed
                    element.classList.add('is-visible');
                } else {
                    // element.classList.remove('is-visible'); // If repeating animation is desired
                }
            });
        };

        window.addEventListener('scroll', checkVisibility);
        window.addEventListener('resize', checkVisibility);
        checkVisibility(); // Initial check
    }
});