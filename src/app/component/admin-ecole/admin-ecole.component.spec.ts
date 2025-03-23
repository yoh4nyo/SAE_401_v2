import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEcoleComponent } from './admin-ecole.component';

describe('AdminEcoleComponent', () => {
  let component: AdminEcoleComponent;
  let fixture: ComponentFixture<AdminEcoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminEcoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEcoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
