const gallery = document.querySelector('#gallery');
const photos = [...gallery.querySelectorAll('[data-photo]')];
let photoIndex = 0;
function renderGallery() {
  photos.forEach((photo, index) => {
    photo.classList.toggle('is-current', index === photoIndex);
    photo.classList.toggle('is-prev', index === (photoIndex - 1 + photos.length) % photos.length);
    photo.classList.toggle('is-next', index === (photoIndex + 1) % photos.length);
    photo.setAttribute('aria-hidden', String(index !== photoIndex));
    const caption = lookup(translations, 'gallery.captions')?.[index];
    if (caption) { photo.querySelector('figcaption').textContent = caption; photo.querySelector('img').alt = caption; }
  });
  document.querySelector('#gallery-position').textContent = tr('gallery.position').replace('{current}', photoIndex + 1).replace('{total}', photos.length);
  document.querySelector('#gallery-prev').setAttribute('aria-label', tr('gallery.prev'));
  document.querySelector('#gallery-next').setAttribute('aria-label', tr('gallery.next'));
}
function movePhoto(direction) { photoIndex = (photoIndex + direction + photos.length) % photos.length; renderGallery(); }
document.querySelector('#gallery-prev').addEventListener('click', () => movePhoto(-1));
document.querySelector('#gallery-next').addEventListener('click', () => movePhoto(1));
gallery.addEventListener('keydown', event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); movePhoto(event.key === 'ArrowLeft' ? -1 : 1); } });
let touchStart = null;
const stage = document.querySelector('#gallery-stage');
stage.addEventListener('touchstart', event => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
stage.addEventListener('touchend', event => { if (touchStart !== null) { const delta = event.changedTouches[0].clientX - touchStart; if (Math.abs(delta) > 45) movePhoto(delta < 0 ? 1 : -1); } touchStart = null; }, { passive: true });
renderGallery();


document.addEventListener('languagechange', renderGallery);
