function onLoad() {

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

        }, 5000);

    } catch (e) {

        Xrm.Utility.alertDialog(functionName + "Error: " + (e.message || e.description));

    }

}

function onGridLoad() {

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

                    //set current row count to the global row count

                    //_rowCount = currentRowCount;

                }

                else if (currentRowCount <= _rowCount) {

                    //call the intended function which we want to call only when records are removed from the grid

                    var alertStrings = { confirmButtonLabel: "OK", text: "Please add at least one internal stakeholder." };
                    var alertOptions = { height: 120, width: 260 };
                    Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                        function (result){
                            console.log("Alert dialog closed");
                        }, 
                        function (error){
                            console.log(error.message);
                        }
                    );

                    //set current row count to the global row count

                    //_rowCount = currentRowCount;

                }

            }

        }, 2000);

    } catch (e) {

        Xrm.Utility.alertDialog(functionName + "Error: " + (e.message || e.description));

    }

}