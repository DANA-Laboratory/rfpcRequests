/**
 * Created by Reza Afzalan.
 */
'use strict';

module.exports = function (app, passport) {
    
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

};
