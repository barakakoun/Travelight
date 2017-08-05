/**
 * Created by dell on 31/03/2017.
 */
var mysql = require('mysql')
// Initialize the connection to the DB
exports.initDB = function(){
    var connection = mysql.createConnection({
        host: '193.106.55.39',
        user: 'project39',
        password: 'project@1833',
        database: 'travelight',
        multipleStatements: true
    });

//Connect to the DB
    connection.connect();
    return connection
    //export the db connection
    //exports.connection=connection;
}
//Should Close the connection, not sure about it
exports.closeDB = function(connection){
    connection.end()
}
