import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'inventoryApps',
    loadChildren: () =>
      import('./views/inventory-apps/inventory-apps.module').then(
        (m) => m.InventoryAppsModule,
      ),
  },
  {
    path: '**',
    redirectTo: 'inventoryApps',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
