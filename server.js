/*

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
const app = express();
var http = require('http');
const server = http.createServer(app);
// const io = require('socket.io')(http, { origins: '*:*'});

const io = require("socket.io")(server);

const bodyParser = require('body-parser');
const fs = require('fs');
const session = require('express-session'); //used to save the session so that the user stays loged in
var passport = require('passport'); //authentication lib

const multer = require("multer");
var upload = multer({dest: __dirname + '/app/images/upload'});

// var db = require('./db'); //The folder when users are stored.

const reque = require('request');
const checklist = require('./checklist');


const users = require('./users');

const auth = require('./auth');
auth.initialize(
    passport,
    users.findByUsername,
    users.findById
    // db.users.findByUsername,
    // db.users.findById
);

const drones = require('./drones');
const tickets = require('./tickets');


// tickets.initialize(app,auth, io);
// const app = express();


app.set('view engine', 'ejs');
app.use('/js', express.static(__dirname + '/node_modules/flipclock/dist')); // redirect flipclock JS

app.use('/js', express.static(__dirname + '/node_modules/socket.io-client/dist')); // redirect bootstrap JS

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/bootstrap-select/dist/js')); // redirect bootstrap JS

app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/popper.js/dist')); // redirect JS jQuery

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/css', express.static(__dirname + '/node_modules/bootstrap-select/dist/css')); // redirect CSS bootstrap

app.use('/css', express.static(__dirname + '/node_modules/purecss/build')); // redirect CSS bootstrap


app.use(session({
    secret: "unsecureSecret",//we need to put this in an env var.
    saveUninitialized: false,
    resave: false,
    cookie: {maxAge: 864000}
}));

app.use(passport.initialize());
app.use(passport.session());

// This serves static files from the specified directory


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));
app.get(['/', '/index.html'],
    auth.checkAuthenticatedRole('user'),
    (req, res) => {
        // res.sendFile(__dirname + '/app/index.html');
        r = {
            'user': req.user,
        };
        res.render('index.ejs', r);
    });


//this has to be called after app is fully initalized otherwise bodyparser wont work for auth
users.addRoutes(app,auth);
tickets.addRoutes(app,auth, io, drones);
drones.addRoutes(app,auth, upload);



app.get('/demo-index.html', (req, res) => {
    res.sendFile(__dirname + '/app/demo-index.html');
});

app.get('/dashboard',auth.checkAuthenticatedRole('admin'), (req, res) => {
    r = {
        'user': req.user,
    };
    res.render('dashboard', r);
});

app.get('/dashboard/drones', auth.checkAuthenticatedRole('admin'), (req, res) => {
    r = {
        'user': req.user,
    };
    res.render('dashboard/drone_managment.ejs', r);
});
app.get('/dashboard/tickets', auth.checkAuthenticatedRole('tech'), (req, res) => {
    r = {
        'user': req.user,
    };
    res.render('dashboard/ticket_managment.ejs', r );
});

app.get('/api/kier_secret', async (req, res) => {
    // console.log();
    // console.log(user);
    let isAuth = await req.isAuthenticated();
    console.log(isAuth);
    if (isAuth) {
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
        r = [{'data': 'UNATHORIZED'}];
        res.send(JSON.stringify(r));
    }

});


app.get('/drones', auth.checkAuthenticatedRole('user'), (req, res) => {

    console.log(req.user.username);
    r = {
        'user': req.user
    };
    res.render('partials/drones.ejs', r);

});

app.get('/index_partial', auth.checkAuthenticatedRole('user'), (req, res) => {

    console.log(req.user.username);
    r = {
        'user': req.user
    };
    res.render('partials/index.ejs', r);

});

app.get('/checklist/:droneid', auth.checkAuthenticatedRole('user'), (req, res) => {
    let droneId = req.params.droneid;
    let jsonFile = __dirname + '/server-data/drones.json';
    let drone;
    fs.readFile(jsonFile, (err, data) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        let drones = JSON.parse(data);

        let drone_filter = drones.drones.filter(function (item, index) {
            return item.did == droneId;
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

app.get('/checklist', auth.checkAuthenticatedRole('user'), (req, res) => {

    console.log(req.user.username);
    r = {
        'user': req.user
    };
    res.render('checklist.ejs', r);

});

app.get('/profile', auth.checkAuthenticated, (req, res) => {

    console.log(req.user.username);
    r = {
        'user': req.user
    };
    res.render('profile.ejs', r);

});
app.get('/postchecklist', auth.checkAuthenticatedRole('user'), (req, res) => {

    console.log(req.user.username);
    r = {
        'user': req.user
    };
    res.render('postchecklist.ejs', r);

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
        } else if (respon.statusCode !== 200) {
            console.log("Error! HTTP Status:", respon.statusCode);
        } else {
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
        } else if (respon.statusCode !== 200) {
            console.log("Error! HTTP Status:", respon.statusCode);
        } else {
            res.send(data);
        }
    })
});

app.get('/api/get_recent_flights', auth.apiAuthenticatedRole('user'), (req, res) => {
    let options = {
        root: __dirname + '/server-data/'
    };

    const fileName = 'flights.json';
    res.sendFile(fileName, options, (err) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
    });
});

app.post('/api/edit_profile', auth.apiAuthenticated, (req, res) => {
    // console.log(req.user);
    // console.log(req.body);

    console.log("EditUser");
    console.log(req.user.username);

    let u = req.user;
    if (req.body.base64photo != '') u.base64data = req.body.base64photo;
    if (typeof req.body.displayName != "undefined") u.displayName = req.body.displayName;
    if (typeof req.body.email != "undefined") u.email = req.body.email;

    let error = false;
    if (req.body.oldpassword != '' && req.body.newpassword != '') {
        // console.log(req.body.oldpassword);
        // console.log(req.body.newpassword);
        let err = users.changePassword(req.user.id, req.body.oldpassword, req.body.newpassword);
        if (err != true) {
            error = err;
            console.log(err)
        }
    }

    if (error == false) {
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

app.get('/login', function (req, res) {
    // res.sendFile(__dirname + '/app/kier_test.html');
    res.render('login.ejs')
});

app.get('/register', function (req, res) {
    // res.sendFile(__dirname + '/app/kier_test.html');
    res.render('login.ejs', {register: true})
});

app.post('/api/login',
    passport.authenticate('local', {failureRedirect: '/login'}),
    function (req, res) {
        console.log(req.isAuthenticated);
        //https://github.com/jaredhanson/passport/issues/482#issuecomment-230594566
        //https://github.com/jaredhanson/passport/issues/482#issuecomment-306021047

        req.session.save(() => {
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
    (req, res) => {
        res.redirect('/login')
    }
);

app.get('/logout',
    function (req, res) {
        req.logout();
        res.redirect('/login');
    });


app.get('/dashboard/checklist',
    auth.checkAuthenticatedRole('admin'),
    async (req, res) => {
        r = {
            'user': req.user
        };
        res.render('new_checklist.ejs', r)
});


app.post('/api/add_new_checklist_checklist_tab', auth.apiAuthenticatedRole('admin'), (req, res) => {
    const path = __dirname + '/server-data/checklist.json';
    let checklistdb = {};
    fs.readFile(path, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        checklistdb = JSON.parse(data);
        ++checklistdb.next_lid
        checklistdb.lists.push(req.body);

        let checklistJson = JSON.stringify(checklistdb, null, 2);
        fs.writeFile(path, checklistJson, err => {
            if (err) {
                console.error(err);
                // return false;
            } else {
                console.log("Saved checklistDB to file");
                res.send(checklistJson);
            }
        });
    });
});
app.post('/api/add_new_sublist_checklist_tab', auth.apiAuthenticatedRole('admin'), (req, res) => {
    const path = __dirname + '/server-data/checklist.json';
    let sublistdb = {};
    fs.readFile(path, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        sublistdb = JSON.parse(data);
        ++sublistdb.next_sid
        sublistdb.sublists.push(req.body);

        let checklistJson = JSON.stringify(sublistdb, null, 2);
        fs.writeFile(path, checklistJson, err => {
            if (err) {
                console.error(err);
                // return false;
            } else {
                console.log("Saved sublistdb to file");
                res.send(checklistJson);
            }
        });
    });
});

app.post('/api/remove_checklist_checklist_tab', auth.apiAuthenticated, (req, res) => {
    const path = __dirname + '/server-data/checklist.json';
    let checklistdb = {};
    fs.readFile(path, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        checklistdb = JSON.parse(data);
        lid = req.body.lid
        checklistdb.lists = checklistdb.lists.filter(d=> d.lid != lid);
        let checklistJson = JSON.stringify(checklistdb, null, 2);
        fs.writeFile(path, checklistJson, err => {
            if (err) {
                console.error(err);
                // return false;
            } else {
                console.log("Removed checklistdb from db");
                res.send(checklistJson);
            }
        });
    });
});

app.post('/api/remove_sublist_sublist_tab', auth.apiAuthenticated, (req, res) => {
    const path = __dirname + '/server-data/checklist.json';
    let sublistdb = {};
    fs.readFile(path, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        sublistdb = JSON.parse(data);
        sid = req.body.sid
        sublistdb.sublists = sublistdb.sublists.filter(d=> d.sid != sid);
        let sublistJson = JSON.stringify(sublistdb, null, 2);
        fs.writeFile(path, sublistJson, err => {
            if (err) {
                console.error(err);
                // return false;
            } else {
                console.log("Removed sublistdb from db");
                res.send(sublistJson);
            }
        });
    });
});
// app.post('/pre_checklist_admin', (req, res) => {
//     console.log("hahhahhahhahahahhahahahhhah");
//     let jsonFile = __dirname + '/server-data/pre_checklist_admin.json';
//     let newEvent = req.body;
//     console.log('Adding new event:', newEvent);
//     fs.readFile(jsonFile, (err, data) => {
//         if (err) {
//             res.sendStatus(500);
//             return;
//         }
//         let events = JSON.parse(data);
//         events.push(newEvent);
//         let eventsJson = JSON.stringify(events, null, 2);
//         fs.writeFile(jsonFile, eventsJson, err => {
//             if (err) {
//                 res.sendStatus(500);
//                 return;
//             }
//             // You could also respond with the database json to save a round trip
//             res.sendStatus(200);
//         });
//     });
// });


app.get('/api/get_checklist', auth.apiAuthenticatedRole('user'), (req, res) => {

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

//in tickets.js now
// app.get('/api/get_tickets', auth.apiAuthenticated, (req, res) => {

// app.get('/api/get_users', auth.apiAuthenticatedRole('user'), (req, res) => {
//     let options = {
//         root: __dirname + '/server-data/'
//     };
//
//     const fileName = 'users.json';
//     res.sendFile(fileName, options, (err) => {
//         if (err) {
//             res.sendStatus(500);
//             return;
//         }
//     });
// });

//all drones api calls are in drones.js now

app.get('/api/get_checklist', auth.apiAuthenticatedRole('user'), (req, res) => {

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

app.get('/api/getChecklist/:checklistid', (req, res) => {
    let checklist_id = req.params.checklistid;
    let checklist;
    let clJsonFile = __dirname + '/server-data/checklist.json';
    fs.readFile(clJsonFile, (err, data) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        let checklists = JSON.parse(data);
        let checklist_filter = checklists.lists.filter(function (item, index) {
            return item.lid == checklist_id;
        });
        checklist = checklist_filter[0];
        let newItems = [];
        if (checklist && checklist.items && checklists.sublists) {
            Array.prototype.forEach.call(checklist.items, ItemInChecklistItem => {
              let item = ItemInChecklistItem;
              if(ItemInChecklistItem.type=='sublist'){
                let sublist_filter = checklists.sublists.filter(function (sublist, index) {
                    return ItemInChecklistItem.sid == sublist.sid;
                });
                item = sublist_filter[0];
              }
              newItems.push(item);
            });

            // for(var i = 0; i < checklist.sublists.length; i++){
            //   var sid = checklist.sublists[i];
            // }
            checklist.items = newItems;
        }
        res.send(checklist);

    });
});

app.get('/api/getPostChecklist/:fid', (req, res) => {
    let fid = req.params.fid;
    console.log(fid);
    let checklist;
    let flightJsonFile = __dirname + '/server-data/flights.json';
    fs.readFile(flightJsonFile, (err, data) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        let flights = JSON.parse(data);
        let flight_filter = flights.flights.filter(function (item, index) {
            return item.id == fid;
        });
        let flight = flight_filter[0];
        let drone_id = flight.drone_id;

        let jsonFile = __dirname + '/server-data/drones.json';
        let drone;
        fs.readFile(jsonFile, (err, dronedata) => {
            if (err) {
                res.sendStatus(500);
                return;
            }
            let drones = JSON.parse(dronedata);

            let drone_filter = drones.drones.filter(function (item, index) {
                return item.did == drone_id;
            });
            drone = drone_filter[0];


            let checklist_id = drone.postflight_lid;

            let clJsonFile = __dirname + '/server-data/checklist.json';
            fs.readFile(clJsonFile, (err, clData) => {
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                let checklists = JSON.parse(clData);
                let checklist_filter = checklists.lists.filter(function (item, index) {
                    return item.lid == checklist_id;
                });
                checklist = checklist_filter[0];
                let newItems = [];
                if (checklist && checklist.items && checklists.sublists) {
                    Array.prototype.forEach.call(checklist.items, ItemInChecklistItem => {
                      let item = ItemInChecklistItem;
                      if(ItemInChecklistItem.type=='sublist'){
                        let sublist_filter = checklists.sublists.filter(function (sublist, index) {
                            return ItemInChecklistItem.sid == sublist.sid;
                        });
                        item = sublist_filter[0];
                      }
                      newItems.push(item);
                    });

                    // for(var i = 0; i < checklist.sublists.length; i++){
                    //   var sid = checklist.sublists[i];
                    // }
                    checklist.items = newItems;
                }
                res.send(checklist);

            });

        });

    });
});

app.post('/api/submit_flight', (req, res) => {
    let jsonFile = __dirname + '/server-data/flights.json';
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
        let newFlight = {
            id: flights.next_id,
            start_time: formData.start_time,
            drone_id: formData.drone_id,
            user: formData.user,
            preflight_list: formData
        };
        flights.next_id += 1;
        flights.flights.push(newFlight);
        let flightsJson = JSON.stringify(flights, null, 2);
        fs.writeFile(jsonFile, flightsJson, err => {
            if (err) {
                res.sendStatus(500);
                return;
            }
            // You could also respond with the database json to save a round trip
            res.send({fid:flights.next_id-1});
        });
    });
});

app.post('/api/end_flight', (req, res) => {
    let jsonFile = __dirname + '/server-data/flights.json';
    let formData = req.body;
    console.log(formData);
    // let newEvent = req.body;
    // TODO: get list and save it to flights.json

    // console.log('Adding new event:', newEvent);
    fs.readFile(jsonFile, (err, data) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        let flights = JSON.parse(data);
        // let flight_filter = flights.flights.filter(function (item, index) {
        //   // console.log(item.id);
        //     return item.id == formData.fid;
        // });
        for (var i =0; i < flights.flights.length; i ++){
          let f = flights.flights[i];
          if(f.id == formData.fid){
            f.end_time = formData.end_time;
          }
        }
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

app.post('/api/submit_postflight', (req, res) => {
    let jsonFile = __dirname + '/server-data/flights.json';
    let formData = req.body;
    console.log(formData);
    // let newEvent = req.body;
    // TODO: get list and save it to flights.json

    // console.log('Adding new event:', newEvent);
    fs.readFile(jsonFile, (err, data) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        let flights = JSON.parse(data);
        // let flight_filter = flights.flights.filter(function (item, index) {
        //   // console.log(item.id);
        //     return item.id == formData.fid;
        // });
        for (var i =0; i < flights.flights.length; i ++){
          let f = flights.flights[i];
          if(f.id == formData.fid){


              
            f.postflight_list = formData;
          }
        }
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

const port = (process.env.PORT || 8080);

 server.listen(port, () => {

    const host = server.address().address;
    const port = server.address().port;

    console.log('App listening at http://%s:%s  XD', host, port);
});

app.get('/admin/users', async (req, res) => {

    res.sendFile(__dirname + '/views/userMgmt.ejs');
});


app.get('/dashboard/ManageUsers', auth.checkAuthenticatedRole('admin'),
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

        // req.session.save(() => {
            console.log(req.user.role);
            switch (req.user.role) {
                case 'admin':
                case 'superadmin':
                    res.render(__dirname + '/views/userMgmt.ejs', r);
                    return;
                case "user":
                case "guest":
                default:
                    res.render('accessDenied.ejs', r);
                    return;
            }


            /*   res.render('userMgmt.ejs', r)*/
            //res.sendFile(__dirname + '/add_checklist.ejs');
        // });
    });


app.post('/api/delete_user', auth.apiAuthenticatedRole('admin'), (req, res) => {
    console.log('delete_user');
    console.log(req.body);

    users.del(req.body.id);
    r = users.get_users();
    r.deleted_id = req.body.id;
    res.send(JSON.stringify(r));
});

// app.post('/api/edit_user', auth.apiAuthenticatedRole('admin'), (req, res) => {
//
//     // console.log(req.file.path);
//     // console.log(req.file.encoding);
//     // console.log(req.file.mimetype);
//
//
//     console.log(req.body);
//     let d;
//     if (req.body.id == -1) {
//         d = users.add();
//     } else {
//         d = users.get_user_by_id(req.body.id);
//     }
//
//
//     // console.log(d);
//     // console.log(req.body);
//
//     if (typeof req.body.username != "undefined") d.username = req.body.username;
//     if (typeof req.body.password != "undefined") d.password = req.body.password;
//
//     if (typeof req.body.displayName != "undefined") d.displayName = req.body.displayName;
//     if (typeof req.body.role != "undefined") d.role = req.body.role;
//     if (typeof req.body.email != "undefined") d.email = req.body.email;
//     console.log(req.body.disabled);
//     // if(typeof req.body.disabled != "undefined") {
//     //if the disabled flag is not sent to the server the drone will be not disabled
//
//     if (d.id == -1) {
//         newd = users.add(d)
//     }
//     users.update(d);
//     r = users.get_users();
//     r.updated_user = d;
//     res.send(JSON.stringify(r));
//
//
// });


app.get('/inflight', auth.checkAuthenticatedRole('user'), (req,res)=>{
    r = {
        'user': req.user,
    };
    res.render(__dirname + '/views/inflight.ejs', r);
});
