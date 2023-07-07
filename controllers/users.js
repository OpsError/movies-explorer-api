const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const InvalidData = require('../errors/invalid-data-err');
const NotFound = require('../errors/not-found-err');
const InvalidAuth = require('../errors/invalid-auth-err');
const DuplicateError = require('../errors/duplicate-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const MONGODB_ERROR = 11000;

// инфо пользователя
const getInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFound('User Not Found');
    })
    .then((user) => res.status(200).send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch(next);
};

// обновить инфо
const patchInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { returnDocument: 'after' })
    .orFail(() => {
      throw new InvalidData('Invalid Data');
    })
    .then((user) => res.status(200).send(user))
    .catch(next);
};

// регистрация
const signup = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === MONGODB_ERROR) {
        next(new DuplicateError('Такая почта уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new InvalidData('Invalid Data'));
      } else {
        next(err);
      }
    });
};

// авторизация
const signin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .orFail(() => {
      throw new InvalidAuth('Неверный логин или пароль');
    })
    .then((user) => Promise.all([user, bcrypt.compare(password, user.password)]))
    .then(([user, matched]) => {
      if (!matched) {
        throw new InvalidAuth('Неверный логин или пароль');
      }

      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-secret-key', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch(next);
};

module.exports = {
  getInfo,
  patchInfo,
  signup,
  signin,
};
