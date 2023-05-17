const express = require('express');
const crypto = require('crypto');
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

// REQ 03 - 04
const validateEmail = (req, res, next) => {
  const { email } = req.body;
  const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  const emailError = 'O "email" deve ter o formato "email@email.com"';
  const emailObrigatoryError = 'O campo "email" é obrigatório';
  if (!email) return res.status(400).json({ message: emailObrigatoryError });
  if (!email.match(regex)) return res.status(400).json({ message: emailError });
  next();
};

const validatePassword = (req, res, next) => {
  const { password } = req.body;
  const passwordObrigatoryError = 'O campo "password" é obrigatório';
  const passwordMinLenthError = 'O "password" deve ter pelo menos 6 caracteres';
  if (!password) return res.status(400).json({ message: passwordObrigatoryError });
  if (password.length < 6) return res.status(400).json({ message: passwordMinLenthError });
  next();
};

app.post('/login', validateEmail, validatePassword, async (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  return res.status(200).json({ token });
});