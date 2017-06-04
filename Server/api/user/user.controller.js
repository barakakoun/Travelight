/**
 * Created by dell on 19/05/2017.
 */
var db = require('../database');
var userConsts = require('../../../consts/user');
var messages = require('../../../consts/messages');


exports.loginUser = function (req,res) {
    var user = req.body;
    // console.log(req.body.firstName);
    // console.log(req.body.lastName);
    // console.log(req.body.email);
    // console.log(req.body.method);

    connection = db.initDB();
    //check if user exists
    var exist = true;
    connection.query("select count(email) as userCount from users where email =?",uesr.email,function (err, rows, fields) {
        if (!err) {

            if(rows[0].userCount == 0)
            {
                exist = false;
            }
        }
        else {
            res.send(messages.loginUserFailed);
            throw err;
        }});

    if(!exist)
    {
        connection.query("INSERT INTO USERS SET ?",user,function(err,result) {
            if(err) {
                throw err;
                res.send(messages.loginUserFailed);
            }
            else {
                res.send(JSON.stringify({message: messages.loginUserSucess}));
            }
        });
        db.closeDB(connection);
    }
    else
    {
        res.send(JSON.stringify({message: messages.loginUserSucess}));
        db.closeDB(connection);
    }
}