import { Component } from '@angular/core';
import { RatesService } from '../rates.service';

@Component({
  selector: 'app-latest-rates',
  templateUrl: './latest-rates.component.html',
  styleUrls: ['./latest-rates.component.scss']
})
export class LatestRatesComponent {
  constructor(private ratesService: RatesService) {}

  get latestRates() {
    return this.ratesService.latestRates;
  }

  get currencies() {
    return this.latestRates ? Object.keys(this.latestRates.rates) : [];
  }

  getRateStateImageSrc(currency: string) {
    const todayRate = this.latestRates.rates[currency];
    const yesterdayRate = this.latestRates.yesterdayRates[currency];

    let icon = '';
    if (todayRate > yesterdayRate) {
      icon = 'increased';
    } else if (todayRate < yesterdayRate) {
      icon = 'decreased';
    } else {
      icon = 'equal';
    }

    return 'assets/icons/' + icon + '.png';
  }
}
