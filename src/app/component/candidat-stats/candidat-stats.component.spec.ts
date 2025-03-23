import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatStatsComponent } from './candidat-stats.component';

describe('CandidatStatsComponent', () => {
  let component: CandidatStatsComponent;
  let fixture: ComponentFixture<CandidatStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidatStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
