namespace Views;

using {app.dataModels as db} from '../dataModels';

view SalesOrderView as select from db.SalesOrder;
view PurchaseOrderView as select from db.PurchaseOrder;