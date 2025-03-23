import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EcoleService } from '../../service/ecole.service';
import { CandidatService } from '../../service/candidat.service';
import { ExamService } from '../../service/exam.service';

interface Exam {
  id_exam: number;
  id_candid: number;
  score: string;
  appreciation: string;
  type: string;
  date: string;
  id_ecole: number;
  selected?: boolean;
}

interface ApiResponse {
  exam: Exam[];
}

@Component({
  selector: 'app-admin-exam',
  standalone: false,
  templateUrl: './admin-exam.component.html',
  styleUrl: './admin-exam.component.css'
})
export class AdminExamComponent implements OnInit {
  showPopup: boolean = false;
  showDeletePopup: boolean = false;
  showModifPopup: boolean = false;
  selectedExamId: number | null = null;
  showTriPopup: boolean = false;

  ajoutform!: FormGroup
  modifForm!: FormGroup;
  triForm!: FormGroup;

  ecoles: any[] = [];
  candidats: any[] = [];
  exams: Exam[] = [];
  allExams: Exam[] = [];
  filteredExams: Exam[] = [];

  constructor(
    private EcoleService: EcoleService,
    private CandidatService: CandidatService,
    private ExamService: ExamService
  ) { }

  ngOnInit(): void {
    this.ajoutform = new FormGroup({
      id_candid: new FormControl(""),
      score: new FormControl(""),
      appreciation: new FormControl(""),
      type: new FormControl(""),
      date: new FormControl(""),
      id_ecole: new FormControl("")
    });

    this.modifForm = new FormGroup({
      id_candid: new FormControl(""),
      score: new FormControl(""),
      appreciation: new FormControl(""),
      type: new FormControl(""),
      date: new FormControl(""),
      id_ecole: new FormControl("")
    });

    this.triForm = new FormGroup({
      id_candid: new FormControl(""),
      id_ecole: new FormControl(""),
      type: new FormControl("")
    });

    this.modifForm.get('id_candid')?.valueChanges.subscribe((value) => {
      if (value) {
        const [id_candid, id_ecole] = value.split('|');
        const candidat = this.candidats.find(c => c.id_candid === +id_candid);

        if (candidat) {
          this.modifForm.patchValue({
            id_ecole: candidat.id_ecole,
          }, { emitEvent: false });
        }
      }
    });

    this.EcoleService.getEcoles().subscribe(
      (data) => this.ecoles = data.ecole || data
    );

    this.CandidatService.getCandidat().subscribe(
      (data) => {
        this.candidats = data.candidat || data;
      }
    );

    this.ExamService.getExams().subscribe(
      (data: ApiResponse) => {
        this.exams = (data.exam || data).map((exam: Exam) => ({ ...exam, selected: false }));
        this.filteredExams = [...this.exams];
        this.allExams = [...this.exams];

        this.exams.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.filteredExams = [...this.exams];
        this.allExams = [...this.exams];
      }
    );

    this.triForm.get('id_candid')?.valueChanges.subscribe((value) => {
      if (value) {
        this.triForm.get('id_ecole')?.disable({ emitEvent: false });
      } else {
        this.triForm.get('id_ecole')?.enable({ emitEvent: false });
      }
    });

    this.triForm.get('id_ecole')?.valueChanges.subscribe((value) => {
      if (value) {
        this.triForm.get('id_candid')?.disable({ emitEvent: false });
      } else {
        this.triForm.get('id_candid')?.enable({ emitEvent: false });
      }
    });
  }

  getEcoleNomById(id_ecole: number): string {
    const ecole = this.ecoles.find(e => e.id_ecole === id_ecole);
    return ecole ? ecole.nom : 'Non attribuée';
  }
  getCandidatNomById(id_candid: number): string {
    const candidat = this.candidats.find(e => e.id_candid === id_candid);
    return candidat ? candidat.nom : 'Non attribuée';
  }
  getCandidatPrenomById(id_candid: number): string {
    const candidat = this.candidats.find(e => e.id_candid === id_candid);
    return candidat ? candidat.prenom : 'Non attribuée';
  }

  togglePopup(): void {
    this.showPopup = !this.showPopup;
  }

  Ajouter() {
    if (this.ajoutform.valid) {
      const selectedValue = this.ajoutform.get('id_candid')?.value;

      if (selectedValue) {
        const [id_candid, id_ecole] = selectedValue.split('|');

        this.ajoutform.patchValue({
          id_candid: id_candid,
          id_ecole: id_ecole
        });

        const exam = this.ajoutform.value;
        this.ExamService.addExam(exam).subscribe(
          () => {
            alert("Exam ajouté !");
            this.ajoutform.reset();
            this.togglePopup();
            window.location.reload();
          },
          (error) => {
            console.error("Erreur lors de l'ajout de l'exam :", error);
            alert("Erreur lors de l'ajout de l'exam.");
          }
        );
      } else {
        console.error("Aucune valeur sélectionnée.");
      }
    } else {
      console.error("Formulaire invalide :", this.ajoutform.errors);
    }
  }

  toggleDeletePopup(): void {
    this.showDeletePopup = !this.showDeletePopup;
  }

  confirmDelete(): void {
    this.supprimer();
    this.toggleDeletePopup();
  }

  supprimer(): void {
    const examsASupprimer = this.exams.filter(exam => exam.selected);
    const idsASupprimer = examsASupprimer.map(exam => exam.id_exam);

    if (idsASupprimer.length === 0) {
      alert("Aucun exam sélectionné.");
      return;
    }

    this.ExamService.deleteExams(idsASupprimer).subscribe(
      () => {
        this.exams = this.exams.filter(exam => !exam.selected);
        alert("exams supprimés avec succès !");
        this.toggleDeletePopup();
        window.location.reload();
      },
      (error) => {
        console.error("Erreur lors de la suppression :", error);
        alert("Erreur lors de la suppression des exams.");
      }
    );
  }

  toggleModifPopup(): void {
    this.showModifPopup = !this.showModifPopup;
    if (!this.showModifPopup) {
      this.selectedExamId = null;
    }
  }

  openModifPopup(examId: number): void {
    console.log('openModifPopup called with examId:', examId);
    const exam = this.exams.find(c => c.id_exam === examId);

    if (exam) {
      this.selectedExamId = examId;
      const candidat = this.candidats.find(c => c.id_candid === exam.id_candid);

      if (candidat) {
        const selectValue = `${exam.id_candid}|${exam.id_ecole}`;

        this.modifForm.patchValue({
          id_candid: selectValue,
          id_ecole: candidat.id_ecole,
          type: exam.type,
          appreciation: exam.appreciation,
          date: exam.date,
          score: exam.score,
        });

        this.toggleModifPopup();
      }
    } else {
      console.log('Exam not found for examId:', examId);
    }
  }

  confirmModif(): void {
    if (this.selectedExamId && this.modifForm.valid) {
      const exam = this.modifForm.value;
      const selectedValue = this.modifForm.get('id_candid')?.value;

      if (selectedValue) {
        const [id_candid, id_ecole] = selectedValue.split('|');
        exam.id_candid = +id_candid;
        exam.id_ecole = +id_ecole;

        this.ExamService.updateExam(this.selectedExamId, exam).subscribe(
          () => {
            alert("Exam modifié !");
            this.modifForm.reset();
            this.toggleModifPopup();
            window.location.reload();
          },
          (error) => {
            alert("Erreur lors de la modification de l'exam.");
            console.error("Erreur lors de la modification :", error);
          }
        );
      }
    }
  }

  toggleTriPopup(): void {
    this.showTriPopup = !this.showTriPopup;
    if (!this.showTriPopup) {
      this.exams = [...this.filteredExams];
    }
  }

  tri(): void {
    const idCandid = this.triForm.get('id_candid')?.value;
    const idEcole = this.triForm.get('id_ecole')?.value;
    const type = this.triForm.get('type')?.value;

    let filteredExams = this.allExams;

    if (idCandid) {
      filteredExams = filteredExams.filter(exam => exam.id_candid === +idCandid);
    }

    if (idEcole) {
      filteredExams = filteredExams.filter(exam => exam.id_ecole === +idEcole);
    }

    if (type) {
      filteredExams = filteredExams.filter(exam => exam.type === type);
    }

    this.filteredExams = filteredExams;
    this.exams = [...this.filteredExams];

    if (this.exams.length === 0) {
      alert("Aucun examen trouvé avec ces critères !");
    }

    this.toggleTriPopup();
    this.triForm.reset();
  }
}