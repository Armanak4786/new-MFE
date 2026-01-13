import { Component, OnInit } from '@angular/core';
import { Legend } from 'chart.js';

@Component({
  selector: 'app-monthly-volumes',
  templateUrl: './monthly-volumes.component.html',
  styleUrl: './monthly-volumes.component.scss',
})
export class MonthlyVolumesComponent implements OnInit {
  data: any;
  options: any;
  items = [
    { name: 'Today', code: 'Today' },
    { name: 'Month', code: 'Month' },
    { name: 'Year', code: 'Year' },
  ];
  time = 'Year';

  year = 2024;

  constructor() {}
  ngOnInit(): void {
    
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      datasets: [
        {
          label: 'Total Amount Financed',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: [7, 18, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
        },
        {
          label: 'Count of Loans',
          backgroundColor: documentStyle.getPropertyValue('--pink-500'),
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          data: [18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7],
        },
      ],
    };

    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false,
        position: 'right',
        align: 'start', // Align the legend to the top
      },
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  save() {}

  increment() {
    this.year++;
  }

  decrement() {
    this.year--;
  }
}
