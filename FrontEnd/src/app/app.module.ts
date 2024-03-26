import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './views/toolbar/toolbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InventoryAppsModule } from './views/inventory-apps/inventory-apps.module';
import { HttpClientModule } from '@angular/common/http';
import { LoadingModule } from './views/loading/loading.module';
import {
  MatSnackBar,
  MatSnackBarRef,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { DialogBoxesModule } from './views/dialog-boxes/dialog-boxes.module';

@NgModule({
  declarations: [AppComponent, ToolbarComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    DialogBoxesModule,
    HttpClientModule,
    InventoryAppsModule,
    LoadingModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
