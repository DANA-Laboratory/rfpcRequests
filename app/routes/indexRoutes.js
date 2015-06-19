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
    app.get('/angular', function (req, res) {
        console.log(req.user);
        res.render('angular', { user: req.user,  'pathToAssets' : '/bower_components', message: req.flash('error') });
    });
};
