const router = require('express').Router();
const { getInfo, patchInfo } = require('../controllers/users');
const { validatePatchInfo } = require('../middlewares/validate');

router.get('/me', getInfo);

router.patch('/me', validatePatchInfo, patchInfo);

module.exports = router;
