import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject } from 'rxjs';

import { DailyRates, MonthlyRates } from './rates';
import { Base, BaseList } from './base';

@Injectable({
  providedIn: 'root'
})
export class RatesService {
  baseUrl = 'https://api.exchangeratesapi.io/';
  latestRates: DailyRates;
  thirtyDaysRates: MonthlyRates;
  currentBase: Base = BaseList.find(b => b.code === 'EUR');

  dailyRatesUpdated = new ReplaySubject();
  yesterdayRatesUpdated = new ReplaySubject();
  monthlyRatesUpdated = new ReplaySubject();

  get params() {
    return { params: { base: this.currentBase.code } };
  }

  constructor(private http: HttpClient) {}

  changeBase(base: Base) {
    this.currentBase = base;
    this.getRates();
  }

  getRates() {
    this.getLatestRates();
    this.getLastThirtyDaysRates();
  }

  getCurrencyRatesOutOfMonthlyRates(currency: string) {
    if (!this.thirtyDaysRates) {
      return;
    }

    const monthlyRates = this.thirtyDaysRates.rates;
    const rates = {};
    for (const date in monthlyRates) {
      if (monthlyRates.hasOwnProperty(date)) {
        rates[date] = monthlyRates[date][currency];
      }
    }
    return rates;
  }

  getLatestRates() {
    this.http.get(this.baseUrl + 'latest', this.params).subscribe(data => {
      this.latestRates = new DailyRates(data);
      this.getYesterdayRates();
      this.dailyRatesUpdated.next();
    });
  }

  getLastThirtyDaysRates() {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1);
    const lastDay = this.getDaysCount(today.getMonth() + 1, today.getFullYear());

    this.http
      .get(this.baseUrl + 'history?start_at=' + date + '-1&end_at=' + date + '-' + lastDay, this.params)
      .subscribe(data => {
        this.thirtyDaysRates = new MonthlyRates(data);
        this.getYesterdayRates();
        this.monthlyRatesUpdated.next();
      });
  }

  getYesterdayRates() {
    if (this.latestRates && this.thirtyDaysRates) {
      const today = this.latestRates.date;
      const dates = Object.keys(this.thirtyDaysRates.rates).sort();
      const index = dates.indexOf(today);
      const yesterday = dates.length > 1 ? dates[index - 1] : today;

      this.latestRates.yesterdayRates = this.thirtyDaysRates.rates[yesterday];
      this.yesterdayRatesUpdated.next();
    }
  }

  getDaysCount(month: number, year: number) {
    switch (month) {
      case 4:
      case 6:
      case 9:
      case 11:
        return 30;

      case 2:
        return year % 4 === 0 ? 29 : 28;

      default:
        return 31;
    }
  }
}
