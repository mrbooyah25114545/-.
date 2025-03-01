document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('galleryGrid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const downloadBtn = document.querySelector('.download-btn');
    const currentImageSpan = document.getElementById('currentImage');
    const gridViewBtn = document.getElementById('gridView');
    const slideViewBtn = document.getElementById('slideView');

    let currentImageIndex = 0;
    const totalImages = 69;

    // Generate gallery items
    for (let i = 1; i <= totalImages; i++) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="images/Anniversary Photo (${i}).jpg" alt="Anniversary Photo ${i}" 
                 loading="lazy" data-index="${i-1}">
        `;
        galleryContainer.appendChild(galleryItem);

        // Add animation delay for staggered appearance
        galleryItem.style.animation = `slideIn 0.5s ease forwards ${i * 0.1}s`;
    }

    // Open lightbox
    galleryContainer.addEventListener('click', (e) => {
        const clickedImage = e.target.closest('.gallery-item img');
        if (clickedImage) {
            currentImageIndex = parseInt(clickedImage.dataset.index);
            updateLightboxImage();
            lightbox.classList.add('active');
        }
    });

    // Close lightbox
    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    // Navigate images
    prevBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
        updateLightboxImage();
    });

    nextBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % totalImages;
        updateLightboxImage();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
                updateLightboxImage();
                break;
            case 'ArrowRight':
                currentImageIndex = (currentImageIndex + 1) % totalImages;
                updateLightboxImage();
                break;
            case 'Escape':
                lightbox.classList.remove('active');
                break;
        }
    });

    // Download current image
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = lightboxImg.src;
        link.download = `Anniversary_Photo_${currentImageIndex + 1}.jpg`;
        link.click();
    });

    // View toggle functionality
    gridViewBtn.addEventListener('click', () => {
        gridViewBtn.classList.add('active');
        slideViewBtn.classList.remove('active');
        galleryContainer.style.display = 'grid';
    });

    slideViewBtn.addEventListener('click', () => {
        slideViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        galleryContainer.style.display = 'flex';
        galleryContainer.style.flexDirection = 'column';
        galleryContainer.style.alignItems = 'center';
    });

    // Update lightbox image
    function updateLightboxImage() {
        lightboxImg.src = `images/Anniversary Photo (${currentImageIndex + 1}).jpg`;
        currentImageSpan.textContent = currentImageIndex + 1;
        
        // Preload next and previous images
        const nextIndex = (currentImageIndex + 1) % totalImages;
        const prevIndex = (currentImageIndex - 1 + totalImages) % totalImages;
        
        new Image().src = `images/Anniversary Photo (${nextIndex + 1}).jpg`;
        new Image().src = `images/Anniversary Photo (${prevIndex + 1}).jpg`;
    }

    // Touch support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeLength = touchEndX - touchStartX;

        if (Math.abs(swipeLength) > swipeThreshold) {
            if (swipeLength > 0) {
                // Swipe right - show previous image
                currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
            } else {
                // Swipe left - show next image
                currentImageIndex = (currentImageIndex + 1) % totalImages;
            }
            updateLightboxImage();
        }
    }
});
