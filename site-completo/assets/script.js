document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.barra-menu');
  const botaoContato = document.querySelector('.botao-contato');
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
});

// Campo de busca

document.addEventListener('DOMContentLoaded', async () => {
  const input = document.getElementById('searchInput');
  const resultsContainer = document.getElementById('results');

  if (!input || !resultsContainer) {
    console.error("Elemento de entrada ou contêiner de resultados não encontrado.");
    return;
  }

  try {
    const [responseData, responseProdutos] = await Promise.all([
      fetch('./assets/data.json'),
      fetch('./assets/produtos.json')
    ]);

    const data = await responseData.json();
    const produtos = await responseProdutos.json();

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
      const query = input.value.trim().toLowerCase();

      if (query === '') {
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
        return;
      }

      let results = miniSearch.search(query);

      if (results.length === 0) {
        results = todosOsDados.filter(item =>
          item.title.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query)
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

  } catch (error) {
    console.error("Erro ao carregar os dados:", error);
  }
});

document.addEventListener('click', function(event) {
  const searchBox = document.getElementById('searchInput');
  const resultsContainer = document.getElementById('results');

  if (!searchBox || !resultsContainer) return;

  if (!searchBox.contains(event.target) && !resultsContainer.contains(event.target)) {
    resultsContainer.style.display = 'none';
  }
});
