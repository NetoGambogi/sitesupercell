fetch('navbar.html')
  .then(res => res.ok ? res.text() : Promise.reject('Erro ao carregar navbar'))
  .then(data => {
    document.getElementById('navbar-container').innerHTML = data;
  })
  .catch(err => console.error(err));