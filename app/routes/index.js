/**
 * Created by Reza Afzalan.
 */
'use strict';
module.exports = function (app, passport, io) {
    require('./indexRoutes')(app);
    require('./passportRoutes')(app, passport);
    require('./databaseRoutes')(app, io);
};
