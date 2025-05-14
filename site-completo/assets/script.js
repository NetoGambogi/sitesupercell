// Função para inicializar os eventos da navbar
function initNavbarEvents() {
  console.log("Inicializando eventos da navbar...");

  // Menu hambúrguer
  const toggleButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.barra-menu');
  const botaoContato = document.querySelector('.botao-contato');

  if (toggleButton && menu && botaoContato) {
    const toggleIcon = toggleButton.querySelector('img');

    toggleButton.addEventListener('click', function () {
      const isMenuActive = menu.classList.toggle('ativo');
      botaoContato.classList.toggle('ativo');

      if (isMenuActive) {
        toggleIcon.src = 'img/fechar.png';
        toggleIcon.alt = 'Fechar menu';
      } else {
        toggleIcon.src = 'img/menu.png';
        toggleIcon.alt = 'Menu';
      }
    });
  } else {
    console.error("Botão de menu ou elementos da barra não encontrados.");
  }

  // Campo de busca
  const input = document.getElementById('searchInput');
  const resultsContainer = document.getElementById('results');

  if (!input || !resultsContainer) {
    console.error("Elemento de entrada ou contêiner de resultados não encontrado.");
    return;
  }

  function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  fetch('./assets/data.json')
    .then(response => response.json())
    .then(data => {
      fetch('./assets/produtos.json')
        .then(response => response.json())
        .then(produtos => {
          const produtosFormatados = produtos.map(produto => ({
            id: produto.id,
            title: produto.nome.replace(' - Consulte a disponibilidade pelo nosso WhatsApp!', ''),
            content: produto.descricao,
            page: `produto.html?id=${produto.id}`
          }));

          const todosOsDados = [...data, ...produtosFormatados];

          const miniSearch = new MiniSearch({
            fields: ['title', 'content'],
            storeFields: ['id', 'title', 'content', 'page'],
            searchOptions: {
              prefix: true,
              fuzzy: 0.2,
              combineWords: true
            }
          });

          miniSearch.addAll(todosOsDados);

          input.addEventListener('input', () => {
            const query = normalizarTexto(input.value.trim());

            if (query === '') {
              resultsContainer.innerHTML = '';
              resultsContainer.style.display = 'none';
              return;
            }

            let results = miniSearch.search(query);

            if (results.length === 0) {
              results = todosOsDados.filter(item =>
                normalizarTexto(item.title).includes(query) ||
                normalizarTexto(item.content).includes(query)
              );
            }

            if (results.length === 0) {
              resultsContainer.innerHTML = '<div class="result-item">Nenhum resultado encontrado.</div>';
            } else {
              resultsContainer.innerHTML = results.map(result => `
                <div class="result-item">
                  <a href="${result.page}" class="result-link">
                    <strong>${result.title}</strong><br>
                    <small>${result.content}</small>
                  </a>
                </div>
              `).join('');
            }

            resultsContainer.style.display = 'block';
          });
        });
    })
    .catch(error => {
      console.error("Erro ao carregar os dados:", error);
    });

  document.addEventListener('click', function (event) {
    if (!input.contains(event.target) && !resultsContainer.contains(event.target)) {
      resultsContainer.style.display = 'none';
    }
  });
}

// Garantir que os eventos sejam inicializados tanto no carregamento quanto na atualização da navbar
document.addEventListener('DOMContentLoaded', initNavbarEvents);
document.addEventListener('navbarLoaded', initNavbarEvents);