import { Component } from '@angular/core';
import { Base, BaseList } from '../base';
import { RatesService } from '../rates.service';

@Component({
  selector: 'app-latest-rates',
  templateUrl: './latest-rates.component.html',
  styleUrls: ['./latest-rates.component.scss']
})
export class LatestRatesComponent {
  currencies = BaseList;

  get currentBase() {
    return this.ratesService.currentBase;
  }

  get latestRates() {
    return this.ratesService.latestRates;
  }

  get currencyCodes() {
    return this.latestRates ? Object.keys(this.latestRates.rates) : [];
  }

  constructor(private ratesService: RatesService) {
    if (ratesService.lastMonthRates && ratesService.lastMonthRates.base !== ratesService.currentBase.code) {
      ratesService.getLastMonthRates();
    }
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

  onDropdownChange(base: Base) {
    this.ratesService.changeBase(base);
  }
}
