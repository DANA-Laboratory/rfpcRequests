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

var replaceIDwithNameFamily = function (rows) {
    for (var user in appConfig.users) {
        if (appConfig.users[user].id === rows.owner) {
            rows.owner = appConfig.users[user].name + ' ' + appConfig.users[user].family;
        } else {
            if (appConfig.users[user].id === rows.user) {
                rows.user = appConfig.users[user].name + ' ' + appConfig.users[user].family;
            }
        }
    }
};

module.exports = function (app) {

    app.get('/data/nsidebar', mypassport.ensureAuthenticated, function (req, res) {
        var ret = [];
        var callback = function (err, rows) {
            ret.push(rows.count);
            if (ret.length === 2 * appConfig.status.length) {
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
            for (var row in rows) {
                replaceIDwithNameFamily(rows[row]);
            }
            res.json(rows);
        };
        db.all('SELECT * from requests where user=' + req.user.id  + ' OR owner=' + req.user.id, callback);
    });
    
    app.get('/data/table/:status', mypassport.ensureAuthenticated, function (req, res) {
        var callback = function (err, rows) {
            for (var row in rows) {
                replaceIDwithNameFamily(rows[row]);
            }
            res.json(rows);
        };
        if (req.params.status > 3) {
            req.params.status -= 4;
        }
        db.all('SELECT * from requests where (user=? OR owner=?) AND status=?', [req.user.id, req.user.id, appConfig.status[req.params.status]], callback);
    });
    
    app.post('/data/updatetasks/:requestID', mypassport.ensureAuthenticated, function (req, res) {
        var callback = function (err) {
            console.log(err);
        };
        db.run('UPDATE requests SET requesttasks=? WHERE (owner=? AND id=?)', [JSON.stringify(req.body.tasks), req.user.id, req.params.requestID], callback);
        res.json();
    });
    
    app.post('/data/updatestatus/:requestID', mypassport.ensureAuthenticated, function (req, res) {
        var callback = function (err) {
            console.log('update status error=', err);
        };
        if (req.body.status === appConfig.status[1]) {
            db.run('UPDATE requests SET status=?, startdate=?, starttime=?, startuser=? WHERE id=?', [req.body.status, req.body.actiondate, req.body.actiontime, req.user.id, req.params.requestID], callback);
            res.json();
        }
        if (req.body.status === appConfig.status[2]) {
            db.run('UPDATE requests SET status=?, enddate=?, endtime=?, enduser=? WHERE id=?', [req.body.status, req.body.actiondate, req.body.actiontime, req.user.id, req.params.requestID], callback);
            res.json();
        }
        if (req.body.status === appConfig.status[3]) {
            db.run('UPDATE requests SET status=?, canceldate=?, canceltime=?, cancelwhy=?, canceluser=? WHERE id=?', [req.body.status, req.body.actiondate, req.body.actiontime, req.body.cancelwhy, req.user.id, req.params.requestID], callback);
            res.json();
        }
    });
    
    app.post('/data/insertrequest', mypassport.ensureAuthenticated, function (req, res) {
        var callback = function (err) {
            console.log(err);
        };
        db.run('INSERT INTO requests (requestitems,owner,user,status,initdate,inittime,description,applicant) VALUES (?,?,?,?,?,?,?,?)', [JSON.stringify(req.body.requestitems), req.body.owner, req.user.id, appConfig.status[0], req.body.initdate, req.body.inittime, req.body.description, req.body.applicant], callback);
        res.json();
    });
    
    app.post('/data/updaterequest', mypassport.ensureAuthenticated, function (req, res) {
        var callback = function (err) {
            console.log(err);
        };
        db.run('UPDATE requests SET requestitems=?, description=? WHERE (id=? AND user=?)', [JSON.stringify(req.body.requestitems), req.body.description, req.body.id, req.user.id], callback);
        res.json();
    });
    
    app.get('/data/:requestID', mypassport.ensureAuthenticated, function (req, res) {
        var callback = function (err, rows) {
            //console.log(rows.user,req.user.id);
            if (rows.user === req.user.id) {
                rows.isCreator = true;
            } else {
                rows.isCreator = false;
            }
            replaceIDwithNameFamily(rows);
            res.json(rows);
        };
        db.get('SELECT * from requests where id=' + req.params.requestID + '  AND (user=' + req.user.id  + ' OR owner=' + req.user.id + ')', callback);
    });
};
