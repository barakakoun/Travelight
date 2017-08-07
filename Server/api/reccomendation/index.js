var controller = require('./reccomendation.controller');
const express = require ('express');
const bodyparser = require('body-parser');
const router = express.Router();

router.get('/',controller.test);
router.get('/:tourId/updateTourProfile',controller.updateTourProfile);
router.get('/:userId/updateUserProfile',controller.updateUserProfile);
router.get('/:userId/:CountryId/contentBasedRecommend',controller.contentBasedRecommend);
router.get('/:userId/:CountryId/ratingBasedRecommend',controller.ratingBasedRecommend);
module.exports = router;

