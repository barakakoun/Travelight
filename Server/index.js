/**
 * Created by dell on 31/03/2017.
 */
//import express from 'express'
var express = require ('express')
var app= express()
var bodyparser = require('body-parser');
app.use(bodyparser.json()); // support json encoded bodies
//app.use(bodyparser()); // support json encoded bodies
app.use(bodyparser.urlencoded({ extended: true })); // support encoded bodies
var router = express.Router()
var tours = require('./api/tour/index');
var users = require('./api/user/index');
var reccomendation = require('./api/reccomendation/index');
app.use('/tours',tours);
app.use('/users',users);
app.use('/reccomendation',reccomendation);
app.listen('3000');
console.log("listening on port 3000");
// app.close(function () {
//     db.closeDB(db.connection)
// })



