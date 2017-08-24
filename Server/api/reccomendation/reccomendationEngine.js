const Recommender = require('likely');
const _ = require('lodash');
const db = require('../database');
exports.ratingBasedRecommend =  function(user,country,res){
    var connection = db.initDB();
    // select all tour id's that our user rated
    const toursQuery = 'SELECT distinct(rv.tour_id) from  reviews rv ' +
      'inner join tour t on t.id = rv.tour_id' + '  where rv.user_id = ? or t.country = ? order by rv.tour_id';
    //


    // const filterUsers =
    //     'select rv.user_id ' +
    //     'from tour_review tourRv ' +
    //     'inner join reviews rv '+
    //     'on tourRv.review_id = rv.id ' +
    //     'inner join tours t on t.id = tourRv.tour_id ' +
    //     'where tourRv.user_id in(result)'+
    //     'and tourRv.user_id in(' +
    //         'select rv1.user_id from tour_review tourRv1 inner join reviews rv1'+
    //         'on tourRv1.review_id = rv1.id inner join tours t on t.id = tourRv1.tour_id where t.city = city)'
    connection.query(toursQuery,[user,country],function(err,rows)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(rows);
            let tours = new Array();
            rows.map(row=>{
                tours.push(row.tour_id);
            })
            console.log("tours:" + tours);
            const usersQuery = 'select distinct(rv.user_id) from reviews rv ' +
                'where rv.tour_id in (?) order by rv.user_id';
            connection.query(usersQuery,[tours],function(err1,rows1){
                if(err1)
                {
                    console.log(err1);
                }
                else
                {
                    let users = new Array();
                    rows1.map(row=>{
                       users.push(row.user_id);
                    });
                    const reviewsQuery = 'select user_id,tour_id,rank from reviews where user_id in (?) and tour_id in(?)';
                    connection.query(reviewsQuery,[users,tours],function(err2,rows2){
                        if(err2)
                        {
                            console.log(err2);
                        }
                        else
                        {
                            console.log(tours);
                            let myMatrix = Array(users.length).fill().map(() => Array(tours.length).fill(0));
                            rows2.map(row => {
                                const userIndex = users.indexOf(row.user_id);
                                const tourIndex = tours.indexOf(parseInt(row.tour_id));
                                console.log("userIndex:"+userIndex + ",tourIndex:"+tourIndex);
                                myMatrix[userIndex][tourIndex] = row.rank;
                            })
                            console.log(JSON.stringify(myMatrix,null,3));
                            var bias = Recommender.calculateBias(myMatrix);

                            var model = Recommender.buildModelWithBias(myMatrix,bias,users, tours);
                            const myUser = rowLabels.indexOf(user);
                            //db.closeDB(connection);
                             const recommendations = model.recommendations(user);
                             let recTours = new Array();
                             // recommendations.map(row=>{
                             //     recTours.push(row.)
                             // })

                            const toursQuery = 'SELECT id,name,img,duration,distance FROM tour WHERE ID in ('+tours+
                                ')';
                            db.closeDB(connection);
                            res.send(recommendations);
                        }
                    })
                }

            });


        }
    })
    //connection.query('SELECT rv.user_id,tourRv.tour_id,rv.rating from tour_review tourRv inner join reviews rv ' +
        //'on tourRv.review_id = rv.id where user_id in (result) order by rv.user_id,tourRv.tour_id');

    // const result = JSON.parse('[' +
    //     '{user_id: "tomer",tour_id: "tour1", rating: 1},' +
    //     '{user_id: "tomer",tour_id: "tour2", rating: 2}', +
    //     '{user_id: "tomer",tour_id: "tour3", rating: 3}', +
    //     '{user_id: "gal",tour_id: "tour1", rating: 4}', +
    //     '{user_id: "gal",tour_id: "tour3", rating: 5}', +
    //     '{user_id: "gal",tour_id: "tour4", rating: 2}', +
    //     '{user_id: "barak",tour_id: "tour1", rating: 3}', +
    //     '{user_id: "barak",tour_id: "tour4", rating: 5}', +
    //     ']');

    var rowLabels = ['tomer','gal','barak'];
    var columnLabels = ['tour1','tour2','tour3','tour4'];
    const result = [
        '{"user_id": "tomer","tour_id": "tour1", "rating": 1}',
        '{"user_id": "tomer","tour_id": "tour2", "rating": 2}',
        '{"user_id": "tomer","tour_id": "tour3", "rating": 3}',
        '{"user_id": "gal","tour_id": "tour1", "rating": 4}',
        '{"user_id": "gal","tour_id": "tour3", "rating": 5}',
        '{"user_id": "gal","tour_id": "tour4", "rating": 2}',
        '{"user_id": "barak","tour_id": "tour1", "rating": 3}',
        '{"user_id": "barak","tour_id": "tour4", "rating": 5}',
    ].map(JSON.parse);

    //console.log(JSON.stringify(result,null ,3));
    let myMatrix = Array(3).fill().map(() => Array(4).fill(0));
    // console.log(JSON.stringify(myMatrix,null,3));
    result.map(row => {
        const userIndex = rowLabels.indexOf(row.user_id);
        const tourIndex = columnLabels.indexOf(row.tour_id);
        myMatrix[userIndex][tourIndex] = row.rating;
    })
    console.log(JSON.stringify(myMatrix,null,3));
    var inputMatrix = [ [ 2, 4, 6, 0 ],
        [2 , 4, 6, 4 ],
        [ 6, 0, 0, 10 ]
    ];


    var bias = Recommender.calculateBias(myMatrix);

    var model = Recommender.buildModelWithBias(myMatrix,bias,rowLabels, columnLabels);
    const myUser = rowLabels.indexOf('barak');
    //db.closeDB(connection);
    console.log( model.recommendations(rowLabels[myUser]));
};

exports.updateTourProfile=function (tour) {
    var connection = db.initDB();
    connection.query('SELECT count(*) as userNum from user_tour where tour_id = ? ',tour,
        function (err, rows, fields) {
        if(!err)
        {
           // console.log("number of records:"+rows[0].userNum);
        if(rows[0].userNum > 5)
        {
            connection.query('SELECT usrP.category_id,avg(usrP.rating) as rating from user_profile usrP where usrP.user_id in(' +
                'select usrT.email from user_tour usrT where usrT.tour_id = ?) group by usrP.category_id order by usrP.category_id',tour,
                function (err1, rows1, fields1) {
                    if (!err1) {
                       //delete old ratings
                        connection.query('DELETE FROM tour_profile where tour_id = ?',tour,function(err2,result2) {
                        if(err2)
                        {
                            console.log(err2);
                        }
                        else
                        {
                            let myMatrix = new Array();
                            rows1.map(row =>{
                                let profile = [parseInt(tour),row.category_id,row.rating];
                                myMatrix.push(profile);}
                            )

                            console.log(myMatrix);
                            connection.query('INSERT INTO tour_profile(tour_id,category_id,rating) VALUES ?',[myMatrix],function (insertError,insertResult) {
                                if(insertError)
                                {
                                    console.log(insertError);
                                }
                                else
                                {
                                    //console.log("effected rows:"+ insertResult.affectedRows);
                                    db.closeDB(connection);
                                }

                            });
                        }
                        })
                    }
                    else
                    {
                        console.log(err1);
                    }
                });
        }
        else
        {
            db.closeDB(connection);
        }
        }
        else
        {console.log(err)}}
        );

  //get all users that took this tour and get their taste profile
};

exports.updateUserProfile=function (user) {
    var connection = db.initDB();
    connection.query('SELECT count(*) as tourNum from user_tour where email = ? ',user,
        function (err, rows, fields) {
            if(!err)
            {
               // console.log("number of records " +rows[0].tourNum )
                if(rows[0].tourNum > 3)
                {
                    connection.query('SELECT tourP.category_id,avg(tourP.rating) as rating from tour_profile tourP where tourP.tour_id in(' +
                        'select usrT.tour_id from user_tour usrT where usrT.email = ?) group by tourP.category_id order by tourP.category_id',user,
                        function (err1, rows1, fields1) {
                            if (!err1) {
                                //delete old ratings
                                connection.query('DELETE FROM user_profile where user_id = ?',user,function(err2,result2) {
                                    if(err2)
                                    {
                                        console.log(err2);
                                    }
                                    else
                                    {
                                        let myMatrix = new Array();
                                        rows1.map(row =>{
                                            let profile = [user,row.category_id,row.rating];
                                            myMatrix.push(profile);}
                                            )

                                        console.log(myMatrix);
                                        //insert new ratings
                                        connection.query('INSERT INTO user_profile values ?',[myMatrix],function (insertError,insertResult) {
                                            if(insertError)
                                            {
                                                console.log(insertError);
                                            }
                                            else
                                            {

                                                db.closeDB(connection);
                                            }

                                        });
                                    }
                                })
                            }
                            else
                            {
                                console.log(err1);
                            }
                        });
                }
                else
                {
                    db.closeDB(connection);
                }
            }
            else
            {console.log(err)}}
    );


    //get all users that took this tour and get their taste profile
};

exports.contentBasedRecommend = function (user,country,res) {
    let connection = db.initDB();
    const sql = 'SELECT category_id,rating from user_profile where user_id = ?; SELECT t.id,tp.category_id,tp.rating ' +
        'from tour_profile tp ' +
        'inner join tour t on t.id = tp.tour_id' +
        ' where t.country = ?';
            connection.query(sql ,[user,country],function(err1,rows1){
                    if(err1)
                    {
                        console.log(err1);
                    }
                    else {
                        let userProfile = rows1[0];
                        let toursProfiles = rows1[1];
                        // connection.query('SELECT t.id,category_id,rating from tour_profile tp ' +
                        //     'inner join tour t on t.id = tp.tour_id' +
                        //     ' where t.country = ? ',country,function(err2,rows2) {
                        //         if (err2) {
                        //             console.log(err2);
                        //         }
                        //         else {
                        //             let toursProfiles = rows2;
                        //             console.log("TOURS profile " + toursProfiles );
                        // Sturcture of {tour,category,distance}
                        if((userProfile.length > 0)&&(toursProfiles.length >0)) {
                            const resultTours = _
                                .chain(toursProfiles)
                                .map(row =>
                                    mapTourToDistance(row, _.find(userProfile,profile => profile.category_id === row.category_id))
                                )
                                .value();
                            // Temp array of tour ids
                            const tourIds = _
                                .chain(resultTours)
                                .map(row => row.tour)
                                .uniq()
                                .value();

                            // Structure of {tour, distance(calculated)}
                            const toursWithDistance = _
                                .chain(tourIds)
                                .map(tourId => ({
                                    tour: tourId,
                                    distance: calcSquertDistance(resultTours.filter(row => row.tour === tourId))
                                }))
                                .value();
                            const sortedTours = _.sortBy(toursWithDistance,['distance']);
                            const tours = [];
                            _.forEach(sortedTours,row => {
                                tours.push(row.tour);
                            });

                            const toursQuery = 'SELECT id,name,img,duration,distance FROM tour WHERE ID in ('+tours+
                        ')';
                            connection.query(toursQuery,[],function (err,rows) {
                                if(err)
                                {
                                    console.log(err);
                                    throw err;
                                }
                                else
                                {
                                    const tourDetails = sortedTours.map(tour=> (
                                        {key:tour.tour,
                                            name:_.find(rows,row => row.id ===tour.tour).name,
                                        img:_.find(rows,row => row.id ===tour.tour).img,
                                        duration:_.find(rows,row => row.id ===tour.tour).duration,
                                        distance:_.find(rows,row => row.id ===tour.tour).distance,
                                    }));
                                    db.closeDB(connection);
                                    res.send(tourDetails);
                                }

                            });
                        }
                        else
                        {
                            db.closeDB(connection);
                            const returnVal = [];
                            return returnVal;
                        }
                    }
                            }
                        )
};

const mapTourToDistance = (row,userRating) => (
    {
    tour: row.id,
    category: row.category_id,
    distance: getSingleDistance(row.rating,userRating.rating),
});
function getSingleDistance(tourRating,userRating)
{
    return Math.pow(tourRating - userRating,2);
}

function calcSquertDistance(ratings) {
    let sum =0;
    _.forEach(ratings, row => {
        sum+=row.distance;
    });
    return Math.sqrt(sum);
}

function getTourDetails(tour,connection)
{
    const query = 'SELECT id,name,img,duration FROM tour WHERE ID = ?';
    connection.query(query,[tour.tour],function(err,rows)
    {
        if (err)
        {
            console.log('error');
            throw err;
        }
        else
        {
            JSON.stringify(rows);
            return ({name:rows[0].name,img:rows[0].img,duration:rows[0].duration,distance:2});
        }
    })
}
