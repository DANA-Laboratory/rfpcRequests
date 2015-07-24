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

if (!exists) {
    console.log('database not exists!');
} else {
    sqlite3 = require('sqlite3').verbose();
    db = new sqlite3.Database(file);
    var setTasks = function (error, data) {
        appConfig.tasks = [];
        for (var item in data) {
            var taskitem = {};
            taskitem.name = data[item].itemName;
            appConfig.tasks.push(taskitem);
        }
    };
    var setRequestItems = function (error, data) {
        appConfig.requestItems = [];
        for (var item in data) {
            appConfig.requestItems.push(data[item].itemName);
        }
    };
    db.all('SELECT itemName FROM config WHERE itemType=0', setTasks);
    db.all('SELECT itemName FROM config WHERE itemType=1', setRequestItems);
}
module.exports = function (app, passport, io) {
    require('./passportRoutes')(app, passport);
    require('./databaseRoutes')(app, io, appConfig, db);
    require('./indexRoutes')(app, appConfig);
};