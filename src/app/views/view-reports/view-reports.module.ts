import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewReportsComponent } from './view-reports/view-reports.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LoadingModule } from '../loading/loading.module';
import {MatTableModule} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { CompletionReportComponent } from './completion-report/completion-report.component';
import { LocationReportComponent } from './location-report/location-report.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AgChartsAngular } from 'ag-charts-angular';
import { HighchartsChartModule } from 'highcharts-angular';

const routes: Routes = [
  {
    path: '',
    component: CompletionReportComponent,
  },
  {
    path: 'admin/completionReport',
    component: CompletionReportComponent,
  },
  {
    path: 'admin/locationReport',
    component: LocationReportComponent,
  },
];

@NgModule({
  declarations: [ViewReportsComponent, CompletionReportComponent, LocationReportComponent],
  imports: [
    CommonModule,
    AgGridModule,
    AgGridAngular,
    AgChartsAngular,
    FormsModule,
    HighchartsChartModule,
    LeafletModule,
    LoadingModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),],
})
export class ViewReportsModule {}
