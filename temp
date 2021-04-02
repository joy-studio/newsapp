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
  let body = document.querySelector('#body');
  let fragment = document.createDocumentFragment();
  for (let i = 0; i < newsArr.length; i++) {
    if (i % 2 !== 0) {
      continue;
    }
    else {
      // Create ROW
      let row = document.createElement('div');
      row.classList.add('row');
      console.log('row', i);
      for (let j = i; j < i + 2; j++) {
        // Create two COL
        console.log('col', j);
        let col = document.createElement('div');
        let card = document.createElement('div');
        let cardImage = document.createElement('div');
        let img = document.createElement('img');
        let span = document.createElement('span');

        col.classList.add('col', 's6');
        card.classList.add('card');
        cardImage.classList.add('card-image');
        img.src = newsArr[j].urlToImage;
        span.classList.add('card-title');
        span.textContent = newsArr[j].title;
        span.style.backgroundColor = 'black';
        span.style.opacity = '0.7';
        span.style.fontSize = '15px';
        span.style.width = '100%';

        row.appendChild(col);
        col.appendChild(card);
        card.appendChild(cardImage);
        cardImage.appendChild(img);
        cardImage.appendChild(span);
        fragment.appendChild(row);
        body.appendChild(fragment);
      }
    };
  }







}


function loadNews() {
  // newService.topHeadlines('ru', onGetResponse);
  let search = document.querySelector('#search');
  search.addEventListener('change', e => {
    let query = e.target.value;
    newService.everything(query, onGetResponse);
  });

}

function onGetResponse(err, res) {
  renderNews(res.articles);
  
}

