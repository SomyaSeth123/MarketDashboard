sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "jquery",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/ColumnListItem",
    "sap/m/Input",
    "sap/m/Text",
    "sap/base/util/deepExtend",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageToast, ODataModel, ColumnListItem, Input, Text, deepExtend) {
        "use strict";
        return Controller.extend("com.ibm.assessment.orderdetails.controller.DetailPage", {
            aEditedData: [],
            onInit: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("detail").attachPatternMatched(this._onRouteMatched, this);

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
                const orderModel = this.getOwnerComponent().getModel();
                let oTabContainer = this.byId("detailpage_tab_cont");
                this.oTabContainer = oTabContainer
                let activeKey = this.status;

                if (this.order_type == 'sales') {
                    oTable = salesOrderTable
                    this.oTable = salesOrderTable

                    orderModel.read('/SalesOrder', {
                        success: function (oData) {
                            console.log("Data from SalesOrder entity set:", oData);
                            this.filterData(oData.results, activeKey, oTable, oTabContainer)

                        }.bind(this),
                        error: function (oError) {
                            console.error("Error reading data from SalesOrder entity set:", oError);
                        }.bind(this)
                    });
                }
                else {
                    oTable = purchaseOrderTable
                    this.oTable = purchaseOrderTable

                    orderModel.read('/PurchaseOrder', {
                        success: function (oData) {
                            console.log("Data from Purchase Order entity set:", oData);
                            this.filterData(oData.results, activeKey, oTable, oTabContainer)
                        }.bind(this),
                        error: function (oError) {
                            console.error("Error reading data from purchase order entity set:", oError);
                        }.bind(this)
                    });
                }
            },

            filterData: function (data, activeKey, oTable, oTabContainer) {
                let filteredData;
                switch (activeKey) {
                    case "All":
                        this.getView().setModel(new JSONModel(data), "filteredOrder");
                        break;
                    case "Completed":
                        filteredData = data.filter(function (item) {
                            return item.status === "Completed";
                        });

                        this.getView().setModel(new JSONModel(filteredData), "filteredOrder");
                        break;
                    case "Inprogress":
                        filteredData = data.filter(function (item) {
                            return item.status === "Inprogress";
                        });

                        this.getView().setModel(new JSONModel(filteredData), "filteredOrder");
                        break;
                    case "Blocked":
                        filteredData = data.filter(function (item) {
                            return item.status === "Blocked";
                        });

                        this.getView().setModel(new JSONModel(filteredData), "filteredOrder");
                        break;
                    default:
                        break;
                }

                console.log('filteredData', filteredData);

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

                if (this.order_type == 'sales') {
                    this.oReadOnlyTemplate = new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Text({
                                text: "{filteredOrder>id}"
                            }),
                            new sap.m.Text({
                                text: "{filteredOrder>salesOrderNumber}"
                            }),
                            new sap.m.Text({
                                text: "{filteredOrder>salesOrderType}"
                            }),
                            new sap.m.Text({
                                text: "{filteredOrder>company}"
                            }),
                            new sap.m.Text({
                                text: "{filteredOrder>status}"
                            })
                        ]
                    })
                }
                else {
                    this.oReadOnlyTemplate = new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Text({
                                text: "{filteredOrder>id}"
                            }),
                            new sap.m.Text({
                                text: "{filteredOrder>purchaseOrderNumber}"
                            }),
                            new sap.m.Text({
                                text: "{filteredOrder>purchaseOrderType}"
                            }),
                            new sap.m.Text({
                                text: "{filteredOrder>company}"
                            }),
                            new sap.m.Text({
                                text: "{filteredOrder>status}"
                            })
                        ]
                    })
                }
                this.rebindTable(this.oReadOnlyTemplate, "Navigation")
            },

            rebindTable: function (oTemplate, sKeyboardMode) {
                if (!this.oTable) {
                    return;
                }
                this.oTable.bindItems({
                    path: "filteredOrder>/",
                    template: oTemplate,
                    templateShareable: true,
                    key: "id"
                });
            },

            onEdit: function () {
                this.byId("edit_btn").setVisible(false);
                this.byId("save_btn").setVisible(true);
                this.byId("cancel_btn").setVisible(true);
                this.byId("delete_btn").setEnabled(false);
                this.byId("create_btn").setEnabled(false);
                if (this.order_type == 'sales') {
                    this.oEditableTemplate = new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Text({
                                text: "{filteredOrder>id}",
                            }),
                            new sap.m.Input({
                                value: "{filteredOrder>salesOrderNumber}",
                                liveChange: this.onChange.bind(this)
                            }),
                            new sap.m.Input({
                                value: "{filteredOrder>salesOrderType}",
                                liveChange: this.onChange.bind(this)
                            }),
                            new sap.m.Input({
                                value: "{filteredOrder>company}",
                                liveChange: this.onChange.bind(this)
                            }),
                            new sap.m.Input({
                                value: "{filteredOrder>status}",
                                liveChange: this.onChange.bind(this)
                            })
                        ]
                    });
                }
                else {
                    this.oEditableTemplate = new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Text({
                                text: "{filteredOrder>id}",
                            }),
                            new sap.m.Input({
                                value: "{filteredOrder>purchaseOrderNumber}",
                                liveChange: this.onChange.bind(this)
                            }),
                            new sap.m.Input({
                                value: "{filteredOrder>purchaseOrderType}",
                                liveChange: this.onChange.bind(this)
                            }),
                            new sap.m.Input({
                                value: "{filteredOrder>company}",
                                liveChange: this.onChange.bind(this)
                            }),
                            new sap.m.Input({
                                value: "{filteredOrder>status}",
                                liveChange: this.onChange.bind(this)
                            })
                        ]
                    });
                }
                this.rebindTable(this.oEditableTemplate, "Edit");
            },

            onChange: function (oEvent) {
                let oInput = oEvent.getSource();
                let oBindingContext = oInput.getBindingContext('filteredOrder');
                let oData = oBindingContext.getObject();

                oData[oInput.getBindingInfo("value").binding.getPath()] = oEvent.getParameter("value");
                let iIndex = this.aEditedData.findIndex(function (item) {
                    return item.id === oData.id;
                });

                if (iIndex === -1) {
                    this.aEditedData.push(oData);
                } else {
                    this.aEditedData[iIndex] = oData;
                }
            },

            onSave: function () {
                this.byId("save_btn").setVisible(false);
                this.byId("cancel_btn").setVisible(false);
                this.byId("edit_btn").setVisible(true);
                this.byId("create_btn").setEnabled(true);
                this.byId("delete_btn").setEnabled(false);
                let that = this
                this.aEditedData.forEach(function (oEditedItem) {
                    let oModel = that.getOwnerComponent().getModel()
                    let entityType = ''
                    if (that.order_type == 'sales') {
                        entityType = 'SalesOrder'
                    }
                    else {
                        entityType = 'PurchaseOrder'
                    }
                    oModel.update("/" + entityType + "('" + oEditedItem.id + "')", oEditedItem, {
                        success: function () {
                        },
                        error: function () {
                        }
                    });
                });

                this.aEditedData = [];
                this.rebindTable(this.oReadOnlyTemplate, "Navigation");
            },

            onCancel: function () {
                this.byId("cancel_btn").setVisible(false);
                this.byId("save_btn").setVisible(false);
                this.byId("edit_btn").setVisible(true);
                this.byId("delete_btn").setEnabled(false);
                this.byId("create_btn").setEnabled(true);
                this.rebindTable(this.oReadOnlyTemplate, "Navigation");

                let entityType = ''
                if (this.order_type == 'sales') {
                    entityType = 'SalesOrder'
                }
                else {
                    entityType = 'PurchaseOrder'
                }
                let oModel = this.getOwnerComponent().getModel()
                oModel.read('/' + entityType, {
                    success: function (oData) {
                        this.filterData(oData.results, this.status, this.oTable, this.oTabContainer)
                    }.bind(this),
                    error: function (oError) {
                        console.error("Error reading data from SalesOrder entity set:", oError);
                    }.bind(this)
                });
            },

            onExit: function () {
                this.oEditableTemplate.destroy();
            },

            onTabSelect: function (oEvent) {
                let oTabItem = oEvent.getParameter("item");

                let activeKey = oTabItem.getKey();
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                if (this.order_type) {
                    oRouter.navTo("detail", { order_type: this.order_type, status: activeKey });
                }
            },

            onPressHome: function () {
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

            onDelete: function () {
                this.allSelectedItems.forEach(function (selectedItem) {
                    let oBindingContext = selectedItem.getBindingContext("filteredOrder");
                    if (oBindingContext) {
                        let oData = oBindingContext.getObject();
                        let sId = oData.id;

                        let orderModel = this.getOwnerComponent().getModel()
                        let entityType = ''
                        if (this.order_type == 'sales') {
                            entityType = 'SalesOrder'
                        }
                        else {
                            entityType = 'PurchaseOrder'
                        }
                        orderModel.remove("/" + entityType + "('" + sId + "')", {
                            success: function () {
                                console.log("Successfully deleted", sId);
                                this.byId('create_btn').setEnabled(true)
                                this.byId('delete_btn').setEnabled(false)
                            }.bind(this),
                            error: function (error) {
                                console.error("Error while deleting", error);
                            }.bind(this)
                        });
                        orderModel.read('/' + entityType, {
                            success: function (oData) {
                                this.filterData(oData.results, this.status, this.oTable, this.oTabContainer)

                            }.bind(this),
                            error: function (oError) {
                                console.error("Error reading data from SalesOrder entity set:", oError);
                            }.bind(this)
                        });
                    }
                }.bind(this));

                this.rebindTable(this.oReadOnlyTemplate, "Navigation");
                this.byId('edit_btn').setEnabled(true)
            },

            onSubmit: function () {
                let id = this.byId("id_").getValue()
                let orderNumber = this.byId("input1").getValue()
                let orderType = this.byId("input2").getValue()
                let company = this.byId("input3").getValue()
                let status = this.byId("input4").getValue()
                let data = {
                    "id": id,
                    "company": company,
                    "status": status
                }
                let entityType = ''
                if (this.order_type == 'sales') {
                    entityType = 'SalesOrder'
                    data["salesOrderNumber"] = orderNumber,
                    data["salesOrderType"] = orderType
                }
                else {
                    entityType = 'PurchaseOrder'
                    data["purchaseOrderNumber"] = orderNumber,
                    data["purchaseOrderType"] = orderType
                }
                let oModel = this.getOwnerComponent().getModel()

                let oRegExp = /^[a-zA-Z0-9\s]*$/;

                if (!oRegExp.test(id) || !oRegExp.test(orderNumber) || !oRegExp.test(orderType) || !oRegExp.test(company) || !oRegExp.test(status)) {
                    sap.m.MessageToast.show("Please correct the input field before submitting.");
                } else {
                    oModel.create('/' + entityType, data, {
                        success: function (oData) {
                            console.log("after creating entry in SalesOrder", oData);
                            this.getView().byId("createDialog").close();
                        }.bind(this),
                        error: function (oError) {
                            console.log("error occured while creating entry in SalesOrder", oError);
                        }.bind(this)
                    })
                    oModel.read('/' + entityType, {
                        success: function (oData) {
                            this.filterData(oData.results, this.status, this.oTable, this.oTabContainer)
                        }.bind(this),
                        error: function (oError) {
                            console.error("Error reading data from SalesOrder entity set:", oError);
                        }.bind(this)
                    });
                    this.byId("id_").setValue(null),
                    this.byId("input1").setValue(null),
                    this.byId("input2").setValue(null)
                    this.byId("input3").setValue(null)
                    this.byId("input4").setValue(null)
                }

            },

            onSelectionChange: function (oEvent) {
                let oTable = oEvent.getSource();
                this.allSelectedItems = oTable.getSelectedItems();

                if (this.allSelectedItems.length >= 1) {
                    this.byId('create_btn').setEnabled(false)
                    this.byId('edit_btn').setEnabled(false)
                    this.byId('save_btn').setVisible(false)
                    this.byId('cancel_btn').setVisible(false)
                    this.byId('delete_btn').setEnabled(true)
                }
                else {
                    this.byId('create_btn').setEnabled(true)
                    this.byId('edit_btn').setVisible(true)
                    this.byId('edit_btn').setEnabled(true)
                    this.byId('delete_btn').setEnabled(false)
                    this.byId('save_btn').setVisible(false)
                    this.byId('cancel_btn').setVisible(false)
                }
            },

            cancelDialog: function () {
                var oDialog = this.getView().byId("createDialog");
                oDialog.close();
                this.byId("id_").setValue(null),
                    this.byId("input1").setValue(null),
                    this.byId("input2").setValue(null)
                this.byId("input3").setValue(null)
                this.byId("input4").setValue(null)
            },

            onInputChange: function (oEvent) {
                let oInput = oEvent.getSource();
                let sValue = oInput.getValue();
                let oRegExp = /^[a-zA-Z0-9\s]*$/;

                if (!oRegExp.test(sValue)) {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Special characters are not allowed.");
                } else {
                    oInput.setValueState("None");
                    oInput.setValueStateText("");
                }
            },
        });
    });