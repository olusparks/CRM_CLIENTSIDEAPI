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
    if(status == 1 || status == 100000003){
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

//Procurement Status Transition

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

        //Call Function
        MakeFieldsReadOnly();
    }
}

//Change status to Revised
function ChangeToRevised(){
    var status = Xrm.Page.getAttribute("statuscode").getValue();
    //Sent For Approval
    if(status == 100000002){    
        Xrm.Page.getAttribute("statuscode").setValue(100000000); //Revised
        Xrm.Page.data.entity.save();
    }
}

//Change status to Rejected
function ChangeToRejected(){
    var status = Xrm.Page.getAttribute("statuscode").getValue();
    if(status == 100000002 || status == 100000000){
        Xrm.Page.getAttribute("statuscode").setValue(100000003); //Rejected
        Xrm.Page.data.entity.save();
    }
    Xrm.Page.ui.setFormNotification("This procurement has been rejected", "WARNING", "rejectedprocurement");

    //Call Function
    MakeFieldsReadOnly();
    IncrementRejectionID();
}

formContext.getAttribute("statuscode").addOnChange(RejectedFuncs);
function RejectedFuncs(executionContext){
    
    var formContext = executionContext.getFormContext();
    var status = formContext.getAttribute("statuscode").getValue();

    //Lock Fields
    if(status == 1 || status == 100000003){
        //make fields readonly
        var controls = Xrm.Page.ui.controls.get();
        for(var i in controls){
            var control = controls[i];
            if(control.getDisabled && control.setDisabled && !control.getDisabled()){
                control.setDisabled(true);
            }
        }
    }

    //Increment Rejection Field
    if(statusValue == 100000003){
        var reject = formContext.getAttribute("new_rejectionid")
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

//End of Procurement Status Transition

//Button Transition
// function UnapprovedStatus(){
//     var formType = Xrm.Page.ui.getFormType();
//     var status = Xrm.Page.getAttribute("statuscode").getValue();

//     //Update FormType and Unapproved
//     if(formType == 2 && status == 100000001){
//         return true;
//     }
//     else{
//         return false;
//     }
// }

// function SentForApprovalStatus(){
//     var status = Xrm.Page.getAttribute("statuscode").getValue();
//     if(status == 100000002){
//         return true;
//     }
//     else{
//         return false;
//     }
// }

// function ApprovedStatus(){
    
//     if(status == 1){
//         return true;
//     }
//     else{
//         return false;
//     }
// }

// function RevisedStatus(){
//     var status = Xrm.Page.getAttribute("statuscode").getValue();
//     if(status == 10000000){
//         return true;
//     }
//     else{
//         return false;
//     }
// }

// function RejectedStatus(){
//     var status = Xrm.Page.getAttribute("statuscode").getValue();
//     if(status == 100000003){
//         return true;
//     }
//     else{
//         return false;
//     }
// }
//End of Button transition

//Increment RejectionID

function IncrementRejectionID(){
     let rejectionCount = 0;
     var statusValue = Xrm.Page.getAttribute("statuscode").getValue();

     if(statusValue === 100000003){
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
	
	var url = "https://pdfsandb.azurewebsites.net/quotepdf.aspx?qtn="+QuoteNumber+"&id="+GUIDvalue+"&ent=quote";
	console.log(url);
	var left  = ((window).innerWidth/2)-(900/2),
		top   = ((window).innerHeight/2)-(600/2);
		pop = window.open (url, "popup", "scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,resizable=no, width=600, height=300, top="+top+", left="+left);
}

//Make customer need required and enabled
//function MakeCustomerNeedRequired(executionContext){
    //var formContext = executionContext.getFormContext();
    //var formType = formContext.ui.getFormType();
    //if(formType == 2){
       // formContext.getAttribute("customerneed").setRequiredLevel("required");
        //formContext.ui.controls.get("customerneed").setDisabled(false);
    //}
//}

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

//Update Exchange Rate on Opportunity Line Item
function UpdateExchangeRt(){
    var req = new XMLHttpRequest();
    var  url = Xrm.Page.context.getClientUrl();
    var lineAmtEx = Xrm.Page.getAttribute("new_exchangerate");

    //Get Opportunity Id Value
    var oppid = Xrm.Page.getAttribute("opportunityid").getValue()[0].id;
    var reOppId = oppid.replace("{", "").replace("}", "");

    Xrm.WebApi.retrieveRecord("opportunity", reOppId, "?$select=new_exchangerate").then(
        function success(result){
            if(result != null || result != undefined){
                lineAmtEx.setValue(result.new_exchangerate);
                Xrm.Page.data.entity.save();
            }
        }
    )
}

//Calculate TotalAmount with Exchange Rate and Quantity
// function CalculateTotalAmount(executionContext){
//     var formContext = executionContext.getFormContext();
//     var priceperunit = formContext.getAttribute("priceperunit").getValue();
//     var quantity = formContext.getAttribute("quantity").getValue();
//     if(priceperunit != null || priceperunit != undefined){
//         //Get exchangerate
//         var exRate = formContext.getAttribute("new_exchangerate").getValue();
//         if(exRate != null || exRate != undefined){
//             //Multiply exchange rate with priceperunit
//             var amount = priceperunit * exRate;
//             if(quantity != null || quantity != undefined){
//                 //Multiply amount by quantity
//                 var totalAmount = amount * quantity;
//                 //Set Total_With_ExchangeRate
//                 formContext.getAttribute("new_totalextendedamount").setValue(totalAmount);
//             }
//         }
//     }
// }

// function entityLineAmount(){
//     setTimeout(function() {
//         var gridCtx = Xrm.Page.getControl("opportunityproductsGrid");
//         if(gridCtx != null || gridCtx != undefined){
//             Xrm.Page.getControl("opportunityproductsGrid").addOnLoad(gridLineAmount);
//         }
//     }, 3000);
    
// }

// function gridLineAmount(){
//     var lineAmount = 0.00;
//     var totalAmount = 0.00;
//     var quantity = 0;
//     var priceperunit = 0.00;
//     var exRate = 0.00;
//     var totalExtendedAmount = 0.00;

    // setTimeout(function(){
    //     var filteredRecordCount = Xrm.Page.getControl("opportunityproductsGrid").getGrid().getTotalRecordCount();
    //     if(filteredRecordCount > 0){
    //         Xrm.Page.ui.setFormNotification("There are "+filteredRecordCount.toString()+ "records", "INFO", "opprecordcount");
    //         var allRows = Xrm.Page.getControl("opportunityproductsGrid").getGrid().getRows();
    
    //         for(var i = 0; i < filteredRecordCount; i++){
    //             var attributes = allRows.get(i).getData().getEntity().getAttributes();
    //             lineAmount = attributes.get("extendedamount").getValue();
    //             totalAmount = totalAmount + lineAmount;
    //         }
    //         alert(totalAmount);
    //         Xrm.Page.ui.clearFormNotification("opprecordcount");
    //     }
    // }, 3000);


//     var filteredRecordCount = Xrm.Page.getControl("opportunityproductsGrid").getGrid().getTotalRecordCount();
//     if(filteredRecordCount > 0){
//             //Xrm.Page.ui.setFormNotification("There are "+filteredRecordCount.toString()+ "records", "INFO", "opprecordcount");
//             var allRows = Xrm.Page.getControl("opportunityproductsGrid").getGrid().getRows();
    
//             for(var i = 0; i < filteredRecordCount; i++){
//                 var attributes = allRows.get(i).getData().getEntity().getAttributes();

//                 quantity = formatNumber(attributes.get("quantity").getValue());
//                 priceperunit = formatNumber(attributes.get("priceperunit").getValue());
//                 exRate = formatNumber(attributes.get("new_exchangerate").getValue());
                
//                 totalExtendedAmount = priceperunit * exRate * quantity;
//                 attributes.get("new_totalextendedamount").setValue(totalExtendedAmount);

//                 lineAmount = formatNumber(attributes.get("new_totalextendedamount").getValue());
//                 totalAmount = totalAmount + lineAmount;
//             }
//             Xrm.Page.getAttribute("new_totalamount_ex").setValue(totalAmount);
//             //Xrm.Page.ui.clearFormNotification("opprecordcount");
//         }
//     else{
//         setTimeout(gridLineAmount, 3000);
//     }
// }

// function formatNumber(value){
//     return parseInt(value.substring(1, value.length).replace(/,/g, ""));
// }


// function checkNAN(executionContext){
//     var formContext = executionContext.getFormContext();
//     var totalAmt = formContext.getAttribute("new_totalamount_ex");
//     if(totalAmt.getValue() == NaN){
//         var valuee = 0.00;
//         totalAmt.setValue(valuee)
//     }
// }

// function filterVendorAccounts(){
//      //Only show accounts with the type 'Preferred Customer'
//      var vendorAccountFilter = "<filter type='and'><condition attribute='customertypecode' operator='eq' value='11'/></filter>";
//      Xrm.Page.getControl("new_vendoraccount").addCustomFilter(vendorAccountFilter, "account");
// }

// function addVendorAccounts(){
//     Xrm.Page.getControl("new_vendoraccount").addPreSearch(filterVendorAccounts);
// }


// function PopulateProcurementLineVendor(){

// }

function GetRecordGuid(){
    var guidValue = Xrm.Page.data.entity.getId();
    guidValue =  guidValue.replace("{", "").replace("}", "");
    alert(guidValue);
}

function GetLoggedInUserSecurityRoleNames(){
    //Get Logged-in user context
    var userSettings = Xrm.Utility.getGlobalContext().userSettings;
    //Get Logged in user security roles
    var loggedInUserSecurityRolesGuidArray = userSettings.securityRoles;
    var userRoleId = userSettings.userId.replace("{","").replace("}","");
    //var  url = Xrm.Page.context.getClientUrl();

    var totalSecurityRolesArray = new Array();
    var rolesOutputText = "";
    var query = "?$select=name,roleid";

    //Retrieve all Roles
    Xrm.WebApi.retrieveMultipleRecords("role", "?$select=name,roleid").then(
        function success(result){
            if(result.entities.length > 0){
                //Push Role Names and Role Ids to Array
                for(var rolesCount = 0; rolesCount < result.entities.length; rolesCount++){
                    totalSecurityRolesArray.push({RoleName: result.entities[roleCount].name, RoleId: result.entities[roleCount].roleid});
            }
        }
    });

    //Compare User Roles with All-Retrieved-Roles
    for(var scRolesCount = 0; scRolesCount < loggedInUserSecurityRolesGuidArray.length; scRolesCount++){
        for(var tscRolesCount =0; tscRolesCount < totalSecurityRolesArray.length; tscRolesCount++){
            if(totalSecurityRolesArray[tscRolesCount].RoleId.toLowerCase() == loggedInUserSecurityRolesGuidArray[scRolesCount]){
                rolesOutputText += totalSecurityRolesArray[tscRolesCount].RoleName + "\n";
            }
        }
    }

    //Alert Roles Name of user
    var alertStrings = { confirmButtonLabel: "OK", text: rolesOutputText };
    var alertOptions = { height: 200, width: 260 };
    Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
        function success(result) {
            console.log("Alert dialog closed");
        },
        function (error) {
            console.log(error.message);
        }
    );
}


    // var req = new XMLHttpRequest();
    // var fullURL = url + "/api/data/v9.0/roles?$select=name&$filter=roleid eq " + userRoleId;
    //     req.open("GET", fullURL, true);
    //     req.setRequestHeader("OData-MaxVersion", "4.0");
    //     req.setRequestHeader("OData-Version", "4.0");
    //     req.setRequestHeader("Accept", "application/json");
    //     req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    //     if(req.readyState == 4 && req.status == 200){
    //         var results = JSON.parse(req.response);
    //         alert(results);
    //         for (let i = 0; i < results.value.length; i++) {
    //             var name = results.value[i]["name"];
    //             alert(name);
    //         }
    //     }
    //     req.send();
    // }
    // if(loggedInUserSecurityRolesGuidArray.length > 0){
    //     Xrm.WebApi.retrieveMultipleRecords("roles", "?$select=name,roleid")
    //     .then(function success(result){
    //         if(result.entities.length > 0){
    //             //Push Role Names and Role Ids to Array
    //             for(var rolesCount = 0; rolesCount < result.entities.length; rolesCount++){
    //                 totalSecurityRolesArray.push({RoleName: result.entities[roleCount].name, RoleId: result.entities[roleCount].roleid});
    //             }

    //             rolesOutputText = userSettings.userName + "has the below Security Roles \n---------------\n";

    //             // //Compare the user security  roles with Total Security Roles
    //             // for(var userSecurityRolesCounter = 0; userSecurityRolesCounter < loggedInUsersecurityRolesGuidArray.length; userSecurityRolesCounter++){
    //             //     for(var totalsecurityRolesCounter = 0;  totalsecurityRolesCounter < totalSecurityRolesArray.length; totalsecurityRolesCounter++){
    //             //         if(totalSecurityRolesArray[totalsecurityRolesCounter].RoleId.toLowerCase() == loggedInUsersecurityRolesGuidArray[userSecurityRolesCounter].toLowerCase()){
    //             //             rolesOutputText += totalSecurityRolesArray[totalsecurityRolesCounter].RoleName + "\n";
    //             //             break;
    //             //         }
    //             //     }
    //             // }
    //         }
    //          // Show User Roles
    //          alert(rolesOutputText);
    //         Xrm.Utility.alertDialog(rolesOutputText, null);
    //     },
    //     function (error) {
    //         // Show error
    //         Xrm.Utility.alertDialog(error.message, null);
    //         }
    //     );
    // }

function OpenProcurementReason(typename, objectId, formId, workflowId){
    var data = { entity: typename, recordId: objectId, formId: formId, workflowId: workflowId}
    var windowOptions = { height: 550, width: 400 }
    Xrm.Navigation.openWebResource("new_ProcurementReasonForm", windowOptions, data);
}

function OpenProcurementReason(objectId){
    var data = objectId;
    var windowOptions = { height: 450, width: 400 }
    Xrm.Navigation.openWebResource("new_ProcurementReasonForm", windowOptions, data);
}

function OpenDialog(dialogId, entityName){
    var objectId = Xrm.Page.data.entity.getId()
    var url = Xrm.Page.context.getClientUrl() +
     "/cs/dialog/rundialog.aspx?DialogId=" + dialogId +
      "&EntityName=" + entityName + 
      "&ObjectId=" + objectId;
      var windowOptions = { height: 550, width: 500 }
      Xrm.Navigation.openUrl(url, windowOptions)
}

function GetRecordIdforProcurement(){
    var guidValue = Xrm.Page.data.entity.getId();
    guidValue =  guidValue.replace("{", "").replace("}", "");
    Xrm.Page.getAttribute("new_recordid").setValue(guidValue);
}


function CallPushProducts(datavalue){
    if (datavalue != "") {  
        var entity = { "EntityId": datavalue };
        console.log("URL after data split: "+ entity);
        var WorkflowId = "5828850C-4351-405B-91FB-64C129BBC056";
    
        var req = new XMLHttpRequest();
        req.open("POST", "https://reliancesandbox.crm4.dynamics.com" + "/api/data/v9.0/workflows(" + WorkflowId + ")/Microsoft.Dynamics.CRM.ExecuteWorkflow", true);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function() {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
        
                if (this.status == 200) {
                    AlertMsg("Success");
                } else {
                    AlertMsg("Error")   
                }
            }
        };
        req.send(JSON.stringify(entity));
    } 
}

function AlertMsg(message){
    var alertStrings = { confirmButtonLabel: "OK", text: message };
    var alertOptions = { height: 200, width: 260 };
    Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
        function success(result) {
            console.log("Alert dialog closed");
        },
        function (error) {
            console.log(error.message);
        }
    );
}

function GetSelectedMeansOfApproval(executionContext, source, target){
    var formContext = executionContext.getFormContext();
    var sourceField = formContext.getAttribute(source);
    var targetField = formContext.getAttribute(target);

    if(sourceField.getValue() != null){

        var sourceValue = sourceField.getValue();
        var deptText = sourceField.getText();
        var sourceLength = sourceValue.length;
        //alert("Length: "+ sourceLength)

        var result = "";
        var selectedOptions = [];
        for(var i=0; i < sourceLength; i++){
            selectedOptions.push(sourceValue[i]);
        }
        selectedOptions.sort();

        for(var j=0; j < selectedOptions.length; j++){
            result += selectedOptions[j];
        }

        if(targetField.getValue() != null){
            targetField.setValue(null);
        }
        targetField.setValue(result);  
    }
    else{
        if(targetField.getValue() != null){
            targetField.setValue(null);
        }
    }
}

function PaymentValueVisibility(executionContext, source){
    var formContext = executionContext.getFormContext();
    var sourceField = formContext.getAttribute(source);
    
    if(sourceField.getValue() != null){
        var sourceText = sourceField.getText();

        if(sourceText.includes("Payment")){
            //Make Payment Value Visible
            Xrm.Page.getControl("new_paymentvalue").setVisible(true)
        }
        else{
            //Make Payment Value invisible
            Xrm.Page.getControl("new_paymentvalue").setVisible(false)
        }
    }
    else{
         //Make Payment Value invisible
         Xrm.Page.getControl("new_paymentvalue").setVisible(false)
    }
}

function UpdateQuoteLine(executionContext, entity, source, query){
    //Get source id value
    var formContext = executionContext.getFormContext();
    var sourceField = formContext.getAttribute(source).getValue()[0].id;
    var sourceId = sourceField.replace("{", "").replace("}", "");
    var queryField = query;

    Xrm.WebApi.retrieveRecord(entity, sourceId, queryField).then(
        function success(result){
            console.log("Retrieved Value: Revenue Type ${result.new_revenuetype}, Revenue Cycle ${result.new_revenuecycle}");
        },
        function(error){
            console.log(error.message);
        }
    );
}
//# sourceURL=dynamicScript.js