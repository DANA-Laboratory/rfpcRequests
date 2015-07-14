/**
 * Created by Reza Afzalan.
 */
'use strict';

var fs = require('fs');
var file = 'app/database/Requests.sqlite';
var exists = fs.existsSync(file);
var sqlite3 = null;
var db = null;
var appConfig = require('../config/appConfig.json');
var flag_1 = false;
var flag_2 = false;

if (!exists) {
    console.log('database not exists!');
} else {
    sqlite3 = require('sqlite3').verbose();
    db = new sqlite3.Database(file);
    var setTasks = function (error, data) {
        appConfig.Tasks = [];
        for (var item in data) {
            appConfig.Tasks.push(data[item].itemName);
        }
        flag_1 = true;
    };
    var setRequestItems = function (error, data) {
        appConfig.requestItems = [];
        for (var item in data) {
            appConfig.requestItems.push(data[item].itemName);
        }
        flag_2 = true;
    };
    db.all('SELECT itemName FROM config WHERE itemType=0', setTasks);
    db.all('SELECT itemName FROM config WHERE itemType=1', setRequestItems);
}

module.exports = function (app, passport, io) {
    while (flag_1 || flag_2) {
    }
    require('./databaseRoutes')(app, io, appConfig, db);
    require('./indexRoutes')(app, appConfig);
    require('./passportRoutes')(app, passport);
};
