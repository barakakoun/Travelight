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
var tours = require('./api/tour/index')

app.use('/tours',tours)
app.listen('3000')
// app.close(function () {
//     db.closeDB(db.connection)
// })



