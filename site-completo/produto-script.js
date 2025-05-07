function getParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

async function loadProduct() {
    try {
        const response = await fetch('produtos.json');
        const produtos = await response.json();
        const id = getParam('id');

        const produto = produtos.find(p => p.id === id);

        if (produto) {
            document.querySelector('.texto-superior strong').textContent = produto.nome;
            const img = document.querySelector('.img-produto');
            img.src = produto.imagem;
            img.alt = produto.textoalt;
            document.querySelector('.descricao').textContent = produto.descricao; 
            document.querySelector('.preco').textContent = produto.preco;
            document.querySelector('.aviso').textContent = produto.mensagem;
        } else {
            document.querySelector('.container').innerHTML = '<p>Produto não encontrado.</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar os produtos:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadProduct);