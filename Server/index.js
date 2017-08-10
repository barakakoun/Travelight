/**
 * Created by dell on 31/03/2017.
 */
//import express from 'express'
const express = require ('express');
const app= express();
const bodyparser = require('body-parser');

app.use(bodyparser.json()); // support json encoded bodies
//app.use(bodyparser()); // support json encoded bodies
app.use(bodyparser.urlencoded({ extended: true })); // support encoded bodies

const router = express.Router();
const tours = require('./api/tour/index');
const users = require('./api/user/index');
const reviews = require('./api/review/index');
const recommendation = require('./api/reccomendation/index');

app.use('/tours',tours);
app.use('/users',users);
app.use('/reviews', reviews);
app.use('/recommendation',recommendation);

app.listen('3000');
console.log("listening on port 3000");
// app.close(function () {
//     db.closeDB(db.connection)
// })



