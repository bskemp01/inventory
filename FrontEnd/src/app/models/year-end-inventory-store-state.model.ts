import { SosTicketModel } from './year-end-inventory-models/sosTicketModel';
import { SosZmmModel } from './year-end-inventory-models/sosZmmModel';
import { UnrestrictedTicketModel } from './year-end-inventory-models/unrestrictedTicketModel';
import { UnrestrictedZmmModel } from './year-end-inventory-models/unrestrictedZmmModel';

export interface YearEndInventoryStoreState {
  lineItems: string[];
  saleOrderData: SosZmmModel[];
  searchedSalesOrder: SosTicketModel;
  searchedUnrestrictedTicket: UnrestrictedTicketModel;
  unrestrictedRowData: UnrestrictedZmmModel;
}
