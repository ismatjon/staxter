import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DailyRates, MonthlyRates } from './rates';

@Injectable({
  providedIn: 'root'
})
export class RatesService {
  baseUrl = 'https://api.exchangeratesapi.io/';
  latestRates: DailyRates;
  thirtyDaysRates: MonthlyRates;

  constructor(private http: HttpClient) {}

  getRates() {
    this.getLatestRates();
    this.getLastThirtyDaysRates();
  }

  getLatestRates() {
    this.http.get(this.baseUrl + 'latest').subscribe(data => {
      this.latestRates = new DailyRates(data);
      this.getYesterdayRates();
    });
  }

  getLastThirtyDaysRates() {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1);
    const lastDay = this.getDaysCount(today.getMonth() + 1, today.getFullYear());

    this.http.get(this.baseUrl + 'history?start_at=' + date + '-1&end_at=' + date + '-' + lastDay).subscribe(data => {
      this.thirtyDaysRates = new MonthlyRates(data);
      this.getYesterdayRates();
    });
  }

  getYesterdayRates() {
    if (this.latestRates && this.thirtyDaysRates) {
      const today = this.latestRates.date;
      const dates = Object.keys(this.thirtyDaysRates.rates).sort();
      const index = dates.indexOf(today);
      const yesterday = dates.length > 1 ? dates[index - 1] : today;

      this.latestRates.yesterdayRates = this.thirtyDaysRates.rates[yesterday];
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
