'use strict';

var PORT_LISTENER = 3001;
console.log('I am listening to this port: http://localhost:%s', PORT_LISTENER);

var express = require('express'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    flash = require('connect-flash');

var appConfig = require('./config/appConfig.json');

var app = express();
// all environments
app.set('port', process.env.PORT || PORT_LISTENER);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({ keepExtensions: true, uploadDir: path.join(__dirname, appConfig.directories.publicDir) }));
app.use(express.methodOverride());
app.use(express.cookieParser('my v3ry s3cr3t C00k1e k3y d0nt y0u th1nk?'));
app.use(express.session({
    secret: 'my l1ttl3 s3cret s3ss10n k3y isnt it?',
    maxAge: 3600000
}));
app.use(flash());
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

//routes
require('./routes/index')(app, passport);

app.use(app.router);
app.use(express.static(path.join(__dirname, appConfig.directories.publicDir)));

app.use(function (req, res, next) {
    console.log('req.body: ' + JSON.stringify(req.body));
    next();
});

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}
// POST /login
// Use passport.authenticate() as route middleware to authenticate the
// request.  If authentication fails, the user will be redirected back to the
// login page.  Otherwise, the primary route function function will be called,
// which, in this example, will redirect the user to the home page.
// 
// curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


