import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatExamComponent } from './candidat-exam.component';

describe('CandidatExamComponent', () => {
  let component: CandidatExamComponent;
  let fixture: ComponentFixture<CandidatExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidatExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
