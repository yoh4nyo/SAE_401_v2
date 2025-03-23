import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StatsData } from '../../models/stats-data';
import { StatsService } from '../../service/stats.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import 'chartjs-adapter-date-fns';

@Component({
  selector: 'app-candidat-stats',
  standalone: false,
  templateUrl: './candidat-stats.component.html',
  styleUrls: ['./candidat-stats.component.css']
})
export class CandidatStatsComponent implements OnInit, AfterViewInit {

  userId: number | null = null;
  stats: StatsData | null = null; // Important: Initialisation à null

  @ViewChild('entrainementsChart') entrainementsChartCanvas: ElementRef | null = null;
  @ViewChild('examensChart') examensChartCanvas: ElementRef | null = null;

  public entrainementsChart: any;
  public examensChart: any;

  constructor(
    private route: ActivatedRoute,
    private StatsService: StatsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['id'] ? +params['id'] : null;

      if (this.userId) {
        this.loadStats();
      }
    });
  }

  ngAfterViewInit(): void {
  }

  loadStats(): void {
    if (this.userId) {
      this.StatsService.getStats(this.userId).subscribe(
        (data: StatsData) => {
          this.stats = data;
          this.createChart('semaine');
        },
        (error) => {
          console.error("Error loading statistics:", error);
        }
      );
    }
  }

  changePeriod(period: string): void {
    this.createChart(period);
  }

  createChart(periode: string): void {
    if (!this.stats) {
      return;
    }

    const entrainementsData = this.getChartData(periode, 'entrainements');
    const examensData = this.getChartData(periode, 'examens');

    if (this.entrainementsChart) {
      this.entrainementsChart.destroy();
    }
    if (this.examensChart) {
      this.examensChart.destroy();
    }

    const chartType: any = 'line'; 

    if (this.entrainementsChartCanvas?.nativeElement) {
      this.entrainementsChart = new Chart(
        this.entrainementsChartCanvas.nativeElement.getContext('2d')!,
        {
          type: chartType,
          data: {
            labels: entrainementsData.labels,
            datasets: [{
              label: 'Entrainements',
              data: entrainementsData.data,
              fill: true,
              borderColor: 'rgb(255, 99, 71)',
              backgroundColor: 'rgba(255, 220, 180, 0.7)',
              tension: 0.4,
              pointRadius: 5,
              pointBackgroundColor: 'rgb(255, 99, 71)',
              pointBorderColor: 'rgb(255, 255, 255)',
              pointHoverRadius: 8,
              pointHoverBackgroundColor: 'rgb(255, 99, 71)',
              borderWidth: 3,
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                max: 40,
                title: {
                  display: true,
                  text: 'Note obtenue',
                  font: {
                    size: 16
                  }
                },
                ticks: {
                  stepSize: 5
                }
              },
              x: {
                type: 'category',
                title: {
                  display: true,
                  text: 'Date',
                  font: {
                    size: 16
                  }
                }
              }
            },
            plugins: {
              legend: {
                display: false,
              },
              filler: {
                propagate: true
              },
              title: {
                display: false,
              }
            },
            maintainAspectRatio: true,
            responsive: true,
          }
        }
      );
    }

    if (this.examensChartCanvas?.nativeElement) {
      this.examensChart = new Chart(
        this.examensChartCanvas.nativeElement.getContext('2d')!,
        {
          type: chartType,
          data: {
            labels: examensData.labels,
            datasets: [{
              label: 'Examens blancs',
              data: examensData.data,
              fill: true,
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              tension: 0.4,
              pointRadius: 5,
              pointBackgroundColor: 'rgb(54, 162, 235)',
              pointBorderColor: 'rgb(255, 255, 255)',
              pointHoverRadius: 8,
              pointHoverBackgroundColor: 'rgb(54, 162, 235)',
              borderWidth: 3,
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                max: 40,
                title: {
                  display: true,
                  text: 'Note obtenue',
                  font: {
                    size: 16
                  }
                },
                ticks: {
                  stepSize: 5
                }
              },
              x: {
                type: 'category',
                title: {
                  display: true,
                  text: 'Date',
                  font: {
                    size: 16
                  }
                }
              }
            },
            plugins: {
              legend: {
                display: false,
              },
              filler: {
                propagate: true
              },
              title: {
                display: false,
              }
            },
            maintainAspectRatio: true,
            responsive: true,
          }
        }
      );
    }
  }

  getChartData(periode: string, type: string): any {
    const labels: string[] = [];
    const data: number[] = [];

    if (this.stats && this.stats[periode]) {
      const statsPeriode = this.stats[periode];

      let dataArray: { date: string; score: number }[] = [];
      if (type === 'entrainements') {
        dataArray = statsPeriode.entrainements || [];
      } else {
        dataArray = statsPeriode.examens || [];
      }

      if (dataArray && Array.isArray(dataArray)) {
        dataArray.forEach(item => {
          labels.push(item.date);
          data.push(parseFloat(item.score?.toString() || '0'));
        });
      }
    }

    return { labels, data };
  }

  navigateToAvisPage(): void {
    if (this.userId) {
      this.router.navigate(['/candidat/avis'], { queryParams: { id: this.userId } });
    } else {
      console.error("ID du candidat non disponible.");
    }
  }

  navigateToExamPage(): void {
    if (this.userId) {
      this.router.navigate(['/candidat/exam'], { queryParams: { id: this.userId } });
    } else {
      console.error("ID du candidat non disponible.");
    }
  }

  navigateToStatsPage(): void {
    if (this.userId) {
      this.router.navigate(['/candidat/stats'], { queryParams: { id: this.userId } });
    } else {
      console.error("ID du candidat non disponible.");
    }
  }
}