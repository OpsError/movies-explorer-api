const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const router = require('./routes/index');
const auth = require('./middlewares/auth');
const NotFound = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const PORT = 3000;
const DB_ADDRESS = 'mongodb://127.0.0.1:27017/filmsbd';

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_ADDRESS);

app.use(express.json());

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(auth, (req, res, next) => {
  next(new NotFound('Запрашиваемая страница не найдена'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log('Server running');
});
