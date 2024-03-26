import { SosCompletionReportModel } from './year-end-inventory-models/sosCompletionReportModel';
import { URCompletionReportModel } from './year-end-inventory-models/uRCompletionReportModel';

export interface YearEndInventoryStoreState {
  sosCompletionReport: SosCompletionReportModel[];
  urCompletionReport: URCompletionReportModel[];
}
