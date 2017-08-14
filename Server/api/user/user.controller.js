/**
 * Created by dell on 19/05/2017.
 */
var db = require('../database');
var userConsts = require('../../../consts/user');
var messages = require('../../../consts/messages');


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
                            res.send(JSON.stringify({message: messages.loginUserSucess}));
                        }
                    });
                    db.closeDB(connection);
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


}