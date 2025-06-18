document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle-minimalist');
    const mobileMenu = document.querySelector('.mobile-menu-minimalist');
    const mobileMenuClose = document.querySelector('.mobile-menu-close-minimalist');
    const navLinks = mobileMenu.querySelectorAll('a');

    if (mobileMenuToggle && mobileMenu && mobileMenuClose) {
        // Function to toggle menu
        const toggleMenu = () => {
            const isActive = mobileMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            mobileMenuToggle.setAttribute('aria-expanded', isActive);
            document.body.classList.toggle('mobile-menu-open', isActive);
        };

        // Open menu
        mobileMenuToggle.addEventListener('click', toggleMenu);

        // Close menu
        mobileMenuClose.addEventListener('click', toggleMenu);

        // Close menu when a link is clicked (for single-page navigation)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });

        // Optional: Close menu if clicked outside
        document.addEventListener('click', (event) => {
            if (mobileMenu.classList.contains('active') && 
                !mobileMenu.contains(event.target) && 
                !mobileMenuToggle.contains(event.target)) {
                toggleMenu();
            }
        });

        // Optional: Close menu on 'Escape' key press
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    } else {
        console.warn('Minimalist navbar mobile menu elements not found. Functionality may be affected.');
    }
});