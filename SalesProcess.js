//Open a Procurement Form and pass parameters
function OpenProcurementForm(){
    var windowOptions = {
        openInNewWindow: true
       };
    var parameters = {};
    
    //Get Values
    //Account
    var accountid = Xrm.Page.getAttribute("customerid").getValue()[0].id;
    var accountName = Xrm.Page.getAttribute("customerid").getValue()[0].name;
    var entityType = Xrm.Page.getAttribute("customerid").getValue()[0].entityType;

    //Contact
    var contactid = Xrm.Page.getAttribute("new_contactperson").getValue()[0].id;
    var contactName = Xrm.Page.getAttribute("new_contactperson").getValue()[0].name;
    var contactEntityType = Xrm.Page.getAttribute("new_contactperson").getValue()[0].entityType;

    //Owner
    var ownerid = Xrm.Page.getAttribute("ownerid").getValue()[0].id;
    var ownerName = Xrm.Page.getAttribute("ownerid").getValue()[0].name;
    var ownerEntityType = Xrm.Page.getAttribute("ownerid").getValue()[0].entityType;
    
    var quoteName = Xrm.Page.getAttribute("name").getValue();
    var quoteId = Xrm.Page.data.entity.getId();

    parameters["customer_id"] = accountid;
    parameters["customer_idname"] = accountName;
    parameters["customer_idtype"] = entityType;
    parameters["quote_id"] = quoteId;
    parameters["quoteName_1"] = quoteName;
    parameters["contact_id"] = contactid;
    parameters["contactName_1"] = contactName;
    parameters["contactName_type"] = contactEntityType;
    parameters["owner_id"] = ownerid;
    parameters["ownerName_1"] = ownerName;
    parameters["ownerEntity_type"] = ownerEntityType;

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
    var contactid = param["contact_id"];
    var contactName = param["contactName_1"];
    var cntEntityType = param["contactName_type"];
    var ownerid = param["owner_id"];
    var ownerName = param["ownerName_1"];
    var ownerEntityType = param["ownerEntity_type"];

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
                name: name,
                entityType: "quote"
            }]
        );    
    }

    //Populate the name
    if(name != null || name != undefined){
        Xrm.Page.getAttribute("new_name").setValue(name);
    }

    //Populate the Contact
    if(contactid != null || contactid != undefined){
        Xrm.Page.getAttribute("new_contactperson").setValue(
            [{
               id: contactid,
               name: contactName,
               entityType: cntEntityType
            }]
        );
    }

    //Populate the Owner
    if(ownerid != null || ownerid != undefined){
        Xrm.Page.getAttribute("new_accountmanager").setValue(
            [{
               id: ownerid,
               name: ownerName,
               entityType: ownerEntityType
            }]
        );
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
//Xrm.Page.getAttribute("statuscode").addOnChange(MakeFieldsReadOnly);
function MakeFieldsReadOnly(){
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

//Change status to SentForApproval
function ChangeToSentForApproval(){
    var status = Xrm.Page.getAttribute("statuscode").getValue();
    if(status == 100000001 || status == 100000000){
        //alert(100000000);
        Xrm.Page.getAttribute("statuscode").setValue(100000002); //Sent Approval
        Xrm.Page.data.entity.save();
    }
}

//Change status to Approved
function ChangeToApproved(){
    var status = Xrm.Page.getAttribute("statuscode").getValue();
    if(status == 100000002){
        //alert(100000002);
        Xrm.Page.getAttribute("statuscode").setValue(1); //Approved
        Xrm.Page.data.entity.save();
    }
}

//Change status to Rejected
function ChangeToRejected(){
    var status = Xrm.Page.getAttribute("statuscode").getValue();
    if(status == 100000002){
        alert(100000002);
        Xrm.Page.getAttribute("statuscode").setValue(100000000); //Rejected
        Xrm.Page.data.entity.save();
    }
}

//Button Transition
function UnapprovedStatus(){
    var formType = Xrm.Page.ui.getFormType();
    var status = Xrm.Page.getAttribute("statuscode").getValue();

    //Update FormType and Unapproved
    if(formType == 2 && status == 100000001){
        return true;
    }
    else{
        return false;
    }
}

function SentForApprovalStatus(){
    var status = Xrm.Page.getAttribute("statuscode").getValue();

    if(status == 100000002){
        return true;
    }
    else{
        return false;
    }
}

function ApprovedStatus(){
    var status = Xrm.Page.getAttribute("statuscode").getValue();

    if(status == 1){
        return true;
    }
    else{
        return false;
    }
}

function RejectedStatus(){
    var status = Xrm.Page.getAttribute("statuscode").getValue();

    if(status == 100000000){
        return true;
    }
    else{
        return false;
    }
}

//Increment RejectionID
///Xrm.Page.getAttribute("statuscode").addOnChange(IncrementRejectionID);
function IncrementRejectionID(){
     let rejectionCount = 0;
     var statusValue = Xrm.Page.getAttribute("statuscode").getValue();

     //alert(statusValue);

     if(statusValue === 100000000){
         var reject = Xrm.Page.getAttribute("new_rejectionid")
         var rejectValue = reject.getValue();

         if(rejectValue == null || rejectValue == undefined){
             rejectValue = 0;
         }
         rejectionCount = rejectValue + 1;
         
         //Set RejectionID
         reject.setValue(rejectionCount);

         Xrm.Page.data.entity.save();
     }
}

//Change status to Rejected
function MakeCustomerNeedRequired(executionContext){
    var formContext = executionContext.getFormContext();
    var formType = formContext.ui.getFormType();
    if(formType == 2){
        formContext.getAttribute("customerneed").setRequiredLevel("required");
        formContext.ui.controls.get("customerneed").setDisabled(false);
    }
}