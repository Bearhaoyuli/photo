document.addEventListener('DOMContentLoaded', function () {
    // Hero section slideshow
    const images = document.querySelectorAll('.hero img');
    const texts = document.querySelectorAll('.hero .text-overlay');
    const totalSlides = images.length;
    const currentSlideElement = document.getElementById('current-slide');
    const totalSlidesElement = document.getElementById('total-slides');
    let currentIndex = 0;
    let startX = 0;
    let endX = 0;

    if (totalSlidesElement) {
        totalSlidesElement.textContent = totalSlides.toString().padStart(2, '0');
    }

    function showSlide(index) {
        images.forEach((img, i) => {
            img.classList.remove('active');
            texts[i].classList.remove('active');
            if (i === index) {
                img.classList.add('active');
                texts[i].classList.add('active');
            }
        });
        if (currentSlideElement) {
            currentSlideElement.textContent = (index + 1).toString().padStart(2, '0');
        }
    }

    function nextSlide() {
        currentIndex = (currentIndex < totalSlides - 1) ? currentIndex + 1 : 0;
        showSlide(currentIndex);
    }

    // Autoplay the slides every 4 seconds
    setInterval(nextSlide, 4000);

    document.getElementById('prev').addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalSlides - 1;
        showSlide(currentIndex);
    });

    document.getElementById('next').addEventListener('click', () => {
        currentIndex = (currentIndex < totalSlides - 1) ? currentIndex + 1 : 0;
        showSlide(currentIndex);
    });

    // Swipe detection
    function handleTouchStart(event) {
        startX = event.touches[0].clientX;
    }

    function handleTouchEnd(event) {
        endX = event.changedTouches[0].clientX;
        handleSwipe();
    }

    function handleSwipe() {
        const diffX = startX - endX;

        if (Math.abs(diffX) > 50) { // Only trigger if swipe distance is significant
            if (diffX > 0) {
                // Swipe left
                nextSlide();
            } else {
                // Swipe right
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalSlides - 1;
                showSlide(currentIndex);
            }
        }
    }

    // Add touch event listeners
    document.querySelector('.hero').addEventListener('touchstart', handleTouchStart, false);
    document.querySelector('.hero').addEventListener('touchend', handleTouchEnd, false);


});


document.addEventListener('DOMContentLoaded', function () {
    // Lazy loading
    const lazyLoadElements = document.querySelectorAll('.lazy-load');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;

                // Retrieve the data attributes
                const imgSrc = element.getAttribute('data-src');
                const title = element.getAttribute('data-title');

                // Create the image element dynamically
                const img = document.createElement('img');
                img.src = imgSrc;
                img.alt = title;
                img.className = 'card-img-top';
                img.style.opacity = 0; // Start with invisible
                img.style.transition = 'opacity 1s ease-in-out'; // Smooth transition

                // Append the image to the card
                element.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                    </div>
                `;
                element.insertBefore(img, element.firstChild);

                // Trigger the fade-in effect
                setTimeout(() => {
                    img.style.opacity = 1; // Gradually fade in the image
                }, 100);

                observer.unobserve(element); // Stop observing once the content is loaded
            }
        });
    }, {
        root: null, // Use the viewport as the root
        rootMargin: '0px', // No margin around the root
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    lazyLoadElements.forEach(element => {
        observer.observe(element);
    });
});
