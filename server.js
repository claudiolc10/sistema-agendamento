require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Conexão com o banco
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no banco:', err);
    return;
  }
  console.log('Conectado ao MySQL!');
});

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Salvar agendamento
app.post('/api/agendamentos', (req, res) => {
  const { nome, telefone, data, horario, servico } = req.body;

  const sql = 'INSERT INTO agendamentos (nome, telefone, data, horario, servico) VALUES (?, ?, ?, ?, ?)';
  
  db.query(sql, [nome, telefone, data, horario, servico], (err, result) => {
    if (err) {
      console.error('Erro ao salvar:', err);
      return res.status(500).json({ erro: 'Erro ao salvar agendamento' });
    }
    res.json({ mensagem: 'Agendamento salvo com sucesso!', id: result.insertId });
  });
});

// Buscar todos os agendamentos
app.get('/api/agendamentos', (req, res) => {
  db.query('SELECT * FROM agendamentos ORDER BY criado_em DESC', (err, results) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar agendamentos' });
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});