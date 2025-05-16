console.log("Iniciando o carregamento da navbar...");

// Verifica se a navbar está armazenada no LocalStorage
const cachedNavbar = localStorage.getItem('navbar');

if (cachedNavbar) {
    document.getElementById('navbar-container').innerHTML = cachedNavbar;
}

fetch('navbar.html')
    .then(res => res.ok ? res.text() : Promise.reject('Erro ao carregar navbar'))
    .then(data => {
        // Atualiza o conteúdo da navbar
        document.getElementById('navbar-container').innerHTML = data;
        console.log("Navbar carregada com sucesso!");
        // Armazena no LocalStorage para carregamento rápido na próxima vez
        localStorage.setItem('navbar', data);
        document.dispatchEvent(new Event('navbarLoaded'));
    })
    .catch(err => console.error("Erro:", err));