/**
 * Created by Reza Afzalan.
 */
'use strict';
var mypassport = require('../passport/mypassport');
var fs = require('fs');
var file = 'app/database/Requests.sqlite';
var appConfig = require('../config/appConfig.json');
var exists = fs.existsSync(file);
var sqlite3 = null;
var db = null;
if (!exists) {
    console.log('database not exists!');
} else {
    sqlite3 = require('sqlite3').verbose();
    db = new sqlite3.Database(file);
}

module.exports = function (app) {

    app.get('/data/rightnav', mypassport.ensureAuthenticated, function (req, res) {

        var ret = [];
        var callback = function (err, rows) {
            ret.push(rows.count);
            if (ret.length === 2*appConfig.status.length) {
                res.json(ret);
            }
        };
        db.serialize(function () {
            for (var status in appConfig.status) {
                db.get('SELECT count(id) as count from requests where status=\'' + appConfig.status[status]  + '\' AND owner=' + req.user.id, callback);
                db.get('SELECT count(id) as count from requests where status=\'' + appConfig.status[status]  + '\' AND user=' + req.user.id, callback);
            }
        });
    });

    app.get('/data/table', mypassport.ensureAuthenticated, function (req, res) {
       var callback = function (err, rows) {
            res.json(rows);
        };
        db.all('SELECT * from requests where user=' + req.user.id  + ' OR owner=' + req.user.id, callback);
    });
};
