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

const multer = require("multer");
var upload = multer({ dest: __dirname + '/app/images/upload' });

// var db = require('./db'); //The folder when users are stored.
const users = require('./users');
const drones = require('./drones');

const reque = require('request');

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

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/bootstrap-select/dist/js')); // redirect bootstrap JS

app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/css', express.static(__dirname + '/node_modules/bootstrap-select/dist/css')); // redirect CSS bootstrap

app.use('/css', express.static(__dirname + '/node_modules/purecss/build')); // redirect CSS bootstrap


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

app.get('/dashboard/drones', (req, res) => {
  res.render('dashboard/drone_managment.ejs');
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

<<<<<<< HEAD
app.get('/checklist/:droneid', auth.checkAuthenticated, (req, res)=> {
  let droneId = req.params.droneid;
  let jsonFile = __dirname + '/server-data/drones.json';
  let drone;
  fs.readFile(jsonFile, (err, data) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
    let drones = JSON.parse(data);

    let drone_filter = drones.drones.filter(function (item,index){
        return item.did==droneId;
    });
    drone = drone_filter[0];


    let checklist_id = drone.preflight_lid;

    console.log(req.user.username);
    r = {
      'user': req.user,
      'checklistid': checklist_id,
      'droneid': droneId
    };
    res.render('partials/checklist.ejs', r);

  });


});



=======
>>>>>>> bc4b1d019c8b37fef2961b814b6e868e9e1a0150
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

app.get('/api/get_weather', auth.checkAuthenticated, (req, res) => {
    const api_key = "7ade1c47b19d13b35e323b0d31f3b6b3";
    const url = "http://api.openweathermap.org/data/2.5/weather?q=Vancouver&units=metric"

    reque.get({
        url: url + "&APPID=" + api_key,
        json: true,
        headers: {'User-Agent': 'Mozilla 5.0'}
    }, (err, respon, data) => {
        if (err) {
            console.log("Error fetching weather:", err);
        }
        else if (respon.statusCode !== 200) {
            console.log("Error! HTTP Status:", respon.statusCode);
        }
        else {
            res.send(data);
        }
    })
});

app.get('/api/get_weather_geo', auth.checkAuthenticated, (req, res) => {
    const api_key = "7ade1c47b19d13b35e323b0d31f3b6b3";
    const url = "http://api.openweathermap.org/data/2.5/weather?units=metric"

    var w_lat = "&lat=" + req.query.lat;
    var w_lon = "&lon=" + req.query.lon;



    reque.get({
        url: url + w_lat + w_lon + "&APPID=" + api_key,
        json: true,
        headers: {'User-Agent': 'Mozilla 5.0'}
    }, (err, respon, data) => {
        if (err) {
            console.log("Error fetching weather:", err);
        }
        else if (respon.statusCode !== 200) {
            console.log("Error! HTTP Status:", respon.statusCode);
        }
        else {
            res.send(data);
        }
    })
});

app.post('/api/edit_profile', auth.apiAuthenticated, (req, res)=> {
  // console.log(req.user);
  // console.log(req.body);
  console.log("EditUser");
  console.log(req.user.username);

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

  // console.log(r);
  res.send(r);

});

app.get('/login', function(req, res){
    // res.sendFile(__dirname + '/app/kier_test.html');
    res.render('login.ejs')
});

app.get('/register', function(req, res){
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
  console.log("hahhahhahhahahahhahahahhhah");
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
//demo get not for icmd
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

//todo: cheack authenitcation
app.get('/api/get_drones', (req, res) => {

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

app.post('/api/delete_drone', auth.apiAuthenticated, (req, res) => {
    drones.del(req.body.did);
    r = drones.get_dronedb();
    r.deleted_did = req.body.did;
    res.send(JSON.stringify(r));
});

//takes in body paramated for the drone as input and will update them in the drone specified by body.did
//if did==-1 it will be added insted
// https://muffinman.io/uploading-files-using-fetch-multipart-form-data/
app.post('/api/edit_drone', auth.apiAuthenticated, upload.single('photo'), (req, res) => {

    // console.log(req.file.path);
    // console.log(req.file.encoding);
    // console.log(req.file.mimetype);



    let d;
    if(req.body.did == -1) {
        d = drones.add();
    } else {
        d = drones.get_drone_by_did(req.body.did);
    }

    if(req.file) {
        d.image = 'upload/' + req.file.filename;
        console.log('image set to: ' + d.image);
    } else {
        console.log("No Image");
    }

    // console.log(d);
    // console.log(req.body);

    if (typeof req.body.name != "undefined") d.name = req.body.name;
    if (typeof req.body.type != "undefined") d.type = req.body.type;
    //todo: if nessasary add a test to validate lids ... i dont think its nessasary since our code sets lids
    if (typeof req.body.pre_list != "undefined") d.preflight_lid = req.body.postflight_lid;
    if (typeof req.body.post_list != "undefined") d.postflight_lid = req.body.postflight_lid;
    console.log(req.body.disabled);
    // if(typeof req.body.disabled != "undefined") {
    //if the disabled flag is not sent to the server the drone will be not disabled
    if (req.body.disabled == 'on')
        d.disabled = true;
    else
        d.disabled = false;
    // }

    if(d.did == -1) {
        newd = drones.add(d)
    }
    drones.update(d);
    r = drones.get_dronedb();
    r.updated_drone = d;
    res.send(JSON.stringify(r));


});

app.get('/api/get_checklist', auth.apiAuthenticated, (req, res) => {

  let options = {
    root: __dirname + '/server-data/'
  };

  const fileName = 'checklist.json';
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

app.get('/api/getChecklist/:checklistid', (req, res)=>{
  // let jsonFile = __dirname + '/server-data/flights.json';
  let checklist_id = req.params.checklistid;
  console.log(checklist_id);
  let checklist;
  let clJsonFile = __dirname + '/server-data/draft_cheacklist.json';
  fs.readFile(clJsonFile, (err, data) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
    let checklists = JSON.parse(data);
    let checklist_filter = checklists.lists.filter(function (item,index){
        return item.lid==checklist_id;
    });
    checklist = checklist_filter[0];

    res.send(checklist);
  });
});

app.post('/api/submit_flight', (req, res) => {
  let jsonFile = __dirname + '/server-data/draft_flights.json';
  let formData = req.body;

  // let newEvent = req.body;
  // TODO: get list and save it to flights.json

  // console.log('Adding new event:', newEvent);
  fs.readFile(jsonFile, (err, data) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
    let flights = JSON.parse(data);
    let newFlight = {id: flights.next_id, start_time: new Date(), drone_id:formData.drone_id, user: formData.user, preflight_list: formData};
    flights.next_id += 1;
    flights.flights.push(newFlight);
    let flightsJson = JSON.stringify(flights, null, 2);
    fs.writeFile(jsonFile, flightsJson, err => {
      if (err) {
        res.sendStatus(500);
        return;
      }
      // You could also respond with the database json to save a round trip
      res.sendStatus(200);
    });
  });
});

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
