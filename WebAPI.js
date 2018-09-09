//retrieve data based on primary entity id
function retrieveAccountDetails() {
  //read lookup value
  if (Xrm.Page.getAttribute("parentcustomerid").getValue() != null && Xrm.Page.getAttribute("parentcustomerid").getValue()[0].id != null) {
    var accountid = Xrm.Page.getAttribute("parentcustomerid").getValue()[0].id;
 
    //pass entity, fields, we can use expand to get related entity fields
    Xrm.WebApi.retrieveRecord("account", accountid, "?$select=telephone1,new_verificationrequired,new_activationdate,address1_shippingmethodcode&$expand=parentaccountid($select=accountid,name)").then(
      function success(result) {
        if (result != null) {
          //set text field
          if (result.telephone1 != null)
            Xrm.Page.getAttribute("telephone1").setValue(result.telephone1);
          //set lookup field
          if (result.parentaccountid != null) {
            var object = new Array();
            object[0] = new Object();
            object[0].id = result.parentaccountid.id;
            object[0].name = result.parentaccountid.name;
            object[0].entityType = "account";
            Xrm.Page.getAttribute("new_parentaccount").setValue(object);
          }
          //set two optionset
          if (result.new_verificationrequired != null)
            Xrm.Page.getAttribute("new_verificationrequired").setValue(result.new_verificationrequired);
          //set date field
          if (result.new_activationdate != null)
            Xrm.Page.getAttribute("new_activationdate").setValue(new Date(result["new_activationdate@OData.Community.Display.V1.FormattedValue"]));
          //set optionset field
          if (result.address1_shippingmethodcode != null)
            Xrm.Page.getAttribute("address1_shippingmethodcode").setValue(result.address1_shippingmethodcode);
        }
      },
      function(error) {
        alert(error.message);
 
      }
    );
  }
}