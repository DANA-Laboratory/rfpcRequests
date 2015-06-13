/**
 * Created by Reza Afzalan.
 */
'use strict';
var mypassport = require('../passport/mypassport');
module.exports = function (app, passport) {
    app.get('/', function (req, res) {
        console.log(req.user);
        res.render('index', { user: req.user,  'pathToAssets' : '/bower_components', message: req.flash('error') });
    });

    app.get('/account', mypassport.ensureAuthenticated, function (req, res) {
        res.render('account', { user: req.user });
    });

    app.get('/login', function (req, res) {
        res.render('login', { user: req.user, message: req.flash('error') });
    });

    app.post('/login',
        passport.authenticate('local', { failureRedirect: '/', failureFlash: true }),
        function (req, res) {
            res.redirect('/');
        });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/site/:selectedTemplate', function (req, res) {
        res.render(req.params.selectedTemplate, { user: req.user, 'pathToAssets': '/bower_components'
        });
    });

    app.get('/qform', function (req, res) {
        res.render('qform');
    });

    app.post('/sql/:type/:table', function (req, res) {
        var query = '';
        var fname = '';
        var and = '';
        switch (req.params.type.toUpperCase()) {
        case 'UPDATE':
            query = req.params.type + ' ' + req.params.table + ' ';
            var where = ' WHERE ';
            var set = ' SET ';
            for (fname in req.body) {
                if (fname === 'id') {
                    where += fname + ' = ' + req.body[fname] + ' ';
                } else {
                    query += set + fname + ' = ' + req.body[fname] + ' ';
                    set = ' , ';
                }
            }
            query += where;
            break;
        case 'SELECT':
            query = req.params.type + ' * FROM ' + req.params.table + ' WHERE ';
            and = '';
            for (fname in req.body) {
                query += and + fname + '=' + req.body[fname];
                and = ' AND ';
            }
            break;
        case 'DELETE':
            query = req.params.type +  ' ' + req.params.table + ' WHERE ';
            and = '';
            for (fname in req.body) {
                query += and + fname + '=' + req.body[fname];
                and = ' AND ';
            }
            break;
        case 'INSERT':
            query = req.params.type + ' INTO ' + req.params.table + ' ';
            var names = '(';
            var values = ' VALUES (';
            var colon = '';
            for (fname in req.body) {
                names += colon + fname;
                values += colon + req.body[fname];
                colon = ',';
            }
            names += ')';
            values += ')';
            query += names + values;
            break;
        }
        query += '<br><a href="/qform">Try again.</a>';
        res.send(query);
    });
};
