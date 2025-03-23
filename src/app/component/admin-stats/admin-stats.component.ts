import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StatsData } from '../../models/stats-data';
import { StatsService } from '../../service/stats.service';
import { Chart, registerables } from 'chart.js';
import { FormGroup, FormControl } from '@angular/forms';
import { CandidatService } from '../../service/candidat.service';
Chart.register(...registerables);
import 'chartjs-adapter-date-fns';

@Component({
  selector: 'app-admin-stats',
  standalone: false,
  templateUrl: './admin-stats.component.html',
  styleUrls: ['./admin-stats.component.css']
})
export class AdminStatsComponent implements OnInit, AfterViewInit {

  userId: number | null = null;
  stats: StatsData | null = null;

  @ViewChild('entrainementsChart') entrainementsChartCanvas: ElementRef | null = null;
  @ViewChild('examensChart') examensChartCanvas: ElementRef | null = null;

  public entrainementsChart: any;
  public examensChart: any;

  showTriPopup: boolean = false;
  triForm!: FormGroup;
  candidats: any[] = [];
  allCandidats: any[] = []; 
  selectedCandidat: any | null = null;
  selectedCandidatName: string = ''; 

  constructor(
    private route: ActivatedRoute,
    private StatsService: StatsService,
    private router: Router,
    private candidatService: CandidatService
  ) { }

  ngOnInit(): void {
    this.triForm = new FormGroup({
      id_candid: new FormControl(""),
    });

    this.candidatService.getCandidat().subscribe(
      (data) => {
        this.candidats = data.candidat || data;
        this.allCandidats = [...this.candidats];
      }
    );
    this.route.queryParams.subscribe(params => {
      this.userId = params['id'] ? +params['id'] : null;

      if (this.userId) {
        this.loadStats(this.userId);
      }
    });

  }

  ngAfterViewInit(): void {
  }

  loadStats(candidatId: number): void {
    if (candidatId) {
      this.StatsService.getStats(candidatId).subscribe(
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

  toggleTriPopup(): void {
    this.showTriPopup = !this.showTriPopup;
    if (!this.showTriPopup) {
      this.triForm.reset();
      this.candidats = [...this.allCandidats];  
    }
  }

  tri(): void {
    const idCandid = this.triForm.get('id_candid')?.value;

    if (idCandid) {
      this.selectedCandidat = this.allCandidats.find(c => c.id_candid === +idCandid);  
      if (this.selectedCandidat) {
        this.selectedCandidatName = `${this.selectedCandidat.prenom} ${this.selectedCandidat.nom}`;
        this.loadStats(this.selectedCandidat.id_candid);   
      }
      this.candidats = [...this.allCandidats];
    } else {
      this.selectedCandidat = null; 
      this.selectedCandidatName = '';
      this.candidats = [...this.allCandidats];
      if (this.userId) {
        this.loadStats(this.userId);
      }
    }
    this.toggleTriPopup(); 
  }
}