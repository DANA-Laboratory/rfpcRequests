/**
 * Created with JetBrains WebStorm.
 * User: Abdelkrim
 * Date: 2013/08/21
 * Time: 00:00
 * Copyright (c) 2013 ALT-F1, We believe in the projects we work on™
 */
/*
 * GET home page.
 */

'use strict';
var mypassport = require('../passport/mypassport');

module.exports = function (app, passport) {
    app.get('/', function (req, res) {
        console.log(req.user);
        res.render('index', { user: req.user,  'pathToAssets' : '/bootstrap-3.3.1', message: req.flash('error') });
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
        res.render(req.params.selectedTemplate, { user: req.user, 'pathToAssets': '/bootstrap-3.3.1'
        });
    });
};
