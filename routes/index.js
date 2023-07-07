const router = require('express').Router();
const userRouter = require('./users');
const moviesRouter = require('./movies');
const authRouter = require('./auth');
const auth = require('../middlewares/auth');

router.use('/users', auth, userRouter);
router.use('/movies', auth, moviesRouter);
router.use('/', authRouter);

module.exports = router;
