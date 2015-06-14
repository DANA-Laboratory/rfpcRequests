/**
 * Created by Reza Afzalan.
 */
'use strict';
var mypassport = require('../passport/mypassport');
function fvalue(fname,value) {
    if (fname.charAt(0) === '_') {
      value='\''+value+'\'';
    }
    return value;
}
module.exports = function (app) {

    app.get('/qform', mypassport.ensureAuthenticated, function (req, res) {
        res.render('qform');
    });

    app.post('/sql/:type/:table', mypassport.ensureAuthenticated, function (req, res) {
        var query = '';
        var fname = '';
        var and = '';
        var owner =  '(SELECT id FROM SystemUsers WHERE Account=\''+req.user.username+'\')';
        switch (req.params.type.toUpperCase()) {
        case 'UPDATE':
            query = req.params.type + ' ' + req.params.table + ' ';
            var where = '';
            var set = ' SET ';
            for (fname in req.body) {
               if (fname === 'id') {
                    where += ' WHERE OWNER=' + owner + ' AND ' + fname + '=' + fvalue(fname,req.body[fname]) + ' ';
                } else {
                    query += set + fname + '=' +  fvalue(fname,req.body[fname]) + ' ';
                    set = ' , ';
                }
            }
            query += where;
            break;
        case 'SELECT':
            query = req.params.type + ' * FROM ' + req.params.table + ' WHERE OWNER=' + owner;
            and = ' AND ';
            for (fname in req.body) {
                query += and + fname + '=' +  fvalue(fname,req.body[fname]);
            }
            break;
        case 'DELETE':
            query = req.params.type +  ' ' + req.params.table + ' WHERE OWNER=' + owner;
            and = ' AND ';
            for (fname in req.body) {
                query += and + fname + '=' +  fvalue(fname,req.body[fname]);
            }
            break;
        case 'INSERT':
            query = req.params.type + ' INTO ' + req.params.table + ' ';
            var names = '(';
            var values = ' VALUES (';
            var colon = '';
            for (fname in req.body) {
                names += colon + fname;
                values += colon +  fvalue(fname,req.body[fname]);
                colon = ',';
            }
            names += ',OWNER)';
            values += ',' + owner + ')';
            query += names + values;
            break;
        }
        query += '<br><a href="/qform">Try again.</a>';
        res.send(query);
    });

};
