function getServerData(path) {
    //  ie /api/getDrones
    return fetch(path, {method: 'GET', credentials: "same-origin"}).then(r => {
        if (!r.ok) throw Error(r.statusText);
        return r.json();
    })
}


// Applied globally on all textareas with the "autoExpand" class
// Applied globally on all textareas with the "autoExpand" class
jQuery.fn.extend({
    autoHeight: function () {
        function autoHeight_(element) {
            return jQuery(element).css({
                'height': 'auto',
                'overflow-y': 'hidden'
            }).height(element.scrollHeight);
        }
        return this.each(function () {
            autoHeight_(this).on('input', function () {
                autoHeight_(this);
            });
        });
    }
});

let ticketdb_p = (getServerData('/api/get_tickets'));
let userdb_p = (getServerData('/api/get_users'));
let dronedb_p = (getServerData('/api/get_drones'));

// let userdb = undefined;
// let dronedb = undefined;
let responses = [];
responses.push(ticketdb_p);
responses.push(userdb_p);
responses.push(dronedb_p);

let current_tid = -1;


console.log(window.location);

var socket = io.connect(window.location.origin);

socket.on('new_ticket', function (data) {
    console.log('YAY SOCKET');
    console.log(data);

    // var options = {
    //  body: data.body
    //
    //    };
    ticketdb_p = (getServerData('/api/get_tickets'));
    ticketdb_p.then(tdb => update_ticket_list(tdb.tickets));


    var myNotification = new Notification("A New Ticket Was Added", {body: data.title});
});

function parse_promises(v) {
    r = {
        ticketdb: v[0],
        userdb: v[1],
        dronedb: v[2]
    };
    // global.ticketdb = v[0];
    // global.userdb = v[1];
    // global.dronedb = v[2];
    return r;


}

// responses.push(dronedb_p);
// responses.push(listdb_p);

function gen_ticket_item(t) {

    let label;


    return
}

Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
}

function formatTime(t) {

    // console.log(typeof t);
    let d = new Date(parseInt(t));

    let s = (d.getDate().pad(2) + '/' + d.getMonth().pad(2) + '/' + d.getFullYear() + ' at '
        + d.getHours().pad(2) + ':' + d.getMinutes().pad(2));

    return s

}

async function delete_issue() {

    let body = new FormData();
    body.append('tid', current_tid);
    const params = new URLSearchParams([...body]);

    const response = await fetch("/api/delete_ticket", {method: "POST", body: params, credentials: "same-origin"});
    r = response.json();
    // console.log(r);
    ticketdb_p = r;

    r.then(tdb => update_ticket_list(tdb.tickets));
}

async function resolve_issue() {

    let body = new FormData();
    body.append('tid', current_tid);
    const params = new URLSearchParams([...body]);

    const response = await fetch("/api/resolve_ticket", {method: "POST", body: params, credentials: "same-origin"});
    r = response.json();
    // console.log(r);
    ticketdb_p = r;

    r.then(tdb => update_ticket_list(tdb.tickets));
}


async function comment() {

    let body = new FormData();

    body.append('tid', current_tid);
    body.append('comment', document.getElementById('comment_area').value);
    const params = new URLSearchParams([...body]);

    const response = await fetch("/api/comment_ticket", {method: "POST", body: params, credentials: "same-origin"});
    r = response.json();
    // console.log(r);
    ticketdb_p = r;

    update_issue(current_tid);
    r.then(tdb => update_ticket_list(tdb.tickets));


}

function update_issue(tid) {

    current_tid = tid;

    ticketdb_p.then(ticketdb => {
        userdb_p.then(userdb => {


            // r = parse_promises(values);


            let t = ticketdb.tickets.find(t => t.tid == tid)
            let u = userdb.users.find(u => u.username == t.created_by);
            if (t == undefined) {
                throw "Ticket Doesnt Exist"
            }
            let img = '';
            if (u != undefined && u.base64data != undefined) {
                img = u.base64data;
            }


            document.getElementById('issue_title').innerHTML = `
            <i class="fa fa-cog"></i> ${t.title}
        `;


            document.getElementById('issue_body').innerHTML = `
            <div class="col-md-2">
                <img id="issue_profileimage" src="${img}"
                class="img-circle" alt="" width="50">
            </div>
            <div class="col-md-10">
                <p>Issue <strong>#${t.tid}</strong> opened by <a
                href="#">${t.created_by}</a> at <span>${formatTime(t.created_at)}</span>
                </p>
                <p>${t.body}</p>
            </div>
        `


            ic = document.getElementById('issue_comments');
            ic.innerHTML = '';

            t.comments.forEach(c => {
                console.log(c);
                let cu = userdb.users.find(u => u.username == c.user);

                let img = '';
                if (cu && cu.base64data) {
                    img = cu.base64data;
                }

                ic.innerHTML += `
               
            <div class="col-md-2">
            <img src="${img}" class="img-circle" alt="" width="50">
            </div>
            <div class="col-md-10">
            <p>Posted by <a href="#">${c.user}</a> on
            ${formatTime(c.date)}</p>
            <p>${c.body}</p>
               `
            });

            ic.innerHTML += `


            <textarea style="min-height: 35px" class="form-control rounded-0" rows='1' data-min-rows='1' placeholder='Comment Here :)' id="comment_area"></textarea>
<!--            <div class="col-md-2">-->
<!--            </div>-->
<!--            <div class="col-md-10">-->
            <a href="#" onclick="comment()"><span class="fa fa-reply"></span>
            &nbsp;Post a comment</a>
<!--            </div>-->
        
               `;
            $('#comment_area').autoHeight();
            $('#issue_resolve')[0].hidden = t.resolved;


        });
    });


}



function open_close_switch(e) {


    // console.log(ticketdb);
    // // if (tickets == undefined) {
    //     console.error("TICKET DB NOT LOADED YET");
    //     return;
    // }
    ticketdb_p.then(t => update_ticket_list(t.tickets));

}

function update_opened_closed() {
    ticketdb_p.then(tdb => {
        document.getElementById('open_tickets').innerText = `${tdb.open} `;
        document.getElementById('closed_tickets').innerText = `${tdb.tickets.length - tdb.open} `;
    });
}

function update_ticket_list(tickets) {
    // console.log(tickets);
    let ticket_list = document.getElementById('ticket_list');
    ticket_list.innerHTML = '';

    let isOpen = document.getElementById('filter_open').checked;
    // console.log(isOpen);

    let sm = document.getElementById('issue_sort_method').value;
    tickets = tickets.filter(t => t.resolved != isOpen);

    update_opened_closed();

    // console.log(sm);
    switch (sm) {
        case 'old':
            tickets.sort((a, b) => {
                return a.created_at - b.created_at;
            });
            break;
        case 'new':
            tickets.sort((a, b) => {
                return b.created_at - a.created_at;
            });
            break;
    }


    tickets.forEach(t => {
        // ticket_list.innerText += `${t.body}\n`;
        let label = '';
        if (t.lockout == true) {
            label = `<span class="badge badge-danger">LOCKOUT</span>`
        }

        let num_comments = 0;
        if (t.comments != undefined) {
            num_comments = t.comments.length;
        }

        let item = `
                <li class="list-group-item" data-toggle="modal" data-target="#issue" onclick="update_issue(${t.tid})">
                    <div class="media">
                        <i class="fa fa-cog pull-left"></i>
                        <div class="media-body">
                            <strong>${t.title}</strong> 
                            ${label}
                            <span class="number pull-right"># ${t.tid}</span>
                            <p class="info">Opened by <a href="#">${t.created_by}</a> on ${formatTime(t.created_at)}
                                <i class="fa fa-comments"></i> <a href="#">${num_comments} comments</a>
                            </p>
                        </div>
                    </div>
                </li>
            `;

        ticket_list.innerHTML += item;

    });
}


function init_ticket_list() {
    let ticket_list = document.getElementById('ticket_list');


    Promise.all(responses).then(values => {
        r = parse_promises(values);

        document.getElementById('open_tickets').innerText = `${r.ticketdb.open} `;
        document.getElementById('closed_tickets').innerText = `${r.ticketdb.tickets.length - r.ticketdb.open} `;
        document.getElementById('filter_open').onchange = open_close_switch;
        document.getElementById('filter_closed').onchange = open_close_switch;


        let ds = document.getElementById('new_issue_drone_select');
        r.dronedb.drones.forEach(d => {
            ds.innerHTML += `<option value="${d.did}">${d.name}</option>`
        });

        document.getElementById('new_issue_submit').onsubmit = submit_ticket;

        update_ticket_list(r.ticketdb.tickets);
        console.log(r);
    }).catch(e => {
        console.log(e)
    })


}


async function submit_ticket(e) {

    e.preventDefault();
    $('#newIssue').modal('toggle');
    const params = new URLSearchParams([...new FormData(e.target).entries()]);

    const response = await fetch("/api/add_ticket", {method: "POST", body: params, credentials: "same-origin"});
    r = response.json();
    // console.log(r);
    ticketdb_p = r;

    r.then(tdb => update_ticket_list(tdb.tickets));

    // update_ticket_list(ticketdb.tickets);

}

