function createSubHeaders(index, l){
    itemsForOneList = ``;
    Object.keys(l).forEach(function(key) {
        var value = l[key];
        //console.log(value)
        itemsForOneList += `<li class="ui-state-default" style="overflow: hidden;"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>
        ${value.sid?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${value.sid}</button>`:''}
        ${value.type?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${value.type}</button>`:''}
        ${value.label?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${value.label}</button>`:''}
        ${value.action?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${value.action}</button>`:''}
        ${value.trigger?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${value.trigger}</button>`:''}
        ${value.alert?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${value.alert}</button>`:''}
        ${value.ticket?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${value.ticket.body}</button>`:''}
        <button type="button" class="btn btn-outline-danger btn-sm float-right">Delete</button></li>`
    });
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
            list_of_checklists_tab += `
            <h3 class="row" style="overflow: hidden;">
                    ${l.label}
                    <button type="button" class="btn btn-outline-dark btn-sm float-right">Edit</button>
                    <button type="button" class="btn btn-outline-danger btn-sm float-right">Delete</button>
            </h3>
            <div>
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
            <h3 class="row" style="overflow: hidden;">
                    ${l.label}
                    <span class="badge badge-dark">${l.sid}</span>
                    <button type="button" class="btn btn-outline-dark btn-sm float-right">Edit</button>
                    <button type="button" class="btn btn-outline-danger btn-sm float-right">Delete</button>
            </h3>
            <div>
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

    itemsForOneList = `<li class="ui-state-default" style="overflow: hidden;"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>
    ${dropdownMenuButtonAddNewItem?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${dropdownMenuButtonAddNewItem}</button>`:''}
    ${createSid?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${createSid}</button>`:''}
    ${createLabel?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${createLabel}</button>`:''}
    ${createList?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${createList}</button>`:''}
    ${dropdownMenuButtonAction?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${dropdownMenuButtonAction}</button>`:''}
    ${createTrigger?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${createTrigger}</button>`:''}
    ${createAlert?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${createAlert}</button>`:''}
    ${createTicket?`<button type="button" class="btn btn-secondary" style="cursor: context-menu;">${createTicket}</button>`:''}
    <button type="button" class="btn btn-outline-danger btn-sm float-right">Delete</button></li>`

    $('.sortable0ForAddInChecklistTab').append(itemsForOneList)

    $('#createSid').val('')     //reset inputs to prevent conflicts
    $('#createLabel').val('')
    $('#createList').val('')
    $('#createTrigger').val('')
    $('#createAlert').val('')
    $('#createTicket').val('')
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
    <button type="button" class="btn btn-outline-danger btn-sm float-right">Delete</button></li>`

    $('.sortable0ForAddInSublistTab').append(itemsForOneList)

    $('#createSid').val('')     //reset inputs to prevent conflicts
    $('#createLabel').val('')
    $('#createList').val('')
    $('#createTrigger').val('')
    $('#createAlert').val('')
    $('#createTicket').val('')
}




let checklistdb = {};
let checklistSubs = []
init_drone_list();
$('#saveChecklistSubs').click(function(){
    addChecklistTab()
})
$('.saveItemBtnSublist').click(function(){
    addSublistTab()
})

