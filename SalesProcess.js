//Open a Procurement Form and pass parameters
function OpenProcurementForm(){
    var windowOptions = {
        openInNewWindow: true
       };
    var parameters = {};
    
    //Get Values
    var accountid = Xrm.Page.getAttribute("customerid").getValue()[0].id;
    var accountName = Xrm.Page.getAttribute("customerid").getValue()[0].name;
    var entityType = Xrm.Page.getAttribute("customerid").getValue()[0].entityType;
    var quoteName = Xrm.Page.getAttribute("name").getValue();

    var quoteId = Xrm.Page.data.entity.getId();

    parameters["customer_id"] = accountid;
    parameters["customer_idname"] = accountName;
    parameters["customer_idtype"] = entityType;
    parameters["quote_id"] = quoteId;
    parameters["quoteName_1"] = quoteName;

    //Open Form
    Xrm.Utility.openEntityForm("new_procurement", null, parameters, windowOptions);
}

//Set Default Values onLoad of Procurement Form
function LoadValueProcurementForm(){
    // Get the Value of the Account through the Custom Parameters
    var param = Xrm.Page.context.getQueryStringParameters();
    var accountid = param["customer_id"];
    var accountName = param["customer_idname"];
    var acctentityType = param["customer_idtype"];
    var quoteid = param["quote_id"];
    var name = param["quoteName_1"];

    //Populate the Account if there is one
    if(accountid != null || accountid != undefined){
        Xrm.Page.getAttribute("new_account").setValue(
            [{
               id: accountid,
               name: accountName,
               entityType: acctentityType
            }]
        );
    }

    //Populate the Quote
    if(quoteid != null || quoteid != undefined)
    {
        Xrm.Page.getAttribute("new_quote").setValue(
            [{
                id: quoteid,
                entityType: "quote"
            }]);    
    }

    //Populate the name
    if(name != null || name != undefined){
        Xrm.Page.getAttribute("new_name").setValue(name);
    }
}

//Refresh Ribbon
Xrm.Page.getAttribute("statuscode").addOnChange(refreshRibbonOnchange);
function refreshRibbonOnchange(){
    Xrm.Page.ui.refreshRibbon();
    alert("Refreshed");
}

//get FormType
function TypeofForm(executionContext){
    var formContext = executionContext.getFormContext();
    var formType = formContext.ui.getFormType();
    alert(formType);
}

//Make fields readonly\
Xrm.Page.getAttribute("statuscode").addOnChange(MakeFieldsReadOnly);
function MakeFieldsReadOnly(executionContext){
    //var formContext = executionContext.getFormContext();
    var status = Xrm.Page.getAttribute("statuscode").getValue();
    alert(status);
    if(status == 1){
        //make fields readonly
        var controls = Xrm.Page.ui.controls.get();
        for(var i in controls){
            var control = controls[i];
            if(control.getDisabled && control.setDisabled && !control.getDisabled()){
                control.setDisabled(true);
            }
        }
    }
}