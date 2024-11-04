const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const app = express();
const port = 4200;

async function connectToDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'biblioteca'
  });

  try {
    await connection.query('SELECT 1');
    console.log('Connected to MySQL database!');
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    connection.end();
  }
}

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
});''

// Middleware
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Função para verificar se o usuário está autenticado
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Não autorizado' });
  }
};

// Rota para registro
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const   
 [results] = await pool.execute('INSERT INTO users SET ?', { username, password: hashedPassword });
    res.json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar usuário'   
 });
  }
});

// Rota para login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ message:   
 'Usuário não encontrado' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      req.session.user = { id: user.id, username: user.username };
      res.json({ message: 'Login realizado com sucesso!' });
    } else {
      res.status(401).json({ message: 'Senha incorreta' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

// Rota para logout
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logout realizado com sucesso!' });
});

// Rota protegida (exemplo)
app.get('/profile', isAuthenticated, (req, res) => {
  res.json({ message: 'Perfil do usuário', user: req.session.user });
});