function UpdateOpportunityLineAmt(){
    var req = new XMLHttpRequest();
    var  url = Xrm.Page.context.getClientUrl();

    var result;
    var _opportunityid_value, exRate;
    var lineAmtEx = Xrm.Page.getAttribute("new_lineamount_ex");

    //Get Opportunity Id Value
    var oppid = Xrm.Page.getAttribute("opportunityid").getValue()[0].id;
    var reOppId = oppid.replace("{", "").replace("}", "");

    Xrm.WebApi.retrieveRecord("opportunityproduct", reOppId, "?$select=quantity, name").then(
        function success(result){
            if(result != null || result != undefined){
                exRate = result.new_exchangerate;
                lineAmtEx.setValue(exRate);
            }
        }
    )
}
//# sourceURL=dynamicScript.js
