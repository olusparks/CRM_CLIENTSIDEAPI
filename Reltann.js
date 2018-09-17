function UpdateOpportunityLineAmt(){
    var req = new XMLHttpRequest();
    var  url = Xrm.Page.context.getClientUrl();

    var exRate;
    var lineAmtEx = Xrm.Page.getAttribute("new_lineamount_ex");

    //Get Opportunity Id Value
    var oppid = Xrm.Page.getAttribute("opportunityid").getValue()[0].id;
    var reOppId = oppid.replace("{", "").replace("}", "");

    Xrm.WebApi.retrieveRecord("opportunity", reOppId, "?$select=new_exchangerate").then(
        function success(result){
            if(result != null || result != undefined){
                exRate = result.new_exchangerate;
                lineAmtEx.setValue(exRate);
            }
        }
    )
}

function CalculateTotalAmount(executionContext){
    var formContext = executionContext.getFormContext();
    var priceperunit = formContext.getAttribute("priceperunit").getValue();
    var quantity = formContext.getAttribute("quantity").getValue();
    if(priceperunit != null || priceperunit != undefined){
        //Get exchangerate
        var exRate = formContext.getAttribute("new_lineamount_ex").getValue();
        if(exRate != null || exRate != undefined){
            //Multiply exchange rate with priceperunit
            var amount = priceperunit * exRate;
            if(quantity != null || quantity != undefined){
                //Multiply amount by quantity
                var totalAmount = amount * quantity;
                //Set Total_With_ExchangeRate
                formContext.getAttribute("new_totalamount_ex").setValue(totalAmount);
            }
        }
    }
}

function onformLoad(executionContext){
    var formContext = executionContext.getFormContext();
    var priceperunit = formContext.getAttribute("priceperunit").getValue();
    var quantity = formContext.getAttribute("quantity").getValue();
    var exRate = formContext.getAttribute("new_lineamount_ex").getValue();

    if(priceperunit == null || priceperunit == undefined){
        return;
    }
    if(quantity != null || quantity != undefined){
        return;
    }
    if(exRate != null || exRate != undefined){
        return;
    }
}

//Using Xrm.WebApi
function RetrieveLineItems2(executionContext, entityName, filterValue, populateValue){
    var formContext = executionContext.getFormContext();

    var options = {}
    options.e_Name = entityName;
    options.f_value = filterValue;
    options.p_value = populateValue;

    var entID = Xrm.Page.data.entity.getId();
    var entIDStripped = entID.replace("{", "").replace("}", "");

    Xrm.WebApi.retrieveMultipleRecord(options.e_Name, "?$select=new_totalamount_ex&$filter="+options._value+" eq "+entIDStripped).then(
        function success(result){
            var totalAmount = 0;
            if(result != null || result != undefined){
                for (var i = 0; i < results.value.length; i++) {
                    var totalamount_ex = results.value[i]["new_totalamount_ex"];
                    totalAmount = totalAmount + totalamount_ex;
                }
                formContext.getAttribute(options.p_value).setValue(totalAmount);
            }
        }
    )
}

//Using XMLHttpRequest
function RetrieveLineItems(executionContext){
    var formContext = executionContext.getFormContext();

    var entID = Xrm.Page.data.entity.getId();
    var entIDStripped = entID.replace("{", "").replace("}", "");

    var req = new XMLHttpRequest();
    req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.0/opportunityproducts?$select=new_totalamount_ex&$filter=_opportunityid_value eq "+entIDStripped, true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
    req.onreadystatechange = function() {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var totalAmount = 0;
                var results = JSON.parse(this.response);
                for (var i = 0; i < results.value.length; i++) {
                    var totalamount_ex = results.value[i]["new_totalamount_ex"];
                    totalAmount = totalAmount + totalamount_ex;
                }
                formContext.getAttribute("new_totalamount_opp").setValue(totalAmount);
            } else {
                Xrm.Utility.alertDialog(this.statusText);
            }
        }
    };
    req.send();
}

function RetrieveLineItemsForOpp(){
    try {
        var gridCtx = Xrm.Page.getControl("Opportunity_Products");
       
        if(Xrm.Page != null && Xrm.Page != undefined && gridCtx != null && gridCtx != undefined) {
            _rowCount = gridCtx.getGrid().getTotalRecordCount();
            gridCtx.addOnLoad(onLineItemLoad);
        }
       
    } catch (error) {
        var alertStrings = { confirmButtonLabel: "OK", text: error.message };
        var alertOptions = { height: 240, width: 350 };
        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
            function (result){
                 console.log("Alert dialog closed");
            }, 
            function (error){
                console.log(error.message);
            }
        );
    }
}

function onLineItemLoad(executionContext){
    var currentRowCount = null;
    var totalAmount = 0.00;

    var formContext = executionContext.getFormContext();
    var gridContext = formContext.getControl("opp_prdgrid");
    try {
        //var gridContext = Xrm.Page.getControl("Opportunity_Products");
        if(gridContext == null || gridContext == undefined){
            setTimeout(function () { onLineItemLoad(); }, 3000); //if the grid hasn’t loaded run this again when it has 
            return;
        }
       
        currentRowCount = gridContext.getGrid().getTotalRecordCount();
        if(currentRowCount > 0){
            var allRows = gridContext.getGrid().getRows();

            for(var i = 0; i < currentRowCount; i++){
                    //get Cell Value == lLineAmount
                var attributes = allRows.get(i).getData().getEntity().getAttributes();
                var lineAmount = attributes.get("new_totalamount_ex").getValue();
                totalAmount = totalAmount + lineAmount;
            }
            formContext.getAttribute("new_totalamount_opp").setValue(totalAmount);
        }
    } catch (error) {
        var alertStrings = { confirmButtonLabel: "OK", text: error.message };
        var alertOptions = { height: 240, width: 350 };
        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
            function (result){
                 console.log("Alert dialog closed");
            }, 
            function (error){
                console.log(error.message);
            }
        );
        Xrm.Utility.alertDialog(functionName + "Error: " + (error.message || error.description));
    }
}

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

function GetSubGridCellValues() {
    if (document.getElementById("opp_prdgrid")) {
        var grid = document.getElementById("opp_prdgrid").control;
        var ids = gridControl.get_allRecordIds();
        for (i = 0; i < ids.length; i++) {
            alert(gridControl.getCellValue('new_totalamount_ex', ids[i]));
        }
    }
    else {
        setTimeout("GetSubGridCellValues();", 2500);
    }
}
//# sourceURL=dynamicScript.js
