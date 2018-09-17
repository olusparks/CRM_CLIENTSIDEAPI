//Pass execution context always
function SetToday(executionContext){
    var formContext = executionContext.getFormContext();
    var today = new Date();
    today.setDate(today.getDate());
    formContext.getAttribute("new_today").setValue(today);
}

//Using XRM ==> working version
Xrm.Page.getAttribute("estimatedclosedate").addOnChange(OnEstimatedClosedDateChange);
function OnEstimatedClosedDateChange(){
    console.log("In the OnEstimatedClosedDate Function");

    var estimatedCloseDate = Xrm.Page.getAttribute("estimatedclosedate").getValue();
    var today = Xrm.Page.getAttribute("new_today").getValue();

    //Get only date
    estimatedCloseDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);

    console.log("Estimated Closed Date:" +estimatedCloseDate + "Today Date:" + today);    

    if(today > estimatedCloseDate){
        //set optionset value to Missed Commitment 
        Xrm.Page.getAttribute("purchaseprocess").setValue(3);

        console.log("Commitment Level set");

        //Increment missed Commitment count
        let missedCount = 0;
        var missedCommitmentCount = Xrm.Page.getAttribute("new_missedcommitmentcount");
        var missedCommitmentCountValue = missedCommitmentCount.getValue();

        console.log("Missed Commitment count Value before Addition: " + missedCommitmentCountValue);
        if(missedCommitmentCountValue === null){
            missedCommitmentCountValue = 0;
        }
        missedCount = missedCommitmentCountValue + 1;

        missedCommitmentCount.setValue(missedCount);
        console.log("Missed Commitment count Value after Addition: " + missedCount)
    }
}

function GetRecordId(){
    var guidValue = Xrm.Page.data.entity.getId();
    guidValue =  guidValue.replace("{", "").replace("}", "");
    Xrm.Page.getAttribute("new_recordguid").setValue(guidValue);
}

function GetSelectedInterest(executionContext){
    var formContext = executionContext.getFormContext();
    var interest = formContext.getAttribute("new_interest");
    var selectedVal = formContext.getAttribute("new_interestselected");

    if(interest.getValue() != null)
    {
        var interestValues = interest.getValue();
        var interestText = interest.getText();
        var interestLength = interestValues.length;
        //alert("Length: "+ interestLength);
    
        var s = "";
        for(var i=0; i < interestLength; i++){

            s += interestText[i] + "; ";
        }
        //alert(s);

        //Does new_interestselected have value
        if(selectedVal.getValue() != null){
            selectedVal.setValue(null);
        }

        selectedVal.setValue(s);
    }
    else{
        if(selectedVal.getValue() != null){
            selectedVal.setValue(null);
        }
    }
   
}

//working version
function GetSelectedDeptartment(executionContext){
    var formContext = executionContext.getFormContext();
    var department = formContext.getAttribute("new_multidepartment");
    var selectedDept = formContext.getAttribute("new_departmentselected");

    if(department.getValue() != null){

        var deptValue = department.getValue();
        var deptText = department.getText();
        var deptLength = deptValue.length;
        //alert("Length: "+ deptLength)

        var d = "";
        var selectedOptions = [];
        for(var i=0; i < deptLength; i++){
            selectedOptions.push(deptValue[i]);
        }
        selectedOptions.sort();

        for(var j=0; j < selectedOptions.length; j++){
            d += selectedOptions[j];
        }

        if(selectedDept.getValue() != null){
            selectedDept.setValue(null);
        }

        setTimeout(() => {
            selectedDept.setValue(d);
        }, 3000);
           
    }
    else{
        if(selectedDept.getValue() != null){
            selectedDept.setValue(null);
        }
    }
}

//Set IFrame to host Download Quote Button
function SetIFrameURL(){
   var quoteNumber = Xrm.Page.data.entity.attributes.get("quotenumber").getValue();
   var GUIDvalue = Xrm.Page.data.entity.getId();
   GUIDvalue =  GUIDvalue.replace("{", "").replace("}", "");
   var url = "https://rqt.azurewebsites.net/GeneratePDF.aspx?qtn="+quoteNumber+"&id="+GUIDvalue+"&ent=quote";
   console.log(url);
   Xrm.Page.ui.controls.get("IFRAME_quotepdf").setSrc(url);
}

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

//Make fields readonly
function MakeFieldsReadOnly(){
    //var formContext = executionContext.getFormContext();
    var status = Xrm.Page.getAttribute("statuscode").getValue();
    //alert(status);
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
        //alert(100000002);
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
function IncrementRejectionID(){
     let rejectionCount = 0;
     var statusValue = Xrm.Page.getAttribute("statuscode").getValue();

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

//Send quote parameters to Download PDF
function GetQuoteDetails(){
	var QuoteNumber= Xrm.Page.data.entity.attributes.get("quotenumber").getValue();
    var GUIDvalue = Xrm.Page.data.entity.getId();
	GUIDvalue =  GUIDvalue.replace("{", "").replace("}", "");
	
	var url = "https://repdf.azurewebsites.net/QuotePDF.aspx?qtn="+QuoteNumber+"&id="+GUIDvalue+"&ent=quote";
	console.log(url);
	var left  = ((window).innerWidth/2)-(900/2),
		top   = ((window).innerHeight/2)-(600/2);
		pop = window.open (url, "popup", "scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,resizable=no, width=600, height=300, top="+top+", left="+left);
}

//when form Loads
function CheckDataInGrid(){
    var funtionName = "onLoad";
    try {
        //setting timeout beacuse subgid take some time to load after the form is loaded
        setTimeout(function () {
            //validating to check if the sub grid is present on the form
            if (Xrm.Page != null && Xrm.Page != undefined && Xrm.Page.getControl("Pursuit_Team") != null && Xrm.Page.getControl("Pursuit_Team") != undefined) {
                //stores the row count of subgrid on load event of CRM Form
                _rowCount = Xrm.Page.getControl("Pursuit_Team").getGrid().getTotalRecordCount();
                //registering refreshform function onload event of subgrid
                Xrm.Page.getControl("Pursuit_Team").addOnLoad(onGridLoad);
            }
        }, 3000);
    } catch (e) {
        var alertStrings = { confirmButtonLabel: "OK", text: "Please add at least one internal stakeholder." };
        var alertOptions = { height: 240, width: 350 };
        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
            function (result){
                console.log("Alert dialog closed");
            }, 
            function (error){
                console.log(error.message);
            }
        );
        Xrm.Utility.alertDialog(functionName + "Error: " + (e.message || e.description));
    }
}

//When Subgrid Loads
function onGridLoad(){
    var functionName = " onGridLoad ";
    var currentRowCount = null;
    try {
        //setting timeout beacuse subgrid take some time to load after the form is loaded
        setTimeout(function () {
            //validating to check if the sub grid is present on the form
            if (Xrm.Page != null && Xrm.Page != undefined && Xrm.Page.getControl("Pursuit_Team") != null && Xrm.Page.getControl("Pursuit_Team") != undefined) {
                //stores the row count of subgrid on load event of CRM Form

                currentRowCount = Xrm.Page.getControl("Pursuit_Team").getGrid().getTotalRecordCount();
                if (currentRowCount > _rowCount) {
                    //call the intended function which we want to call only when records are added to the grid
                    Xrm.Page.getAttribute("customerneed").setRequiredLevel("required");
                    Xrm.Page.ui.controls.get("customerneed").setDisabled(false);
                }
                else{
                    Xrm.Page.getAttribute("customerneed").setRequiredLevel("none");
                    Xrm.Page.ui.controls.get("customerneed").setDisabled(true);
                }
              }
            }, 2000);
    
        } catch (e) {
            var alertStrings = { confirmButtonLabel: "OK", text: "Please add at least one internal stakeholder." };
            var alertOptions = { height: 240, width: 350 };
            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                function (result){
                    console.log("Alert dialog closed");
                }, 
                function (error){
                    console.log(error.message);
                }
            );
            Xrm.Utility.alertDialog(functionName + "Error: " + (e.message || e.description));
        }
    
}
//# sourceURL=dynamicScript.js