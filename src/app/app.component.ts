import { Component } from '@angular/core';
import { RatesService } from './rates.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(ratesService: RatesService) {
    ratesService.getRates();
  }
}
