import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RatesService } from '../rates.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-historical-chart',
  templateUrl: './historical-chart.component.html',
  styleUrls: ['./historical-chart.component.scss']
})
export class HistoricalChartComponent implements OnInit {
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
    this.chartOptions.title.text = currency;

    this.ratesService.monthlyRatesUpdated.pipe(take(1)).subscribe(() => {
      this.getRatesData(currency);
    });
  }

  getRatesData(currency: string) {
    const rates = this.ratesService.getMonthlyRatesByCurrency(currency);
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
