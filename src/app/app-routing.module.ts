import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LatestRatesComponent } from './latest-rates/latest-rates.component';
import { LastThirtyDaysComponent } from './last-thirty-days/last-thirty-days.component';
import { TopFiveComponent } from './top-five/top-five.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'latest-rates'
  },
  {
    path: 'latest-rates',
    component: LatestRatesComponent
  },
  {
    path: 'last-thirty-days',
    component: LastThirtyDaysComponent
  },
  {
    path: 'top-five',
    component: TopFiveComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
