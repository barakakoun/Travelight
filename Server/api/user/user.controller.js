/**
 * Created by dell on 19/05/2017.
 */
var db = require('../database');
var userConsts = require('../../../consts/user');
var messages = require('../../../consts/messages');

exports.toursHistory = function (req,res) {
    var email =  req.param('email');
    connection = db.initDB();
    // const query = 'SELECT T.id,T.name,T.description,T.distance,T.duration,S.latitude,S.longitude,T.img' +
    //     ' FROM tour T INNER JOIN tour_station TS ON T.ID = TS.TOUR_ID INNER JOIN station S ' +
    //     ' ON TS.STATION_ID = S.ID WHERE TS.STATION_NUMBER =1';

    const query = 'SELECT T.id,T.name,T.description,T.distance,T.duration,T.img' +
        ' FROM tour T INNER JOIN user_tour UT ON T.ID = UT.tour_id WHERE UT.email = ?';
    connection.query(query,email,
        function (err, tours) {
            if (err) {
                res.send(messages.selectTourFailed);
            }
            else {
                const resTours = tours.map(tour => ({
                    key: tour.id,
                    name: tour.name,
                    description: tour.description,
                    distance: tour.distance,
                    duration: tour.duration,
                    img: tour.img,
                }));
                res.send(resTours);
            }

            // const reviewsQuery = 'SELECT R.id, R.rank' +
            //     ' FROM reviews R WHERE R.TOUR_ID = ?';
            //
            // connection.query(reviewsQuery,tourId, function (err2,reviews) {
            //     if(err2) { res.send(err2)}
            //
            //     // TODO: Maybe there is a better way...
            //     const stationsQuery = 'SELECT S.latitude,S.longitude' +
            //         ' FROM tour T INNER JOIN tour_station TS ON T.ID = TS.TOUR_ID INNER JOIN station S ON TS.STATION_ID = S.ID WHERE TS.STATION_NUMBER =1 and T.ID = ?';
            //
            //     connection.query(stationsQuery,tourId, function (err3,station) {
            //         if(err3) { res.send(err3)}
            //
            //         let sum = 0;
            //         for(let i=0; i< reviews.length; i++) {
            //             sum += reviews[i].rank;
            //         }
            //
            //         const tour = {
            //             key: tours[0].id,
            //             name: tours[0].name,
            //             description: tours[0].description,
            //             duration: tours[0].duration,
            //             accessible: true,
            //             distance: tours[0].distance,
            //             img: tours[0].img
            //         };
            //         db.closeDB(connection);
            //         res.send(tour);
            //     });
            // });
        });

    db.closeDB(connection);
};

exports.loginUser = function (req,res) {
    var user = req.body;
    connection = db.initDB();
    //check if user exists
    var exist = true
    console.log(JSON.stringify(user));
    connection.query("select count(email) as userCount from users where email =?",[user.EMAIL],function (err, rows, fields) {
        if (!err) {

            if(rows[0].userCount == 0)
            {
                connection.query("INSERT INTO users SET ?",[user],function(err,result) {
                    if(err) {
                        console.log(err);
                        throw err;
                        res.send(messages.loginUserFailed);
                    }
                    else {
                        connection.query('SELECT id from categories',[],function(err,rows){
                            if(err)
                            {
                                console.log(err);
                                throw err;
                            }
                            else
                            {
                                let insertsQueries ='';
                                rows.forEach(row => {
                                    insertsQueries+='INSERT into user_profile set user_id ="'+user.EMAIL+
                                        '",category_id='
                                        + row.id +',rating=2.5;';
                                });
                                console.log(insertsQueries);
                                connection.query(insertsQueries,[],function (err,result1) {
                                    if(err)
                                    {
                                        throw err;
                                    }
                                    else
                                    {
                                        res.send(JSON.stringify({message: messages.loginUserSucess}));
                                        db.closeDB(connection);
                                    }

                                })

                            }
                        })

                    }
                });

            }
            else
            {
                res.send(JSON.stringify({message: messages.loginUserSucess}));
                db.closeDB(connection);
            }exist = false;
        }
        else {
            res.send(messages.loginUserFailed);
            throw err;
        }});
};