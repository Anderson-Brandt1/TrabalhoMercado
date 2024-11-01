const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const util = require('util');

// Criação da instância do Express
const app = express();

// Middleware para analisar o corpo das requisições
app.use(bodyParser.json());

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mercado'
});

// Função para conectar ao MySQL
function connectDB() {
    return new Promise((resolve, reject) => {
        connection.connect(err => {
            if (err) {
                console.error('Erro ao conectar ao MySQL:', err);
                reject(err);
            } else {
                console.log('Conectado ao MySQL');
                resolve();
            }
        });
    });
}

// Promisify para usar async/await com queries
const query = util.promisify(connection.query).bind(connection);

// Função para adicionar um mercado
async function adicionarMercado(nome, endereco) {
    try {
        const result = await query('INSERT INTO mercados (nome, endereco) VALUES (?, ?)', [nome, endereco]);
        console.log('Mercado adicionado com sucesso, ID:', result.insertId);
        return result.insertId;
    } catch (err) {
        console.error('Erro ao adicionar mercado:', err);
        throw err;
    }
}

// Função para listar mercados
async function listarMercados() {
    try {
        return await query('SELECT * FROM mercados');
    } catch (err) {
        console.error('Erro ao listar mercados:', err);
        throw err;
    }
}

// Buscar mercado por ID
async function buscarMercadoPorId(id) {
    try {
        const result = await query('SELECT * FROM mercados WHERE id = ?', [id]);
        return result[0]; // Retorna o primeiro resultado ou undefined
    } catch (err) {
        console.error('Erro ao buscar mercado:', err);
        throw err;
    }
}

// Atualizar mercado
async function atualizarMercado(id, nome, endereco) {
    try {
        const result = await query(
            'UPDATE mercados SET nome = ?, endereco = ? WHERE id = ?',
            [nome, endereco, id]
        );
        return result.affectedRows > 0;
    } catch (err) {
        console.error('Erro ao atualizar mercado:', err);
        throw err;
    }
}

// Excluir mercado
async function excluirMercado(id) {
    try {
        const result = await query('DELETE FROM mercados WHERE id = ?', [id]);
        return result.affectedRows > 0;
    } catch (err) {
        console.error('Erro ao excluir mercado:', err);
        throw err;
    }
}

// Função para adicionar um produto
async function adicionarProduto(nome, descricao, preco, quantidade, mercado_id) {
    try {
        const result = await query(
            'INSERT INTO produtos (nome, descricao, preco, quantidade, mercado_id) VALUES (?, ?, ?, ?, ?)', 
            [nome, descricao, preco, quantidade, mercado_id]
        );
        console.log('Produto adicionado com sucesso, ID:', result.insertId);
        return result.insertId;
    } catch (err) {
        console.error('Erro ao adicionar produto:', err);
        throw err;
    }
}

// Função para listar produtos
async function listarProdutos(mercadoId) {
    try {
        if (mercadoId) {
            return await query('SELECT * FROM produtos WHERE mercado_id = ?', [mercadoId]);
        } else {
            return await query('SELECT * FROM produtos');
        }
    } catch (err) {
        console.error('Erro ao listar produtos:', err);
        throw err;
    }
}
// Função para registrar movimentação
async function registrarMovimentacao(tipo, quantidade, data_movimentacao, produto_id, mercado_id) {
    try {
        const result = await query(
            'INSERT INTO movimentacoes (tipo, quantidade, data_movimentacao, produto_id, mercado_id) VALUES (?, ?, ?, ?, ?)', 
            [tipo, quantidade, data_movimentacao, produto_id, mercado_id]
        );
        console.log('Movimentação registrada com sucesso, ID:', result.insertId);
        return result.insertId; // Retorna o ID da movimentação registrada
    } catch (err) {
        console.error('Erro ao registrar movimentação:', err);
        throw new Error('Erro ao registrar movimentação'); // Lança um erro mais descritivo
    }
}

// Função para listar movimentações
async function listarMovimentacoes() {
    try {
        const result = await query('SELECT * FROM movimentacoes'); // Consulta para pegar todas as movimentações
        console.log('Movimentações listadas com sucesso:', result);
        return result; // Retorna as movimentações
    } catch (err) {
        console.error('Erro ao listar movimentações:', err);
        throw new Error('Erro ao listar movimentações'); // Lança um erro mais descritivo
    }
}

// Rota para listar mercados
app.get('/mercados', async (req, res) => {
    try {
        const mercados = await listarMercados();
        res.json(mercados);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar mercados' });
    }
});

// Exportar as funções para uso em outros arquivos
module.exports = {
    connectDB,
    adicionarMercado,
    listarMercados,
    buscarMercadoPorId,
    atualizarMercado,
    excluirMercado,
    adicionarProduto,
    listarProdutos,
    registrarMovimentacao
};