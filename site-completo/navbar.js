fetch('navbar.html')
  .then(res => res.ok ? res.text() : Promise.reject('Erro ao carregar navbar'))
  .then(data => {
    document.getElementById('navbar-container').innerHTML = data;
    // Dispara um evento personalizado indicando que a navbar foi carregada
    document.dispatchEvent(new Event('navbarLoaded'));
  })
  .catch(err => console.error(err));