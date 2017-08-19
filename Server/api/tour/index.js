/**
 * Created by dell on 30/03/2017.
 */
const controller = require('./tour.controller');
const express = require ('express');
const bodyparser = require('body-parser');
const router = express.Router();

router.get('/',controller.getTours);
router.post('/tourUser', controller.addTourToUser);
router.get('/details/:tourId',controller.getTourDetails);
router.post('/create',controller.create);
router.post('/:tourId/update',controller.update);
router.get('/:tourId/delete',controller.delete);
router.get('/:city/selectTours',controller.selectByCity);
router.get('/:tourId/getStations',controller.getStations);

module.exports = router;