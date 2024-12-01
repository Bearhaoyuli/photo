document.addEventListener('DOMContentLoaded', function () {
    const backToTopButton = document.getElementById('backToTop');
    const header = document.getElementById('header'); // Reference the header element

    window.addEventListener('scroll', () => {
        const headerHeight = header.offsetHeight; // Get the height of the header

        if (window.scrollY > headerHeight) {
            // Show button when scrolled past the header
            backToTopButton.classList.add('show');
        } else {
            // Hide button if above the header
            backToTopButton.classList.remove('show');
        }
    });

    // Smooth scroll to top when the button is clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
