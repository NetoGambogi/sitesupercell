function initNavbarEvents() {
  console.log("Inicializando eventos da navbar...");

  const toggleButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.barra-menu');
  const botaoContato = document.querySelector('.botao-contato');

  if (toggleButton && menu && botaoContato) {
    // Substitui o botão antigo por um clone sem eventos antigos
    const newToggleButton = toggleButton.cloneNode(true);
    toggleButton.parentNode.replaceChild(newToggleButton, toggleButton);

    const toggleIcon = newToggleButton.querySelector('img'); // <-- Aqui está o fix

    newToggleButton.addEventListener('click', function () {
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
    console.warn("Elementos da navbar não encontrados. Tentando novamente em 100ms...");
    setTimeout(initNavbarEvents, 100);
  }
}

// Função para o campo de busca
function initSearch() {
  const input = document.getElementById('searchInput');
  const resultsContainer = document.getElementById('results');

  if (!input || !resultsContainer) {
    console.warn("Campo de busca não encontrado. Tentando novamente em 100ms...");
    setTimeout(initSearch, 100);
    return;
  }

  function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  Promise.all([
    fetch('./assets/data.json').then(r => r.json()),
    fetch('./assets/produtos.json').then(r => r.json()),
    fetch('./assets/servicos.json').then(r => r.json())
  ])
    .then(([data, produtos, servicos]) => {
      const produtosFormatados = produtos.map(produto => ({
        id: `produto-${produto.id}`,
        title: produto.nome.replace(' - Consulte a disponibilidade pelo nosso WhatsApp!', ''),
        content: produto.descricao,
        page: `produto.html?id=${produto.id}`
      }));

      const servicosFormatados = Object.entries(servicos).map(([slug, servico]) => ({
        id: `servico-${slug}`,
        title: servico.titulo,
        content: servico.descricao,
        page: `desc-servicos.html?servico=${slug}`
      }));

      const todosOsDados = [...data, ...produtosFormatados, ...servicosFormatados];

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

      // Remove listener anterior se houver
      input.replaceWith(input.cloneNode(true));
      const novoInput = document.getElementById('searchInput');

      novoInput.addEventListener('input', () => {
        const query = normalizarTexto(novoInput.value.trim());

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

      // Clique fora da busca fecha resultados
      document.addEventListener('click', function handleClickOutside(event) {
        if (!novoInput.contains(event.target) && !resultsContainer.contains(event.target)) {
          resultsContainer.style.display = 'none';
        }
      });
    })
    .catch(error => {
      console.error("Erro ao carregar os dados da busca:", error);
    });
}

// Inicializa ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  initNavbarEvents();
  initSearch();
});

// Reexecuta se a navbar for carregada dinamicamente
document.addEventListener("navbarLoaded", () => {
  initNavbarEvents();
  initSearch();
});