
const Strategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const salt = 10;

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}





function initialize(passport, findByUsername, findById) {


    passport.use(new Strategy(
        function (username, password, cb) {
            findByUsername(username, function (err, user) {
                if (err) {//server error
                    return cb(err);
                }
                if (!user) {//no user with that username
                    return cb(null, false);
                }
                // bcrypt.hash(password, 10,function(h){
                //     console.log(h);
                //     console.log(user.password);
                // });
                bcrypt.compare(password, user.password,function(err, same) {
                    if (err) {//server error
                        return cb(err);
                    }
                    if(!same){ //wrong password
                        console.log('Wrong pass');
                        return cb(null, false);
                    }
                    console.log("Correct pass");
                    return cb(null, user);
                });
                // if (user.password != password) {//
                //     return cb(null, false);
                // }
                // return cb(null, user);
            });
        }));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
    passport.serializeUser(function (user, cb) {
        cb(null, user.id);
    });

    passport.deserializeUser(function (id, cb) {
        findById(id, function (err, user) {
            if (err) {
                return cb(err);
            }
            cb(null, user);
        });
    });
}

module.exports.initialize = initialize;
module.exports.checkAuthenticated = checkAuthenticated;
module.exports.checkNotAuthenticated = checkNotAuthenticated;