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

async function handleSearchForm(e) {
  e.preventDefault();
  clearContainer();
  pixabayApi.searchQuery = e.currentTarget.elements.searchQuery.value;

  if (pixabayApi.searchQuery === '') {
    refs.loadBtn.classList.add('hidden');
    Notify.failure(`Please, enter your request`);
    return;
  }

  pixabayApi.resetPage();

  try {
    const data = await pixabayApi.axiosArticales();

    renderGallery(data);

    if (data.totalHits <= pixabayApi.per_page) {
      refs.loadBtn.classList.add('hidden');
    } else {
      refs.loadBtn.classList.remove('hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

async function handleLoadMoreBtn() {
  try {
    const data = await pixabayApi.axiosArticales();

    if (
      pixabayApi.page * pixabayApi.per_page >= 500 &&
      pixabayApi.page === 13
    ) {
      refs.loadBtn.classList.add('hidden');
      Notify.info(`We're sorry, but you've reached the end of search results.`);

      renderGallery(data);
    } else renderGallery(data);
  } catch (error) {
    console.log(error);
  }
}

function renderGallery(data) {
  try {
    let markupGallery;
    if (data.totalHits === 500 && pixabayApi.page === 13) {
      markupGallery = createGalleryCard(data.hits.slice(0, 20));
    } else markupGallery = createGalleryCard(data.hits);

    const allPages = Math.ceil(data.totalHits / pixabayApi.per_page);

    pixabayApi.incrementPage();

    if (data.totalHits === 0) {
      refs.loadBtn.classList.add('hidden');
      Notify.failure(
        `Sorry, there are no images matching your search query. Please try again.`
      );
    } else if (pixabayApi.page > allPages && data.hits.length < 40) {
      refs.loadBtn.classList.add('hidden');
      Notify.info(`Hooray! We found ${data.totalHits} images.`);

      clearContainer();
    } else if (pixabayApi.page - 1 === 1 && data.totalHits > 1) {
      Notify.info(`Hooray! We found ${data.totalHits} images.`);
    }

    refs.gallery.insertAdjacentHTML('beforeend', markupGallery);

    const lightbox = new SimpleLightbox('.gallery a', {
      captionDelay: 250,
    });

    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }
}

function createGalleryCard(hits) {
  //   console.log(hits);
  return hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
                    <a class=photo-card__link href="${largeImageURL}"> <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b>${likes}
                        </p>
                        <p class="info-item">
                            <b>Views</b>${views}
                        </p>
                        <p class="info-item">
                            <b>Comments</b>${comments}
                        </p>
                        <p class="info-item">
                            <b>Downloads</b>${downloads}
                         </p>
                    </div>
                </div>`;
      }
    )
    .join('');
}

function clearContainer() {
  refs.gallery.innerHTML = ' ';
}
