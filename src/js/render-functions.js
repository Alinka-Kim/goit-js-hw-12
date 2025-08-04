import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const loader = document.querySelector('.loader');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
const loadingText = document.querySelector('.loading-text');

let lightbox = null;

export function showLoader() {
  loader.classList.remove('visually-hidden');
}

export function hideLoader() {
  loader.classList.add('visually-hidden');
}

export function clearGallery() {
  gallery.innerHTML = '';
}

export function showLoadMoreBtn() {
  loadBtn.classList.remove('visually-hidden');
}

export function hideLoadMoreBtn() {
  loadBtn.classList.add('visually-hidden');
}
export function showLoadingText() {
  loadingText.classList.remove('visually-hidden');
}

export function hideLoadingText() {
  loadingText.classList.add('visually-hidden');
}

export function createGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<li class="gallery-item">
    <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" title=""/></a>
    <div class="cont">
      <p><b>Likes</b><br>${likes}</p>
      <p><b>Views</b><br>${views}</p>
      <p><b>Comments</b><br>${comments}</p>
      <p><b>Downloads</b><br>${downloads}</p>
    </div>
</li>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  if (lightbox) {
    lightbox.refresh();
  } else {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  }
}