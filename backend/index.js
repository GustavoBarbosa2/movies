const express = require('express');
const { connect, client } = require('./database');
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const { ObjectId } = require('mongodb'); 

const server = express();
const PORT = process.env.PORT || 3000;

server.use(cors());
server.use(express.json());

server.use(express.static(path.join(__dirname, '..', 'frontend'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'index.html'));
});

server.get('/movies', async (req, res) => {
  try {
    const db = client.db('sample_mflix');
    const movies = await db.collection('movies')
      .find(
        { poster: { $ne: null }, title: { $ne: null } }
      )
      .limit(100)
      .toArray();

    res.json(movies);
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    res.status(500).json({ error: 'Erro ao buscar filmes' });
  }
});

server.get('/movies/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    const db = client.db('sample_mflix');
    const movie = await db.collection('movies').findOne({ _id: new ObjectId(movieId) });

    if (!movie) {
      return res.status(404).json({ error: 'Filme não encontrado' });
    }

    res.json(movie);
  } catch (error) {
    console.error('Erro ao buscar detalhes do filme:', error);
    res.status(500).json({ error: 'Erro ao buscar detalhes do filme' });
  }
});

server.get('/movies/:id/comments', async (req, res) => {
  try {
    const movieId = req.params.id;
    const db = client.db('sample_mflix');
    const movie = await db.collection('movies').findOne({ _id: new ObjectId(movieId) });

    if (!movie) {
      return res.status(404).json({ error: 'Filme não encontrado' });
    }

    res.json(movie.comments || []);
  } catch (error) {
    console.error('Erro ao buscar comentários do filme:', error);
    res.status(500).json({ error: 'Erro ao buscar comentários do filme' });
  }
});

server.post('/movies/:id/comments', async (req, res) => {
  try {
    const movieId = req.params.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Texto é necessário para o comentário' });
    }

    const db = client.db('sample_mflix');
    const newComment = { id: new ObjectId(), text, date: new Date() };

    await db.collection('movies').updateOne(
      { _id: new ObjectId(movieId) },
      { $push: { comments: newComment } }
    );

    res.status(201).json({ message: 'Comentário adicionado com sucesso', comment: newComment });
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    res.status(500).json({ error: 'Erro ao adicionar comentário' });
  }
});

server.put('/movies/:movieId/comments/:commentId', async (req, res) => {
  try {
    const { movieId, commentId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Texto é necessário para editar o comentário' });
    }

    const db = client.db('sample_mflix');
    const result = await db.collection('movies').updateOne(
      { _id: new ObjectId(movieId), 'comments.id': new ObjectId(commentId) },
      { $set: { 'comments.$.text': text, 'comments.$.date': new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }

    res.json({ message: 'Comentário editado com sucesso' });
  } catch (error) {
    console.error('Erro ao editar comentário:', error);
    res.status(500).json({ error: 'Erro ao editar comentário' });
  }
});

server.delete('/movies/:movieId/comments/:commentId', async (req, res) => {
  try {
    const { movieId, commentId } = req.params;

    const db = client.db('sample_mflix');
    const result = await db.collection('movies').updateOne(
      { _id: new ObjectId(movieId) },
      { $pull: { comments: { id: new ObjectId(commentId) } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }

    res.json({ message: 'Comentário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir comentário:', error);
    res.status(500).json({ error: 'Erro ao excluir comentário' });
  }
});

const startServer = async () => {
  try {
    await connect();
    server.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor', error);
  }
};

startServer();
