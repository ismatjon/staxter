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
  lastMonthRates: MonthlyRates;
  currentBase: Base = BaseList.find(b => b.code === 'EUR');
  comparingBase: string;

  latestRatesUpdated = new ReplaySubject();
  yesterdayRatesUpdated = new ReplaySubject();
  lastMonthRatesUpdated = new ReplaySubject();

  get paramsWithCurrentBase() {
    return this.generateParam(this.currentBase.code);
  }

  constructor(private http: HttpClient) {}

  /**
   * Changes currency base and gets rates with it
   * @param base currency base
   * @param isComparing boolean flag that indicates that base is changing for comparison and it should not get rates with it
   */
  changeBase(base: Base, isComparing = false) {
    this.currentBase = base;
    if (!isComparing) {
      this.getRates();
    }
  }

  /**
   * Shortcuts method for generating params for HTTP calls
   * @param base currency base
   */
  generateParam(base: string) {
    return { params: { base } };
  }

  /**
   * Fetches rates
   */
  getRates() {
    this.getLatestRates();
  }

  /**
   * Fetches latest rates
   */
  getLatestRates() {
    this.http.get(this.baseUrl + 'latest', this.paramsWithCurrentBase).subscribe(data => {
      this.latestRates = new DailyRates(data);
      this.getLastMonthRates();
      this.latestRatesUpdated.next();
    });
  }

  /**
   * Fetches last 30 days rates
   * @param base optional currency base string; if it's not given it'll use this.currencyBase
   */
  getLastMonthRates(base?: string) {
    if (!this.latestRates) {
      // saving base in order to use it next time the mothod is called
      this.comparingBase = base;
      return;
    }

    const today = new Date(this.latestRates.date);
    const date = today.getFullYear() + '-' + (today.getMonth() + 1);
    const lastDay = this.getDaysCount(today.getMonth() + 1, today.getFullYear());

    base = base || this.comparingBase;
    const params = base ? this.generateParam(base) : this.paramsWithCurrentBase;

    // setting to null because it shouldn't be used after getting rates for comparing chart
    this.comparingBase = null;

    this.http
      .get(this.baseUrl + 'history?start_at=' + date + '-1&end_at=' + date + '-' + lastDay, params)
      .subscribe(data => {
        this.lastMonthRates = new MonthlyRates(data);
        this.getYesterdayRates();
        this.lastMonthRatesUpdated.next();
      });
  }

  /**
   * Gets all the rates in last month for the given currency
   * @param currency code like "EUR"
   */
  getCurrencyRatesOutOfMonthlyRates(currency: string) {
    if (!this.lastMonthRates) {
      return;
    }

    const monthlyRates = this.lastMonthRates.rates;
    const rates = {};
    for (const date in monthlyRates) {
      if (monthlyRates.hasOwnProperty(date)) {
        const rate = monthlyRates[date][currency] || 0;
        rates[date] = rate === 0 ? rate : rate.toFixed(4);
      }
    }
    return rates;
  }

  /**
   * Gets yesterday rates out of last month rates
   */
  getYesterdayRates() {
    const today = this.latestRates.date;
    const dates = Object.keys(this.lastMonthRates.rates).sort();
    const index = dates.indexOf(today);
    const yesterday = dates.length > 1 ? dates[index - 1] : today;

    this.latestRates.yesterdayRates = this.lastMonthRates.rates[yesterday];
    this.yesterdayRatesUpdated.next();
  }

  /**
   * Helper method for getting number of days in a given month
   * @param month
   * @param year
   */
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
