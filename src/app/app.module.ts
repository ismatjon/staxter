import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LatestRatesComponent } from './latest-rates/latest-rates.component';
import { LastThirtyDaysComponent } from './last-thirty-days/last-thirty-days.component';
import { TopFiveComponent } from './top-five/top-five.component';
import { HistoricalChartComponent } from './historical-chart/historical-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LatestRatesComponent,
    LastThirtyDaysComponent,
    TopFiveComponent,
    HistoricalChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DropdownModule,
    ChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
