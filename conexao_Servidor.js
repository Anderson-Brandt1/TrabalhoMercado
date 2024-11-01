const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./conexao_MySQL');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Rota para criar mercado
app.post('/mercados', async (req, res) => {
    try {
        const { nome, endereco } = req.body;
        const id = await db.adicionarMercado(nome, endereco);
        res.status(201).json({ id, nome, endereco });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar mercado' });
    }
});

// Rota para listar mercados
app.get('/mercados', async (req, res) => {
    try {
        const mercados = await db.listarMercados();
        res.json(mercados);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar mercados' });
    }
});
// Rota para buscar mercado por ID
app.get('/mercados/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const mercado = await db.buscarMercadoPorId(id);
        if (!mercado) {
            return res.status(404).json({ error: 'Mercado não encontrado' });
        }
        res.json(mercado);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar mercado' });
    }
});

// Rota para atualizar mercado
app.put('/mercados/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { nome, endereco } = req.body;
        
        // Verificar se o mercado existe
        const mercado = await db.buscarMercadoPorId(id);
        if (!mercado) {
            return res.status(404).json({ error: 'Mercado não encontrado' });
        }

        const sucesso = await db.atualizarMercado(id, nome, endereco);
        if (sucesso) {
            const mercadoAtualizado = await db.buscarMercadoPorId(id);
            res.json(mercadoAtualizado);
        } else {
            res.status(400).json({ error: 'Não foi possível atualizar o mercado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar mercado' });
    }
});

// Rota para excluir mercado
app.delete('/mercados/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        // Verificar se o mercado existe
        const mercado = await db.buscarMercadoPorId(id);
        if (!mercado) {
            return res.status(404).json({ error: 'Mercado não encontrado' });
        }

        const sucesso = await db.excluirMercado(id);
        if (sucesso) {
            res.json({ message: 'Mercado excluído com sucesso' });
        } else {
            res.status(400).json({ error: 'Não foi possível excluir o mercado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir mercado' });
    }
});

// Rota para adicionar produto
app.post('/produtos', async (req, res) => {
    try {
        const { nome, descricao, preco, quantidade, mercado_id } = req.body;
        
        // Verificação básica dos dados
        if (!nome || !descricao  ||!preco || !quantidade || !mercado_id) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const id = await db.adicionarProduto(nome, descricao, preco, quantidade, mercado_id);
        res.status(201).json({ id, nome, descricao, preco, quantidade, mercado_id });
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        res.status(500).json({ error: 'Erro ao adicionar produto' });
    }
});

// Rota para listar produtos
app.get('/produtos', async (req, res) => {
    try {
        const mercadoId = req.query.mercadoId;
        if (!mercadoId) {
            return res.status(400).json({ error: 'O ID do mercado é obrigatório' });
        }
        const produtos = await db.listarProdutos(mercadoId);
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar produtos' });
    }
});

// Rota para registrar movimentação
app.post('/movimentacoes', async (req, res) => {
    try {
        const { tipo, quantidade, data_movimentacao, produto_id, mercado_id } = req.body;
        const id = await db.registrarMovimentacao(tipo, quantidade, data_movimentacao, produto_id, mercado_id);
        res.status(201).json({ id, tipo, quantidade, data_movimentacao, produto_id, mercado_id });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar movimentação' });
    }
});
// Rota para listar movimentações
app.get('/movimentacoes', async (req, res) => {
    try {
        const movimentacoes = await db.listarMovimentacoes(); // Presumindo que existe uma função para listar movimentações
        res.status(200).json(movimentacoes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar movimentações' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    db.connectDB()
        .then(() => console.log('Conectado ao banco de dados'))
        .catch(err => console.error('Erro ao conectar ao banco de dados:', err));
});