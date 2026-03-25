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

        if (packageWindow && packageTrack && originalSlides.length > 1) {
            originalSlides.forEach((slide) => {
                packageTrack.appendChild(slide.cloneNode(true));
            });

            let slideWidth = 0;
            let gap = 0;
            let setWidth = 0;
            let offset = 0;
            let lastFrameTime = 0;
            let animationFrameId = null;
            let nudgeFrameId = null;
            let isDragging = false;
            let dragStartX = 0;
            let lastPointerX = 0;
            let movedDuringDrag = false;
            const autoSpeed = 32;

            function measureCarousel() {
                const firstSlide = packageTrack.children[0];
                if (!firstSlide) {
                    return;
                }

                slideWidth = firstSlide.getBoundingClientRect().width;
                const slideStyles = window.getComputedStyle(packageTrack);
                gap = parseFloat(slideStyles.columnGap || slideStyles.gap || 0);
                setWidth = originalSlides.length * (slideWidth + gap);
            }

            function slideStep() {
                if (!slideWidth) {
                    measureCarousel();
                }

                return slideWidth + gap;
            }

            function normalizeOffset(value) {
                if (!setWidth) {
                    return value;
                }

                let nextValue = value;
                while (nextValue <= -setWidth) {
                    nextValue += setWidth;
                }

                while (nextValue > 0) {
                    nextValue -= setWidth;
                }

                return nextValue;
            }

            function renderTrack() {
                packageTrack.style.transform = `translateX(${offset}px)`;
            }

            function setOffset(value) {
                offset = normalizeOffset(value);
                renderTrack();
            }

            function stopNudgeAnimation() {
                if (nudgeFrameId) {
                    cancelAnimationFrame(nudgeFrameId);
                    nudgeFrameId = null;
                }
            }

            function animateNudge(distance) {
                stopNudgeAnimation();

                const startOffset = offset;
                const targetOffset = normalizeOffset(startOffset + distance);
                const duration = 450;
                let startTime = null;

                function stepAnimation(timestamp) {
                    if (startTime === null) {
                        startTime = timestamp;
                    }

                    const elapsed = timestamp - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const blendedOffset = startOffset + (distance * eased);

                    setOffset(blendedOffset);

                    if (progress < 1) {
                        nudgeFrameId = requestAnimationFrame(stepAnimation);
                    } else {
                        offset = targetOffset;
                        renderTrack();
                        nudgeFrameId = null;
                    }
                }

                nudgeFrameId = requestAnimationFrame(stepAnimation);
            }

            function moveNext() {
                animateNudge(-slideStep());
            }

            function movePrev() {
                animateNudge(slideStep());
            }

            function tick(timestamp) {
                if (!lastFrameTime) {
                    lastFrameTime = timestamp;
                }

                const deltaSeconds = (timestamp - lastFrameTime) / 1000;
                lastFrameTime = timestamp;

                if (!isDragging && !nudgeFrameId) {
                    setOffset(offset - (autoSpeed * deltaSeconds));
                }

                animationFrameId = requestAnimationFrame(tick);
            }

            function handlePointerDown(clientX) {
                isDragging = true;
                dragStartX = clientX;
                lastPointerX = clientX;
                movedDuringDrag = false;
                packageCarousel.classList.add('is-dragging');
                stopNudgeAnimation();
            }

            function handlePointerMove(clientX) {
                if (!isDragging) {
                    return;
                }

                const deltaX = clientX - lastPointerX;
                if (Math.abs(clientX - dragStartX) > 6) {
                    movedDuringDrag = true;
                }

                lastPointerX = clientX;
                setOffset(offset + deltaX);
            }

            function handlePointerUp() {
                if (!isDragging) {
                    return;
                }

                packageCarousel.classList.remove('is-dragging');
                isDragging = false;

                const totalDrag = lastPointerX - dragStartX;
                if (Math.abs(totalDrag) > Math.max(60, slideWidth * 0.2)) {
                    if (totalDrag < 0) {
                        moveNext();
                    } else {
                        movePrev();
                    }
                }
            }

            packagePrev.addEventListener('click', () => {
                movePrev();
            });

            packageNext.addEventListener('click', () => {
                moveNext();
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
            packageWindow.addEventListener('click', (event) => {
                if (movedDuringDrag) {
                    event.preventDefault();
                    movedDuringDrag = false;
                }
            });

            window.addEventListener('resize', () => {
                measureCarousel();
                setOffset(offset);
            });

            measureCarousel();
            setOffset(0);
            packageTrack.style.transition = 'none';
            animationFrameId = requestAnimationFrame(tick);
        }
    }
});
