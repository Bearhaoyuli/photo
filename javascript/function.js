document.addEventListener('DOMContentLoaded', function () {
    // Hero section slideshow
    const images = document.querySelectorAll('.hero img');
    const texts = document.querySelectorAll('.hero .text-overlay');
    const totalSlides = images.length;
    let currentIndex = 0;

    function showSlide(index) {
        images.forEach((img, i) => {
            img.classList.toggle('active', i === index);
            texts[i].classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex < totalSlides - 1) ? currentIndex + 1 : 0;
        showSlide(currentIndex);
    }

    // Attach event listener to the Next button
    const nextButton = document.getElementById('next');
    if (nextButton) {
        nextButton.addEventListener('click', nextSlide);
    }

    // Optional: Previous button functionality
    const prevButton = document.getElementById('prev');
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; // Decrement and loop back to last slide
            showSlide(currentIndex);
        });
    }
    

    setInterval(nextSlide, 5000);



    const scrollArrow = document.getElementById('scrollArrow');
    const targetSection = document.querySelector('#about'); // Section to scroll to

    if (scrollArrow && targetSection) {
        scrollArrow.addEventListener('click', () => {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
    

    // Navigation link handling
    document.querySelectorAll('.nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (href.startsWith('http')) {
                // External links are handled natively
                return;
            }
        });
    });

    // Global navigation visibility handling
    const globalNav = document.querySelector('.global-nav');
    const heroHeight = document.querySelector('.hero').offsetHeight;

    window.addEventListener('scroll', () => {
        if (window.scrollY >= heroHeight - 50) { // Show global nav after hero
            globalNav.classList.add('show');
        } else {
            globalNav.classList.remove('show');
        }
    });

    // "Back to Top" button
    const backToTopButton = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > window.innerHeight) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Lazy loading
    const lazyLoadElements = document.querySelectorAll('.lazy-load');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const imgSrc = element.getAttribute('data-src');
                const title = element.getAttribute('data-title');

                const img = document.createElement('img');
                img.src = imgSrc;
                img.alt = title;
                img.className = 'card-img-top';
                img.style.opacity = 0;
                img.style.transition = 'opacity 1s ease-in-out';

                element.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                    </div>
                `;
                element.insertBefore(img, element.firstChild);

                setTimeout(() => {
                    img.style.opacity = 1;
                }, 100);

                observer.unobserve(element);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });

    lazyLoadElements.forEach(element => {
        observer.observe(element);
    });
});
