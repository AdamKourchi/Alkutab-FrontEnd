import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardHomePageComponent } from './admin-dashboard-home-page.component';

describe('AdminDashboardHomePageComponent', () => {
  let component: AdminDashboardHomePageComponent;
  let fixture: ComponentFixture<AdminDashboardHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardHomePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
