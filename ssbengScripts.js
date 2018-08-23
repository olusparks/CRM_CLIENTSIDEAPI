function OpenProcurementForm(){
    var windowOptions = {
        openInNewWindow: true
       };
    var paramters = {};
    Xrm.Utility.openEntityForm("rel_procurement", null, null, windowOptions);
}


"https://sbsengg.crm4.dynamics.com/main.aspx?etn=rel_procurement&pagetype=entityrecord";

function ChangeToSentForApproval(){
    var status = Xrm.Page.getAttribute("statuscode").getValue();
    if(status == 100000000 || status == 100000002){
        alert(100000000);
        Xrm.Page.getAttribute("statuscode").setValue(100000001); //Sent Approval
        Xrm.Page.data.entity.save();
    }
}

function ChangeToApproved(){
    var status = Xrm.Page.getAttribute("statuscode").getValue();
    if(status == 100000001){
        alert(100000001);
        Xrm.Page.getAttribute("statuscode").setValue(1); //Approved
        Xrm.Page.data.entity.save();
    }
}

function ChangeToRejected(){
    var status = Xrm.Page.getAttribute("statuscode").getValue();
    if(status == 100000001){
        alert(100000001);
        Xrm.Page.getAttribute("statuscode").setValue(100000002); //Rejected
        Xrm.Page.data.entity.save();
    }

    alert("Status after saving: "+ status);
    status = Xrm.Page.getAttribute("statuscode").getValue();
    alert("Query status again: "+ status);

    //Call IncrementRejection 
     IncrementRejectionID(status);
}


//Button Transition
function UnapprovedStatus(){
    var formType = Xrm.Page.ui.getFormType();
    var status = Xrm.Page.getAttribute("statuscode").getValue();

    //Update FormType and Unapproved
    if(formType == 2 && status == 100000000){
        return true;
    }
    else{
        return false;
    }
}

function SentForApprovalStatus(){
    var status = Xrm.Page.getAttribute("statuscode").getValue();

    if(status == 100000001){
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

    if(status == 100000002){
        return true;
    }
    else{
        return false;
    }
}

//Increment RejectionID
function IncrementRejectionID(status){
    let rejectionCount = 0;
    var statusValue = Xrm.Page.getAttribute("statuscode").getValue();

    alert("Status Value: "+statusValue);

    if(statusValue == status){
        var reject = Xrm.Page.getAttribute("new_rejectionid")
        var rejectValue = reject.getValue();

        alert("Reject Value: "+rejectValue);

        if(rejectValue == null || rejectValue == undefined){
            rejectValue = 0;
        }
        rejectionCount = rejectValue + 1;
        
        alert("Count: "+ rejectionCount);
        //Set RejectionID
        reject.setValue(rejectionCount);

        Xrm.Page.data.entity.save();
    }
}
//# sourceURL=dynamicScript.js