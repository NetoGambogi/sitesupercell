const CACHE_KEY = 'cachedNavbar';
const CACHE_TTL = 60 * 60 * 1000; 

function isCacheValid() {
  const timestamp = localStorage.getItem(`${CACHE_KEY}-timestamp`);
  return timestamp && (Date.now() - parseInt(timestamp, 10) < CACHE_TTL);
}

function loadNavbarFromCache() {
  const cachedHTML = localStorage.getItem(CACHE_KEY);
  if (cachedHTML) {
    document.getElementById('navbar-container').innerHTML = cachedHTML;
    document.dispatchEvent(new Event('navbarLoaded'));
  }
}

function fetchAndCacheNavbar() {
  fetch('navbar.html')
    .then(res => res.ok ? res.text() : Promise.reject('Erro ao carregar navbar'))
    .then(data => {
      document.getElementById('navbar-container').innerHTML = data;
      localStorage.setItem(CACHE_KEY, data);
      localStorage.setItem(`${CACHE_KEY}-timestamp`, Date.now().toString());
      document.dispatchEvent(new Event('navbarLoaded'));
    })
    .catch(err => console.error(err));
}

if (isCacheValid()) {
  loadNavbarFromCache();
} else {
  fetchAndCacheNavbar();
}