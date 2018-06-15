const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const models = require('./models');

const setupAuth = (app) => {


    app.use(cookieParser());

    app.use(session({
        secret: 'secretCode',
        resave: true,
        saveUninitialized: true
    }));

    passport.use(new GitHubStrategy({
        clientID: "9c6f9733180638093a3e",
        clientSecret: "dd3676a334855c0b6db74e7550f38627d112c93c",
        callbackURL: "https://chilangosproj.herokuapp.com/github/auth"
    }, (accessToken, refreshToken, profile, done) => {
        models.User.findOrCreate({
            where: {
                githubid: profile.id,
                username: profile.username
            }
        })
            .then(result => {
                return done(null, result[0]);
            })
            .catch(err => { // .catch(done);
                done(err);
            })
    }))

    passport.use(new TwitterStrategy({
        consumerKey: "XHCwlBVJSbLrHgECPCsi7TXxg",
        consumerSecret: "M2muLmIZ3IPwzHlZPVk2o5eG1FXJGgsgPkyIrkE13tNNg9xXDG",
        callbackURL: "https://chilangosproj.herokuapp.com/twitter/auth/"
      },
      function(token, tokenSecret, profile, cb) {
        models.tUser.findOrCreate({ twitterId: profile.id }, function (err, user) {
          return cb(err, tUser);
        });
      }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        done(null, id);
    });

    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/login', passport.authenticate('github'));
    app.get('/login', passport.authenticate('twitter'));


    app.get('/logout', function(req, res, next){
        req.logout();
        res.redirect('/');
    });

    app.get('/github/auth',
        passport.authenticate('github', {
            failureRedirect: '/login'
        }),
        (req, res) => {
            res.redirect('/home');
        });

    app.get('/twitter/auth',
        passport.authenticate('twitter', {
            failureRedirect: '/login'
        }),
        (req, res) => {
            res.redirect('/home');
    });
};

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/home');
}
module.exports = setupAuth;
module.exports.ensureAuthenticated = ensureAuthenticated;
