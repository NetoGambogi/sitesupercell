document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const servicoSlug = urlParams.get("servico");

  fetch("./assets/servicos.json")
    .then(res => res.json())
    .then(servicos => {
      const dados = servicos[servicoSlug];

      if (!dados) {
        document.body.innerHTML = "<h2>Serviço não encontrado.</h2>";
        return;
      }

      document.getElementById("titulo-servico").textContent = dados.titulo;
      document.getElementById("breadcrumb-atual").textContent = dados.titulo;
      const img = document.getElementById("imagem-servico");
      img.src = dados.imagem;
      img.alt = dados.titulo;
      document.getElementById("descricao-servico").textContent = dados.descricao;

      // Cria etapas
      const container = document.getElementById("etapas-container");
      dados.etapas.forEach(etapa => {
        const div = document.createElement("div");
        div.className = "etapa";
        div.innerHTML = `
          <span class="icone"><img src="${etapa.icone}" alt="${etapa.titulo}"></span>
          <div class="texto">
            <strong>${etapa.titulo}:</strong>
            <p>${etapa.texto}</p>
          </div>
        `;
        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error("Erro ao carregar dados do serviço:", err);
      document.body.innerHTML = "<h2>Erro ao carregar o serviço.</h2>";
    });
});