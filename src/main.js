import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

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

const form = document.querySelector('form');
const loadBtn = document.querySelector('.load-more');

const PER_PAGE = 40;
let currentPage = 1;
let currentQuery = '';

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
      message: 'Please enter a search query.',
      position: 'topRight',
    });
  }

  try {
    currentQuery = input;
    currentPage = 1;
    const res = await getImagesByQuery(currentQuery, currentPage, PER_PAGE);

    hideLoader();

    if (res.hits.length === 0) {
      return iziToast.error({
        title: 'Error',
        message: 'Sorry, no images found. Try another keyword!',
        position: 'topRight',
      });
    }

    createGallery(res.hits);

    if (res.totalHits <= PER_PAGE) {
      iziToast.info({
        title: 'Info',
        message: "You've reached the end of search results.",
        position: 'topRight',
      });
      hideLoadMoreBtn();
    } else {
      showLoadMoreBtn();
    }
  } catch (err) {
    hideLoader();
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again!',
      position: 'topRight',
    });
  } finally {
    form.reset();
  }
});

loadBtn.addEventListener('click', async () => {
  currentPage += 1;
  hideLoadMoreBtn();
  showLoadingText();

  try {
    const res = await getImagesByQuery(currentQuery, currentPage, PER_PAGE);
    createGallery(res.hits);

    if (res.totalHits <= currentPage * PER_PAGE) {
      hideLoadMoreBtn();
      iziToast.info({
        title: 'Info',
        message: "You've reached the end of search results.",
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
