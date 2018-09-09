function UpdateOpportunityLineAmt(){
    var req = new XMLHttpRequest();
    var  url = Xrm.Page.context.getClientUrl();

    var result;
    var _opportunityid_value, exRate;
    var lineAmtEx = Xrm.Page.getAttribute("new_lineamount_ex");

    //Get Opportunity Id Value
    var oppid = Xrm.Page.getAttribute("opportunityid").getValue()[0].id;
    var reOppId = oppid.replace("{", "").replace("}", "");

    if(oppid != null){
        var fullURL = url + "/api/data/v9.0/opportunities("+reOppId+")?$select=new_exchangerate";
        req.open("GET", fullURL, true);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    
        req.onreadystatechange = function() {
            if(this.readyState == 4){
                if(this.status == 200){
                    result = JSON.parse(this.responseText);
                    exRate = result.new_exchangerate;
                    lineAmtEx.setValue(exRate);
                }
            }
        };
        req.send();
    }
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


function CheckDataInGrid(executionContext){
    //var formContext = executionContext.getFormContext();
    //var gridContext = formContext.getControl("Pursuit_Team");
    var grid = Xrm.Page.getControl("Pursuit_Team");
    var filteredRecordCount = grid.getGrid().getTotalRecordCount();

    var internalStakeholderOnLoad = function(){
        if(filteredRecordCount != null || filteredRecordCount != undefined){
            if(filteredRecordCount > 0){
                //Enable the Customer Need field
                Xrm.Page.getAttribute("customerneed").setRequiredLevel("required");
                Xrm.Page.ui.controls.get("customerneed").setDisabled(false);
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
    grid.addOnLoad(internalStakeholderOnLoad);
}

//# sourceURL=dynamicScript.js
