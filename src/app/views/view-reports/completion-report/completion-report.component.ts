import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { locationDetails } from 'src/app/const/locations.const';
import { CompletionReportsModel } from 'src/app/models/location-reports.model';
import { SosCompletionReportModel } from 'src/app/models/year-end-inventory-models/sosCompletionReportModel';
import { URCompletionReportModel } from 'src/app/models/year-end-inventory-models/uRCompletionReportModel';
import { YearEndInventoryStoreState } from 'src/app/models/year-end-inventory-store-state.model';
import { YearEndInventoryStateService } from 'src/app/state/year-end-inventory-store.service';
import { getCompletionReportTotals } from 'src/app/utils/completion-reports.utils';
import { formatDate } from '@angular/common';
import * as Highcharts from 'highcharts';
import {
  SeriesClickEventObject,
  SeriesColumnOptions,
  XAxisOptions,
} from 'highcharts';
import { columnChartOptions } from 'src/app/const/columnChartOptions.const';

@Component({
  selector: 'app-completion-report',
  templateUrl: './completion-report.component.html',
  styleUrls: ['./completion-report.component.scss'],
})
export class CompletionReportComponent implements OnInit, OnDestroy {
  //highcharts variables
  chartOptions = JSON.parse(JSON.stringify(columnChartOptions));
  highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;

  //component variables
  completionData: CompletionReportsModel[] = [];
  isLoadingCompletionReport$ =
    this.yearEndInventoryService.isLoadingCompletionReport$;

  private sub = new Subscription();
  private sosCompletionReportData: SosCompletionReportModel[] = [];
  private urCompletionReportData: URCompletionReportModel[] = [];

  constructor(private yearEndInventoryService: YearEndInventoryStateService) {}

  ngOnInit(): void {
    this.sub.add(
      this.yearEndInventoryService.stateChanged
        .pipe()
        .subscribe((state: YearEndInventoryStoreState) => {
          this.isLoadingCompletionReport$.next(true);
          this.completionData = [];
          if (state.sosCompletionReport.length) {
            this.sosCompletionReportData = state.sosCompletionReport;
            this.urCompletionReportData = state.urCompletionReport;
            locationDetails.forEach((location) => {
              this.completionData.push(
                getCompletionReportTotals(
                  location.locationName,
                  this.sosCompletionReportData,
                  this.urCompletionReportData,
                ),
              );
            });
            this.initialChartSetup();
            this.isLoadingCompletionReport$.next(false);
          } else {
            this.yearEndInventoryService.completionReports();
          }
        }),
    );
  }

  refreshData() {
    this.yearEndInventoryService.completionReports();
  }

  private initialChartSetup() {
    this.setChartEvents();
    this.setChartCategories();
    this.setChartSeriesData(null);
    this.updateFlag = true;
  }

  private redrawChart() {
    const chart = Highcharts.chart('columnChart', this.chartOptions);
    chart.reflow();
  }

  private setChartEvents(): void {
    this.chartOptions.plotOptions.column.events = {
      click: this.getChartClick.bind(this),
    };
  }

  private getChartClick(event: SeriesClickEventObject): boolean {
    if ((<XAxisOptions>this.chartOptions.xAxis).categories.length === 1) {
      this.initialChartSetup();
      this.redrawChart();
      return false;
    }
    const clickedCategory = event.point.category.toString();
    this.setChartCategories([clickedCategory]); // Set only the clicked category
    this.setChartSeriesData(clickedCategory); // Load data for the clicked category
    this.redrawChart();
    return false;
  }

  private setChartCategories(setCategories?: string[]): void {
    const categories: string[] = setCategories
      ? setCategories
      : locationDetails.map((location) => location.locationName);
    (<XAxisOptions>this.chartOptions.xAxis).categories = categories;
  }

  private setChartSeriesData(clickedCategory: string): void {
    (<SeriesColumnOptions>this.chartOptions.series[0]).data = [];
    (<SeriesColumnOptions>this.chartOptions.series[1]).data = [];

    const clickedLocationData = this.completionData.find(
      (report) => report.locationName === clickedCategory,
    );
    const sosPercentageCompleted = this.completionData.map(
      (report) => report.sosPercentageCompleted,
    );
    const urPercentageCompleted = this.completionData.map(
      (report) => report.urPercentageCompleted,
    );

    if (clickedLocationData) {
      (<SeriesColumnOptions>this.chartOptions.series[0]).data.push(
        clickedLocationData.sosPercentageCompleted,
      );
      (<SeriesColumnOptions>this.chartOptions.series[1]).data.push(
        clickedLocationData.urPercentageCompleted,
      );
    } else {
      sosPercentageCompleted.forEach((item) => {
        (<SeriesColumnOptions>this.chartOptions.series[0]).data.push(item);
      });

      urPercentageCompleted.forEach((item) => {
        (<SeriesColumnOptions>this.chartOptions.series[1]).data.push(item);
      });
    }
  }

  ngOnDestroy(): void {
    // this.chartOptions = null;
    // this.sub.unsubscribe();
  }
}
