import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SpiritusComponent} from "./spiritus/spiritus.component";


const routes: Routes = [ {
  path: 'spiritus',
  component: SpiritusComponent,
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
