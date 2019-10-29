/*
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const session = require('express-session'); //used to save the session so that the user stays loged in
var passport = require('passport'); //authentication lib
var Strategy = require('passport-local').Strategy;
var db = require('./db'); //The folder when users are stored.

passport.use(new Strategy(
    function(username, password, cb) {
      db.users.findByUsername(username, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if (user.password != password) { return cb(null, false); }
        return cb(null, user);
      });
    }));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});


const app = express();

app.use(session({
  secret: "unsecureSecret",//we need to put this in an env var.
  saveUninitialized: false,
  resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

// This serves static files from the specified directory
app.use(express.static(__dirname + '/app'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get(['/', '/index.html'], (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


app.get('/api/kier_secret', (req, res) => {
      console.log(req.isAuthenticated());
      // console.log(user);
      if(req.isAuthenticated()) {
      let options = {
        root: __dirname + '/server-data/'
      };

      const fileName = 'kier_secret.json';
      res.sendFile(fileName, options, (err) => {
        if (err) {
          res.sendStatus(500);
          return;
        }
      });
      } else {
        r = [{ 'data': 'UNATHORIZED'}]
        res.send(JSON.stringify(r));
      }

});

app.get('/login',
  function(req, res){
    res.sendFile(__dirname + '/app/kier_test.html');
});
app.post('/login',
  passport.authenticate('local', { failureRedirect: '/kier_test.html' }),
  function(req, res) {
  //https://github.com/jaredhanson/passport/issues/482#issuecomment-230594566
  //https://github.com/jaredhanson/passport/issues/482#issuecomment-306021047
    req.session.save(()=> {
      res.redirect('/kier_secret.html');
    });
  });

app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/kier_test.html');
});

// // Endpoint to serve the configuration file // for Auth0
// app.get("/auth_config.json", (req, res) => {
//   res.sendFile(join(__dirname, "auth_config.json"));
// });

app.get('/api/getAll', (req, res) => {

  let options = {
    root: __dirname + '/server-data/'
  };

  const fileName = 'events.json';
  res.sendFile(fileName, options, (err) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
  });
});

app.post('/api/add', (req, res) => {
  let jsonFile = __dirname + '/server-data/events.json';
  let newEvent = req.body;
  console.log('Adding new event:', newEvent);
  fs.readFile(jsonFile, (err, data) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
    let events = JSON.parse(data);
    events.push(newEvent);
    let eventsJson = JSON.stringify(events, null, 2);
    fs.writeFile(jsonFile, eventsJson, err => {
      if (err) {
        res.sendStatus(500);
        return;
      }
      // You could also respond with the database json to save a round trip
      res.sendStatus(200);
    });
  });
});

//
app.post('/api/delete', (req, res) => {
  let jsonFile = __dirname + '/server-data/events.json';
  let id = req.body.id;
  fs.readFile(jsonFile, (err, data) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
    let events = JSON.parse(data);
    let index = events.findIndex(event => event.id == id);
    events.splice(index, 1);

    let eventsJson = JSON.stringify(events, null, 2);

    fs.writeFile(jsonFile, eventsJson, err => {
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});


const port = (process.env.PORT || 8080)
const server = app.listen(port , () => {

  const host = server.address().address;
  const port = server.address().port;

  console.log('App listening at http://%s:%s  XD', host, port);
});

