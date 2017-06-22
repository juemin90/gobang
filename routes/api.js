const express = require('express');
const router = express.Router();
const user = require('./../modules/user');
const next_piece = require('./../modules/next_piece');

router.get('/user', user.getHandler);
router.post('/next_piece', next_piece.postHandler);

module.exports = router;
