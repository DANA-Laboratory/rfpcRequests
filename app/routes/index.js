/**
 * Created by Reza Afzalan.
 */
'use strict';
module.exports = function (app, passport) {
    require('./indexRoutes')(app);
    require('./passportRoutes')(app, passport);
    require('./databaseRoutes')(app);
};
