namespace app.dataModels;

entity SalesOrder {
  @title : 'Id'
  key id: String;
  @title : 'SalesOrderNumber'
  salesOrderNumber: String;
  @title : 'SalesOrderType'
  salesOrderType: String;
  @title : 'Company'
  company: String;
  @title : 'Status'
  status: String;
}

entity PurchaseOrder {
  @title : 'Id'
  key id: String;
  @title : 'PurchaseOrderNumber'
  purchaseOrderNumber: String;
  @title : 'PurchaseOrderType'
  purchaseOrderType: String;
  @title : 'Company'
  company: String;
  @title : 'Status'
  status: String;
}