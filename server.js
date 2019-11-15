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

// var db = require('./db'); //The folder when users are stored.
const users = require('./users');

const auth = require('./auth');
auth.initialize(
  passport,
    users.findByUsername,
  users.findById
  // db.users.findByUsername,
  // db.users.findById
);

const app = express();



app.set('view engine', 'ejs');

app.use(session({
  secret: "unsecureSecret",//we need to put this in an env var.
  saveUninitialized: false,
  resave: false,
  cookie: { maxAge: 864000 }
}));

app.use(passport.initialize());
app.use(passport.session());

// This serves static files from the specified directory


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));
app.get(['/', '/index.html'],
    auth.checkAuthenticated,
    (req, res) => {
  // res.sendFile(__dirname + '/app/index.html');
      r = {
        'user': req.user,
      };
      res.render('index.ejs', r);
});



app.get('/demo-index.html', (req, res) => {
  res.sendFile(__dirname + '/app/demo-index.html');
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});


app.get('/api/kier_secret', async (req, res) => {
      // console.log();
      // console.log(user);
      let isAuth = await req.isAuthenticated();
      console.log(isAuth);
      if(isAuth) {
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
        r = [{ 'data': 'UNATHORIZED'}];
        res.send(JSON.stringify(r));
      }

});


app.get('/drones', auth.checkAuthenticated, (req, res)=> {

  console.log(req.user.username);
  r = {
    'user': req.user
  };
    res.render('partials/drones.ejs', r);

});

app.get('/index_partial', auth.checkAuthenticated, (req, res)=> {

  console.log(req.user.username);
  r = {
    'user': req.user
  };
    res.render('partials/index.ejs', r);

});



app.get('/checklist', auth.checkAuthenticated, (req, res)=> {

  console.log(req.user.username);
  r = {
    'user': req.user
  };
  res.render('checklist.ejs', r);

});

app.get('/profile', auth.checkAuthenticated, (req, res)=> {

  console.log(req.user.username);
  r = {
    'user': req.user
  };
  res.render('profile.ejs', r);

});

app.post('/api/edit_profile', auth.checkAuthenticated, (req, res)=> {
  // console.log(req.user);
  // console.log(req.body);

  let u = req.user;
  if(req.body.base64photo != '') u.base64data = req.body.base64photo;
  if(typeof req.body.displayName != "undefined") u.displayName = req.body.displayName;
  if(typeof req.body.email != "undefined") u.email = req.body.email;

  let error = false;
  if(req.body.oldpassword != '' && req.body.newpassword != '') {
    // console.log(req.body.oldpassword);
    // console.log(req.body.newpassword);
    let err = users.changePassword(req.user.id, req.body.oldpassword, req.body.newpassword);
    if (err != true){
      error = err;
      console.log(err)
    }
  }

  if(error == false) {
    try {
      users.update(req.user.id, u);
    } catch (e) {
      console.error(e);
      error = e;
    }
  }




  r = {
    'user': req.user,
    'error': error
  };

  res.send(r);

});


app.get('/login',
  function(req, res){
    // res.sendFile(__dirname + '/app/kier_test.html');
    res.render('login.ejs')
});
app.get('/register',
  function(req, res){
    // res.sendFile(__dirname + '/app/kier_test.html');
    res.render('login.ejs', {register:true})
});

app.post('/api/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
  console.log(req.isAuthenticated);
  //https://github.com/jaredhanson/passport/issues/482#issuecomment-230594566
  //https://github.com/jaredhanson/passport/issues/482#issuecomment-306021047

    req.session.save(()=> {
      console.log(req.user.role);
      switch (req.user.role) {
        case "guest":
          res.redirect('/profile');
          return;
        case "user":
          res.redirect('/');
          return;
        case 'admin':
        case 'superadmin':
          res.redirect('/dashboard');
          return;
        default:
          res.redirect('/');
          return;
      }

    });
  });

app.post('/api/register',
    auth.checkNotAuthenticated,
    auth.register,
    (req, res)=>{
      res.redirect('/login')
    }
    );

app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/login');
});

app.get('/admin/add_drone/add_check_list',
    auth.checkAuthenticated,
    async (req, res) => {

  //uncoment later when imp job is done XD!
  // let isAuth = await req.isAuthenticated();
  // if(!isAuth) {
  //   r = [{ 'data': 'UNATHORIZED'}];
  //   res.send(JSON.stringify(r));
  // }
  r = {
    'user': req.user
  };
  res.render('add_checklist.ejs', r)
  //res.sendFile(__dirname + '/add_checklist.ejs');
});
app.post('/pre_checklist_admin', (req, res) => {
  console.log("hahhahhahhahahahhahahahhhah")
  let jsonFile = __dirname + '/server-data/pre_checklist_admin.json';
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

app.get('/api/getDrones', (req, res) => {

  let options = {
    root: __dirname + '/server-data/'
  };

  const fileName = 'drones.json';
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


app.post('/api/submit_flight', (req, res) => {
  let jsonFile = __dirname + '/server-data/flights.json';
  // let newEvent = req.body;
  // TODO: get list and save it to flights.json

  // console.log('Adding new event:', newEvent);
  // fs.readFile(jsonFile, (err, data) => {
  //   if (err) {
  //     res.sendStatus(500);
  //     return;
  //   }
  //   let events = JSON.parse(data);
  //   events.push(newEvent);
  //   let eventsJson = JSON.stringify(events, null, 2);
  //   fs.writeFile(jsonFile, eventsJson, err => {
  //     if (err) {
  //       res.sendStatus(500);
  //       return;
  //     }
  //     // You could also respond with the database json to save a round trip
  //     res.sendStatus(200);
  //   });
  // });
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



app.use(express.static(__dirname + '/app'));

const port = (process.env.PORT || 8080)
const server = app.listen(port , () => {

  const host = server.address().address;
  const port = server.address().port;

  console.log('App listening at http://%s:%s  XD', host, port);
});

app.get('/admin/users',async (req, res) => {

  res.sendFile(__dirname + '/app/admin-usersView.html');
});
