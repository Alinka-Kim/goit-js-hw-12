import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('form');
const loadBtn = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';

import { getImagesByQuery } from './js/pixabay-api';
import {
  showLoader,
  hideLoader,
  clearGallery,
  createGallery,
  showLoadMoreBtn,
  hideLoadMoreBtn,
  showLoadingText,
  hideLoadingText,
} from './js/render-functions';

form.addEventListener('submit', async e => {
  e.preventDefault();
  clearGallery();
  hideLoadMoreBtn();
  hideLoadingText();
  showLoader();

  const input = e.currentTarget.elements['search-text'].value.trim();

  if (!input) {
    hideLoader();
    return iziToast.error({
      title: 'Error',
      message:
        'Sorry, there are no images matching your search query. Please try again!',
      position: 'topRight',
    });
  }

  try {
    currentQuery = input;
    currentPage = 1;
    const res = await getImagesByQuery(currentQuery, currentPage);

    if (res.hits.length === 0) {
      return iziToast.error({
        title: 'Error',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
    }

    createGallery(res.hits);

    if (res.totalHits > currentPage * 15) {
      showLoadMoreBtn();
    } else {
      hideLoadMoreBtn();
    }
  } catch (err) {
    iziToast.error({
      title: 'Error',
      message: 'Sorry, something went wrong. Please try again!',
      position: 'topRight',
    });
  } finally {
    hideLoader();
    form.reset();
  }
});

loadBtn.addEventListener('click', async () => {
  currentPage += 1;
  hideLoadMoreBtn();
  showLoadingText();

  try {
    const res = await getImagesByQuery(currentQuery, currentPage);
    createGallery(res.hits);

    if (res.totalHits <= currentPage * 15) {
      hideLoadMoreBtn();
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreBtn();
    }

    const firstCard = document.querySelector('.gallery').firstElementChild;
    if (firstCard) {
      const { height: cardHeight } = firstCard.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load more images.',
      position: 'topRight',
    });
  } finally {
    hideLoadingText();
  }
});