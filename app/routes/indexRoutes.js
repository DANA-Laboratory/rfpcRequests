/**
 * Created by Reza Afzalan.
 */
'use strict';

module.exports = function (app) {
    app.get('/', function (req, res) {
        console.log(req.user);
        res.render('index', { user: req.user,  'pathToAssets' : '/bower_components', message: req.flash('error') });
    });
    app.get('/it', function (req, res) {
        console.log(req.user);
        res.render('itRequest/itRequests', { user: req.user,  'pathToAssets' : '/bower_components', message: req.flash('error') });
    });
    app.get('/itRequest/:rl/:ul', function (req, res) {
        console.log(req.user);
        res.render('itRequest/itRequest', { user: req.user, requestLevel: req.params.rl, userLevel: req.params.ul,  'pathToAssets' : '/bower_components', message: req.flash('error') });
    });
};
