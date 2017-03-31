/**
 * Created by dell on 30/03/2017.
 */
var controller = require('./tour.controller');
var express = require ('express');
var bodyparser = require('body-parser');
var router = express.Router();
console.log(controller);
router.get('/',controller.test);
router.get('/:tourId/details',controller.getTourDetails);
router.post('/create',controller.create);

module.exports = router;