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

    const packageCarousel = document.querySelector('.package-carousel');
    if (packageCarousel) {
        const packageWindow = packageCarousel.querySelector('.package-carousel-window');
        const packageTrack = packageCarousel.querySelector('.package-carousel-track');
        const packagePrev = packageCarousel.querySelector('.package-arrow-prev');
        const packageNext = packageCarousel.querySelector('.package-arrow-next');
        const originalSlides = Array.from(packageTrack.children);

        if (packageWindow && packageTrack && originalSlides.length > 0) {
            const cloneCount = originalSlides.length;
            const prependClones = originalSlides.slice(-cloneCount).map((slide) => slide.cloneNode(true));
            const appendClones = originalSlides.slice(0, cloneCount).map((slide) => slide.cloneNode(true));

            prependClones.forEach((clone) => packageTrack.insertBefore(clone, packageTrack.firstChild));
            appendClones.forEach((clone) => packageTrack.appendChild(clone));

            const slides = () => Array.from(packageTrack.children);
            let currentIndex = cloneCount;
            let slideWidth = 0;
            let gap = 0;
            let isAnimating = false;
            let dragStartX = 0;
            let dragDeltaX = 0;
            let isDragging = false;
            let autoSlideId = null;

            function measureCarousel() {
                const currentSlides = slides();
                if (currentSlides.length < 2) {
                    return;
                }

                slideWidth = currentSlides[0].getBoundingClientRect().width;
                const slideStyles = window.getComputedStyle(packageTrack);
                gap = parseFloat(slideStyles.columnGap || slideStyles.gap || 0);
            }

            function offsetFor(index) {
                return index * (slideWidth + gap);
            }

            function setPosition(index, animate = true) {
                if (!slideWidth) {
                    measureCarousel();
                }

                packageTrack.style.transition = animate ? 'transform 0.55s ease' : 'none';
                packageTrack.style.transform = `translateX(-${offsetFor(index)}px)`;
            }

            function normalizeIndex() {
                const lastOriginalIndex = originalSlides.length + cloneCount - 1;
                if (currentIndex > lastOriginalIndex) {
                    currentIndex = cloneCount;
                    setPosition(currentIndex, false);
                } else if (currentIndex < cloneCount) {
                    currentIndex = originalSlides.length + cloneCount - 1;
                    setPosition(currentIndex, false);
                }
            }

            function goToSlide(nextIndex) {
                if (isAnimating) {
                    return;
                }

                isAnimating = true;
                currentIndex = nextIndex;
                setPosition(currentIndex, true);
            }

            function restartAutoSlide() {
                if (autoSlideId) {
                    clearInterval(autoSlideId);
                }

                autoSlideId = setInterval(() => {
                    if (!isDragging) {
                        goToSlide(currentIndex + 1);
                    }
                }, 3500);
            }

            function handlePointerDown(clientX) {
                isDragging = true;
                dragStartX = clientX;
                dragDeltaX = 0;
                packageCarousel.classList.add('is-dragging');
                packageTrack.style.transition = 'none';
            }

            function handlePointerMove(clientX) {
                if (!isDragging) {
                    return;
                }

                dragDeltaX = clientX - dragStartX;
                packageTrack.style.transform = `translateX(-${offsetFor(currentIndex) - dragDeltaX}px)`;
            }

            function handlePointerUp() {
                if (!isDragging) {
                    return;
                }

                packageCarousel.classList.remove('is-dragging');
                isDragging = false;

                if (Math.abs(dragDeltaX) > Math.max(50, slideWidth * 0.18)) {
                    goToSlide(dragDeltaX < 0 ? currentIndex + 1 : currentIndex - 1);
                } else {
                    setPosition(currentIndex, true);
                }

                restartAutoSlide();
            }

            packageTrack.addEventListener('transitionend', () => {
                isAnimating = false;
                normalizeIndex();
            });

            packagePrev.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
                restartAutoSlide();
            });
            packageNext.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
                restartAutoSlide();
            });

            packageWindow.addEventListener('mousedown', (event) => {
                event.preventDefault();
                handlePointerDown(event.clientX);
            });

            window.addEventListener('mousemove', (event) => {
                handlePointerMove(event.clientX);
            });

            window.addEventListener('mouseup', handlePointerUp);
            packageWindow.addEventListener('mouseleave', handlePointerUp);

            packageWindow.addEventListener('touchstart', (event) => {
                handlePointerDown(event.touches[0].clientX);
            }, { passive: true });

            packageWindow.addEventListener('touchmove', (event) => {
                handlePointerMove(event.touches[0].clientX);
            }, { passive: true });

            packageWindow.addEventListener('touchend', handlePointerUp);

            window.addEventListener('resize', () => {
                measureCarousel();
                setPosition(currentIndex, false);
            });

            measureCarousel();
            setPosition(currentIndex, false);
            restartAutoSlide();
        }
    }
});
