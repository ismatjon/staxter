import { Component } from '@angular/core';
import { RatesService } from './rates.service';
import { Base, BaseList } from './base';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currencies = BaseList;

  get currentBase() {
    return this.ratesService.currentBase;
  }
  set currentBase(base: Base) {
    this.ratesService.changeBase(base);
  }

  constructor(private ratesService: RatesService) {
    ratesService.getRates();
  }
}
