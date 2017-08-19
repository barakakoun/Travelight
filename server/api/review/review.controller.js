/**
 * Created by galna21 on 03/08/2017.
 */

const db = require('../database');
//create connection to mysql

exports.getTourReviews = function (req,res) {
    const tourId = req.param('tourId');
    connection = db.initDB();

    connection.query('SELECT u.first_name,u.last_name,u.img,r.rank,r.review_text from reviews r inner join' +
        ' users u on u.email = r.user_id where tour_id = ?', tourId, function (err, rows, fields) {
        if (err) {
            console.log('error');
            throw err;
        } else {
            const reviews = rows.map(row => ( {
                rank: row.rank,
                reviewText: row.review_text,
                firstName: row.first_name,
                lastName: row.last_name,
                userImg: row.img,
            }));
            console.log(reviews);
            res.send(reviews);
        }
    });
    db.closeDB(connection);
};

exports.addReviewToTour = function ({body:{userId, rank, reviewText, tourId}},res) {
    const query = 'INSERT INTO reviews SET RANK = ' + rank +', REVIEW_TEXT = \'' +reviewText.toString() + '\', USER_ID = \'' +
        userId.toString() + '\', TOUR_ID = ' + tourId;
    connection = db.initDB();
    connection.query(query, function (err, result) {
            if (err) {
                console.log(err);
                db.closeDB(connection);
                res.send({status: '300', error: err});
                //throw err;
            } else {
                db.closeDB(connection);
                res.send({status: '200'})
            }

        });

};
//     const reviews = [
//         {
//             rank: 1,
//             reviewText: 'בר שבגלל המיקום האקסקלוסיבי שלו במתחם החדש מרשה לעצמו לדפוק מחירים גבוהים מאוד על כל שטות, אין חצי ליטר בירה רק קנקנים לא מדודים במחיר שהוא לא משתלם במיוחד. שירות בינוני ומטה על אף שכולם מסתובבים עם אוזניות כדי לשדר יוקרה מדומה. הייתי בגלל יומולדת (כמעט כמו כולם שם) ולא אשוב',
//             firstName: 'Gal',
//             lastName: 'Navon',
//             userImg: 'https://fb-s-c-a.akamaihd.net/h-ak-fbx/v/t1.0-1/p240x240/13413639_10209577413778019_6885539031227596632_n.jpg?oh=9dc2ee923f67e9ce8473c3f3030dea1b&oe=59FAF669&__gda__=1509710365_8227cabc148f9ac445b55e1cf1d7a5e4'
//         },
//         {
//             rank: 5,
//             reviewText: 'המקום הכי כיפי בתא נמצא בחולון!!! אווירה אש! מוזיקה אש! אוכל מעולה! סעידה בפארק מומלץ!',
//             firstName: 'Linoy',
//             lastName: 'Panker',
//             userImg: 'https://scontent-frx5-1.xx.fbcdn.net/v/t1.0-1/p240x240/19399133_10213777943067758_8989438153049957659_n.jpg?oh=820c0eebed8df422456fc86f60cd1dda&oe=5A32A102'
//         },
//         {
//             rank: 5,
//             reviewText: 'Very nice place great experience and atmosphere love to come back and see again ',
//             firstName: 'Barak',
//             lastName: 'Kakoun',
//             userImg: 'https://scontent-frx5-1.xx.fbcdn.net/v/t1.0-1/p240x240/10378962_10208275307986185_4571518277487617801_n.jpg?oh=907bfb5587f28d28899071d529766939&oe=5A36B6AC'
//         },
//         {
//             rank: 3,
//             reviewText: 'it was fun',
//             firstName: 'Tomer',
//             lastName: 'Laniado',
//             userImg: 'https://scontent-frx5-1.xx.fbcdn.net/v/t1.0-1/p240x240/10468534_10203642736004852_1372010264454616997_n.jpg?oh=dafcd1e1c091200c13b211e8c2bf234c&oe=5A2AE3F2'
//         },
//         {
//             rank: 4,
//             reviewText: 'i saw oren hazan',
//             firstName: 'Ravit',
//             lastName: 'Siman-Tov',
//             userImg: 'https://scontent-frx5-1.xx.fbcdn.net/v/t1.0-1/c51.51.642.642/s240x240/541128_352478311520904_994106610_n.jpg?oh=a38706b8b39c6f0c911e18dcf6d8b5d1&oe=5A2A4F0B'
//         },
//         {
//             rank: 2,
//             reviewText: 'Hello',
//             firstName: 'Yuval',
//             lastName: 'Amir',
//             userImg: 'https://scontent-frx5-1.xx.fbcdn.net/v/t1.0-1/p240x240/12115579_10203421498137975_8720969998490274601_n.jpg?oh=d9aba817fcb79f0f1f842604fbd37113&oe=59FCB69B'
//         },
//         {
//             rank: 1,
//             reviewText: 'shit',
//             firstName: 'Gal',
//             lastName: 'Gadot',
//             userImg: 'https://scontent-frx5-1.xx.fbcdn.net/v/t1.0-1/p320x320/19510151_1941201389454316_1687338582841272545_n.png?oh=288128c52beefba566a0f800a83ef3a5&oe=59FE317D'
//         },
//         {
//             rank: 2,
//             reviewText: 'The tour is not so good',
//             firstName: 'Dan',
//             lastName: 'Mano',
//             userImg: 'https://scontent-frx5-1.xx.fbcdn.net/v/t1.0-1/p240x240/10996150_10152756303392426_901130926570529896_n.jpg?oh=cbc305ebec66dd10456e9a19765162d5&oe=5A328C54'
//         },
//     ];
//
//     res.send(reviews);
// };
