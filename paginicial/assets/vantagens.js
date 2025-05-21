function initNavbarEvents() {
    const slider = document.querySelector('.fotos-slider');
    const images = document.querySelectorAll('.fotos-slider img');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    let currentIndex = 0;

    function updateSlider() {
        const imageWidth = images[0].clientWidth + 20; 
        const offset = -currentIndex * imageWidth;
        slider.style.transform = `translateX(${offset}px)`;
    }

    nextBtn.addEventListener('click', () => {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            updateSlider();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    window.addEventListener('resize', updateSlider);
}