import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SpiritusComponent} from "./spiritus/spiritus.component";
import {FerroComponent} from "./ferro/ferro.component";
import {IndexComponent} from "./index/index.component";


const routes: Routes = [
  {path: 'spiritus', component: SpiritusComponent},
  {path: 'ferro', component: FerroComponent},
  {path: '**', component: IndexComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
