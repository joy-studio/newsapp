function http() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
          return response; // Пробный возврат значения
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
  };
}


document.addEventListener('DOMContentLoaded', function () {
  M.AutoInit();
  loadNews();
});

const myHttp = http();

// Самовызывающаяся функция
const newService = (function () {

  const apiKey = '4d82c098a1dc4fa08e98d6c8ad7c4cac';
  const apiUrl = 'https://news-api-v2.herokuapp.com';
  return {
    topHeadlines(country = 'us', cb) {
      myHttp.get(`${apiUrl}/top-headlines?country=us&apiKey=${apiKey}`, cb);
    },
    everything(query, cb) {
      myHttp.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
    }
  }
})();

function renderNews(newsArr) {
  let body = document.querySelector('#news-wrapper');
  let fragment = document.createDocumentFragment();
  for (el of newsArr) {
    let col = document.createElement('div');
    let card = document.createElement('div');
    let cardImage = document.createElement('div');
    let img = document.createElement('img');
    let span = document.createElement('span');

    col.classList.add('col', 's12', 'm4');
    card.classList.add('card');
    cardImage.classList.add('card-image');
    img.src = el.urlToImage;
    span.classList.add('card-title');
    span.textContent = el.title;
    span.style.backgroundColor = 'black';
    span.style.opacity = '0.7';
    span.style.fontSize = '15px';
    span.style.width = '100%';

    col.appendChild(card);
    card.appendChild(cardImage);
    cardImage.appendChild(img);
    cardImage.appendChild(span);
    fragment.appendChild(col);
    body.appendChild(fragment);
  }
}

function loadNews() {
  newService.topHeadlines('ru', onGetResponse);
}

function onGetResponse(err, res) {
  renderNews(res.articles);
}

