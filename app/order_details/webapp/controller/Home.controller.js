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

        return Controller.extend("com.ibm.assessment.orderdetails.controller.Home", {
            onInit: function () {
            },
            onClickTile: function (oEvent, order_type, status) {
                console.log("Panel clicked!");
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("detail", {
                    order_type: order_type,
                    status: status
                });
            },
            onPressViewAll: function() {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("alert");
            },
            // onAfterRendering: function() {
            //     console.log("after rendering called", this.getOwnerComponent().getModel('mainModel'));
            //     // var oModel = this.getOwnerComponent().getModel('mainModel');
            //     // oModel.attachRequestCompleted(function() {
            //     //     console.log(oModel.getData());
            //     // });
            // },
        });
    });