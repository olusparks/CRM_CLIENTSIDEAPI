function OpenProcurementForm(){
    var windowOptions = {
        openInNewWindow: true
       };
    var paramters = {};
    Xrm.Utility.openEntityForm("rel_procurement", null, null, windowOptions);
}

function OpenProcurementForm(){
    var windowOptions = {
        openInNewWindow: true
       };
    var parameters = {};
    
    //Get Values
    var accountid = Xrm.Page.getAttribute("customerid").getValue()[0].id;
    var accountName = Xrm.Page.getAttribute("customerid").getValue()[0].name;
    var entityType = Xrm.Page.getAttribute("customerid").getValue()[0].entityType;
    var quoteId = Xrm.Page.data.entity.getId();

    parameters["customer_id"] = accountid;
    parameters["customer_idname"] = accountName;
    parameters["quote_id"] = quoteId;

    //Open Form
    Xrm.Utility.openEntityForm("new_procurement", null, parameters, windowOptions);
}

function LoadValueProcurementForm(){
    // Get the Value of the Account through the Custom Parameters
    var param = Xrm.Page.context.getQueryStringParameters();
    var accountid = param["customer_id"];
    var accountName = param["customer_idname"];
    var accountType = param["customer_idtype"];

    //Populate the Account if there is one
    if(accountid != null || account != undefined){
        Xrm.Page.getAttribute("new_account").setValue(
            [{
               id: accountid,
               name: accountName,
               entityType: accountType
            }]
        );
    }
}
"https://sbsengg.crm4.dynamics.com/main.aspx?etn=rel_procurement&pagetype=entityrecord";



