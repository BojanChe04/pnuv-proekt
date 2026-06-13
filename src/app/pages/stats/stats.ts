import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HbscDataService } from '../../services/hbsc-data';
import { Chart, registerables } from 'chart.js';
import { PLATFORM_ID, Inject } from '@angular/core';

Chart.register(...registerables);

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.html',
  styleUrl: './stats.scss'
})
export class StatsComponent implements OnInit {
  @ViewChild('schoolChart') schoolChart!: ElementRef;
  @ViewChild('activityChart') activityChart!: ElementRef;
  @ViewChild('socialChart') socialChart!: ElementRef;
  @ViewChild('lonelyChart') lonelyChart!: ElementRef;
  @ViewChild('lifeChart') lifeChart!: ElementRef;

  hbscData: any = null;

  constructor(
    private hbscService: HbscDataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.hbscService.getHbscData().subscribe((data: any) => {
      this.hbscData = data;
      setTimeout(() => this.createCharts(), 300);
    });
  }

  createCharts() {
    const ages = ['11 год.', '13 год.', '15 год.'];
    const green = '#5DB996';
    const darkGreen = '#118B50';

    new Chart(this.schoolChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ages,
        datasets: [
          {
            label: 'Девојчиња',
            data: [
              this.hbscData.schoolwork_pressure.age_11.girls,
              this.hbscData.schoolwork_pressure.age_13.girls,
              this.hbscData.schoolwork_pressure.age_15.girls
            ],
            backgroundColor: green
          },
          {
            label: 'Момчиња',
            data: [
              this.hbscData.schoolwork_pressure.age_11.boys,
              this.hbscData.schoolwork_pressure.age_13.boys,
              this.hbscData.schoolwork_pressure.age_15.boys
            ],
            backgroundColor: darkGreen
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { y: { max: 100, ticks: { callback: (v) => v + '%' } } }
      }
    });

    new Chart(this.activityChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ages,
        datasets: [
          {
            label: 'Девојчиња',
            data: [
              this.hbscData.physical_activity.age_11.girls,
              this.hbscData.physical_activity.age_13.girls,
              this.hbscData.physical_activity.age_15.girls
            ],
            backgroundColor: green
          },
          {
            label: 'Момчиња',
            data: [
              this.hbscData.physical_activity.age_11.boys,
              this.hbscData.physical_activity.age_13.boys,
              this.hbscData.physical_activity.age_15.boys
            ],
            backgroundColor: darkGreen
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { y: { max: 100, ticks: { callback: (v) => v + '%' } } }
      }
    });

    new Chart(this.socialChart.nativeElement, {
      type: 'line',
      data: {
        labels: ages,
        datasets: [
          {
            label: 'Девојчиња',
            data: [
              this.hbscData.social_media.age_11.girls,
              this.hbscData.social_media.age_13.girls,
              this.hbscData.social_media.age_15.girls
            ],
            borderColor: green,
            backgroundColor: green + '33',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Момчиња',
            data: [
              this.hbscData.social_media.age_11.boys,
              this.hbscData.social_media.age_13.boys,
              this.hbscData.social_media.age_15.boys
            ],
            borderColor: darkGreen,
            backgroundColor: darkGreen + '33',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { y: { max: 30, ticks: { callback: (v) => v + '%' } } }
      }
    });

    new Chart(this.lonelyChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['11 год. Д', '11 год. М', '13 год. Д', '13 год. М', '15 год. Д', '15 год. М'],
        datasets: [{
          data: [
            this.hbscData.feeling_lonely.age_11.girls,
            this.hbscData.feeling_lonely.age_11.boys,
            this.hbscData.feeling_lonely.age_13.girls,
            this.hbscData.feeling_lonely.age_13.boys,
            this.hbscData.feeling_lonely.age_15.girls,
            this.hbscData.feeling_lonely.age_15.boys
          ],
          backgroundColor: ['#5DB996', '#118B50', '#7DC9A8', '#0A6B3C', '#E3F0AF', '#C5E07A']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'right' } }
      }
    });

    new Chart(this.lifeChart.nativeElement, {
      type: 'radar',
      data: {
        labels: ['11 год. Д', '11 год. М', '13 год. Д', '13 год. М', '15 год. Д', '15 год. М'],
        datasets: [{
          label: 'Среден скор (0-10)',
          data: [
            this.hbscData.life_satisfaction.age_11.girls,
            this.hbscData.life_satisfaction.age_11.boys,
            this.hbscData.life_satisfaction.age_13.girls,
            this.hbscData.life_satisfaction.age_13.boys,
            this.hbscData.life_satisfaction.age_15.girls,
            this.hbscData.life_satisfaction.age_15.boys
          ],
          borderColor: darkGreen,
          backgroundColor: green + '55'
        }]
      },
      options: {
        responsive: true,
        scales: { r: { min: 0, max: 10 } }
      }
    });
  }
}
