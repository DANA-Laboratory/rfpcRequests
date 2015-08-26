/**
 * Created by Reza Afzalan.
 */
'use strict';
var mypassport = require('../passport/mypassport');

module.exports = function (app, io, appConfig, db) {

    var replaceIDwithNameFamily = function (row) {
        var userAccounts = mypassport.userAccounts();
        for (var user in userAccounts) {
            if ([user].id === row.owner) {
                row.owner = userAccounts[user].name + ' ' + userAccounts[user].family;
            } else {
                if (userAccounts[user].id === row.user) {
                    row.user = userAccounts[user].name + ' ' + userAccounts[user].family;
                }
            }
        }
    };
        
    var formatdata = function (row) {
        //replaceIDwithNameFamily
        replaceIDwithNameFamily(row);
        row.init = row.initdate + ' ' + row.inittime;
        row.end = row.enddate + ' ' + row.endtime;
        row.start = row.startdate + ' ' + row.starttime;
        //remove formats from string
        if (row.requesttasks !== null) {
            row.requesttasks = row.requesttasks.replace(/[\"\[\]]/g, ' ');
        }
        if (row.requestitems !== null) {
            row.requestitems = row.requestitems.replace(/[\"\[\]]/g, ' ');
        }
    };

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
                formatdata(rows[row]);
            }
            res.json(rows);
        };
        db.all('SELECT * from requests where ((user=' + req.user.id  + ' OR owner=' + req.user.id + ') AND (status=? OR status=?))', ['ثبت شده', 'در دست اقدام'], callback);
    });
    
    app.get('/data/table/:status', mypassport.ensureAuthenticated, function (req, res) {
        var callback = function (err, rows) {
            for (var row in rows) {
                formatdata(rows[row]);
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
            console.log('update tasks error=', err);
            res.sendStatus(200);
        };
        db.run('UPDATE requests SET requesttasks=? WHERE (owner=? AND id=?)', [JSON.stringify(req.body.tasks), req.user.id, req.params.requestID], callback);
    });
    
    app.post('/data/updatestatus/:requestID', mypassport.ensureAuthenticated, function (req, res) {
        var callback = function (err) {
            console.log('update status error=', err);
            io.emit('update');
            res.sendStatus(200);
        };
        if (req.body.status === appConfig.status[1]) {
            db.run('UPDATE requests SET status=?, startdate=?, starttime=?, startuser=? WHERE id=?', [req.body.status, req.body.actiondate, req.body.actiontime, req.user.id, req.params.requestID], callback);
        }
        if (req.body.status === appConfig.status[2]) {
            db.run('UPDATE requests SET status=?, enddate=?, endtime=?, enduser=? WHERE id=?', [req.body.status, req.body.actiondate, req.body.actiontime, req.user.id, req.params.requestID], callback);
        }
        if (req.body.status === appConfig.status[3]) {
            db.run('UPDATE requests SET status=?, canceldate=?, canceltime=?, cancelwhy=?, canceluser=? WHERE id=?', [req.body.status, req.body.actiondate, req.body.actiontime, req.body.cancelwhy, req.user.id, req.params.requestID], callback);
        }
    });
    
    app.post('/data/insertrequest', mypassport.ensureAuthenticated, function (req, res) {
        var callback = function (err) {
            console.log('insert request error=', err);
            io.emit('update');
            res.sendStatus(200);
        };
        db.run('INSERT INTO requests (requestitems,owner,user,status,initdate,inittime,description,applicant) VALUES (?,?,?,?,?,?,?,?)', [JSON.stringify(req.body.requestitems), mypassport.ownerRowID(), req.user.id, appConfig.status[0], req.body.initdate, req.body.inittime, req.body.description, req.body.applicant], callback);
    });
    
    app.post('/data/updaterequest', mypassport.ensureAuthenticated, function (req, res) {
        var callback = function (err) {
            console.log('update request error=', err);
            res.sendStatus(200);
        };
        db.run('UPDATE requests SET requestitems=?, description=? WHERE (id=? AND user=?)', [JSON.stringify(req.body.requestitems), req.body.description, req.body.id, req.user.id], callback);
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
