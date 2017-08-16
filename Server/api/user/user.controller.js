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


}