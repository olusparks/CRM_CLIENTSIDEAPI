function startWorkflow(workflowProcessId) {
    var entityId = Xrm.Page.data.entity.getId();
    var request = "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
     "<s:Body>" +
       "<Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">" +
         "<request i:type=\"b:ExecuteWorkflowRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\" xmlns:b=\"http://schemas.microsoft.com/crm/2011/Contracts\">" +
           "<a:Parameters xmlns:c=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">" +
             "<a:KeyValuePairOfstringanyType>" +
               "<c:key>EntityId</c:key>" +
               "<c:value i:type=\"d:guid\" xmlns:d=\"http://schemas.microsoft.com/2003/10/Serialization/\">" + entityId + "</c:value>" +
             "</a:KeyValuePairOfstringanyType>" +
             "<a:KeyValuePairOfstringanyType>" +
               "<c:key>WorkflowId</c:key>" +
               "<c:value i:type=\"d:guid\" xmlns:d=\"http://schemas.microsoft.com/2003/10/Serialization/\">" + workflowProcessId + "</c:value>" +
             "</a:KeyValuePairOfstringanyType>" +
           "</a:Parameters>" +
           "<a:RequestId i:nil=\"true\" />" +
           "<a:RequestName>ExecuteWorkflow</a:RequestName>" +
         "</request>" +
       "</Execute>" +
     "</s:Body>" +
   "</s:Envelope>";
   
    var requestURL = Xrm.Page.context.getClientUrl() + "/XRMServices/2011/Organization.svc/web";
    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open("POST", requestURL, false)
    xmlHttpRequest.setRequestHeader("Accept", "application/xml, text/xml, */*");
    xmlHttpRequest.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    xmlHttpRequest.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
    xmlHttpRequest.onreadystatechange = function () { assignResponse(xmlHttpRequest); };
    xmlHttpRequest.send(request);
  }

  function assignResponse(xmlHttpRequest) {
    if (xmlHttpRequest.readyState == 4) {
        if (xmlHttpRequest.status == 200) {
            //save and refresh - settimeout for any delay for workflow to run
            alert("Successfully executed workflow");
            Xrm.Page.data.save();
            Xrm.Page.data.refresh();
        }
    }
}