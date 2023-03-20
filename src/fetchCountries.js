const BASE_URL = 'https://pixabay.com/api/';
const MY_KEY = '34558947-f958ce14bef551c2e57ca815f';

function fetchPictures(name, pageNumber) {
  const searchName = name.replace(' ', '+');

  console.log(
    `${BASE_URL}/?key=${MY_KEY}&q=${searchName}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageNumber}`
  );

  return fetch(
    `${BASE_URL}/?key=${MY_KEY}&q=${searchName}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageNumber}`
  ).then(response => {
    return response.json();
  });
}

export default { fetchPictures };
