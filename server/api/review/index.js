/**
 * Created by galna21 on 03/08/2017.
 */
/**
 * Created by dell on 30/03/2017.
 */
const controller = require('./review.controller');
const express = require ('express');
const bodyparser = require('body-parser');
const router = express.Router();

router.get('/:tourId',controller.getTourReviews);
router.post('/create',controller.addReviewToTour);
module.exports = router;