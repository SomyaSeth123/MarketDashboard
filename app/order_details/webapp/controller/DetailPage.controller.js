sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "jquery",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v4/ODataModel",
    // "../../../../srv/dataModel_srv",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageToast, ODataModel) {
        "use strict";
        return Controller.extend("com.ibm.assessment.orderdetails.controller.DetailPage", {
            onInit: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("detail").attachPatternMatched(this._onRouteMatched, this);
                this._oTable = this.byId("salesOrderTable");

                let oTabContainer = this.byId("detailpage_tab_cont");

                oTabContainer.attachItemSelect(this.onTabSelect, this);
            },

            _onRouteMatched: function (oEvent) {
                let oArguments = oEvent.getParameter("arguments");
                this.order_type = oArguments.order_type;
                this.status = oArguments.status;

                let oModel = new JSONModel();
                oModel.setProperty("/isSales", this.order_type === 'sales');
                this.getView().setModel(oModel, "viewModel");

                let oTable = ''
                let salesOrderTable = this.getView().byId("salesOrderTable");
                let purchaseOrderTable = this.getView().byId("purchaseOrderTable");

                if (this.order_type == 'sales') {
                    oTable = salesOrderTable
                }
                else {
                    oTable = purchaseOrderTable
                }
                let oTabContainer = this.byId("detailpage_tab_cont");

                let activeKey = this.status;
                let oBinding = oTable.getBinding("items");
                let oFilter;

                switch (activeKey) {
                    case "All":
                        oBinding.filter([]);
                        break;
                    case "Completed":
                        oFilter = new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "Completed");
                        oBinding.filter([oFilter]);
                        break;
                    case "Inprogress":
                        oFilter = new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "Inprogress");
                        oBinding.filter([oFilter]);
                        break;
                    case "Blocked":
                        oFilter = new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "Blocked");
                        oBinding.filter([oFilter]);
                        break;
                    default:
                        break;
                }
                var oTabItems = oTabContainer.getItems();

                for (var i = 0; i < oTabItems.length; i++) {
                    var oTabItem = oTabItems[i];
                    if (oTabItem.getKey() === activeKey) {
                        oTabContainer.setSelectedItem(oTabItem);
                        oTabItem.removeAllContent();
                        oTabItem.addContent(oTable);
                    } else {
                        oTabItem.removeAllContent();
                    }
                }
            },
            onAfterRendering: function() {
                console.log("on after rendering called", this.getOwnerComponent().getModel('mainModel'));
            },

            onTabSelect: function (oEvent) {
                let oTabItem = oEvent.getParameter("item");

                let activeKey = oTabItem.getKey();
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                if(this.order_type){
                    oRouter.navTo("detail", { order_type: this.order_type, status: activeKey });
                }
            },
            
            onHomePress: function() {
                // Navigate to the home page
                this.getOwnerComponent().getRouter().navTo("home");
            },

            createOrder: function () {
                var oDialog = this.getView().byId("createDialog");
                if (!oDialog) {
                    oDialog = new sap.ui.xmlfragment(this.getView().getId(), "MarketDashboard.DetailPage", this);
                    this.getView().addDependent(oDialog);
                }
                oDialog.open();
            },
            onCancel: function () {
                var oDialog = this.getView().byId("createDialog");
                if (!oDialog) {
                    oDialog = new sap.ui.xmlfragment(this.getView().getId(), "MarketDashboard.DetailPage", this);
                    this.getView().addDependent(oDialog);
                }
                oDialog.close();
            },
            onSubmit: function () {
                var inputValue1 = this.byId("input1").getValue();
                var inputValue2 = this.byId("input2").getValue();
                var inputValue3 = this.byId("input3").getValue();
                var inputValue4 = this.byId("input4").getValue();

                var csvRow = inputValue1 + "," + inputValue2 + "," + inputValue3 + "," + inputValue4 + "\n";

                const oList = this._oTable;
                const oBinding = oList.getBinding("items");
                const oContext = oBinding.create({
                    "id": this.byId("id_").getValue(),
                    "salesOrderNumber": this.byId("input1").getValue(),
                    "salesOrderType": this.byId("input2").getValue(),
                    "company": this.byId("input3").getValue(),
                    "status": this.byId("input4").getValue()
                });
                oContext.created()
                    .then(() => {
                        this.getView().byId("createDialog").close();
                        // dataModel_srv.createEntity('dataaaa','typee')
                    });
            },
            onDelete: function () {
                var oSelected = this.byId("salesOrderTable").getSelectedItem();
                if (oSelected) {
                    var oSalesOrder = oSelected.getBindingContext("mainModel").getObject().id;

                    oSelected.getBindingContext("mainModel").delete("$auto").then(function () {
                        // MessageToast.show(oSalesOrder + " SuccessFully Deleted");
                    }.bind(this),
                        function (oError) {
                            // MessageToast.show("Deletion Error: ",oError);
                        });
                } else {
                    // MessageToast.show("Please Select a Row to Delete");
                }

            },
        });
    });