import './css/styles.css';
import PixabayApi from './pixabayApi';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-more'),
};

const pixabayApi = new PixabayApi();

refs.form.addEventListener('submit', handleSearchForm);
refs.loadBtn.addEventListener('click', handleLoadMoreBtn);
refs.loadBtn.classList.add('hidden');

function handleSearchForm(evt) {
  evt.preventDefault();
  clearContainer();
  pixabayApi.searchQuery = evt.currentTarget.elements.searchQuery.value;

  if (pixabayApi.searchQuery === '') {
    refs.loadBtn.classList.add('hidden');
    Notify.failure(`Please, enter your request`);
    return;
  }
  pixabayApi.resetPage();

  refs.loadBtn.classList.remove('hidden');
}

function handleLoadMoreBtn() {
  pixabayApi.axiosArticales();
}

function clearContainer() {
  refs.gallery.innerHTML = ' ';
}
