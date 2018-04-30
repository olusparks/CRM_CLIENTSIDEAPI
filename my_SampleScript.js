
function globalVariable(executionContext){
    //Define global variables
    var myUniqueId = "_myUniqueId";
    var currentUserName = Xrm.Utility.getGlobalContext().userSettings.userName; //get current username
    var message = currentUserName +": Your Javascript code in action!";

    formOnLoad(executionContext, message, myUniqueId);
}


//OnLoad()
function formOnLoad (executionContext, message, myUniqueId){
    var formContext = executionContext.getFormContext();

    //display form level notification
    formContext.ui.setFormNotification(message, "INFO", myUniqueId);

    //Wait for 5 seconds before clearing the notification
    window.setTimeout(function(){
        formContext.ui.clearFormNotification(myUniqueId);
    }, 5000);
}

//OnChange()

function attributeOnChange (executionContext){
    var formContext = executionContext.getFormContext();

    //Automatically set some fields if the account contains "Contoso"
    var accountName = formContext.getAttribute("name").getValue();
    if(accountName.toLowerCase().search("contoso") != -1){
        formContext.getAttribute("websiteurl").setValue("http://www.contoso.com");
        formContext.getAttribute("telephone1").setValue("08138549501");
        formContext.getAttribute("description").setValue("Website URL, Phone and Description set using custom script");
    }
}

function formOnSave (executionContext){
    //Display an alert dialog
    Xrm.Navigation.opneAlertDialog({text: "Record saved"});
}


//# sourceURL=dynamicScript.js


