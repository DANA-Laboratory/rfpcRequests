/**
 * Created by Reza Afzalan.
 */
'use strict';

module.exports = function (app) {
    app.get('/', function (req, res) {
        console.log(req.user);
        res.render('index', { user: req.user,  'pathToAssets' : '/bower_components', message: req.flash('error') });
    });
    app.get('/itRequest/:requestID', function (req, res) {
        console.log(req.user);
        //find right request & user Level
        //TODO
        res.json({requestLevel:1, userLevel: 1});
    });
    app.get('/itRequest', function (req, res) {
        console.log(req.user);
        res.render('itRequest/itRequest', { user: req.user,  'pathToAssets' : '/bower_components', message: req.flash('error') });
    });
};
