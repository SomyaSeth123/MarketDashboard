using {Views} from '../db/views/views';

service CatalogService {
    @requires: 'SalesOrderAdmin'
    @restrict: [{ grant: 'READ', to: 'SalesOrderViewer' }]
    entity SalesOrder as projection on Views.SalesOrderView;
    
    @requires: 'PurchaseOrderAdmin'
    @restrict: [{ grant: 'READ', to: 'PurchaseOrderViewer' }]
    entity PurchaseOrder as projection on Views.PurchaseOrderView;
}