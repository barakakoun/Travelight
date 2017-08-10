var controller = require('./reccomendation.controller');
const express = require ('express');
const bodyparser = require('body-parser');
const router = express.Router();

router.get('/',controller.test);
router.get('/:tourId/updateTourProfile',controller.updateTourProfile);
router.get('/:userId/updateUserProfile',controller.updateUserProfile);
router.get('/contentBasedRecommend/:userId/:CountryId',controller.contentBasedRecommend);
router.get('/ratingBasedRecommend/:userId/:CountryId',controller.ratingBasedRecommend);
module.exports = router;

