import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RatesService } from '../rates.service';
import { BaseList, Base } from '../base';

@Component({
  selector: 'app-historical-chart',
  templateUrl: './historical-chart.component.html',
  styleUrls: ['./historical-chart.component.scss']
})
export class HistoricalChartComponent implements OnInit, OnDestroy {
  ngDestroy$ = new Subject();

  get currentBase() {
    return this.ratesService.currentBase;
  }

  isComparingDropdownVisible = false;
  comparingCurrency: Base = BaseList[0];
  currencies = BaseList;

  chartData;

  chartOptions = {
    title: {
      display: true,
      text: '',
      fontSize: 16
    },
    legend: {
      display: false
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          gridLines: {
            drawBorder: false
          },
          ticks: {
            beginAtZero: true,
            display: false
          }
        }
      ]
    }
  };

  constructor(private route: ActivatedRoute, private ratesService: RatesService) {}

  ngOnInit(): void {
    const params = this.route.snapshot.params;
    const currency = params.currency;
    if (currency) {
      this.chartOptions.title.text = currency;
    } else {
      this.isComparingDropdownVisible = true;
      this.ratesService.getLastThirtyDaysRates(this.comparingCurrency.code);
    }

    this.ratesService.monthlyRatesUpdated.pipe(takeUntil(this.ngDestroy$)).subscribe(() => {
      this.getRatesData(currency);
    });
  }

  ngOnDestroy() {
    this.ngDestroy$.next();
    this.ngDestroy$.complete();
  }

  onBaseDropdownChange(base: Base) {
    this.ratesService.changeBase(base, true);
    this.ratesService.getLastThirtyDaysRates(this.comparingCurrency.code);
  }

  onCompareDropdownChange(base: Base) {
    this.comparingCurrency = base;
    this.ratesService.getLastThirtyDaysRates(base.code);
  }

  getRatesData(currency: string = this.ratesService.currentBase.code) {
    const rates = this.ratesService.getCurrencyRatesOutOfMonthlyRates(currency);
    this.chartData = {
      labels: Object.keys(rates),
      datasets: [
        {
          data: Object.values(rates),
          backgroundColor: '#4B90FA'
        }
      ]
    };
  }
}
