import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  PlantLocations,
  StorageLocations,
} from 'src/app/const/locations.const';
import { UnrestrictedModel } from 'src/app/models/forms.model';
import { UnrestrictedTicketModel } from 'src/app/models/year-end-inventory-models/unrestrictedTicketModel';
import { UnrestrictedZmmModel } from 'src/app/models/year-end-inventory-models/unrestrictedZmmModel';
import { YearEndInventoryStoreState } from 'src/app/models/year-end-inventory-store-state.model';
import { YearEndInventoryStateService } from 'src/app/state/year-end-inventory-store.service';
import { SearchUnrestrictedTicketDialogComponent } from '../../dialog-boxes/search-unrestricted-ticket-dialog/search-unrestricted-ticket-dialog.component';

@Component({
  selector: 'app-unrestricted',
  templateUrl: './unrestricted.component.html',
  styleUrls: ['./unrestricted.component.scss'],
})
export class UnrestrictedComponent implements OnInit {
  plantLocations = PlantLocations;
  storageLocations = StorageLocations;
  updateTicket = false;
  unrestrictedRowData!: UnrestrictedZmmModel;
  unrestrictedTicket!: UnrestrictedTicketModel;

  unrestrictedForm!: FormGroup<UnrestrictedModel>;

  constructor(
    private dialog: MatDialog,
    private el: ElementRef,
    private yearEndInventoryService: YearEndInventoryStateService,
  ) {
    this.unrestrictedForm = new FormGroup<UnrestrictedModel>({
      plantLocation: new FormControl('', Validators.required),
      storageLocation: new FormControl('', Validators.required),
      areaLocation: new FormControl(
        { value: null, disabled: true },
        Validators.required,
      ),
      ticketNumber: new FormControl(
        { value: null, disabled: true },
        Validators.required,
      ),
      partNumber: new FormControl(
        { value: null, disabled: true },
        Validators.required,
      ),
      description: new FormControl({ value: null, disabled: true }),
      unitOfMeasure: new FormControl({ value: null, disabled: true }),
      quantity: new FormControl(
        { value: null, disabled: true },
        Validators.required,
      ),
    });
  }

  ngOnInit(): void {
    this.setFormControls();

    this.yearEndInventoryService.stateChanged
      .pipe()
      .subscribe((state: YearEndInventoryStoreState) => {
        if (state.unrestrictedRowData.material) {
          this.unrestrictedRowData = state.unrestrictedRowData;
          this.setDescription();
        }
      });
  }

  addUnrestrictedTicket() {
    const formValue = this.unrestrictedForm.value;

    this.unrestrictedTicket = {
      ticketNumber: +formValue.ticketNumber!,
      partNumber: formValue.partNumber!,
      storageLocation: +formValue.storageLocation!,
      description: formValue.description!,
      unitOfMeasure: formValue.unitOfMeasure!,
      quantity: formValue.quantity!,
      plantLocation: +formValue.plantLocation!,
      areaLocation: formValue.areaLocation!,
      userEntered: 'N/A',
    };

    if (this.updateTicket) {
      this.yearEndInventoryService.updateUnrestrictedTicket(this.unrestrictedTicket);
    } else {
      this.yearEndInventoryService.addUnrestrictedTicket(
        this.unrestrictedTicket,
      );
    }
    this.clearForm();
    this.moveToNextField('plantLocation');
  }

  changePlant() {
    this.unrestrictedForm.patchValue({
      storageLocation: '',
      areaLocation: null,
      ticketNumber: null,
      partNumber: null,
      description: '',
      unitOfMeasure: null,
      quantity: null,
    });
    this.unrestrictedRowData = {};
    this.updateTicket = false;
    this.yearEndInventoryService.clearAllStates();
    this.moveToNextField('storageLocation');
  }

  clearForm() {
    this.unrestrictedForm.reset({
      plantLocation: '',
      storageLocation: '',
      areaLocation: null,
      ticketNumber: null,
      partNumber: null,
      description: '',
      unitOfMeasure: null,
      quantity: null,
    });
    this.unrestrictedRowData = {};
    this.updateTicket = false;
    this.yearEndInventoryService.clearAllStates();
  }

  getUnrestrictedRowData() {
    const formValue = this.unrestrictedForm.value;

    if (formValue.partNumber) {
      this.yearEndInventoryService.getUnrestrictedRowData(
        formValue.partNumber?.toString()!,
      );
    }
  }

  isClearButtonDisabled(): boolean {
    // Check if any field in the form has a value
    return Object.values(this.unrestrictedForm.value).every(
      (value) => value === null || value === '',
    );
  }

  moveToNextField(fieldName: string): void {
    const nextField = this.unrestrictedForm.get(fieldName);
    if (nextField) {
      nextField.markAsTouched();

      const element = this.el.nativeElement.querySelector(
        `[formControlName="${fieldName}"]`,
      );

      if (element) {
        if (element.tagName.toLowerCase() === 'mat-select') {
          // Open the MatSelect dropdown
          element.click(); // You can use other methods like 'dispatchEvent' if 'click' doesn't work
        } else if (element instanceof HTMLInputElement) {
          // Set focus if the HTML element is an input
          element.focus();
        }
      }
    }
  }

  searchUnrestrictedTicket() {
    this.yearEndInventoryService.clearAllStates();
    this.dialog
      .open(SearchUnrestrictedTicketDialogComponent, {
        disableClose: true,
        id: 'SearchUnrestrictedTicketDialog',
        width: '700px',
      })
      .afterClosed()
      .subscribe((foundTicket: UnrestrictedTicketModel) => {
        if (foundTicket) {
          this.unrestrictedForm.patchValue({
            plantLocation: foundTicket.plantLocation?.toString(),
            storageLocation: foundTicket.storageLocation?.toString(),
            areaLocation: foundTicket.areaLocation,
            ticketNumber: foundTicket.ticketNumber?.toString(),
            partNumber: foundTicket.partNumber,
            description: foundTicket.description,
            unitOfMeasure: foundTicket.unitOfMeasure,
            quantity: foundTicket.quantity,
          });
          this.updateTicket = true;
        }
      });
  }

  setDescription() {
    this.unrestrictedForm.patchValue({
      description: this.unrestrictedRowData.materialDescription,
      unitOfMeasure: this.unrestrictedRowData.baseUnitOfMeasure,
    });
    this.moveToNextField('quantity');
  }

  //**************************************************************
  //  only form control setup code below this line
  //**************************************************************

  setFormControls() {
    this.unrestrictedForm
      .get('plantLocation')!
      .valueChanges.subscribe((plantLocationValue) => {
        const storageLocationValue =
          this.unrestrictedForm.get('storageLocation')?.value;
        const areaLocationControl = this.unrestrictedForm.get('areaLocation');
        const ticketNumberControl = this.unrestrictedForm.get('ticketNumber');
        const partNumberControl = this.unrestrictedForm.get('partNumber');
        const descriptionControl = this.unrestrictedForm.get('description');
        const unitOfMeasureControl = this.unrestrictedForm.get('unitOfMeasure');
        const quantityControl = this.unrestrictedForm.get('quantity');

        if (plantLocationValue !== '' && storageLocationValue !== '') {
          // Enable other controls when plantLocation and storageLocationValue is filled
          areaLocationControl!.enable();
          ticketNumberControl!.enable();
          partNumberControl!.enable();
          descriptionControl!.enable();
          unitOfMeasureControl!.enable();
          quantityControl!.enable();
        } else {
          // Disable other controls when plantLocation is empty
          areaLocationControl!.disable();
          ticketNumberControl!.disable();
          partNumberControl!.disable();
          descriptionControl!.disable();
          unitOfMeasureControl!.disable();
          quantityControl!.disable();
        }
      });

    this.unrestrictedForm
      .get('storageLocation')!
      .valueChanges.subscribe((storageLocationValue) => {
        const plantLocationValue =
          this.unrestrictedForm.get('plantLocation')?.value;
        const areaLocationControl = this.unrestrictedForm.get('areaLocation');
        const ticketNumberControl = this.unrestrictedForm.get('ticketNumber');
        const partNumberControl = this.unrestrictedForm.get('partNumber');
        const descriptionControl = this.unrestrictedForm.get('description');
        const unitOfMeasureControl = this.unrestrictedForm.get('unitOfMeasure');
        const quantityControl = this.unrestrictedForm.get('quantity');

        if (storageLocationValue !== '' && plantLocationValue !== '') {
          // Enable other controls when plantLocation and storageLocationControl is filled
          areaLocationControl!.enable();
          ticketNumberControl!.enable();
          partNumberControl!.enable();
          descriptionControl!.enable();
          unitOfMeasureControl!.enable();
          quantityControl!.enable();
          setTimeout(() => {
            this.moveToNextField('areaLocation');
          }, 100);
        } else {
          // Disable other controls when plantLocation is empty
          areaLocationControl!.disable();
          ticketNumberControl!.disable();
          partNumberControl!.disable();
          descriptionControl!.disable();
          unitOfMeasureControl!.disable();
          quantityControl!.disable();
        }
      });
  }
}
