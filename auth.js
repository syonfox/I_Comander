
const Strategy = require('passport-local').Strategy;
// var db = require('./db'); //The folder when users are stored.
const fs = require('fs');
const bcrypt = require('bcrypt');
const users = require('./users');
const salt = 10;

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}
//authenticated
function apiAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.sendStatus(401)
}

let roleRank = {'superadmin':0, 'admin':1, 'tech':3, 'user':4, 'guest':5};
function checkAuthenticatedRole(role) {
    return function (req,res,next) {

        if (req.isAuthenticated()) {

           if(roleRank[req.user.role] <= roleRank[role]){
               return next();
           } else {

               res.render('accessDenied.ejs', r);
               return;
           }
        }
        res.redirect('/login')
    }
}

function apiAuthenticatedRole(role) {
    return function (req,res,next) {

        if (req.isAuthenticated()) {

           if(roleRank[req.user.role] <= roleRank[role]){
               return next();
           }
            console.log("WARNING USER IS AUTHENTICATED BUT NOT AUTHORIZED FOR THIS" + role);
            console.log(req.route);
        }

        res.sendStatus(401);
    }
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}


function register(req, res, next) {

    try {
        let newUser = users.addUser(req);
        req.icmd = {user:newUser};


    } catch (e) {
        console.log(e);
        if(e = "Username Already Exists") {
            res.render('login.ejs', {register:true, invalidUsername:true});
            return;
        }
        res.sendStatus(500);
        return;
    }
    next();
}





// function register(req, res, next) {
//
//     findByUsername(req.body.username, (err, user)=>{
//         if(err) {
//             res.sendStatus(500)
//             return
//         }
//         if(user) {
//
//         }
//
//         let hashedPassword = bcrypt.hash(req.body.password, 10);
//
//         let jsonFile = __dirname + '/server-data/users.json';
//         fs.readFile(jsonFile,  async (err, data) => {
//             if (err) {
//               res.sendStatus(500);
//               return;
//             }
//             let userdb = JSON.parse(data);
//
//             hashedPassword.then((hpw)=>{
//                 console.log(hpw);
//                 let newUser = {
//                     id: userdb.nextId++, //get next and increments
//                     username: req.body.username,
//                     displayName: req.body.username,
//                     email: req.body.email,
//                     role: 'guest',
//                     password: hpw
//                 };
//                 console.log('Adding new User:', newUser);
//                 userdb.users.push(newUser);
//                 let usersJson = JSON.stringify(userdb, null, 2);
//                 fs.writeFile(jsonFile, usersJson, err => {
//                     if (err) {
//                         res.sendStatus(500);
//                         return;
//                     }
//                 });
//                 req.icmd = {user:newUser};
//                 next();
//             }).catch((e)=>{console.log(e)});
//         });
//     });
//
// }

// function getUserdb() {
//     let jsonFile = __dirname + '/server-data/users.json';
//     fs.readFile(jsonFile, (err, data) => {
//         // console.log(data)
//         if (err) {
//             cb(err, null);
//             return;
//         }
//         return JSON.parse(data);
//     });
// }
// function findByUsername(username, cb) {
//
//     let jsonFile = __dirname + '/server-data/users.json';
//     // console.log(jsonFile);
//     fs.readFile(jsonFile, (err, data) => {
//         // console.log(data)
//         if (err) {
//             cb(err, null);
//             return;
//         }
//         let userdb = JSON.parse(data);
//         r = userdb.users.find(user => user.username == username);
//         console.log(r);
//         if (r == undefined) r = null;
//         cb(null, r);
//     });
// }
//
// function findById(id, cb){
//
//     let jsonFile = __dirname + '/server-data/users.json';
//     // console.log(jsonFile);
//     fs.readFile(jsonFile, (err, data) => {
//         // console.log(data)
//         if (err) {
//             cb(err, null);
//             return;
//         }
//         let userdb = JSON.parse(data);
//         r = userdb.users.find(user => user.id == id);
//         // console.log(r);
//         if (r == undefined) r = null;
//         cb(null, r);
//     });
// };


function initialize(passport, _findByUsername, _findById) {

    if(typeof _findByUsername != 'undefined') {
        // findByUsername = db.users.findByUsername;
        findByUsername = _findByUsername;
    }
    if(typeof _findById != 'undefined') {
            // findById = db.users.findById;
        findById = _findById;
    }

    passport.use(new Strategy(
        function (username, password, cb) {
            findByUsername(username, function (err, user) {
                if (err) {//server error
                    return cb(err);
                }
                if (!user) {//no user with that username
                    return cb(null, false);
                }

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

/* Midlewhere*/
//registers a user and then sets req.local.user = New User
module.exports.register = register;

//cheacks if a user is authenticated if not it redirects to login page (also sets req.user)
module.exports.checkAuthenticated = checkAuthenticated;
//cheacks if a user is authenticated if not it redirects to login page (also sets req.user)
module.exports.apiAuthenticated = apiAuthenticated;
module.exports.apiAuthenticatedRole = apiAuthenticatedRole;
module.exports.checkAuthenticatedRole = checkAuthenticatedRole;

//cheacks if usere is not authenticated if it is redirets to home page
module.exports.checkNotAuthenticated = checkNotAuthenticated;