import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LatestRatesComponent } from './latest-rates/latest-rates.component';
import { LastThirtyDaysComponent } from './last-thirty-days/last-thirty-days.component';
import { TopFiveComponent } from './top-five/top-five.component';
import { HistoricalChartComponent } from './historical-chart/historical-chart.component';

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
  },
  {
    path: 'historical-chart/:currency',
    component: HistoricalChartComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
