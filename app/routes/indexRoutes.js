/**
 * Created by Reza Afzalan.
 */
'use strict';
module.exports = function (app) {
    app.get('/', function (req, res) {
        console.log(req.user);
        res.render('index', { user: req.user,  'pathToAssets' : '/bower_components', message: req.flash('error') });
    });
};
