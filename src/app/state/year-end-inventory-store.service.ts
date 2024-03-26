import { Injectable } from '@angular/core';
import { YearEndInventoryStoreState } from '../models/year-end-inventory-store-state.model';
import { ObservableStore } from '@codewithdan/observable-store';
import { BehaviorSubject, EMPTY, Observable, catchError, forkJoin, of } from 'rxjs';
import { sosMockInventoryData } from '../const/mockSosData.const';
import { mockURInventoryData } from '../const/mockURData.const';

const enum YearEndInventoryStates {
  INIT_STATE = 'INIT_STATE',
  COMPLETION_REPORTS_UPDATED = 'COMPLETION_REPORTS_UPDATED',
  LINE_ITEMS_UPDATED = 'LINE_ITEMS_UPDATED',
  REPORT_DATA_UPDATED = 'REPORT_DATA_UPDATED',
  SALES_ORDER_DATA_UPDATED = 'SALES_ORDER_DATA_UPDATED',
  SEARCHED_SALES_ORDER_UPDATED = 'SEARCHED_SALES_ORDER_UPDATED',
  SEARCHED_UNRESTRICTED_TICKET_UPDATED = 'SEARCHED_UNRESTRICTED_TICKET_UPDATED',
  SOS_TICKET_ADDED = 'SOS_TICKET_ADDED',
  SOS_TICKET_UPDATED = 'SOS_TICKET_UPDATED',
  STATE_RESET = 'STATE_RESET',
  UNRESTRICTED_ROW_DATA_UPDATED = 'UNRESTRICTED_ROW_DATA_UPDATED',
  UNRESTRICTED_TICKET_ADDED = 'UNRESTRICTED_TICKET_ADDED',
}

const initState: YearEndInventoryStoreState = {
  sosCompletionReport: [],
  urCompletionReport: [],
};

@Injectable({
  providedIn: 'root',
})
export class YearEndInventoryStateService extends ObservableStore<YearEndInventoryStoreState> {
  isLoading$ = new BehaviorSubject<boolean>(false);
  isLoadingCompletionReport$ = new BehaviorSubject<boolean>(false);

  constructor() {
    super({
      stateSliceSelector: (state: YearEndInventoryStoreState) => {
        if (!state) return initState;
        return {
          sosCompletionReport: state.sosCompletionReport,
          urCompletionReport: state.urCompletionReport,
        };
      },
    });
    this.setState(initState, YearEndInventoryStates.INIT_STATE);
  }

  sosCompletionReport(): Observable<any> {
    return of(sosMockInventoryData);
  }

  urCompletionReport(): Observable<any> {
    return of(mockURInventoryData);
  }

  completionReports() {
    this.isLoadingCompletionReport$.next(true);
    forkJoin([
      // this.api.sosCompletionReport().pipe(
      //   catchError((err) => {
      //     this.setError(
      //       errorMessages.errorMessages.reportError,
      //       errorMessages.errorMessages.reportErrorMsg,
      //       err || '',
      //     );
      //     return EMPTY;
      //   }),
      // ),
      // this.api.urCompletionReport().pipe(
      //   catchError((err) => {
      //     this.setError(
      //       errorMessages.errorMessages.reportError,
      //       errorMessages.errorMessages.reportErrorMsg,
      //       err || '',
      //     );
      //     return EMPTY;
      //   }),
      // ),
        this.sosCompletionReport().pipe(
          catchError((err) => {
            // Handle errors if any
            return EMPTY;
          })
        ),
        this.urCompletionReport().pipe(
          catchError((err) => {
            // Handle errors if any
            return EMPTY;
          })
        )
    ]).subscribe(([sosReport, urReport]) => {
      const st = this.getState();
      st.sosCompletionReport = sosReport;
      st.urCompletionReport = urReport;
      this.setState(st, YearEndInventoryStates.COMPLETION_REPORTS_UPDATED);
      this.isLoadingCompletionReport$.next(false);
    });
  }

}
