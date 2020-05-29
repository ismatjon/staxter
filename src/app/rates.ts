export class DailyRates {
  base: string;
  date: string;
  rates: { [currencyCode: string]: number };
  yesterdayRates: { [currencyCode: string]: number };

  constructor(init?: Partial<DailyRates>) {
    Object.assign(this, init);
  }
}

export class MonthlyRates {
  base: string;
  start_at: string;
  end_at: string;
  rates: { [date: string]: { [currencyCode: string]: number } };

  constructor(init?: Partial<MonthlyRates>) {
    Object.assign(this, init);
  }
}
