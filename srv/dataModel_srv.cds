using {Views} from '../db/views/views';

service CatalogService {
    @requires: 'SalesOrderAdmin'
    // @restrict: [{ grant: 'READ', to: 'SalesOrderViewer' }, {grant: '*', to: 'SalesOrderAdmin'}]
    entity SalesOrder as projection on Views.SalesOrderView;
    
    @requires: 'PurchaseOrderAdmin'
    // @restrict: [{ grant: 'READ', to: 'PurchaseOrderViewer' }, {grant: '*', to: 'PurchaseOrderAdmin'}]
    entity PurchaseOrder as projection on Views.PurchaseOrderView;
}