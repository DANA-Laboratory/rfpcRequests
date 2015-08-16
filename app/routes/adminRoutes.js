/**
 * Created by Reza Afzalan.
 */
'use strict';
var mypassport = require('../passport/mypassport');
var multer = require('multer');
var upload = multer({ dest : 'uploads/' });

module.exports = function (app, db) {
    app.post('/admin/import', mypassport.ensureAuthenticated, upload.single('Requests.sqlite'), function (req, res) {
        if (req.user.isOwner) {
            console.log('file uploaded', req.file);
            var fs = require('fs');
            var file = 'app/database/Requests.sqlite';
            req.logout();
            var sqlite3 = require('sqlite3').verbose();
            db.close(function () {
                fs.rename(file, 'app/database/Requests' + Date.now() + '.sqlite', function () {
                    fs.rename(req.file.path, 'app/database/Requests' + '.sqlite', function () {
                        db = new sqlite3.Database(file);
                    });
                });
            });
        }
        res.redirect('/');
    });
    
    app.get('/admin/backup', mypassport.ensureAuthenticated, function (req, res) {
        if (req.user.isOwner) {
            res.download('app/database/Requests.sqlite');
        } else {
            res.redirect('/');
        }
    });
    
    app.get('/admin/select/users', mypassport.ensureAuthenticated, function (req, res) {
        if (req.user.isOwner) {
            res.json(mypassport.userAccounts());
        } else {
            res.redirect('/');
        }
    });
    
    app.post('/admin/insert/user', mypassport.ensureAuthenticated, function (req, res) {
        if (req.user.isOwner) {
            var callback = function (err) {
                if (err) {
                    console.log('insert user error=', err);
                } else {
                    mypassport.readAccounts();
                }
                res.sendStatus(200);
            };
            db.run('INSERT INTO config (itemName,itemType) VALUES (?,2)', [JSON.stringify(req.body.account), req.body.id], callback);
        } else {
            res.redirect('/');
        }
    });

    app.post('/admin/update/user', mypassport.ensureAuthenticated, function (req, res) {
        if (req.user.isOwner) {
            var callback = function (err) {
                if (err) {
                    console.log('update user error=', err);
                } else {
                    mypassport.readAccounts();
                }
                res.sendStatus(200);
            };
            db.run('UPDATE config SET itemName=? WHERE (id=? AND itemType=2)', [JSON.stringify(req.body.account), req.body.id], callback);
        } else {
            res.redirect('/');
        }
    });

    app.post('/admin/delete/user', mypassport.ensureAuthenticated, function (req, res) {
        if (req.user.isOwner) {
            var callback = function (err) {
                if (err) {
                    console.log('delete user error=', err);
                } else {
                    mypassport.readAccounts();
                }
                res.sendStatus(200);
            };
            db.run('DELETE FROM config WHERE (id=? AND itemType=2)', [req.body.id], callback);
        } else {
            res.redirect('/');
        }
    });
};