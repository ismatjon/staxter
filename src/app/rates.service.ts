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

  get paramsWithCurrentBase() {
    return this.generateParam(this.currentBase.code);
  }

  constructor(private http: HttpClient) {}

  changeBase(base: Base, isComparing = false) {
    this.currentBase = base;
    if (!isComparing) {
      this.getRates();
    }
  }

  generateParam(base: string) {
    return { params: { base } };
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
        const rate = monthlyRates[date][currency] || 0;
        rates[date] = rate === 0 ? rate : rate.toFixed(4);
      }
    }
    return rates;
  }

  getLatestRates() {
    this.http.get(this.baseUrl + 'latest', this.paramsWithCurrentBase).subscribe(data => {
      this.latestRates = new DailyRates(data);
      this.getYesterdayRates();
      this.dailyRatesUpdated.next();
    });
  }

  getLastThirtyDaysRates(base?: string) {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1);
    const lastDay = this.getDaysCount(today.getMonth() + 1, today.getFullYear());

    const params = base ? this.generateParam(base) : this.paramsWithCurrentBase;
    this.http
      .get(this.baseUrl + 'history?start_at=' + date + '-1&end_at=' + date + '-' + lastDay, params)
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
