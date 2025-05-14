fetch('footer.html')
  .then(res => res.ok ? res.text() : Promise.reject('Erro ao carregar rodapé'))
  .then(data => {
    document.getElementById('footer-container').innerHTML = data;
  })
  .catch(err => console.error(err));