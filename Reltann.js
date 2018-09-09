function UpdateOpportunityLineAmt(){
    var req = new XMLHttpRequest();
    var  url = Xrm.Page.context.getClientUrl();

    var _opportunityid_value, exRate;
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


function CheckDataInGrid(executionContext){
    var formContext = executionContext.getFormContext();
    var gridContext = formContext.getControl("Pursuit_Team");
    var filteredRecordCount = gridContext.getGrid().getTotalRecordCount();

    var internalStakeholderOnLoad = function(){
        if(filteredRecordCount != null || filteredRecordCount != undefined){
            if(filteredRecordCount > 0){
                //Enable the Customer Need field
                formContext.getAttribute("customerneed").setRequiredLevel("required");
                formContext.ui.controls.get("customerneed").setDisabled(false);
            }
        }
        else{
            var alertStrings = { confirmButtonLabel: "OK", text: "Please add at least one internal stakeholder." };
            var alertOptions = { height: 120, width: 260 };
            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                function (result){
                    console.log("Alert dialog closed");
                }, 
                function (error){
                    console.log(error.message);
                });
        }
    }
    gridContext.addOnLoad(internalStakeholderOnLoad);
}

//# sourceURL=dynamicScript.js
