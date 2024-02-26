sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "jquery"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent) {
        "use strict";

        return Controller.extend("com.ibm.assessment.orderdetails.controller.AlertPage", {
            onInit: function () {
            },
            onHomePress: function() {
                // Navigate to the home page
                this.getOwnerComponent().getRouter().navTo("home");
            },
        });
    });