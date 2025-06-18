document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle-glass');
    const mobileMenu = document.querySelector('.mobile-menu-glass');
    const navLinks = document.querySelectorAll('.nav-link-glass, .mobile-nav-link-glass');
    const header = document.querySelector('.glass-header');

    // Toggle mobile menu
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            // Optional: Toggle body scroll
            // document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu on link click
    if (mobileMenu && mobileMenuToggle) {
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link-glass');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu.classList.contains('active')) {
                    mobileMenuToggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    // document.body.style.overflow = '';
                }
            });
        });
    }

    // Close mobile menu on outside click
    document.addEventListener('click', (event) => {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            const isClickInsideMenu = mobileMenu.contains(event.target);
            const isClickOnToggler = mobileMenuToggle.contains(event.target);
            if (!isClickInsideMenu && !isClickOnToggler) {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                // document.body.style.overflow = '';
            }
        }
    });

    // Close mobile menu on 'Escape' key press
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            // document.body.style.overflow = '';
        }
    });

    // Active link highlighting based on scroll
    const sections = document.querySelectorAll('section[id]');
    function updateActiveLink() {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - (header ? header.offsetHeight : 80) - 50) { // Adjusted offset
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // Initial call and on scroll
    if (sections.length > 0) {
        updateActiveLink();
        window.addEventListener('scroll', updateActiveLink);
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                let headerOffset = header ? header.offsetHeight : 80;
                // If mobile menu is active and it's a mobile link, don't adjust for header
                // as the menu will close and header will be visible.
                if (mobileMenu && mobileMenu.classList.contains('active') && this.classList.contains('mobile-nav-link-glass')) {
                    // No offset adjustment needed here as menu closes
                } else if (!header || getComputedStyle(header).position !== 'fixed') {
                    headerOffset = 0; // No offset if header is not fixed or doesn't exist
                }

                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Optional: Change header style on scroll
    // window.addEventListener('scroll', () => {
    //     if (header) {
    //         if (window.scrollY > 50) {
    //             header.classList.add('scrolled'); // Add a 'scrolled' class for different styles
    //         } else {
    //             header.classList.remove('scrolled');
    //         }
    //     }
    // });
});