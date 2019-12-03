function createSubHeaders(index, l){
    itemsForOneList = ``;
    Object.keys(l).forEach(function(key) {
        var value = l[key];
        //console.log(value)
        itemsForOneList += `<li class="ui-state-default" style="overflow: hidden;"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>
        ${value.sid?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${value.sid}</button>`:''}
        ${value.type?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${value.type}</button>`:''}
        ${value.label?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${value.label}</button>`:''}
        ${value.options?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${value.options}</button>`:''}
        ${value.action?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${value.action}</button>`:''}
        ${value.trigger?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${value.trigger}</button>`:''}
        ${value.alert?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${value.alert}</button>`:''}
        ${value.ticket?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${value.ticket.body}</button>`:''} `
    });
    //<button type="button" class="btn btn-outline-danger btn-sm float-right">Delete</button></li> ability to delete already stored subs
    return itemsForOneList;
}

async function init_drone_list() {
    let responses = []
    responses.push(checklistdb_p);
    Promise.all(responses).then(value => {
        checklistdb = value[0];
        //console.log(checklistdb)
        list_of_checklists_tab = ``;
        list_of_sublists_tab = ``;
        for (let [index, l] of checklistdb.lists.entries()) {
            //<button type="button" class="btn btn-outline-dark btn-sm float-right">Edit</button>
            list_of_checklists_tab += `
            <h3 class="row checklistsWithSubs" style="overflow: hidden;" uniqueId="checklistWithSubs${l.lid}">
                    ${l.label}
                    <button type="button" class="btn btn-outline-danger btn-sm float-right deleteChecklistBtn">Delete</button>
            </h3>
            <div class="checklistsWithSubs" uniqueId="checklistWithSubs${l.lid}">
                    <ul id="sortable" class="sortable0">
                            ${createSubHeaders(index, l.items)}
                    </ul>
            </div>
            `
        }
        $('#accordion').append(list_of_checklists_tab).accordion( "refresh" );  //To add the accordion and sortable properties to the appended elements
        $('.sortable0').sortable();
        //------- sublists tab
        for (let [index, l] of checklistdb.sublists.entries()) {
            list_of_sublists_tab += `
            <h3 class="row checklistsWithSubs" style="overflow: hidden;" uniqueId="sublistWithSubs${l.sid}">
                    ${l.label}
                    <span class="badge badge-dark">${l.sid}</span>
                    <button type="button" class="btn btn-outline-danger btn-sm float-right deleteSublistBtn">Delete</button>
            </h3>
            <div class="checklistsWithSubs" uniqueId="sublistWithSubs${l.sid}">
                    <ul id="sortable" class="sortable0">
                            ${createSubHeaders(index, l.items)}
                    </ul>
            </div>
            `
        }
        $('#accordion2').append(list_of_sublists_tab).accordion( "refresh" );  //To add the accordion and sortable properties to the appended elements
        $('.sortable0').sortable();
    })
}
function addChecklistTab(){
    dropdownMenuButtonAction = $('#dropdownMenuButtonAction').val()
    createSid = $('#createSid').val()
    createLabel = $('#createLabel').val()
    createList = $('#createList').val()
    dropdownMenuButtonAddNewItem = $('#dropdownMenuButtonAddNewItem').val()
    createTrigger = $('#createTrigger').val()
    createAlert = $('#createAlert').val()
    createTicket = $('#createTicket').val()

    if(createSid==''&&createLabel==''&&createList==''&&createTrigger==''&&createAlert==''&&createTicket=='')return;

    itemsForOneList = `<li class="ui-state-default" id="liForChecklistSubs" style="overflow: hidden;"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>
    ${dropdownMenuButtonAddNewItem?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${dropdownMenuButtonAddNewItem}</button>`:''}
    ${createSid?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${createSid}</button>`:''}
    ${createLabel?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${createLabel}</button>`:''}
    ${createList?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${createList}</button>`:''}
    ${dropdownMenuButtonAction?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${dropdownMenuButtonAction}</button>`:''}
    ${createTrigger?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${createTrigger}</button>`:''}
    ${createAlert?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${createAlert}</button>`:''}
    ${createTicket?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${createTicket}</button>`:''}
    <button type="button" class="btn btn-outline-danger btn-sm float-right deleteForSubsChecklist">Delete</button></li>`

    $('.sortable0ForAddInChecklistTab').append(itemsForOneList)

    $('#createSid').val('')     //reset inputs to prevent conflicts
    $('#createLabel').val('')
    $('#createList').val('')
    $('#createTrigger').val('')
    $('#createAlert').val('')
    $('#createTicket').val('')

    oneItem = {}
    if(dropdownMenuButtonAddNewItem.toLowerCase() == 'sublist'){
        oneItem = {
            "type": dropdownMenuButtonAddNewItem.toLowerCase(),
            "sid": createSid
        }
    }else if((dropdownMenuButtonAddNewItem.toLowerCase() == 'checkbox') || (dropdownMenuButtonAddNewItem.toLowerCase() == 'input')){
        if(dropdownMenuButtonAction == 'LockOut'){
            oneItem = {
                "type": dropdownMenuButtonAddNewItem.toLowerCase(),
                "label": createLabel,
                "action": dropdownMenuButtonAction,
                "trigger": createTrigger,
                "alert": createAlert,
                "ticket": {
                  "title": createTicket,
                  "body": createTicket
                }
              }
        }else if(dropdownMenuButtonAction.toLowerCase() == 'ticket'){
            oneItem = {
                "type": dropdownMenuButtonAddNewItem,
                "label": createLabel,
                "action": dropdownMenuButtonAction.toLowerCase(),
                "trigger": createTrigger,
                "ticket": {
                  "title": createTicket,
                  "body": createTicket
                }
              }
        } else{       //none is selected
            oneItem = {
                "type": dropdownMenuButtonAddNewItem,
                "label": createLabel,
                "action": "None"
              }
        }
    }else if(dropdownMenuButtonAddNewItem.toLowerCase() == 'dropdown'){
        if(dropdownMenuButtonAction == 'LockOut'){
            oneItem = {
                "type": dropdownMenuButtonAddNewItem.toLowerCase(),
                "label": createLabel,
                "options": [
                    createList
                  ],
                "action": dropdownMenuButtonAction,
                "trigger": createTrigger,
                "alert": createAlert,
                "ticket": {
                  "title": createTicket,
                  "body": createTicket
                }
              }
        }else if(dropdownMenuButtonAction.toLowerCase() == 'ticket'){
            oneItem = {
                "type": dropdownMenuButtonAddNewItem,
                "label": createLabel,
                "options": [
                    createList
                  ],
                "action": dropdownMenuButtonAction.toLowerCase(),
                "trigger": createTrigger,
                "ticket": {
                  "title": createTicket,
                  "body": createTicket
                }
              }
        }else{
            oneItem = {
                "type": dropdownMenuButtonAddNewItem,
                "label": createLabel,
                "options": [
                    createList
                  ],
                "action": "None"
              }
        }
    }
    checklistSubs.push(oneItem)
}

function addSublistTab(){
    dropdownMenuButtonAction = $('#dropdownMenuButtonActionSublist').val()
    createSid = $('#createSidSublist').val()
    createLabel = $('#createLabelSublist').val()
    createList = $('#createListSublist').val()
    dropdownMenuButtonAddNewItem = $('#dropdownMenuButtonAddNewItemSublist').val()
    createTrigger = $('#createTriggerSublist').val()
    createAlert = $('#createAlertSublist').val()
    createTicket = $('#createTicketSublist').val()

    if(createSid==''&&createLabel==''&&createList==''&&createTrigger==''&&createAlert==''&&createTicket=='')return;

    itemsForOneList = `<li class="ui-state-default" style="overflow: hidden;"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>
    ${dropdownMenuButtonAddNewItem?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${dropdownMenuButtonAddNewItem}</button>`:''}
    ${createSid?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${createSid}</button>`:''}
    ${createLabel?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${createLabel}</button>`:''}
    ${createList?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${createList}</button>`:''}
    ${dropdownMenuButtonAction?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${dropdownMenuButtonAction}</button>`:''}
    ${createTrigger?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${createTrigger}</button>`:''}
    ${createAlert?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${createAlert}</button>`:''}
    ${createTicket?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${createTicket}</button>`:''}
    <button type="button" class="btn btn-outline-danger btn-sm float-right deleteForSubsSublist">Delete</button></li>`

    $('.sortable0ForAddInSublistTab').append(itemsForOneList)

    $('#createSidSublist').val('')     //reset inputs to prevent conflicts
    $('#createLabelSublist').val('')
    $('#createListSublist').val('')
    $('#createTriggerSublist').val('')
    $('#createAlertSublist').val('')
    $('#createTicketSublist').val('')

    oneItem = {}
    if(dropdownMenuButtonAddNewItem.toLowerCase() == 'sublist'){
        oneItem = {
            "type": dropdownMenuButtonAddNewItem.toLowerCase(),
            "sid": createSid
        }
    }else if((dropdownMenuButtonAddNewItem.toLowerCase() == 'checkbox') || (dropdownMenuButtonAddNewItem.toLowerCase() == 'input')){
        if(dropdownMenuButtonAction == 'LockOut'){
            oneItem = {
                "type": dropdownMenuButtonAddNewItem.toLowerCase(),
                "label": createLabel,
                "action": dropdownMenuButtonAction,
                "trigger": createTrigger,
                "alert": createAlert,
                "ticket": {
                  "title": createTicket,
                  "body": createTicket
                }
              }
        }else if(dropdownMenuButtonAction.toLowerCase() == 'ticket'){
            oneItem = {
                "type": dropdownMenuButtonAddNewItem,
                "label": createLabel,
                "action": dropdownMenuButtonAction.toLowerCase(),
                "trigger": createTrigger,
                "ticket": {
                  "title": createTicket,
                  "body": createTicket
                }
              }
        } else{       //none is selected
            oneItem = {
                "type": dropdownMenuButtonAddNewItem,
                "label": createLabel,
                "action": "None"
              }
        }
    }else if(dropdownMenuButtonAddNewItem.toLowerCase() == 'dropdown'){
        if(dropdownMenuButtonAction == 'LockOut'){
            oneItem = {
                "type": dropdownMenuButtonAddNewItem.toLowerCase(),
                "label": createLabel,
                "options": [
                    createList
                  ],
                "action": dropdownMenuButtonAction,
                "trigger": createTrigger,
                "alert": createAlert,
                "ticket": {
                  "title": createTicket,
                  "body": createTicket
                }
              }
        }else if(dropdownMenuButtonAction.toLowerCase() == 'ticket'){
            oneItem = {
                "type": dropdownMenuButtonAddNewItem,
                "label": createLabel,
                "options": [
                    createList
                  ],
                "action": dropdownMenuButtonAction.toLowerCase(),
                "trigger": createTrigger,
                "ticket": {
                  "title": createTicket,
                  "body": createTicket
                }
              }
        }else{
            oneItem = {
                "type": dropdownMenuButtonAddNewItem,
                "label": createLabel,
                "options": [
                    createList
                  ],
                "action": "None"
              }
        }
    }
    sublistSubs.push(oneItem)
}

async function addAllChecklistWithSubsToDB(){
    if($('#nameOfChecklist').val() == '') return;
    if(checklistSubs.length == 0) return;
    nameOfChecklist = $('#nameOfChecklist').val()
    checklist = {
        "lid": ++(checklistdb.next_lid),
        "label": nameOfChecklist,
        "items": checklistSubs
    }
    const response = await fetch("/api/add_new_checklist_checklist_tab", {method: "POST", body: JSON.stringify(checklist), headers: { "Content-Type": "application/json" }, credentials: "same-origin"})
    r = await response.json();
    checklistdb_p = r
    $('#nameOfChecklist').val('')
    $('#sortable').html('');
    //$('#accordion h3, #accordion div').not(':first').remove(); //except the first child which is the adding checklists one
    $('.sortable0ForAddInSublistTab').html('');
    //$('#accordion2 h3, #accordion2 div').not(':first').remove();
    $('.checklistsWithSubs').remove()
    init_drone_list();
}


async function addAllSublistWithSubsToDB(){
    if($('#nameOfSublist').val() == '') return;
    if(sublistSubs.length == 0) return;
    nameOfSublist = $('#nameOfSublist').val()
    checklist = {
        "sid": ++(checklistdb.next_sid),
        "label": nameOfSublist,
        "items": sublistSubs
    }
    const response = await fetch("/api/add_new_sublist_checklist_tab", {method: "POST", body: JSON.stringify(checklist), headers: { "Content-Type": "application/json" }, credentials: "same-origin"})
    r = await response.json();
    checklistdb_p = r
    $('#nameOfSublist').val('')
    $('.sortable0ForAddInSublistTab').html('');
    $('.checklistsWithSubs').remove()
    $('#sortable').html('');
    init_drone_list();
}

function removeSubButtons(){
    $('#accordion').on('click', '.deleteForSubsChecklist', function() {  //For checklists
        $(this).parent().remove()
    })
    $('#accordion2').on('click', '.deleteForSubsSublist', function() {  //For sublists
        $(this).parent().remove()
    })
}

async function removeAllChecklistButton(){
    $('#accordion').on('click', '.deleteChecklistBtn',async function() {  //For checklists
        //console.log($(this).parent().attr('uniqueId'))
        idWithString = $(this).parent().attr('uniqueId')
        idNoString= idWithString.substring(idWithString.indexOf("s") + 10)

        const response = await fetch("/api/remove_checklist_checklist_tab", {method: "POST", body: JSON.stringify({lid: idNoString}), headers: { "Content-Type": "application/json" }, credentials: "same-origin"})
        //$(idWithString).parent().remove()
        mm = $("#accordion").find(`[uniqueId='${idWithString}']`).remove()
        console.log(mm)
        //r = await response.json();
        //console.log(idNoString)
    })
}

async function removeAllSublistButton(){
    $('#accordion2').on('click', '.deleteSublistBtn',async function() {  //For checklists
        //console.log($(this).parent().attr('uniqueId'))
        idWithString = $(this).parent().attr('uniqueId')
        idNoString= idWithString.substring(idWithString.indexOf("s") + 15)

        const response = await fetch("/api/remove_sublist_sublist_tab", {method: "POST", body: JSON.stringify({sid: idNoString}), headers: { "Content-Type": "application/json" }, credentials: "same-origin"})
        //$(idWithString).parent().remove()
        mm = $("#accordion2").find(`[uniqueId='${idWithString}']`).remove()
        console.log(idNoString)
        //r = await response.json();
        //console.log(idNoString)
    })
}



//Calling funs and Global vars
let checklistdb = {};
let checklistSubs = []
let sublistSubs = []
init_drone_list();
$('#saveChecklistSubs').click(function(){
    addChecklistTab()
})
$('.saveItemBtnSublist').click(function(){
    addSublistTab()
})
$('#saveTheChecklist').click(function(){
    addAllChecklistWithSubsToDB()
})
$('#saveTheSublist').click(function(){
    addAllSublistWithSubsToDB()
})
removeSubButtons();
removeAllChecklistButton();
removeAllSublistButton();



