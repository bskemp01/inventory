import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { YearEndInventoryStateService } from 'src/app/state/year-end-inventory-store.service';
import { ReportsSelectionComponent } from '../dialog-boxes/reports-selection/reports-selection.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  constructor(private dialog: MatDialog) {}

  openReportsSelection() {
    this.dialog.open(ReportsSelectionComponent, {
      disableClose: true,
      id: 'ReportsSelectionDialog',
      width: '625px',
    });
  }
}
