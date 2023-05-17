const express = require('express');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { readTalker } = require('./utils/fsUtils');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

// REQ 01

app.get('/talker', async (req, res) => {
  const talkers = await readTalker();
  return res.status(200).json(talkers);
});

// REQ 02

app.get('/talker/:id', async (req, res) => {
  const talkers = await readTalker();
  const { id } = req.params;
  const message = 'Pessoa palestrante não encontrada';
  if (!talkers.some((e) => e.id === Number(id))) return res.status(404).json({ message });
  return res.status(200).json(talkers.find((e) => e.id === Number(id)));
});

app.post('/login', async (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  return res.status(200).json({ token });
});