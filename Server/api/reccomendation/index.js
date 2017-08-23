var controller = require('./reccomendation.controller');
const express = require ('express');
const bodyparser = require('body-parser');
const router = express.Router();

router.get('/',controller.test);
router.get('/updateTourProfile/:tourId',controller.updateTourProfile);
router.get('/updateUserProfile/:userId',controller.updateUserProfile);
router.get('/contentBasedRecommend/:userId/:CountryId',controller.contentBasedRecommend);
router.get('/ratingBasedRecommend/:userId/:CountryId',controller.ratingBasedRecommend);
module.exports = router;

