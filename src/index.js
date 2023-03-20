import './css/styles.css';
import API from './fetchCountries.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const refs = {
  searchForm: document.querySelector('#search-form'),
  searchInput: document.querySelector('#search-input'),
  searchButton: document.querySelector('#search-button'),
  picturesList: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let pageNumber = 1;

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

refs.searchForm.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onFormLoadMore);

function onFormSubmit(event) {
  event.preventDefault();

  refs.picturesList.innerHTML = '';
  pageNumber = 1;

  const pictureToFind = refs.searchInput.value.trim();

  if (pictureToFind.length !== 0) {
    API.fetchPictures(pictureToFind, pageNumber)
      .then(renderPictureCard)
      .catch(onFetchError);
  }
}

function onFormLoadMore(event) {
  event.preventDefault();

  pageNumber += 1;

  const pictureToFind = refs.searchInput.value.trim();

  if (pictureToFind.length !== 0) {
    API.fetchPictures(pictureToFind, pageNumber)
      .then(renderPictureCard)
      .catch(onFetchError);
  }
}

function renderPictureCard(image) {
  if (image.totalHits === 0 && pageNumber === 1) {
    Notiflix.Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    refs.loadMoreBtn.style.visibility = 'hidden';
    return;
  }

  if (image.hits.length === 0 && pageNumber > 1) {
    Notiflix.Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );
    refs.loadMoreBtn.style.visibility = 'hidden';
    return;
  }

  if (pageNumber === 1) {
    Notiflix.Notify.success(`Hooray! We found ${image.totalHits} images.`);
  }

  refs.picturesList.innerHTML =
    refs.picturesList.innerHTML +
    image.hits
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
          return `
        <div class="photo-card">
        <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" class="photo-img">
            </a>
            <div class="info">
                <div class="info-item-div">
                <p class="info-item"><b>Likes</b></p>
                <p>${likes}</p>
                </div>
             
        <div class="info-item-div">
        <p class="info-item"><b>Views</b></p>
        <p>  ${views}</p>
        </div>
                <div class="info-item-div">
                <p class="info-item"><b>Comments</b></p>
                <p>${comments}</p>
                </div>
        <div class="info-item-div">
        <p class="info-item"><b>Downloads</b></p>
        <p>${downloads}</p>
        </div>
        </div>
        </div>
    `;
        }
      )
      .join('');

  refs.loadMoreBtn.style.visibility = 'visible';

  lightbox.refresh();
}

function onFetchError(error) {
  Notiflix.Notify.failure(
    `Sorry, there are no images matching your search query. Please try again.`
  );
}
