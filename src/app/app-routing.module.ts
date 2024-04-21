import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EthCompComponent } from './components/eth-comp/eth-comp.component';

const routes: Routes = [
  { path: '', component: EthCompComponent }, // Ruta raíz que carga en /
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
