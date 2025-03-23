import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatAvisComponent } from './candidat-avis.component';

describe('CandidatAvisComponent', () => {
  let component: CandidatAvisComponent;
  let fixture: ComponentFixture<CandidatAvisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidatAvisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatAvisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
