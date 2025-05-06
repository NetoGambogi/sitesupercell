document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.barra-menu');
  const botaoContato = document.querySelector('.botao-contato');
  const toggleIcon = toggleButton.querySelector('img');

  toggleButton.addEventListener('click', function () {
    const isMenuActive = menu.classList.toggle('ativo');
    botaoContato.classList.toggle('ativo');

    if (isMenuActive) {
      toggleIcon.src = 'img.produtos/fechar.png';
      toggleIcon.alt = 'Fechar menu';
    } else {
      toggleIcon.src = 'img.produtos/menu.png';
      toggleIcon.alt = 'Menu';
    }
  });
});