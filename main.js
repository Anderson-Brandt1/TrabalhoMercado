const API_URL = 'http://localhost:3000';

// Funções auxiliares
async function fetchAPI(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${API_URL}${endpoint}`, options);
    if (!response.ok) throw new Error('Erro na requisição');
    return response.json();
}

function showMessage(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

// Funções de Mercado
async function criarMercado(event) {
    event.preventDefault();
    const nome = document.getElementById('nomeMercado').value;
    const endereco = document.getElementById('enderecoMercado').value;
    try {
        const data = await fetchAPI('/mercados', 'POST', { nome, endereco });
        showMessage('respostaCriacaoDeMercado', `Mercado criado com ID: ${data.id}`);
    } catch (error) {
        showMessage('respostaCriacaoDeMercado', 'Erro ao criar mercado');
    }
}

async function listarMercados() {
    try {
        const mercados = await fetchAPI('/mercados');
        const lista = mercados.map(m => `ID: ${m.id}, Nome: ${m.nome}, Endereço: ${m.endereco}`).join('<br>');
        document.getElementById('listaMercado').innerHTML = lista;
    } catch (error) {
        showMessage('listaMercado', 'Erro ao listar mercados');
    }
}

async function buscarMercadoDetalhes() {
    const id = document.getElementById('idMercadoGerenciar').value;
    const divDetalhes = document.getElementById('detalhesMercado');
    try {
        const mercado = await fetchAPI(`/mercados/${id}`);
        document.getElementById('alteracaoDeNome').value = mercado.nome;
        document.getElementById('alteracaoDeEndereco').value = mercado.endereco;
        divDetalhes.style.display = 'block';
        showMessage('respostaGerenciamentoMercado', '');
    } catch (error) {
        showMessage('respostaGerenciamentoMercado', 'Mercado não encontrado');
        divDetalhes.style.display = 'none';
    }
}

async function atualizarMercadoDetalhes() {
    const id = document.getElementById('idMercadoGerenciar').value;
    const nome = document.getElementById('alteracaoDeNome').value;
    const endereco = document.getElementById('alteracaoDeEndereco').value;
    try {
        await fetchAPI(`/mercados/${id}`, 'PUT', { nome, endereco });
        showMessage('respostaGerenciamentoMercado', 'Mercado atualizado com sucesso!');
    } catch (error) {
        showMessage('respostaGerenciamentoMercado', 'Erro ao atualizar mercado');
    }
}

async function confirmarExclusao() {
    const id = document.getElementById('idMercadoGerenciar').value;
    if (confirm(`Você tem certeza que deseja excluir o mercado com ID ${id}?`)) {
        try {
            await fetchAPI(`/mercados/${id}`, 'DELETE');
            showMessage('respostaGerenciamentoMercado', 'Mercado excluído com sucesso!');
        } catch (error) {
            showMessage('respostaGerenciamentoMercado', 'Erro ao excluir mercado');
        }
    }
}

// Funções de Produto
async function adicionarProduto(event) {
    event.preventDefault();
    const idMercado = document.getElementById('idMercadoProduto').value;
    const produto = {
        nome: document.getElementById('nomeProduto').value,
        descricao: document.getElementById('descricaoProduto').value,
        preco: parseFloat(document.getElementById('precoProduto').value),
        quantidade: parseInt(document.getElementById('quantidadeProduto').value),
        mercado_id: parseInt(idMercado)
    };
    console.log('Dados do produto:', produto);
    try {
        const data = await fetchAPI('/produtos', 'POST', produto);
        showMessage('respostaAdicionarProduto', `Produto adicionado com ID: ${data.id}`);
        // Limpar formulário após sucesso
        document.getElementById('adicionarProduto').reset();
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        showMessage('respostaAdicionarProduto', 'Erro ao adicionar produto');
    }
}

async function listarProdutos(event) {
    event.preventDefault();
    const marketId = document.getElementById('listaIdMercado').value;
    try {
        const produtos = await fetchAPI(`/produtos?mercadoId=${marketId}`);
        const lista = produtos.map(p => 
            `ID: ${p.id}, Nome: ${p.nome}, Preço: ${p.preco}, Quantidade: ${p.quantidade}`
        ).join('<br>');
        document.getElementById('listaProdutoResultado').innerHTML = lista;
    } catch (error) {
        showMessage('listaProdutoResultado', 'Erro ao listar produtos');
    }
}

// Função de Movimentação de Estoque
async function registrarMovimentacao(event) {
    event.preventDefault();
    const movimentacao = {
        tipo: document.getElementById('tipoMovimentacao').value,
        quantidade: parseInt(document.getElementById('quantidadeMovimentacao').value),
        data_movimentacao: document.getElementById('dataMovimentacao').value,
        produto_id: parseInt(document.getElementById('idProdutoMovimentacao').value),
        mercado_id: parseInt(document.getElementById('idMercadoMovimentacao').value)
    };
    try {
        await fetchAPI('/movimentacoes', 'POST', movimentacao);
        showMessage('respostaMovimentacao', 'Movimentação registrada com sucesso!');
        // Limpar formulário após sucesso
        document.getElementById('registrarMovimentacao').reset();
    } catch (error) {
        showMessage('respostaMovimentacao', 'Erro ao registrar movimentação');
    }
}
// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('criarMercado').addEventListener('submit', criarMercado);
    document.getElementById('botaoListaMercado').addEventListener('click', listarMercados);
    document.getElementById('adicionarProduto').addEventListener('submit', adicionarProduto);
    document.getElementById('listaProduto').addEventListener('submit', listarProdutos);
    document.getElementById('registrarMovimentacao').addEventListener('submit', registrarMovimentacao);
});