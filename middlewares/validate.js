const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const urlPattern = /(https?):\/\/(w{3}\.)?(\w*\/*\W*\d*)*\./;

const validateSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateMovieBody = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer().required(),
    year: Joi.number().integer().required(),
    description: Joi.string().min(2).required(),
    image: Joi.string().uri().pattern(new RegExp(urlPattern)).required(),
    trailerLink: Joi.string().uri().pattern(new RegExp(urlPattern)).required(),
    thumbnail: Joi.string().uri().pattern(new RegExp(urlPattern)).required(),
    movieId: Joi.objectId().required(),
    nameRU: Joi.string().required().required(),
    nameEN: Joi.string().required().required(),
  }),
});

const validateMovieParams = celebrate({
  params: Joi.object().keys({
    movieId: Joi.objectId(),
  }),
});

const validatePatchInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
});

module.exports = {
  validateSignup,
  validateSignin,
  validatePatchInfo,
  validateMovieBody,
  validateMovieParams,
};
