function CallWorkflow(szWorkflowName) {
    debugger
    var _url = Xrm.Page.context.getClientUrl();
    var _query = "/WorkflowSet?$select=WorkflowId&$filter=Name eq '" + szWorkflowName + "' and ActiveWorkflowId/Id ne null";
    var _odataurl = _url + "/XRMServices/2011/OrganizationData.svc" + _query;
    var _uReq = new XMLHttpRequest();
    _uReq.open("GET", _odataurl, false);
    _uReq.setRequestHeader("Accept", "application/json");
    _uReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    _uReq.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status === 200) {
                debugger
                var _json = JSON.parse(_uReq.responseText);
                var _res;
                if ((_json != undefined) && (_json.d != undefined) && (_json.d.results != undefined) && (_json.d.results[0] != null)) {
                    _res = _json.d.results[0];
                    var _wfid = _res.WorkflowId;
                    //test id
                    if (_wfid != null) {
                        //call runworkflow
                        RunWorkflow(_wfid);
                    } else {
                        alert("Error: Could Not Find Workflow by Name: " + szWorkflowName);
                    }
                }
            } else {
                alert("Problem getting Workflow Named: " + szWorkflowName);
            }
        }
    }
    _uReq.send();
}

function RunWorkflow(szWorkflowID) {
    var url = Xrm.Page.context.getClientUrl();
    var entityId = Xrm.Page.data.entity.getId();
    var workflowId = szWorkflowID;
    var OrgServicePath = "/XRMServices/2011/Organization.svc/web";
    url = url + OrgServicePath;
    var request;
    request = "<s:Envelope xmlns:s=\"schemas.xmlsoap.org/.../envelope\">" +
                "<s:Body>" +
                "<Execute xmlns=\"schemas.microsoft.com/.../Services\" xmlns:i=\"www.w3.org/.../XMLSchema-instance\">" +
                    "<request i:type=\"b:ExecuteWorkflowRequest\" xmlns:a=\"schemas.microsoft.com/.../Contracts\" xmlns:b=\"schemas.microsoft.com/.../Contracts\">" +
                    "<a:Parameters xmlns:c=\"schemas.datacontract.org/.../System.Collections.Generic\">" +
                        "<a:KeyValuePairOfstringanyType>" +
                        "<c:key>EntityId</c:key>" +
                        "<c:value i:type=\"d:guid\" xmlns:d=\"schemas.microsoft.com/.../Serialization\">" + entityId + "</c:value>" +
                        "</a:KeyValuePairOfstringanyType>" +
                        "<a:KeyValuePairOfstringanyType>" +
                        "<c:key>WorkflowId</c:key>" +
                        "<c:value i:type=\"d:guid\" xmlns:d=\"schemas.microsoft.com/.../Serialization\">" + workflowId + "</c:value>" +
                        "</a:KeyValuePairOfstringanyType>" +
                    "</a:Parameters>" +
                    "<a:RequestId i:nil=\"true\" />" +
                    "<a:RequestName>ExecuteWorkflow</a:RequestName>" +
                    "</request>" +
                "</Execute>" +
                "</s:Body>" +
            "</s:Envelope>";

    var req = new XMLHttpRequest();
    req.open("POST", url, true)
    // Responses will return XML. It isn't possible to return JSON.
    req.setRequestHeader("Accept", "application/xml, text/xml, */*");
    req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    req.setRequestHeader("SOAPAction", "schemas.microsoft.com/.../Execute");
    req.onreadystatechange = function () { assignResponse(req); };
    req.send(request);
}

function assignResponse(req) {
    if (req.readyState == 4) {
        if (req.status == 200) {
            //save and refresh - settimeout for any delay for workflow to run
            Xrm.Page.data.save();
            Xrm.Page.data.refresh();
        }
    }
}