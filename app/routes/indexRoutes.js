/**
 * Created by Reza Afzalan.
 */
'use strict';

var appConfig = require('../config/appConfig.json');

module.exports = function (app) {
    app.get('/', function (req, res) {
        console.log('get index');
        res.render('index', { user: req.user, tasks: JSON.stringify(appConfig.tasks),  'pathToAssets' : '/bower_components', message: req.flash('error') });
    });

    app.get('/itRequest', function (req, res) {
        console.log('get request');
        res.render('itRequest/itRequest', { user: req.user, requestItems: appConfig.requestItems,  'pathToAssets' : '/bower_components', message: req.flash('error') });
    });
};
