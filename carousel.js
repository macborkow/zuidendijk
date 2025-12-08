// Carousel module - enables any [carousel="..."] [carousel-count="N"] element as a photo carousel

function initCarousels(scope = document) {
  const carousels = scope.querySelectorAll('[carousel][carousel-count]');
  console.log(`Initializing ${carousels.length} carousels`);
  carousels.forEach(function(container) {
    // Only initialize once!
    if (container.dataset.carouselInit) return;
    container.dataset.carouselInit = "1";

    const name = container.getAttribute('carousel');
    const count = parseInt(container.getAttribute('carousel-count'), 10) || 0;
    const imgDir = `images/${name}/`;

    // Build carousel structure
    const track = document.createElement('div');
    track.className = 'carousel-track';
    for (let i = 1; i <= count; i++) {
      const img = document.createElement('img');
      img.src = `${imgDir}${i}.jpg`; // you can use png if you want, or auto-detect
      img.alt = `${name} foto ${i}`;
      track.appendChild(img);
    }
    container.innerHTML = '';
    container.classList.add('carousel-container');

    // Controls
    const carousel = document.createElement('div');
    carousel.className = 'carousel';
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-prev';
    prevBtn.setAttribute('aria-label', 'Vorige');
    prevBtn.innerHTML = '&lt;';
    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-next';
    nextBtn.setAttribute('aria-label', 'Volgende');
    nextBtn.innerHTML = '&gt;';
    carousel.appendChild(track);
    carousel.appendChild(prevBtn);
    carousel.appendChild(nextBtn);

    container.appendChild(carousel);
    const indicators = document.createElement('div');
    indicators.className = 'carousel-indicators';
    container.appendChild(indicators);

    // Indicator dots
    indicators.innerHTML = Array(count).fill().map((_, i) =>
      `<button ${i===0?'class="active"':''} aria-label="Foto ${i+1}"></button>`
    ).join('');
    const dots = Array.from(indicators.children);

    let current = 0;
    const update = () => {
      track.style.transform = `translateX(${-current * 100}%)`;
      dots.forEach((d,i) => d.classList.toggle('active', i === current));
    };
    prevBtn.onclick = function() {
      current = (current-1+count)%count;
      update();
    };
    nextBtn.onclick = function() {
      current = (current+1)%count;
      update();
    };
    dots.forEach((d,i) => d.onclick = function() {
      current = i; update();
    });

    // Touch/swipe support for mobile
    let startX = null;
    track.addEventListener('touchstart', function(e){
      if(e.touches.length===1) startX = e.touches[0].clientX;
    });
    track.addEventListener('touchend', function(e) {
      if(startX !== null) {
        let dx = e.changedTouches[0].clientX - startX;
        if(dx > 40) prevBtn.click();
        if(dx < -40) nextBtn.click();
        startX = null;
      }
    });

    update();
  });
}

// Initialize carousels on DOMContentLoaded for static content
document.addEventListener('DOMContentLoaded', () => {
  initCarousels(document);
});
