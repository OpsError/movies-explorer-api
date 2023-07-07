const router = require('express').Router();
const { validateSignup, validateSignin } = require('../middlewares/validate');
const { signup, signin } = require('../controllers/users');

router.post('/signin', validateSignin, signin);

router.post('/signup', validateSignup, signup);

module.exports = router;
