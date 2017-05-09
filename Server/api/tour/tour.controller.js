/**
 * Created by dell on 30/03/2017.
 */

var db = require('../database');
var tourConsts = require('../../../consts/tour');
var stationConsts = require('../../../consts/station');
var tourStationConsts = require('../../../consts/tourStation');
var messages = require('../../../consts/messages');
//create connection to mysql

exports.test = function(req, res) {

    //Connect to the DB
    connection = db.initDB();

    connection.query('SELECT * from tour', function (err, rows, fields) {
        if (!err) {
            console.log('The solution is: ', rows);
            res.send(rows);
        }
        else {
            res.send('idiot');
            console.log('Error while performing Query.');
        }
    });
    db.closeDB(connection)
};
// Get tour by ID
exports.getTourDetails = function(req,res) {
   var id =  req.param('tourId')
    //Connect to the DB
    connection = db.initDB();
    connection.query('SELECT * from tour where ID=?',id,function (err, rows, fields) {
        if (!err) {

            res.send(rows);
        }
        else {
            res.send(messages.selectTourFailed);
           throw err;
        }
    });
    db.closeDB(connection);
};
// Create Tour
exports.create = function(req,res) {
var tour = req.body;
//if(!tour.name||!tour.city||!tour.duration)
if(!tour.name||!tour.duration)
{
    res.send('please enter all required fields');
}
else {
    connection = db.initDB();
    connection.query('INSERT INTO TOUR SET ?',tour,function(err,result) {
        if(err) {
            throw err;
            res.send(messages.addTourFailed);
        }
        else
        {
            res.send(messages.addTourSuccess);
        }
    })
    db.closeDB(connection);
}

};
// Delete tour
exports.delete = function(req,res) {
    id = req.params.tourId;
    console.log('delete id is'+id);
    connection = db.initDB();
    connection.query('DELETE FROM TOUR WHERE ID = ?',[id],function(err,result){
        if(err)
        {
            throw err;
            res.send(messages.deleteTourFailed);
        }
        else
        {
            res.send(messages.deleteTourSuccess);
        }
    })
    db.closeDB(connection);
};
// Update tour
exports.update = function(req,res) {
    var id = req.param('tourId');
    var tour = req.body;
    connection = db.initDB();
    connection.query('UPDATE TOUR SET ? WHERE ID=?',[tour,id],function (err,result) {
       if(err)
       {
           throw err;
           res.send(messages.updateTourFailed);
       }
       else
       {
           res.send(messages.updateTourSuceess);
       }

    });
    db.closeDB(connection);
};
// Select tours by city and return first station location
exports.selectByCity= function (req,res) {
    var city = req.param('city');
    console.log(city);
    connection = db.initDB();
    connection.query('SELECT T.ID,S.LATITUDE,S.LONGITUDE FROM TOUR T INNER JOIN TOUR_STATION TS ON T.ID = TS.TOUR_ID ' +
        'INNER JOIN STATION S ON S.ID = TS.STATION_ID WHERE T.CITY = ? AND TS.STATION_NUMBER = 1',[city],function (err,rows,fields) {
        if(err)
        {
            throw  err;
            res.send(messages.selectTourFailed);
        }
        else
        {
            res.send(rows);
        }
    })
    db.closeDB(connection);
}