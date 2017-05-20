/**
 * Created by dell on 19/05/2017.
 */
var db = require('../database');
var userConsts = require('../../../consts/user');
var messages = require('../../../consts/messages');

exports.loginUser = function (req,res) {
    var user = req.body;
    console.log(req.body.firstName);
    console.log(req.body.lastName);
    console.log(req.body.email);
    console.log(req.body.method);
    res.send(JSON.stringify({message: messages.loginUserSucess}));
}