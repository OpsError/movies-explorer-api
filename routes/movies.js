const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validateMovieBody, validateMovieParams } = require('../middlewares/validate');

router.get('/', getMovies);

router.post('/', validateMovieBody, createMovie);

router.delete('/:movieId', validateMovieParams, deleteMovie);

module.exports = router;
