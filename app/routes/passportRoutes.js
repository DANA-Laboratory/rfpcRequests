/**
 * Created by Reza Afzalan.
 */
'use strict';

module.exports = function (app, passport, appConfig) {
    
    var mypassport = require('../passport/mypassport');
    
    app.get('/account', mypassport.ensureAuthenticated, function (req, res) {
        console.log(req.user);
        res.send(req.user);
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

    app.get('/itRequest', mypassport.ensureAuthenticated, function (req, res) {
        res.render('itRequest/itRequest', { userNameIDs: mypassport.users(), user: req.user, requestItems: appConfig.requestItems,  'pathToAssets' : '/bower_components', message: req.flash('error') });
    });

    app.get('/', function (req, res) {
        res.render('index', { user: req.user, tasks: JSON.stringify(appConfig.tasks),  'pathToAssets' : '/bower_components', message: req.flash('error') });
    });
    
};
