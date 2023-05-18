const express = require('express');
const crypto = require('crypto');
const { readTalker, writeTalker } = require('./utils/fsUtils');

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

// REQ 05

const validateToken = (req, res, next) => {
  const token = req.header('Authorization');
  console.log(token);
  if (!token) return res.status(401).json({ message: 'Token não encontrado' });
  if (token.length !== 16 || typeof (token) !== 'string') {
    return res.status(401).json({ message: 'Token inválido' });
  }
  next();
};

const validateName = (req, res, next) => {
  const { name } = req.body;
  const obrigatoryNameError = 'O campo "name" é obrigatório';
  if (!name) return res.status(400).json({ message: obrigatoryNameError });
  const minLengthNameError = 'O "name" deve ter pelo menos 3 caracteres';
  if (name.length < 3) return res.status(400).json({ message: minLengthNameError });
  next();
};

const validateAge = (req, res, next) => {
  const { age } = req.body;
  const obrigatoryAgeError = 'O campo "age" é obrigatório';
  if (!age) return res.status(400).json({ message: obrigatoryAgeError });
  const validate = Number.isInteger(age) && age >= 18;
  const minAgeError = 'O campo "age" deve ser um número inteiro igual ou maior que 18';
  if (!validate) return res.status(400).json({ message: minAgeError });
  next();
};

const validateNullTalk = (req, res, next) => {
  const { talk } = req.body;
  const obrigatoryTalkError = 'O campo "talk" é obrigatório';
  if (!talk) return res.status(400).json({ message: obrigatoryTalkError });
  const { watchedAt, rate } = talk;
  const obrigatoryWatchedAtError = 'O campo "watchedAt" é obrigatório';
  if (!watchedAt) return res.status(400).json({ message: obrigatoryWatchedAtError });
  const obrigatoryRateError = 'O campo "rate" é obrigatório';
  if (rate === null || rate === undefined) {
    return res.status(400).json({ message: obrigatoryRateError });
  }

  next(); 
};

const validateFormatTalk = (req, res, next) => {
  const { talk } = req.body;
  const { watchedAt, rate } = talk;
  const regexDate = /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}$/;
  const dateFormatError = 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"';
  if (!watchedAt.match(regexDate)) return res.status(400).json({ message: dateFormatError });
  const validateRate = Number.isInteger(rate) && rate >= 1 && rate <= 5;
  console.log(validateRate);
  const rateFormatError = 'O campo "rate" deve ser um número inteiro entre 1 e 5';
  if (!validateRate) return res.status(400).json({ message: rateFormatError });
  next();
};

app.post('/talker', validateToken, validateName, validateAge, validateNullTalk, 
validateFormatTalk, async (req, res) => {
  const newTalker = req.body;
  const newArq = await writeTalker(newTalker);
  const lastTalker = newArq[newArq.length - 1];
  return res.status(201).json(lastTalker);
});
