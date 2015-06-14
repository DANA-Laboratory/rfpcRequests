/**
 * Created by Reza Afzalan.
 */
'use strict';
var mypassport = require('../passport/mypassport');
module.exports = function (app, passport) {

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

};
