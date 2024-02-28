sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "jquery",
    "sap/ui/model/json/JSONModel",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, JSONModel) {
        "use strict";

        return Controller.extend("com.ibm.assessment.orderdetails.controller.Home", {
            onInit: function () {
                let oModel = this.getOwnerComponent().getModel()
                oModel.read('/SalesOrder', {
                    success: function(oData) {
                        console.log("Data from SalesOrder entity set:", oData);
                        let salesOrderCompletedData = oData.results.filter(function(item) {
                            return item.status === "Completed";
                        });
                        let salesOrderInprogressData = oData.results.filter(function(item) {
                            return item.status === "Inprogress";
                        });
                        let salesOrderBlockedData = oData.results.filter(function(item) {
                            return item.status === "Blocked";
                        });
                        let salesOrderData = {
                            completed: salesOrderCompletedData.length,
                            inProgress: salesOrderInprogressData.length,
                            blocked: salesOrderBlockedData.length
                        };
                        console.log("salesOrderData", salesOrderData);
                        let jsonModel = new JSONModel(salesOrderData);
                        this.getView().setModel(jsonModel, "salesOrderCount");

                    }.bind(this),
                    error: function(oError) {
                        console.error("Error reading data from SalesOrder entity set:", oError);
                    }.bind(this)
                });
                oModel.read('/PurchaseOrder', {
                    success: function(oData) {
                        console.log("Data from SalesOrder entity set:", oData);
                        this.purchaseOrder = oData.results
                        let purchaseOrderCompletedData = oData.results.filter(function(item) {
                            return item.status === "Completed";
                        });
                        let purchaseOrderInprogressData = oData.results.filter(function(item) {
                            return item.status === "Inprogress";
                        });
                        let purchaseOrderBlockedData = oData.results.filter(function(item) {
                            return item.status === "Blocked";
                        });
                        let purchaseOrderData = {
                            completed: purchaseOrderCompletedData.length,
                            inProgress: purchaseOrderInprogressData.length,
                            blocked: purchaseOrderBlockedData.length
                        };
                        let jsonModel = new JSONModel(purchaseOrderData);
                        this.getView().setModel(jsonModel, "purchaseOrderCount");
                    }.bind(this),
                    error: function(oError) {
                        console.error("Error reading data from SalesOrder entity set:", oError);
                    }.bind(this)
                });
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