import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeasureSimilarityComponent } from './measure-similarity/measure-similarity.component';

const routes: Routes = [
  { 
    path: 'measure-similarity',
    component: MeasureSimilarityComponent
  },
  { 
    path: '**',
    component: MeasureSimilarityComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
