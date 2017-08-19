/**
 * Created by dell on 19/05/2017.
 */
var controller = require('./user.controller');
var express = require ('express');
var bodyparser = require('body-parser');
var router = express.Router();

router.get('/toursHistory/:email',controller.toursHistory);
router.post('/addTour',controller.addTour);
router.post('/login',controller.loginUser);

module.exports = router;