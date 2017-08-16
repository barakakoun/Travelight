/**
 * Created by dell on 30/03/2017.
 */

const db = require('../database');
const tourConsts = require('../../../consts/tour');
const stationConsts = require('../../../consts/station');
const tourStationConsts = require('../../../consts/tourStation');
const messages = require('../../../consts/messages');

const _ = require('lodash');
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

// exports.getTours = function(req, res) {
//     const tours = [
//         {
//             key: 1,
//             name: 'The history of Rabin Square',
//             description: 'Get to know Rabin Square from the beginning to present. get to know the full history of formerly kings of Israel square',
//             duration: '1.30',
//             accessible: true,
//             distance: '2',
//             reviews: 5,
//             rating: 4.5,
//             coordinate: {
//                 latitude: 32.0802627,
//                 longitude: 34.7808783
//             },
//             img: 'http://www.mapa.co.il/WWWTemp/UDP/105936_800_600.jpeg'
//         },
//         {
//             key: 2,
//             name: 'Dizingoff street as you never seen before',
//             description: 'Dizengoff Street is a major street in central Tel Aviv, named after Tel Avivs first mayor, Meir Dizengoff.',
//             duration: '1.30',
//             accessible: false,
//             distance: '1.5',
//             reviews: 9,
//             rating: 3.7,
//             coordinate: {
//                 latitude: 32.0745575,
//                 longitude: 34.7772692
//             },
//             img: 'http://www.sea-hotel.co.il/sites/sea/UserContent/images/Attractions/%D7%93%D7%99%D7%96%D7%99%D7%A0%D7%92%D7%95%D7%A3%20%D7%A1%D7%A0%D7%98%D7%A8.jpg'
//         },
//         {
//             key: 3,
//             name: 'Beautiful tour in Rothschild Boulevard',
//             description: 'Rothschild Boulevard is one of the principal streets in the center of Tel Aviv, Israel, beginning in Neve Tzedek at its southwestern edge and running north to Habima Theatre.',
//             duration: '2',
//             accessible: true,
//             distance: '3.2',
//             reviews: 20,
//             rating: 5,
//             coordinate: {
//                 latitude: 32.0633612,
//                 longitude: 34.7730913
//             },
//             img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/PikiWiki_Israel_8331_rotshild_blvd._tel-aviv.jpg/800px-PikiWiki_Israel_8331_rotshild_blvd._tel-aviv.jpg'
//         },
//         {
//             key: 4,
//             name: 'History of Petach Tikva',
//             description: 'Learn about Petach Tikva. a city that grew in the last few years',
//             duration: '0.50',
//             accessible: false,
//             distance: '1.5',
//             reviews: 0,
//             rating: 0,
//             coordinate: {
//                 latitude: 32.078801,
//                 longitude: 34.907979
//             },
//             img: 'http://images1.ynet.co.il/xnet//PicServer2/pic/012012/154037/31_735.jpg'
//         }
//     ];
//
//     res.send(tours);
// };

exports.getTours = function(req, res) {
    let connection = db.initDB();

    const query = 'SELECT T.id,T.name,T.description,T.distance,T.duration,S.latitude,S.longitude,T.img' +
                   ' FROM tour T INNER JOIN tour_station TS ON T.ID = TS.TOUR_ID INNER JOIN station S ' +
                   ' ON TS.STATION_ID = S.ID WHERE TS.STATION_NUMBER =1';
    connection.query(query,[],function (err,rows) {
        if(err)
        {
            console.log(err);
            db.closeDB(connection);
            res.send('error');
        }
        else
        {
            const tourIds = rows.map(row => row.id);
            const reviewsQuery = 'SELECT R.RANK, R.REVIEW_TEXT, R.TOUR_ID' +
            ' FROM reviews R WHERE R.TOUR_ID IN (' + tourIds + ')';
            connection.query(reviewsQuery,function (err2,reviews) {
                if(err2) {res.send('error')}
                // console.log(JSON.stringify(reviews,null,3));
                const tours = _
                    .chain(rows).map(row => {
                        let tourReviews = reviews.filter(review => review.TOUR_ID === row.id);
                        console.log(JSON.stringify(tourReviews,null,3));
                        let sum = 0;
                        for(let i=0; i<tourReviews.length; i++) {
                            sum += tourReviews[i].RANK;
                        }
                        // console.log(sum);
                        // console.log(sum/tourReviews.length);
                        // console.log(Math.round(sum/tourReviews.length));
                        return {
                            key: row.id,
                            name: row.name,
                            description: row.description,
                            duration: row.duration,
                            accessible: true,
                            distance: row.distance,
                            reviews: tourReviews.length,
                            rating: tourReviews.length ? Math.round(sum/tourReviews.length) : 0,
                            coordinate: {
                                latitude: row.latitude,
                                longitude: row.longitude
                            },
                            img: row.img,
                        }}).value();

                db.closeDB(connection);
                res.send(tours);
            })
        }
    })

};

// Get tour by ID
exports.getTourDetails = function(req,res) {
   var tourId =  req.param('tourId');
    //Connect to the DB
    connection = db.initDB();
    connection.query('SELECT T.id, T.name, T.description,T.duration,T.distance,T.img from tour T where ID=?',tourId,
        function (err, tours) {
            if (err) {
                db.closeDB(connection);
                res.send(messages.selectTourFailed);
            }

            const reviewsQuery = 'SELECT R.id, R.rank' +
                ' FROM reviews R WHERE R.TOUR_ID = ?';

            connection.query(reviewsQuery,tourId, function (err2,reviews) {
                if(err2) { res.send(err2)}

                // TODO: Maybe there is a better way...
                const stationsQuery = 'SELECT S.latitude,S.longitude' +
                    ' FROM tour T INNER JOIN tour_station TS ON T.ID = TS.TOUR_ID INNER JOIN station S ON TS.STATION_ID = S.ID WHERE TS.STATION_NUMBER =1 and T.ID = ?';

                connection.query(stationsQuery,tourId, function (err3,station) {
                    if(err3) { res.send(err3)}

                    let sum = 0;
                    for(let i=0; i< reviews.length; i++) {
                        sum += reviews[i].rank;
                    }

                    const tour = {
                        key: tours[0].id,
                        name: tours[0].name,
                        description: tours[0].description,
                        duration: tours[0].duration,
                        coordinate: {
                            latitude: station[0].latitude,
                            longitude: station[0].longitude
                        },
                        accessible: true,
                        distance: tours[0].distance,
                        reviews: reviews.length,
                        rating: reviews.length ? Math.round(sum/reviews.length) : 0,
                        img: tours[0].img
                    };
                    db.closeDB(connection);
                    res.send(tour);
                });
            });
    });
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
    const query = 'SELECT T.id,T.name,T.description,T.duration,S.latitude,S.longitude,T.img' +
        ' FROM tour T INNER JOIN tour_station TS ON T.ID = TS.TOUR_ID INNER JOIN station S ' +
        ' ON TS.STATION_ID = S.ID WHERE TS.STATION_NUMBER =1 and T.CITY = ?';
    connection = db.initDB();
    connection.query(query,[city],function (err,rows,fields) {
        if(err)
        {
            throw  err;
            res.send(messages.selectTourFailed);
        }
        else
        {
            const tours =_
                .chain(rows).map(row => ({key:row.id,name:row.name,description:row.description,
                    duration:row.duration,accessible: true,
                    distance: '2', reviews: 5, rating: 4.5,coordinate:{latitude:row.latitude,longitude:row.longitude
                        ,img:row.img}
                })).value();

            db.closeDB(connection);
            res.send(tours);
        }
    });
};

exports.getStations = function (req,res) {
    const tourKey = req.param('tourId');
    const query ='SELECT ts.station_number, s.name, s.latitude, s.longitude, s.image, si.type, si.data' +
        ' FROM tour_station ts inner join station s on  s.id = ts.station_id left join station_info si' +
        ' on s.id = si.station_id where tour_id = ?';
    connection = db.initDB();

    connection.query(query,[tourKey],function (err,rows) {
        if(err)
        {
            console.log(err);
            res.send('error');
        }
        else
        {
            const stationsData = _
                .chain(rows)
                .map(row => ({
                key:row.station_number,
                name:row.name,
                coordinate:{
                    latitude:row.latitude,
                    longitude:row.longitude},
                type:row.type,
                data:row.data,
            })).value();

            const stationIds = _
                .chain(stationsData)
                .map(s => ({key: s.key, name:s.name, coordinate: s.coordinate}))
                .uniqBy('key')
                .value();

            const resultStations = stationIds.map(stationId =>{
                const station = {
                    key: stationId.key,
                    name:stationId.name,
                    coordinate: stationId.coordinate,
                    data: [],
                };

                station.data = _
                    .chain(stationsData)
                    .filter(s => s.key === stationId.key)
                    .map(row => ({type: row.type,data: row.data }))
                    .value();

                return station;
            });
            console.log(JSON.stringify(resultStations, null, 3));
            res.send(resultStations);
        }
    });
    db.closeDB(connection);
}
