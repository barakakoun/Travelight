/**
 * Created by dell on 16/06/2017.
 */
var engine = require('./reccomendationEngine');

exports.test = function (req,res) {
    engine.ratingBasedReccomend();
    res.send("done");
};
exports.updateTourProfile = function(req,res){
    const tour = req.param('tourId');
    engine.updateTourProfile(tour);
    res.send(1);
};

exports.updateUserProfile = function (req,res) {
    const user = req.param('userId');
    engine.updateUserProfile(user);
    res.send(1);
}
exports.contentBasedRecommend = function (req,res) {
    const user = req.param('userId');
    const country = req.param('CountryId');
    let reccomendations = engine.contentBasedRecommend(user,country,res);
}

exports.ratingBasedRecommend = function (req,res) {
    const user = req.param('userId');
    const country = req.param('country');
    engine.ratingBasedRecommend(user,country,res);
}