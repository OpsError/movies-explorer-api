const Movie = require('../models/movie');
const InvalidData = require('../errors/invalid-data-err');
const NotFound = require('../errors/not-found-err');
const AccessError = require('../errors/access-err');
const DuplicateError = require('../errors/duplicate-err');

const MONGODB_ERROR = 11000;

// список фильмов в избранных
const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((film) => res.status(200).send(film))
    .catch(next);
};

// добавление фильма в избр
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((film) => res.status(201).send(film))
    .catch((err) => {
      if (err.code === MONGODB_ERROR) {
        next(new DuplicateError('Этот фильм уже добавлен в избранные'));
      } else if (err.name === 'ValidationError') {
        next(new InvalidData('Invalid Data'));
      }
      next(err);
    });
};

// удалить фильм из избр
const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFound('Movie Not Found');
    })
    .then((film) => {
      if (!(film.owner.toString() === req.user._id)) {
        throw next(new AccessError('Нет прав доступа'));
      }

      Movie.deleteOne({ _id: req.params.movieId })
        .orFail(() => {
          throw new NotFound('Movie Not Found');
        })
        .then(() => res.send({ message: 'Movie removed' }))
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
