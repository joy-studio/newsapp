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
          return response; // Потом избавиться от этого
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
  let body = document.querySelector('#q');
  let fragment = '';

  for (el of newsArr) {
    let ht = createCard(el.urlToImage, el.title);
    fragment += ht;
  }
  console.log(fragment);
  body.insertAdjacentHTML('afterbegin', fragment);
}


function createCard(img, title) {
  return `
      <div class="col s12">
        <div class="card">
        <div class="card-image">
         <img src="${img}">
        <span>${title}</span>
        </div>
        </div>
      </div>
    `;
}


function loadNews() {
  // newService.topHeadlines('us', onGetResponse);
  let search = document.querySelector('#search');
  search.addEventListener('change', e => {
    let query = e.target.value;
    newService.everything(query, onGetResponse);
  });

}

function onGetResponse(err, res) {
  renderNews(res.articles);
}

