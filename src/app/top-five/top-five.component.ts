import { Component } from '@angular/core';
import { take } from 'rxjs/operators';
import { RatesService } from '../rates.service';

@Component({
  selector: 'app-top-five',
  templateUrl: './top-five.component.html',
  styleUrls: ['./top-five.component.scss']
})
export class TopFiveComponent {
  top5;
  selectedState = 'increase';

  constructor(private ratesService: RatesService) {
    ratesService.yesterdayRatesUpdated.pipe(take(1)).subscribe(() => {
      this.top5 = this.getTop5();
    });
  }

  get latestRates() {
    return this.ratesService.latestRates;
  }

  get currencies() {
    return this.latestRates ? Object.keys(this.latestRates.rates) : [];
  }

  private getDiff(currency: string) {
    const todayRate = this.latestRates.rates[currency];
    const yesterdayRate = this.latestRates.yesterdayRates[currency];
    const diff = todayRate - yesterdayRate;
    if (diff !== 0) {
      return diff.toFixed(4);
    }
    return diff;
  }

  getTop5() {
    const diffs = [];
    const { rates } = this.latestRates;
    for (const currency in rates) {
      if (rates.hasOwnProperty(currency)) {
        diffs.push({ currency, diff: this.getDiff(currency) });
      }
    }
    const arr = diffs.sort((a, b) => a.diff - b.diff);

    return {
      increase: arr.slice(arr.length - 5),
      decrease: arr.slice(0, 5)
    };
  }
}
