/**
 * Created by Reza Afzalan.
 */
'use strict';

var appConfig = require('../config/appConfig.json');

var userNameIDs = [];

for (var user in appConfig.users) {
  userNameIDs.push([appConfig.users[user].id, appConfig.users[user].name + ' ' + appConfig.users[user].family]);
}

console.log(userNameIDs);

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', { user: req.user, tasks: JSON.stringify(appConfig.tasks),  'pathToAssets' : '/bower_components', message: req.flash('error') });
    });

    app.get('/itRequest', function (req, res) {
        res.render('itRequest/itRequest', { userNameIDs: userNameIDs, user: req.user, requestItems: appConfig.requestItems,  'pathToAssets' : '/bower_components', message: req.flash('error') });
    });
};
