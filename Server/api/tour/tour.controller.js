/**
 * Created by dell on 30/03/2017.
 */

var db = require('../database');
var tourConsts = require('../../../Consts/tour');

//create connection to mysql

    exports.test = function(req, res)
{

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
}
// Get tour by ID
exports.getTourDetails = function(req,res) {
   var id =  req.param('tourId')
    //Connect to the DB
    connection = db.initDB();
    connection.query('SELECT * from tour where ID=?',id,function (err, rows, fields) {
        if (!err) {
            console.log('The solution is: ', rows);
            res.send(rows);
        }
        else {
            res.send('something weired happend');
            console.log('Error while performing Query.');
        }
    });
}
exports.create = function(req,res) {
console.log(req.body);
res.send('sds');
}