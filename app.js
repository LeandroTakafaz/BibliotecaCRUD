const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 4200;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'blibioteca'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado ao MySQL!');
});

app.use(express.json());

app.get('/livros', (req, res) => {
  connection.query('SELECT * FROM livros', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/livros', (req, res) => {
  const { titulo, autor, genero, ano } = req.body;
  connection.query('INSERT INTO livros SET ?', { titulo, autor, genero, ano }, (err, result) => {
    if (err) throw err;
    res.json({ message: 'Livro criado com sucesso!' });
  });
});

app.get('/livros/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM livros WHERE id = ?', [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }
    res.json(results[0]);
  });
});

app.put('/livros/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, autor, genero, ano } = req.body;
  connection.query('UPDATE livros SET titulo = ?, autor = ?, genero = ?, ano = ? WHERE id = ?', 
    [titulo, autor, genero, ano, id], 
    (err, result) => {
      if (err) throw err;
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Livro não encontrado' });
      }
      res.json({ message: 'Livro atualizado com sucesso!' });
    }
  );
});

app.delete('/livros/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM livros WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }
    res.json({ message: 'Livro deletado com sucesso!' });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});