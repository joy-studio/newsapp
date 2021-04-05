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
      addPreloader();
      myHttp.get(`${apiUrl}/top-headlines?country=us&apiKey=${apiKey}`, cb);
    },
    everything(query, cb) {
      addPreloader();
      myHttp.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
    }
  }
})();

function renderNews(newsArr) {
  removePreloader();
  let container = document.querySelector('#newsContainer');
  if(container.children.length){
  clearContainer(container);
}
  let fragment = '';

  for (el of newsArr) {
    let ht = createCard(el.urlToImage, el.title);
    fragment += ht;
  }
  container.insertAdjacentHTML('afterbegin', fragment);
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
  
  
  
  let searchBtn = document.querySelector('#search-btn');
  let search = document.querySelector('#search');
  let categoty = document.querySelector('#category');
  let country = document.querySelector('#country');
if(country.value==='' && categoty.value==='' && search.value===''){
  newService.topHeadlines('us', onGetResponse);
}
country.addEventListener('change',function(e){
  newService.topHeadlines(country.value, onGetRexsxponse);
});
categoty.addEventListener('change',function(){
    newService.everything(categoty.value, onGetResponse);
});
  searchBtn.addEventListener('click', e => {
    let query = search.value;
    newService.everything(query, onGetResponse);
  });

}

function onGetResponse(err, res) {
  if(err){M.toast({html: err});}
   
  renderNews(res.articles);
}

function addPreloader(){
    document.body.insertAdjacentHTML('afterbegin',`
  <div class="progress">
    <div class="indeterminate"></div>
  </div>`)
}
function removePreloader(){
  let loader = document.querySelector('.progress');
  if(loader){
    loader.remove();
  }
}
function clearContainer(newsContainer){
  newsContainer.innerHTML = '';
}

