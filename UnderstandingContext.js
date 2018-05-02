//Pass execution context always
function SetToday(executionContext){
    var formContext = executionContext.getFormContext();
    var today = new Date();
    today.setDate(today.getDate());
    formContext.getAttribute("new_today").setValue(today);
}

function CheckEstimatedCloseDate(context){
    var formContext = context.getFormContext();
    var estimatedCloseDate = formContext.getAttribute("estimatedclosedate").getValue();
    var today = formContext.getAttribute("new_today").getValue();



    if(today > estimatedCloseDate){
        //set optionset value to Missed Commitment
        formContext.getAttribute("new_commitmentlevel").setValue(4);

        //Increment missed Commitment count
        let missedCount = 0;
        var missedCommitmentCount = formContext.getAttribute("new_missedcommitmentcount").getValue();

        missedCount = missedCommitmentCount + 1;

        missedCommitmentCount.setValue(missedCount);
    }
}

function LoadForm(executionContext){
    OnEstimatedClosedDateChange(executionContext);
    Xrm.Page.getAttribute("estimatedclosedate").addOnChange(OnEstimatedClosedDateChange);
}


formContext.getAttribute("estimatedclosedate").addOnChange(OnEstimatedClosedDateChange);

//Using Form Context
Xrm.Page.getAttribute("estimatedclosedate").addOnChange(OnEstimatedClosedDateChange);
function OnEstimatedClosedDateChange(executionContext){
    var formContext = executionContext.getFormContext();

    var estimatedCloseDate = formContext.getAttribute("estimatedclosedate").getValue();
    var today = formContext.getAttribute("new_today").getValue();
        
    if(today > estimatedCloseDate){
        //set optionset value to Missed Commitment 
        formContext.getAttribute("new_commitmentlevel").setValue(4);

        //Increment missed Commitment count
        let missedCount = 0;
        var missedCommitmentCount = formContext.getAttribute("new_missedcommitmentcount").getValue();

        missedCount = missedCommitmentCount + 1;

        missedCommitmentCount.setValue(missedCount);
        console.log("Missed Count: "+missedCount);
    }
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

Xrm.Page.getAttribute("estimatedclosedate").addOnChange(display);
function display(){
    alert("Estimated Closed Date Changed");
}
//# sourceURL=dynamicScript.js