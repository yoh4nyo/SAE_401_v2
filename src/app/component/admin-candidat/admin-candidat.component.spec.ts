import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCandidatComponent } from './admin-candidat.component';

describe('AdminCandidatComponent', () => {
  let component: AdminCandidatComponent;
  let fixture: ComponentFixture<AdminCandidatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCandidatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCandidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
